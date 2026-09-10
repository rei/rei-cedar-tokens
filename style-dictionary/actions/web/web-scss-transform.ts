/**
 * web-scss-transform.ts
 *
 * Modular SCSS output for the web platform organized by semantic category.
 *
 * Output layout:
 *   dist/{buildPath}/foundations/cdr-color-surface.scss — Surface color tokens as SCSS variables
 *   dist/{buildPath}/foundations/cdr-color-text.scss    — Text color tokens as SCSS variables
 *   dist/{buildPath}/foundations/cdr-color-border.scss  — Border color tokens as SCSS variables
 *   ...
 *
 * Resolution order for color values:
 *   light: option.$value (web-light canonical)
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Action } from 'style-dictionary/types';
import { hexToCustomOklch } from './oklch-formulas.js';
import {
  type CedarOptionNode,
  getTokenAtPath,
  resolveOptionHex,
} from '../../utils/option-resolver.js';

function formatOklch(hex: string, colorFamily?: string): string {
  return hexToCustomOklch(hex, colorFamily);
}

function renderColorDeclarations(scssVar: string, hex: string, colorFamily?: string): string {
  return [`${scssVar}: ${hex};`, `${scssVar}: ${formatOklch(hex, colorFamily)};`].join('\n');
}

/** Convert dot-path token name to SCSS variable */
export function toScssVar(tokenPath: string[], subProperty?: string): string {
  let meaningful = [...tokenPath];

  if (meaningful[0] === 'color' && meaningful[1] === 'modes') {
    meaningful = meaningful.slice(3);
  } else if (meaningful[0] === 'color') {
    meaningful = meaningful.slice(1);
  } else if (meaningful[0] === 'text' && meaningful[1] === 'semantic') {
    meaningful.splice(1, 1);
  }

  if (subProperty) {
    const kebabSub = subProperty.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    meaningful.push(kebabSub);
  }

  return `$cdr-${meaningful.join('-')}`;
}

/** Convert token ref syntax like {spacing.scale.-50} into $cdr-spacing-scale--50 */
export function toScssValue(value: unknown): string {
  if (typeof value === 'number') {
    // Mitigate floating point precision issues (e.g., -0.25600001215934753 -> -0.256)
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  // Rewrite token aliases (e.g. "{text.size.fluid.400}" -> "$cdr-text-size-fluid-400")
  return value.replace(/\{([^}]+)\}/g, (_match, refPath: string) => {
    const refSegments = refPath.split('.');
    return toScssVar(refSegments);
  });
}

export const webScssAction: Action = {
  name: 'web-scss',
  do: (dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/scss/';
    fs.mkdirSync(buildPath, { recursive: true });
    fs.mkdirSync(path.join(buildPath, 'foundations'), { recursive: true });

    // Organize color tokens by semantic category
    const colorByCategory: Record<string, string[]> = {};
    const COLOR_CATEGORIES = new Set([
      'surface',
      'text',
      'border',
      'icon',
      // "action", // TODO: Add action category when ready
      // "selection", // TODO: Add selection category when ready
      // "navigation", // TODO: Add navigation category when ready
      // "feedback", // TODO: Add feedback category when ready
      // "overlay" , // TODO: Add overlay category when ready
    ]);

    function getColorCategory(token: any): string | undefined {
      if (token.path[0] !== 'color') return undefined;
      if (token.path[1] === 'modes') return token.path[3];
      if (token.path[1] === 'option') return undefined;
      return token.path[1];
    }

    function pushColorByCategory(token: any, line: string): boolean {
      const category = getColorCategory(token);
      if (!category || !COLOR_CATEGORIES.has(category)) {
        console.warn(
          `[web-scss] Token ${token.name}: unknown semantic color category "${String(
            category,
          )}" at path "${token.path.join('.')}"`,
        );
        return false;
      }

      if (!colorByCategory[category]) {
        colorByCategory[category] = [];
      }
      colorByCategory[category].push(line);
      return true;
    }

    // Categorize color tokens
    const colorTokens = dictionary.allTokens.filter(
      (t) =>
        t.path[0] === 'color' &&
        t.path[1] !== 'option' &&
        t.$type === 'color' &&
        (t.path[1] !== 'modes' || t.path[2] === 'default' || t.path[2] === 'rest'),
    );

    colorTokens.forEach((token) => {
      const resolved = (token.$extensions as any)?.cedar?.resolved?.web;
      if (resolved && typeof resolved.light === 'string') {
        const scssVar = toScssVar(token.path);
        // colorFamily is not available on resolved semantic tokens; skip custom OKLCH for resolved path
        const line = renderColorDeclarations(scssVar, resolved.light);

        pushColorByCategory(token, line);
        return;
      }

      const webCedar = (token.$extensions as any)?.cedar?.web;

      if (typeof webCedar?.light !== 'string') {
        throw new Error(
          `[web-scss] Token ${token.name}: missing $extensions.cedar.web.light. ` +
            `Expected a string ref but got ${typeof webCedar?.light}. ` +
            `Ensure normalize.ts mergeColorVariants generated web option refs.`,
        );
      }

      const lightOptionNode = getTokenAtPath(dictionary.tokens, webCedar.light) as
        | CedarOptionNode
        | undefined;

      if (!lightOptionNode) {
        throw new Error(
          `[web-scss] Token ${token.name}: could not resolve web option token. ` +
            `light="${webCedar.light}".`,
        );
      }

      const lightHex = resolveOptionHex(lightOptionNode, 'web', 'light');

      if (!lightHex) {
        throw new Error(
          `[web-scss] Token ${token.name}: could not resolve web hex value. ` +
            `light="${webCedar.light}"→${lightHex}.`,
        );
      }

      const scssVar = toScssVar(token.path);
      const colorFamily = (lightOptionNode.$extensions as any)?.cedar?.colorFamily;
      const line = renderColorDeclarations(scssVar, lightHex, colorFamily);

      pushColorByCategory(token, line);
    });

    // Write modular SCSS files
    const foundationsDir = path.join(buildPath, 'foundations');

    // Color files
    for (const [category, categoryLines] of Object.entries(colorByCategory)) {
      if (categoryLines.length === 0) continue;
      const scss = `${categoryLines.join('\n')}\n`;
      fs.writeFileSync(path.join(foundationsDir, `cdr-color-${category}.scss`), scss);
    }

    // Log generated files
    for (const [category, lines] of Object.entries(colorByCategory)) {
      if (lines.length > 0) {
        console.log(`    ✓ foundations/cdr-color-${category}.scss (${lines.length} tokens)`);
      }
    }
  },

  undo: (_dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/scss/';
    const foundationsDir = path.join(buildPath, 'foundations');

    if (fs.existsSync(foundationsDir)) {
      for (const file of fs.readdirSync(foundationsDir)) {
        if (file.startsWith('cdr-color-')) {
          fs.rmSync(path.join(foundationsDir, file));
        }
      }
    }

    // Clean up foundations directory if empty
    try {
      if (fs.existsSync(foundationsDir) && fs.readdirSync(foundationsDir).length === 0) {
        fs.rmdirSync(foundationsDir);
      }
    } catch {
      // ignore
    }
  },
};

/**
 * web-css-transform.ts
 *
 * Modular CSS output for the web platform organized by semantic category.
 *
 * Output layout:
 *   dist/{buildPath}/cdr-foundations.css              — @import index
 *   dist/{buildPath}/foundations/cdr-color-surface.css — Surface color tokens
 *   dist/{buildPath}/foundations/cdr-color-text.css    — Text color tokens
 *   dist/{buildPath}/foundations/cdr-color-border.css  — Border color tokens
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

function renderColorDeclarations(cssVar: string, hex: string, colorFamily?: string): string {
  return [`  ${cssVar}: ${hex};`, `  ${cssVar}: ${formatOklch(hex, colorFamily)};`].join('\n');
}

/** Convert dot-path token name to CSS custom property */
export function toCssVar(tokenPath: string[], subProperty?: string): string {
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

  return `--cdr-${meaningful.join('-')}`;
}

/** Convert token ref syntax like {spacing.scale.-50} into var(--cdr-spacing-scale--50) */
export function toCssValue(value: unknown): string {
  if (typeof value === 'number') {
    // Mitigate floating point precision issues (e.g., -0.25600001215934753 -> -0.256)
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  // Rewrite token aliases (e.g. "{text.size.fluid.400}" -> "var(--cdr-text-size-fluid-400)")
  return value.replace(/\{([^}]+)\}/g, (_match, refPath: string) => {
    const refSegments = refPath.split('.');
    return `var(${toCssVar(refSegments)})`;
  });
}

export const webCssAction: Action = {
  name: 'web-css',
  do: (dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/css/';
    const ext = buildPath.endsWith('scss/') ? 'scss' : 'css';
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
          `[web-css] Token ${token.name}: unknown semantic color category "${String(
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
        const cssVar = toCssVar(token.path);
        // colorFamily is not available on resolved semantic tokens; skip custom OKLCH for resolved path
        const line = renderColorDeclarations(cssVar, resolved.light);

        pushColorByCategory(token, line);
        return;
      }

      const webCedar = (token.$extensions as any)?.cedar?.web;

      if (typeof webCedar?.light !== 'string') {
        throw new Error(
          `[web-css] Token ${token.name}: missing $extensions.cedar.web.light. ` +
            `Expected a string ref but got ${typeof webCedar?.light}. ` +
            `Ensure normalize.ts mergeColorVariants generated web option refs.`,
        );
      }

      const lightOptionNode = getTokenAtPath(dictionary.tokens, webCedar.light) as
        | CedarOptionNode
        | undefined;

      if (!lightOptionNode) {
        throw new Error(
          `[web-css] Token ${token.name}: could not resolve web option token. ` +
            `light="${webCedar.light}".`,
        );
      }

      const lightHex = resolveOptionHex(lightOptionNode, 'web', 'light');

      if (!lightHex) {
        throw new Error(
          `[web-css] Token ${token.name}: could not resolve web hex value. ` +
            `light="${webCedar.light}"→${lightHex}.`,
        );
      }

      const cssVar = toCssVar(token.path);
      const colorFamily = (lightOptionNode.$extensions as any)?.cedar?.colorFamily;
      const line = renderColorDeclarations(cssVar, lightHex, colorFamily);

      pushColorByCategory(token, line);
    });

    // Write modular CSS files
    const foundationsDir = path.join(buildPath, 'foundations');

    // Color files
    for (const [category, categoryLines] of Object.entries(colorByCategory)) {
      if (categoryLines.length === 0) continue;
      const css = `:root {\n${categoryLines.join('\n')}\n}\n`;
      fs.writeFileSync(path.join(foundationsDir, `cdr-color-${category}.${ext}`), css);
    }

    // Log generated files
    for (const [category, lines] of Object.entries(colorByCategory)) {
      if (lines.length > 0) {
        console.log(`    ✓ foundations/cdr-color-${category}.css (${lines.length} tokens)`);
      }
    }
  },

  undo: (_dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/css/';
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

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

    // Organize color tokens by family
    const colorByCategory: Record<string, string[]> = {};
    const CATEGORY_FILE_MAP: Record<string, string> = {
      graphic: 'graphik',
    };
    const VALID_COLOR_FAMILIES = [
      'background',
      'surface',
      'border',
      'icon',
      'text',
      'action',
      'control',
      'feedback',
      'graphic',
      'selection',
      'navigation',
      'overlay',
    ];
    const NEW_COLOR_FAMILIES = ['action', 'control', 'feedback', 'graphic', 'selection'];

    function getColorCategory(token: any): string | undefined {
      if (token.path[0] !== 'color') return undefined;
      if (token.path[1] === 'option') return undefined;
      const familyIndex = token.path[1] === 'modes' ? 3 : 1;
      return token.path[familyIndex];
    }

    function pushColorByCategory(token: any, line: string): boolean {
      const family = getColorCategory(token);
      if (typeof family !== 'string' || !VALID_COLOR_FAMILIES.includes(family)) {
        console.warn(
          `[web-scss] Token ${token.name}: unknown semantic color category at path "${token.path.join('.')}"`,
        );
        return true;
      }
      if (!NEW_COLOR_FAMILIES.includes(family)) {
        return true;
      }

      const category = CATEGORY_FILE_MAP[family] ?? family;
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

      let lightHex: string | undefined;
      let colorFamily: string | undefined;

      if (typeof webCedar?.light === 'string') {
        const lightOptionNode = getTokenAtPath(dictionary.tokens, webCedar.light) as
          | CedarOptionNode
          | undefined;

        if (!lightOptionNode) {
          throw new Error(
            `[web-scss] Token ${token.name}: could not resolve web option token. ` +
              `light="${webCedar.light}".`,
          );
        }

        lightHex = resolveOptionHex(lightOptionNode, 'web', 'light') ?? undefined;
        if (!lightHex) {
          throw new Error(
            `[web-scss] Token ${token.name}: could not resolve web hex value. ` +
              `light="${webCedar.light}"→${lightHex}.`,
          );
        }

        colorFamily = (lightOptionNode.$extensions as any)?.cedar?.colorFamily;
      } else if (typeof token.$value === 'string' && token.$value.startsWith('#')) {
        // Some semantic tokens carry a literal hex (e.g. 8-digit with alpha) instead of an alias.
        lightHex = token.$value;
      } else {
        throw new Error(
          `[web-scss] Token ${token.name}: missing $extensions.cedar.web.light and no literal hex $value. ` +
            `Expected a string ref or hex but got ${typeof webCedar?.light} / ${typeof token.$value}.`,
        );
      }

      const scssVar = toScssVar(token.path);
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

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
          `[web-css] Token ${token.name}: unknown semantic color category at path "${token.path.join('.')}"`,
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
        const cssVar = toCssVar(token.path);
        // colorFamily is not available on resolved semantic tokens; skip custom OKLCH for resolved path
        const line = renderColorDeclarations(cssVar, resolved.light);

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
            `[web-css] Token ${token.name}: could not resolve web option token. ` +
              `light="${webCedar.light}".`,
          );
        }

        lightHex = resolveOptionHex(lightOptionNode, 'web', 'light') ?? undefined;
        if (!lightHex) {
          throw new Error(
            `[web-css] Token ${token.name}: could not resolve web hex value. ` +
              `light="${webCedar.light}"→${lightHex}.`,
          );
        }

        colorFamily = (lightOptionNode.$extensions as any)?.cedar?.colorFamily;
      } else if (typeof token.$value === 'string' && token.$value.startsWith('#')) {
        // Some semantic tokens carry a literal hex (e.g. 8-digit with alpha) instead of an alias.
        lightHex = token.$value;
      } else {
        throw new Error(
          `[web-css] Token ${token.name}: missing $extensions.cedar.web.light and no literal hex $value. ` +
            `Expected a string ref or hex but got ${typeof webCedar?.light} / ${typeof token.$value}.`,
        );
      }

      const cssVar = toCssVar(token.path);
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

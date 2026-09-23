import fs from 'node:fs';
import path from 'node:path';
import type { Action } from 'style-dictionary/types';
import { converter } from 'culori';
import { buildCustomOklch } from '../web/oklch-formulas.js';
import { iosColorsetFormatter } from '../../formats/ios/ios-colorset.js';
import {
  type CedarOptionNode,
  getTokenAtPath,
  resolveOptionHex,
} from '../../utils/option-resolver.js';
import { formatNumber } from '../../utils/format-number.js';

type CedarPlatformRefs = {
  light: string;
  dark: string;
};

const toP3 = converter('p3');

function oklchToP3Components(hex: string, colorFamily?: string) {
  const customOklch = buildCustomOklch(hex, colorFamily);
  const p3 = toP3(customOklch);
  if (!p3) {
    throw new Error(`[ios-colorset] Could not convert color value "${hex}" to Display P3`);
  }

  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const finiteOrZero = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? n : 0);

  const r = formatNumber(clamp(finiteOrZero(p3.r)), 4);
  const g = formatNumber(clamp(finiteOrZero(p3.g)), 4);
  const b = formatNumber(clamp(finiteOrZero(p3.b)), 4);
  // culori omits `alpha` for fully-opaque colors — default to 1 rather than a
  // separately-formatted literal so opaque colors always format identically
  // regardless of whether the source hex had an explicit alpha channel.
  const alpha = formatNumber(
    typeof p3.alpha === 'number' && Number.isFinite(p3.alpha) ? p3.alpha : 1,
    3,
  );

  return { red: r, green: g, blue: b, alpha };
}

function oklchToP3(hex: string, colorFamily?: string): P3Color {
  return {
    'color-space': 'display-p3',
    components: oklchToP3Components(hex, colorFamily),
  };
}

function hasLightDarkStrings(value: unknown): value is { light: string; dark: string } {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { light?: unknown }).light === 'string' &&
    typeof (value as { dark?: unknown }).dark === 'string'
  );
}

type P3Color = {
  'color-space': 'display-p3';
  components: {
    red: string;
    green: string;
    blue: string;
    alpha: string;
  };
};

function writeColorset(
  assetRoot: string,
  token: { name: string },
  lightP3: P3Color,
  darkP3: P3Color,
) {
  const transformedToken = {
    ...token,
    value: {
      light: lightP3,
      dark: darkP3,
    },
  };

  const folderPath = path.join(assetRoot, `cdr-${token.name}.colorset`);
  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(path.join(folderPath, 'Contents.json'), iosColorsetFormatter(transformedToken));
}

export const iosColorsetAction: Action = {
  name: 'ios-colorset',

  do: (dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/ios/';
    const assetRoot = path.join(buildPath, 'CdrColors.xcassets');

    fs.mkdirSync(assetRoot, { recursive: true });

    fs.writeFileSync(
      path.join(assetRoot, 'Contents.json'),
      JSON.stringify({ info: { author: 'xcode', version: 1 } }, null, 2),
    );

    const colorTokens = dictionary.allTokens.filter(
      (token) =>
        token.path[0] === 'color' &&
        token.path[1] === 'modes' &&
        token.path[2] === 'default' &&
        token.$type === 'color',
    );

    colorTokens.forEach((token) => {
      // Prefer option-token references so we can read colorFamily and use the
      // same custom OKLCH formula as the web platform.
      const iosCedar = (token.$extensions as { cedar?: { ios?: unknown } } | undefined)?.cedar?.ios;

      if (hasLightDarkStrings(iosCedar)) {
        const lightRefPath = (iosCedar as CedarPlatformRefs).light;
        const darkRefPath = (iosCedar as CedarPlatformRefs).dark;

        // Look up the option token in dictionary.tokens (the full nested tree)
        const lightOptionNode = getTokenAtPath(dictionary.tokens, lightRefPath) as
          | CedarOptionNode
          | undefined;
        const darkOptionNode = getTokenAtPath(dictionary.tokens, darkRefPath) as
          | CedarOptionNode
          | undefined;

        if (!lightOptionNode) {
          throw new Error(
            `Token ${token.name}: could not find light option token at "${lightRefPath}". ` +
              `Check canonical/tokens.json was built correctly.`,
          );
        }
        if (!darkOptionNode) {
          throw new Error(
            `Token ${token.name}: could not find dark option token at "${darkRefPath}". ` +
              `Check canonical/tokens.json was built correctly.`,
          );
        }

        const lightHex = resolveOptionHex(lightOptionNode, 'ios', 'light');
        const darkHex = resolveOptionHex(darkOptionNode, 'ios', 'dark');

        if (!lightHex || !darkHex) {
          throw new Error(
            `Token ${token.name}: could not resolve iOS hex. ` +
              `light="${lightRefPath}"→${lightHex}, dark="${darkRefPath}"→${darkHex}. ` +
              `Check $extensions.cedar on the option tokens.`,
          );
        }

        const colorFamily = lightOptionNode.$extensions?.cedar?.colorFamily;
        const lightP3 = oklchToP3(lightHex, colorFamily);
        const darkP3 = oklchToP3(darkHex, colorFamily);
        writeColorset(assetRoot, token, lightP3, darkP3);
        return;
      }

      // Fallback to pre-resolved hex values when option refs are unavailable.
      const resolved = (
        token.$extensions as { cedar?: { resolved?: { ios?: unknown } } } | undefined
      )?.cedar?.resolved?.ios;

      if (hasLightDarkStrings(resolved)) {
        writeColorset(assetRoot, token, oklchToP3(resolved.light), oklchToP3(resolved.dark));
        return;
      }

      throw new Error(
        `Token ${token.name}: $extensions.cedar.ios must be { light, dark } path strings. ` +
          `Ensure normalize.ts mergeColorVariants ran correctly.`,
      );
    });
  },

  undo: (_dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/ios/';
    const assetRoot = path.join(buildPath, 'CdrColors.xcassets');
    if (fs.existsSync(assetRoot)) {
      fs.rmSync(assetRoot, { recursive: true, force: true });
    }
  },
};

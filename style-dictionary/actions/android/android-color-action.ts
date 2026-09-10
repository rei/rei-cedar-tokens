import fs from 'node:fs';
import path from 'node:path';
import type { Action } from 'style-dictionary/types';
import {
  type CedarOptionNode,
  getTokenAtPath,
  resolveOptionHex,
} from '../../utils/option-resolver.js';

type CedarPlatformRefs = {
  light: string;
  dark: string;
};

function hasLightDarkStrings(value: unknown): value is { light: string; dark: string } {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { light?: unknown }).light === 'string' &&
    typeof (value as { dark?: unknown }).dark === 'string'
  );
}

function writeXmlFile(
  buildPath: string,
  fileName: string,
  tokens: { name: string; value: string }[],
) {
  const filePath = path.join(buildPath, fileName);
  const content = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    ...tokens.map((token) => `    <color name="${token.name}">${token.value}</color>`),
    '</resources>',
  ].join('\n');

  fs.writeFileSync(filePath, content);
}

export const androidColorAction: Action = {
  name: 'android-color-xml',

  do: (dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/android/';
    const valuesPath = path.join(buildPath, 'res/values');
    const valuesNightPath = path.join(buildPath, 'res/values-night');

    fs.mkdirSync(valuesPath, { recursive: true });
    fs.mkdirSync(valuesNightPath, { recursive: true });

    const colorTokens = dictionary.allTokens.filter(
      (token) =>
        token.path[0] === 'color' &&
        token.path[1] === 'modes' &&
        token.path[2] === 'default' &&
        token.$type === 'color',
    );

    const lightColors: { name: string; value: string }[] = [];
    const darkColors: { name: string; value: string }[] = [];

    colorTokens.forEach((token) => {
      const resolved = (
        token.$extensions as { cedar?: { resolved?: { android?: unknown } } } | undefined
      )?.cedar?.resolved?.android;

      let lightHex: string;
      let darkHex: string;

      if (hasLightDarkStrings(resolved)) {
        lightHex = resolved.light;
        darkHex = resolved.dark;
      } else {
        const androidCedar = (token.$extensions as { cedar?: { android?: unknown } } | undefined)
          ?.cedar?.android;

        if (!hasLightDarkStrings(androidCedar)) {
          throw new Error(
            `Token ${token.name}: $extensions.cedar.android must be { light, dark } path strings. ` +
              `Got: ${JSON.stringify(androidCedar)}. ` +
              `Ensure normalize.ts mergeColorVariants ran correctly.`,
          );
        }

        const lightRefPath = (androidCedar as CedarPlatformRefs).light;
        const darkRefPath = (androidCedar as CedarPlatformRefs).dark;

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

        const resolvedLightHex = resolveOptionHex(lightOptionNode, 'android', 'light');
        const resolvedDarkHex = resolveOptionHex(darkOptionNode, 'android', 'dark');

        if (!resolvedLightHex || !resolvedDarkHex) {
          throw new Error(
            `Token ${token.name}: could not resolve Android hex. ` +
              `light="${lightRefPath}"→${resolvedLightHex}, dark="${darkRefPath}"→${resolvedDarkHex}. ` +
              `Check $extensions.cedar on the option tokens.`,
          );
        }

        lightHex = resolvedLightHex;
        darkHex = resolvedDarkHex;
      }

      lightColors.push({ name: token.name, value: lightHex });
      darkColors.push({ name: token.name, value: darkHex });
    });

    writeXmlFile(valuesPath, 'colors.xml', lightColors);
    writeXmlFile(valuesNightPath, 'colors.xml', darkColors);
  },

  undo: (_dictionary, config) => {
    const buildPath = config.buildPath ?? 'dist/themes/rei-dot-com/android/';
    const resPath = path.join(buildPath, 'res');
    if (fs.existsSync(resPath)) {
      fs.rmSync(resPath, { recursive: true, force: true });
    }
  },
};

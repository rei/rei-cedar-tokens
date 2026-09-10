import type { Config, TransformedToken } from 'style-dictionary';

import '../transforms/android/android-name-transform.js';
import '../transforms/android/android-color-transform.js';
import '../formats/android/android-color-xml.js';
import '../formats/android/android-compose-colors.js';
// Note: Android action disabled until normalization layer generates android extensions
// import "../actions/android/android-color-action.js";

export const androidConfig: Config = {
  source: ['canonical/tokens.json'],
  log: { verbosity: 'verbose' },
  platforms: {
    android: {
      transforms: ['attribute/cti', 'name/android-snake', 'value/android-color'],
      transformGroup: 'cedar/android',
      buildPath: 'dist/themes/rei-dot-com/android/',
      // actions: ["android-color-xml"], // Disabled until normalization generates android extensions
      files: [
        {
          destination: 'res/values/colors.xml',
          format: 'android/color-xml',
          filter: (token: TransformedToken) =>
            token.path[0] === 'color' &&
            token.path[1] === 'modes' &&
            token.path[2] === 'default' &&
            token.$type === 'color',
        },
        {
          destination: 'CedarColors.kt',
          format: 'android/compose-colors',
          filter: (token: TransformedToken) =>
            token.path[0] === 'color' &&
            token.path[1] === 'modes' &&
            token.path[2] === 'default' &&
            token.$type === 'color',
        },
      ],
    },
  },
};

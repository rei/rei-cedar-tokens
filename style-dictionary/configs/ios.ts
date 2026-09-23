import type { Config, TransformedToken } from 'style-dictionary';

import '../transforms/ios/ios-spacing-static-transform.js';
import '../formats/ios/ios-spacing-static-format.js';
import '../formats/ios/ios-text-size-format.js';

import '../transforms/ios/ios-name-transform.js';
import '../formats/ios/ios-colorset.js';
import '../actions/ios/ios-color-action.js';

export const iosConfig: Config = {
  source: ['canonical/tokens.json'],
  log: { verbosity: 'verbose' },
  platforms: {
    ios: {
      transforms: ['attribute/cti', 'name/ios-camel', 'value/ios/spacing-static-only'],
      buildPath: 'dist/themes/rei-dot-com/ios/',
      actions: ['ios-colorset'],
      files: [
        {
          destination: 'CdrSpacing.swift',
          format: 'swift/spacing-static-struct',
          filter: (token: TransformedToken) =>
            token.path[0] === 'spacing' &&
            (token.path[1] === 'component' || token.path[1] === 'layout'),
        },
        {
          destination: 'CdrTypography.swift',
          format: 'swift/text-size-struct',
          filter: (token: TransformedToken) =>
            token.path[0] === 'text' && token.path[1] === 'semantic',
        },
      ],
    },
  },
};

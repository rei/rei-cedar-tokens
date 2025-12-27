import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const css = (theme: Theme): PlatformConfig => ({
  css: {
    ...commonConfig(theme, 'css'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp'
    ],
    files: [
      {
        destination: 'cdr-tokens.css',
        format: 'css/variables',
        filter: 'remove-source-tokens'
      }
    ]
  }
});

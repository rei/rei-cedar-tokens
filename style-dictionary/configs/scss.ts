import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const scss = (theme: Theme): PlatformConfig => ({
  scss: {
    ...commonConfig(theme, 'scss'),
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
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        filter: 'remove-source-tokens'
      },
      {
        destination: 'cdr-typography.scss',
        format: 'scss/typography'
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map'
      }
    ],
    actions: [
      'include-media-queries-scss',
      'include-container-queries-scss',
      'include-display-scss',
      'concat-files'
    ]
  }
});

import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { getTokenModules } from '../token-modules';
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
        filter: 'remove-categories-tokens'
      },
      ...getTokenModules(theme, 'scss').map((tokenModule) => ({
        destination: `${tokenModule.responsibility}/${tokenModule.name}.scss`,
        format: 'scss/variables',
        filter: tokenModule.filter
      })),
      {
        destination: 'utilities/cdr-type-mixins.scss',
        format: 'scss/typography'
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map'
      }
    ],
    actions: ['include-queries-file-scss', 'include-display-scss', 'concat-files']
  }
});

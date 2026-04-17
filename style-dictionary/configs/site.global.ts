import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const siteGlobal = (theme: Theme): PlatformConfig => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/strip-all-px-js',
      'size/space-js',
      'size/px-to-rem-transitive',
      'time/seconds',
      'value/clamp',
    ],
    files: [
      {
        destination: 'global.json',
        format: 'site',
        filter: 'remove-source-tokens',
      },
    ],
  },
});

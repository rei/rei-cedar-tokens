import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const siteAndroid = (theme: Theme): PlatformConfig => ({
  siteAndroid: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'attribute/text-short-names',
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/hex8android',
    ],
    files: [
      {
        destination: 'android.json',
        format: 'site',
        filter: 'remove-source-tokens',
      },
    ],
  },
});

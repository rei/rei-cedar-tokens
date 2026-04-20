import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const siteIos = (theme: Theme): PlatformConfig => ({
  siteIos: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'color/UIColor',
      'size/strip-px',
      'size/space',
      'size/float',
    ],
    files: [
      {
        destination: 'ios.json',
        format: 'site',
        filter: 'remove-source-tokens',
      },
    ],
  },
});

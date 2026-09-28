import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const figma = (theme: Theme): PlatformConfig => ({
  figma: {
    ...commonConfig(theme, 'figma'),
    transforms: [
      'attribute/deprecated',
      'attribute/text-short-names',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
    ],
    files: [
      {
        destination: 'figma.json',
        format: 'figma',
      },
    ],
  },
});

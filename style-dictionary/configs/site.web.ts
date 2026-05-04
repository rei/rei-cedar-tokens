import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const siteWeb = (theme: Theme): PlatformConfig => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'attribute/text-short-names',
      'name/kebab',
      'size/strip-px',
      'size/space-js',
      'size/px-to-rem-transitive',
      'time/seconds',
      'value/clamp',
    ],
    files: [
      {
        destination: 'web.json',
        format: 'site',
        filter: 'remove-source-tokens',
      },
      // Foundations filters
      ...foundationsFilters('json', 'site'),
      // Component filters
      ...componentsFilters('json', 'site'),
    ],
  },
});

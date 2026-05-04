import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const css = (theme: Theme): PlatformConfig => ({
  css: {
    ...commonConfig(theme, 'css'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp',
    ],
    files: [
      {
        destination: 'cdr-variables.css',
        format: 'css/variables',
        filter: 'remove-categories-tokens',
      },
      // Foundations filters
      ...foundationsFilters('css', 'css/variables'),
      // Component filters
      ...componentsFilters('css', 'css/variables'),
      // REI Dot Com Specific Palettes
      ...(theme === 'rei-dot-com'
        ? [
            {
              destination: 'palettes/cdr-palette-membership-subtle.css',
              format: 'css/variables',
              filter: 'membership-subtle-tokens',
            },
            {
              destination: 'palettes/cdr-palette-membership-vibrant.css',
              format: 'css/variables',
              filter: 'membership-vibrant-tokens',
            },
          ]
        : []),
    ],
    actions: ['concat-files'],
  },
});

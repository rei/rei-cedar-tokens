import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const scss = (theme: Theme): PlatformConfig => ({
  scss: {
    ...commonConfig(theme, 'scss'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp',
    ],
    files: [
      // Foundations filters
      ...foundationsFilters('scss', 'scss/variables'),
      // Component filters
      ...componentsFilters('scss', 'scss/variables'),
      // REI Dot Com Specific Palettes
      {
        destination: 'utilities/cdr-type-mixins.scss',
        format: 'scss/typography',
      },
      {
        destination: 'cdr-variables.scss',
        format: 'scss/variables',
        filter: 'remove-categories-tokens',
      },
      ...(theme === 'rei-dot-com'
        ? [
            {
              destination: 'palettes/cdr-palette-membership-subtle.scss',
              format: 'scss/variables',
              filter: 'membership-subtle-tokens',
            },
            {
              destination: 'palettes/cdr-palette-membership-vibrant.scss',
              format: 'scss/variables',
              filter: 'membership-vibrant-tokens',
            },
          ]
        : []),
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map',
      },
    ],
    actions: ['include-queries-file-scss', 'include-display-scss', 'concat-files'],
  },
});

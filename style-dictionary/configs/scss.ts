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
      ...(theme === 'docsite'
        ? [
            {
              destination: 'cdr-variable.scss',
              format: 'scss/variables',
              filter: 'remove-categories-tokens',
            },
            {
              destination: 'foundations/cdr-color-background.scss',
              format: 'scss/variables',
              filter: 'color-background-tokens',
            },
            {
              destination: 'foundations/cdr-color-text.scss',
              format: 'scss/variables',
              filter: 'color-text-tokens',
            },
            {
              destination: 'foundations/cdr-color-border.scss',
              format: 'scss/variables',
              filter: 'color-border-tokens',
            },
            {
              destination: 'foundations/cdr-color-icon.scss',
              format: 'scss/variables',
              filter: 'color-icon-tokens',
            },
            {
              destination: 'foundations/cdr-motion.scss',
              format: 'scss/variables',
              filter: 'motion-tokens',
            },
            {
              destination: 'foundations/cdr-prominence.scss',
              format: 'scss/variables',
              filter: 'prominence-tokens',
            },
            {
              destination: 'foundations/cdr-form.scss',
              format: 'scss/variables',
              filter: 'form-tokens',
            },
            {
              destination: 'foundations/cdr-icon.scss',
              format: 'scss/variables',
              filter: 'icon-tokens',
            },
            {
              destination: 'foundations/cdr-radius.scss',
              format: 'scss/variables',
              filter: 'radius-tokens',
            },
            {
              destination: 'foundations/cdr-space.scss',
              format: 'scss/variables',
              filter: 'space-tokens',
            },
            {
              destination: 'utilities/cdr-type-mixins.scss',
              format: 'scss/typography',
            },
          ]
        : []),
      ...(theme === 'rei-dot-com'
        ? [
            // Foundations filters
            ...foundationsFilters('scss', 'scss/variables'),
            // Component filters
            ...componentsFilters('scss', 'scss/variables'),
            // REI Dot Com Specific Palettes
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

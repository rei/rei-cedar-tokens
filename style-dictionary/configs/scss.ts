import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const scss = (theme: Theme): PlatformConfig => ({
  scss: {
    ...commonConfig(theme, 'scss'),
    transforms: [
      // tokens-studio transforms
      'ts/descriptionToComment',
      'ts/resolveMath',
      'ts/size/px',
      'ts/opacity',
      'ts/size/lineheight',
      'ts/typography/fontWeight',
      'ts/color/modifiers',
      'ts/color/css/hexrgba',
      'ts/size/css/letterspacing',
      'ts/shadow/innerShadow',
      // built-in CSS transforms (excluding size/rem to use our custom override)
      'attribute/cti',
      'attribute/text-short-names',
      'name/kebab',
      'time/seconds',
      'html/icon',
      'color/css',
      'asset/url',
      'fontFamily/css',
      'cubicBezier/css',
      'strokeStyle/css/shorthand',
      'border/css/shorthand',
      'typography/css/shorthand',
      'transition/css/shorthand',
      'shadow/css/shorthand',
      // custom transforms
      'attribute/deprecated',
      'size/space',
      'size/px-to-rem-transitive',
      'size/rem-custom',
      'fontFamily/css-quotes',
      'value/clamp',
    ],
    files: [
      // Foundations filters
      ...foundationsFilters('scss', 'scss/variables'),
      // Component filters
      ...componentsFilters('scss', 'scss/variables'),
      // REI Dot Com Specific Palettes
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
        destination: 'utilities/cdr-type-mixins.scss',
        format: 'scss/typography',
      },
      {
        destination: 'map-resolved.no_concat.scss',
        format: 'scss/map',
      },
      {
        destination: 'map-vars.no_concat.scss',
        format: 'scss/map-vars',
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map-legacy-forward',
      },
    ],
    actions: ['include-queries-file-scss', 'include-display-scss', 'concat-files'],
  },
});

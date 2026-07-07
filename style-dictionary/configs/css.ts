import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const css = (theme: Theme): PlatformConfig => ({
  css: {
    ...commonConfig(theme, 'css'),
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

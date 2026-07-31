import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

const keep = ['$value', '$type', 'name', 'attributes', 'docs', 'mixin', 'utility-class'];

export const siteWeb = (theme: Theme): PlatformConfig => {
  const { prefix, buildPath } = commonConfig(theme, 'json');

  return {
    siteWeb: {
      prefix,
      buildPath,
      options: {
        showFileHeader: false,
        stripMeta: { keep },
      },
      transforms: [
        // tokens-studio transforms (excluding size/rem to prevent lineHeight conversion)
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
        'attribute/cti',
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
        'attribute/surface-docs',
        'attribute/text-short-names',
        'name/kebab',
        'size/strip-px',
        'size/space-js',
        'size/px-to-rem-transitive',
        'fontFamily/css-quotes',
        'value/clamp',
      ],
      files: [
        {
          destination: 'web.json',
          format: 'json',
          filter: 'remove-source-tokens',
        },
        // Foundations filters
        ...foundationsFilters('json', 'json'),
        // Component filters
        ...componentsFilters('json', 'json'),
      ],
    },
  };
};

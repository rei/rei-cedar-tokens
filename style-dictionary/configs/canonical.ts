import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';

const keep = ['$value', '$type', '$extensions', 'docs', 'mixin', 'utility-class'];

export const canonical = (theme: Theme): PlatformConfig => ({
  canonical: {
    prefix: 'cdr',
    buildPath: `canonical/${theme}/`,
    options: {
      showFileHeader: false,
      stripMeta: { keep },
    },
    transforms: [
      // tokens-studio normalization transforms
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
      // custom normalization transforms
      'attribute/deprecated',
      'attribute/surface-docs',
      'attribute/text-short-names',
      'name/kebab',
      'value/clamp',
    ],
    files: [
      {
        destination: 'tokens.json',
        format: 'json',
      },
    ],
  },
});

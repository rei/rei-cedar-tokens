import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

const keep = ['$value', '$type', 'name', 'attributes', 'docs', 'mixin', 'utility-class'];

export const siteIos = (theme: Theme): PlatformConfig => {
  const { prefix, buildPath } = commonConfig(theme, 'json');

  return {
    siteIos: {
      prefix,
      buildPath,
      options: {
        showFileHeader: false,
        stripMeta: { keep },
      },
      transforms: [
        'attribute/deprecated',
        'attribute/surface-docs',
        'attribute/text-short-names',
        'name/pascal',
        'name/pascal-space-scale-range',
        'color/UIColor',
        'size/strip-px',
        'size/space',
        'size/float',
      ],
      files: [
        {
          destination: 'ios.json',
          format: 'json',
          filter: 'remove-source-tokens',
        },
      ],
    },
  };
};

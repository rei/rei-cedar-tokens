import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

const keep = ['$value', '$type', 'name', 'attributes', 'docs', 'mixin', 'utility-class'];

export const siteGlobal = (theme: Theme): PlatformConfig => {
  const { prefix, buildPath } = commonConfig(theme, 'json');

  return {
    siteGlobal: {
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
        'name/kebab',
        'size/strip-all-px-js',
        'size/space-js',
        'size/px-to-rem-transitive',
        'fontFamily/css-quotes',
        'time/seconds',
        'value/clamp',
      ],
      files: [
        {
          destination: 'global.json',
          format: 'json',
          filter: 'remove-source-tokens',
        },
      ],
    },
  };
};

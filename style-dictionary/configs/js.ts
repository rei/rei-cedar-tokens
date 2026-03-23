import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { getTokenModules } from '../token-modules';
import { commonConfig } from '../utils';

export const js = (theme: Theme): PlatformConfig => ({
  js: {
    ...commonConfig(theme, 'js'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'value/clamp'
    ],
    files: [
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'remove-source-tokens'
      },
      {
        destination: 'cdr-tokens.cjs',
        format: 'javascript/module-flat',
        filter: 'remove-source-tokens'
      },
      {
        destination: 'cdr-tokens.d.mts',
        format: 'typescript/es6-declarations',
        filter: 'remove-source-tokens'
      },
      ...getTokenModules(theme, 'js').flatMap((tokenModule) => [
        {
          destination: `${tokenModule.responsibility}/${tokenModule.name}.mjs`,
          format: 'javascript/es6',
          filter: tokenModule.filter
        },
        {
          destination: `${tokenModule.responsibility}/${tokenModule.name}.cjs`,
          format: 'javascript/module-flat',
          filter: tokenModule.filter
        },
        {
          destination: `${tokenModule.responsibility}/${tokenModule.name}.d.ts`,
          format: 'typescript/es6-declarations',
          filter: tokenModule.filter
        }
      ])
    ]
  }
});

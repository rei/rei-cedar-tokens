import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { foundationsFilters } from './filters/foundationsFilters';
import { componentsFilters } from './filters/componentsFilters';

export const js = (theme: Theme): PlatformConfig => ({
  js: {
    ...commonConfig(theme, 'js'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'value/clamp',
    ],
    files: [
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-tokens.cjs',
        format: 'javascript/module-flat',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-tokens.d.mts',
        format: 'typescript/es6-declarations',
        filter: 'remove-source-tokens',
      },
      ...foundationsFilters('mjs', 'javascript/es6'),
      ...foundationsFilters('cjs', 'javascript/module-flat'),
      ...foundationsFilters('d.ts', 'typescript/es6-declarations'),
      ...componentsFilters('mjs', 'javascript/es6'),
      ...componentsFilters('cjs', 'javascript/module-flat'),
      ...componentsFilters('d.ts', 'typescript/es6-declarations'),
    ],
  },
});

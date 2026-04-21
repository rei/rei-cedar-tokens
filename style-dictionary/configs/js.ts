import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

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
        destination: 'cdr-tokens.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'foundations/cdr-color-background.mjs',
        format: 'javascript/es6',
        filter: 'color-background-tokens',
      },
      {
        destination: 'foundations/cdr-color-background.cjs',
        format: 'javascript/module-flat',
        filter: 'color-background-tokens',
      },
      {
        destination: 'foundations/cdr-color-background.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'color-background-tokens',
      },
      {
        destination: 'foundations/cdr-color-text.mjs',
        format: 'javascript/es6',
        filter: 'color-text-tokens',
      },
      {
        destination: 'foundations/cdr-color-text.cjs',
        format: 'javascript/module-flat',
        filter: 'color-text-tokens',
      },
      {
        destination: 'foundations/cdr-color-text.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'color-text-tokens',
      },
      {
        destination: 'foundations/cdr-color-border.mjs',
        format: 'javascript/es6',
        filter: 'color-border-tokens',
      },
      {
        destination: 'foundations/cdr-color-border.cjs',
        format: 'javascript/module-flat',
        filter: 'color-border-tokens',
      },
      {
        destination: 'foundations/cdr-color-border.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'color-border-tokens',
      },
      {
        destination: 'foundations/cdr-color-icon.mjs',
        format: 'javascript/es6',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'foundations/cdr-color-icon.cjs',
        format: 'javascript/module-flat',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'foundations/cdr-color-icon.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'foundations/cdr-motion.mjs',
        format: 'javascript/es6',
        filter: 'motion-tokens',
      },
      {
        destination: 'foundations/cdr-motion.cjs',
        format: 'javascript/module-flat',
        filter: 'motion-tokens',
      },
      {
        destination: 'foundations/cdr-motion.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'motion-tokens',
      },
      {
        destination: 'foundations/cdr-prominence.mjs',
        format: 'javascript/es6',
        filter: 'prominence-tokens',
      },
      {
        destination: 'foundations/cdr-prominence.cjs',
        format: 'javascript/module-flat',
        filter: 'prominence-tokens',
      },
      {
        destination: 'foundations/cdr-prominence.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'prominence-tokens',
      },
      {
        destination: 'foundations/cdr-form.mjs',
        format: 'javascript/es6',
        filter: 'form-tokens',
      },
      {
        destination: 'foundations/cdr-form.cjs',
        format: 'javascript/module-flat',
        filter: 'form-tokens',
      },
      {
        destination: 'foundations/cdr-form.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'form-tokens',
      },
      {
        destination: 'foundations/cdr-icon.mjs',
        format: 'javascript/es6',
        filter: 'icon-tokens',
      },
      {
        destination: 'foundations/cdr-icon.cjs',
        format: 'javascript/module-flat',
        filter: 'icon-tokens',
      },
      {
        destination: 'foundations/cdr-icon.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'icon-tokens',
      },
      {
        destination: 'foundations/cdr-radius.mjs',
        format: 'javascript/es6',
        filter: 'radius-tokens',
      },
      {
        destination: 'foundations/cdr-radius.cjs',
        format: 'javascript/module-flat',
        filter: 'radius-tokens',
      },
      {
        destination: 'foundations/cdr-radius.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'radius-tokens',
      },
      {
        destination: 'foundations/cdr-space.mjs',
        format: 'javascript/es6',
        filter: 'space-tokens',
      },
      {
        destination: 'foundations/cdr-space.cjs',
        format: 'javascript/module-flat',
        filter: 'space-tokens',
      },
      {
        destination: 'foundations/cdr-space.d.ts',
        format: 'typescript/es6-declarations',
        filter: 'space-tokens',
      },
    ],
  },
});

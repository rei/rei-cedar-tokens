import { commonConfig } from '../utils.mjs';

export const js = (theme) => ({
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
        destination: 'cdr-tokens.cjs',
        format: 'javascript/module-flat',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'remove-source-tokens',
      },
      {
        format: 'typescript/es6-declarations',
        destination: 'cdr-tokens.d.mts',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-color-background.mjs',
        format: 'javascript/es6',
        filter: 'color-background-tokens',
      },
      {
        destination: 'cdr-color-background.cjs',
        format: 'javascript/module-flat',
        filter: 'color-background-tokens',
      },
      {
        destination: 'cdr-color-text.mjs',
        format: 'javascript/es6',
        filter: 'color-text-tokens',
      },
      {
        destination: 'cdr-color-text.cjs',
        format: 'javascript/module-flat',
        filter: 'color-text-tokens',
      },
      {
        destination: 'cdr-color-border.mjs',
        format: 'javascript/es6',
        filter: 'color-border-tokens',
      },
      {
        destination: 'cdr-color-border.cjs',
        format: 'javascript/module-flat',
        filter: 'color-border-tokens',
      },
      {
        destination: 'cdr-color-icon.mjs',
        format: 'javascript/es6',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'cdr-color-icon.cjs',
        format: 'javascript/module-flat',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'cdr-motion.mjs',
        format: 'javascript/es6',
        filter: 'motion-tokens',
      },
      {
        destination: 'cdr-motion.cjs',
        format: 'javascript/module-flat',
        filter: 'motion-tokens',
      },
      {
        destination: 'cdr-prominence.mjs',
        format: 'javascript/es6',
        filter: 'prominence-tokens',
      },
      {
        destination: 'cdr-prominence.cjs',
        format: 'javascript/module-flat',
        filter: 'prominence-tokens',
      },
      {
        destination: 'cdr-form.mjs',
        format: 'javascript/es6',
        filter: 'form-tokens',
      },
      {
        destination: 'cdr-form.cjs',
        format: 'javascript/module-flat',
        filter: 'form-tokens',
      },
      {
        destination: 'cdr-icon.mjs',
        format: 'javascript/es6',
        filter: 'icon-tokens',
      },
      {
        destination: 'cdr-icon.cjs',
        format: 'javascript/module-flat',
        filter: 'icon-tokens',
      },
      {
        destination: 'cdr-radius.mjs',
        format: 'javascript/es6',
        filter: 'radius-tokens',
      },
      {
        destination: 'cdr-radius.cjs',
        format: 'javascript/module-flat',
        filter: 'radius-tokens',
      },
      {
        destination: 'cdr-space.mjs',
        format: 'javascript/es6',
        filter: 'space-tokens',
      },
      {
        destination: 'cdr-space.cjs',
        format: 'javascript/module-flat',
        filter: 'space-tokens',
      },
    ],
  },
});

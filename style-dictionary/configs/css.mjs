import { commonConfig } from '../utils.mjs';

export const css = (theme) => ({
  css: {
    ...commonConfig(theme, 'css'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp',
    ],
    files: [
      {
        destination: 'cdr-variables.css',
        format: 'css/variables',
        filter: 'remove-categories-tokens',
      },
      {
        destination: 'cdr-color-background.no_concat.css',
        format: 'css/variables',
        filter: 'color-background-tokens',
      },
      {
        destination: 'cdr-color-text.no_concat.css',
        format: 'css/variables',
        filter: 'color-text-tokens',
      },
      {
        destination: 'cdr-color-border.no_concat.css',
        format: 'css/variables',
        filter: 'color-border-tokens',
      },
      {
        destination: 'cdr-color-icon.no_concat.css',
        format: 'css/variables',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'cdr-motion.no_concat.css',
        format: 'css/variables',
        filter: 'motion-tokens',
      },
      {
        destination: 'cdr-prominence.no_concat.css',
        format: 'css/variables',
        filter: 'prominence-tokens',
      },
      {
        destination: 'cdr-form.no_concat.css',
        format: 'css/variables',
        filter: 'form-tokens',
      },
      {
        destination: 'cdr-icon.no_concat.css',
        format: 'css/variables',
        filter: 'icon-tokens',
      },
      {
        destination: 'cdr-radius.no_concat.css',
        format: 'css/variables',
        filter: 'radius-tokens',
      },
      {
        destination: 'cdr-space.no_concat.css',
        format: 'css/variables',
        filter: 'space-tokens',
      },
    ],
    actions: ['concat-files'],
  },
});

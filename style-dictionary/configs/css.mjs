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
        destination: 'cdr-tokens.css',
        format: 'css/variables',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-color-background.css',
        format: 'css/variables',
        filter: 'color-background-tokens',
      },
      {
        destination: 'cdr-color-text.css',
        format: 'css/variables',
        filter: 'color-text-tokens',
      },
      {
        destination: 'cdr-color-border.css',
        format: 'css/variables',
        filter: 'color-border-tokens',
      },
      {
        destination: 'cdr-color-icon.css',
        format: 'css/variables',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'cdr-motion.css',
        format: 'css/variables',
        filter: 'motion-tokens',
      },
      {
        destination: 'cdr-prominence.css',
        format: 'css/variables',
        filter: 'prominence-tokens',
      },
      {
        destination: 'cdr-form.css',
        format: 'css/variables',
        filter: 'form-tokens',
      },
      {
        destination: 'cdr-icon.css',
        format: 'css/variables',
        filter: 'icon-tokens',
      },
      {
        destination: 'cdr-radius.css',
        format: 'css/variables',
        filter: 'radius-tokens',
      },
      {
        destination: 'cdr-space.css',
        format: 'css/variables',
        filter: 'space-tokens',
      },
    ],
  },
});

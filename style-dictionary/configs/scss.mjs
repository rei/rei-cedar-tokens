import { commonConfig } from '../utils.mjs';

export const scss = (theme) => ({
  scss: {
    ...commonConfig(theme, 'scss'),
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
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        filter: 'remove-source-tokens',
      },
      {
        destination: 'cdr-color-background.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-background-tokens',
      },
      {
        destination: 'cdr-color-text.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-text-tokens',
      },
      {
        destination: 'cdr-color-border.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-border-tokens',
      },
      {
        destination: 'cdr-color-icon.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map',
      },
    ],
    actions: [
      'include-media-queries-scss',
      'include-container-queries-scss',
      'include-display-scss',
      'concat-files',
    ],
  },
});

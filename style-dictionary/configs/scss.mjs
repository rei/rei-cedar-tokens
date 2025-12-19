import { commonConfig } from '../utils.mjs'

export const scss = (theme) => ({
  scss: {
    ...commonConfig(theme, 'scss'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp'
    ],
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        filter: 'remove-categories-tokens'
      },
      {
        destination: 'cdr-color-background.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-background-tokens'
      },
      {
        destination: 'cdr-color-text.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-text-tokens'
      },
      {
        destination: 'cdr-color-border.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-border-tokens'
      },
      {
        destination: 'cdr-color-icon.no_concat.scss',
        format: 'scss/variables',
        filter: 'color-icon-tokens'
      },
      {
        destination: 'cdr-motion.no_concat.scss',
        format: 'scss/variables',
        filter: 'motion-tokens'
      },
      {
        destination: 'cdr-prominence.no_concat.scss',
        format: 'scss/variables',
        filter: 'prominence-tokens'
      },
      {
        destination: 'cdr-form.no_concat.scss',
        format: 'scss/variables',
        filter: 'form-tokens'
      },
      {
        destination: 'cdr-icon.no_concat.scss',
        format: 'scss/variables',
        filter: 'icon-tokens'
      },
      {
        destination: 'cdr-radius.no_concat.scss',
        format: 'scss/variables',
        filter: 'radius-tokens'
      },
      {
        destination: 'cdr-space.no_concat.scss',
        format: 'scss/variables',
        filter: 'space-tokens'
      },
      {
        destination: 'cdr-type-mixins.no_concat.scss',
        format: 'scss/mixin'
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map'
      }
    ],
    actions: ['include-queries-file-scss', 'include-display-scss', 'concat-files']
  }
})

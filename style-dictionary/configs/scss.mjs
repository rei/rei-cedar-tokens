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
      'color/alpha',
      'color/css-transitive'
    ],
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map',
        options: {
          showFileHeader: false
        }
      }
    ],
    actions: ['include-media-queries-scss', 'include-display-scss', 'concat-files', 'include-deprecate-scss']
  }
})

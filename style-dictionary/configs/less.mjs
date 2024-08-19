import { commonConfig } from '../utils.mjs'

export const less = (theme) => ({
  less: {
    ...commonConfig(theme, 'less'),
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
        destination: 'cdr-variable.less',
        format: 'less/variables',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
        options: {
          showFileHeader: false
        }
      }
    ],
    actions: ['include-media-queries-less', 'include-display-less', 'concat-files']
  }
})

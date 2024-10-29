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
        format: 'less/variables'
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin'
      }
    ],
    actions: ['include-media-queries-less', 'include-container-queries-less', 'include-display-less', 'concat-files']
  }
})

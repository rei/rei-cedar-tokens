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
      'value/clamp'
    ],
    files: [
      {
        destination: 'cdr-variable.less',
        format: 'less/variables',
        filter: 'remove-source-tokens'
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
        filter: 'remove-source-tokens'
      }
    ],
    actions: ['include-media-queries-less', 'include-container-queries-less', 'include-display-less', 'concat-files']
  }
})

import { commonConfig } from '../utils.mjs'

export const scss = (theme) => ({
  scssUse: {
    ...commonConfig(theme, 'scss'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive'
    ],
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        filter: 'remove-source-tokens'
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
        options: {
          includeDeprecate: true
        }
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map'
      }
    ],
    actions: ['include-media-queries-scss', 'include-container-queries-scss', 'include-display-scss', 'concat-files', 'include-deprecate-scss']
  }
})

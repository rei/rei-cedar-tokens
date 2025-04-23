import { commonConfig } from '../utils.mjs'

export const scssUse = (theme) => ({
  scss: {
    ...commonConfig(theme, 'scss-use'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive'
    ],
    files: [
      {
        destination: 'cdr-use-tokens.scss',
        format: 'scss/map-flat'
      },
      {
        destination: 'cdr-use-mixin.scss',
        format: 'scss/mixin'
      }
    ]
  }
})

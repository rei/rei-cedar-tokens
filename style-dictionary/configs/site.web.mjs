import { commonConfig } from '../utils.mjs'

export const siteWeb = (theme) => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/strip-px',
      'size/space-js',
      'color/css-transitive',
      'size/px-to-rem-transitive',
      'time/seconds'
    ],
    files: [
      {
        destination: 'web.json',
        format: 'site',
        filter: 'remove-source-tokens'
      }
    ]
  }
})

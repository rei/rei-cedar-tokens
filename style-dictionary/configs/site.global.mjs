import { commonConfig } from '../utils.mjs'

export const siteGlobal = (theme) => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/strip-all-px-js',
      'size/space-js',
      'color/css-transitive',
      'size/px-to-rem-transitive',
      'time/seconds'
    ],
    files: [
      {
        destination: 'global.json',
        format: 'site',
        filter: 'remove-source-tokens'
      }
    ]
  }
})

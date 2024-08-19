import { commonConfig } from '../utils.mjs'

export const siteGlobal = (theme) => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'color/alpha',
      'color/css-transitive'
    ],
    files: [
      {
        destination: 'global.json',
        format: 'site',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

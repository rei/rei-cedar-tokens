import { commonConfig } from '../utils.mjs'

export const siteAndroid = (theme) => ({
  siteAndroid: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/hex8android'
    ],
    files: [
      {
        destination: 'android.json',
        format: 'site',
        filter: 'remove-source-tokens'
      }
    ]
  }
})

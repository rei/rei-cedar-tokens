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
      'color/alpha',
      'color/hex8android-transitive'
    ],
    files: [
      {
        destination: 'android.json',
        format: 'site',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

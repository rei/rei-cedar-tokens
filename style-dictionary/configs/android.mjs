import { commonConfig } from '../utils.mjs'

export const android = (theme) => ({
  android: {
    ...commonConfig(theme, 'android'),
    transforms: [
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/alpha',
      'color/hex8android-transitive'
    ],
    files: [
      {
        destination: 'colors.xml',
        filter: {
          $type: 'color'
        },
        options: {
          showFileHeader: false
        },
        format: 'android/resources'
      },
      {
        destination: 'font_dimens.xml',
        filter: {
          $type: 'fontSize'
        },
        options: {
          showFileHeader: false
        },
        format: 'android/fontDimens'
      },
      {
        destination: 'dimens.xml',
        filter: {
          $type: 'dimension'
        },
        options: {
          showFileHeader: false
        },
        format: 'android/dimens'
      }
    ]
  }
})

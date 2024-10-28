import { commonConfig, filterSourceTokensAndType } from '../utils.mjs'

export const android = (theme) => ({
  android: {
    ...commonConfig(theme, 'android'),
    transforms: [
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/hex8android'
    ],
    files: [
      {
        destination: 'colors.xml',
        filter: (token) => filterSourceTokensAndType(token, 'color'),
        format: 'android/resources'
      },
      {
        destination: 'font_dimens.xml',
        filter: (token) => filterSourceTokensAndType(token, 'fontSize'),
        format: 'android/fontDimens'
      },
      {
        destination: 'dimens.xml',
        filter: (token) => filterSourceTokensAndType(token, 'dimension'),
        format: 'android/dimens'
      }
    ]
  }
})

import { commonConfig, filterSourceTokensAndType } from '../utils.mjs'

export const ios = (theme) => ({
  ios: {
    ...commonConfig(theme, 'ios'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'color/UIColor',
      'size/strip-px',
      'size/space',
      'size/float'
    ],
    files: [
      {
        destination: 'CdrSize.h',
        format: 'ios/static.h',
        filter: (token) => filterSourceTokensAndType(token, ['dimension', 'fontSize']),
        options: {
          type: 'float',
          className: 'CdrSize'
        }
      },
      {
        destination: 'CdrSize.m',
        format: 'ios/static.m',
        filter: (token) => filterSourceTokensAndType(token, ['dimension', 'fontSize']),
        options: {
          type: 'float',
          className: 'CdrSize'
        }
      },
      {
        destination: 'CdrColor.h',
        format: 'ios/colors.h',
        filter: (token) => filterSourceTokensAndType(token, 'color'),
        options: {
          type: 'CdrColorName',
          className: 'CdrColor'
        }
      },
      {
        destination: 'CdrColor.m',
        format: 'ios/colors.m',
        filter: (token) => filterSourceTokensAndType(token, 'color'),
        options: {
          type: 'CdrColorName',
          className: 'CdrColor'
        }
      }
    ]
  }
})

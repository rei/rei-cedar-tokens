import { commonConfig } from '../utils.mjs'

export const ios = (theme) => ({
  ios: {
    ...commonConfig(theme, 'ios'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'color/alpha',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float'
    ],
    files: [
      {
        destination: 'CdrSize.h',
        format: 'ios/static.h',
        filter: 'ios-size',
        options: {
          type: 'float',
          className: 'CdrSize'
        }
      },
      {
        destination: 'CdrSize.m',
        format: 'ios/static.m',
        filter: 'ios-size',
        options: {
          type: 'float',
          className: 'CdrSize'
        }
      },
      {
        destination: 'CdrColor.h',
        format: 'ios/colors.h',
        filter: {
          $type: 'color'
        },
        type: 'CdrColorName',
        className: 'CdrColor'
      },
      {
        destination: 'CdrColor.m',
        format: 'ios/colors.m',
        filter: {
          $type: 'color'
        },
        options: {
          type: 'CdrColorName',
          className: 'CdrColor'
        }
      }
    ]
  }
})

export const ios = (theme) => ({
  ios: {
    prefix: 'cdr',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'color/alpha',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float'
    ],
    buildPath: `dist/${theme}/ios/`,
    files: [
      {
        destination: 'CdrSize.h',
        format: 'ios/static.h',
        type: 'float',
        className: 'CdrSize',
        filter: 'ios-size',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'CdrSize.m',
        format: 'ios/static.m',
        type: 'float',
        className: 'CdrSize',
        filter: 'ios-size',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'CdrColor.h',
        format: 'ios/colors.h',
        className: 'CdrColor',
        type: 'CdrColorName',
        filter: 'ios-color',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'CdrColor.m',
        format: 'ios/colors.m',
        className: 'CdrColor',
        type: 'CdrColorName',
        filter: 'ios-color',
        options: {
          showFileHeader: false
        }
      }
    ]
  }
})

module.exports = function (theme) {
  return {
    ios: {
      transformGroup: 'custom/ios',
      buildPath: `dist/${theme}/ios/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'CdrSize.h',
          format: 'ios/static.h',
          type: 'float',
          className: 'CdrSize',
          filter: 'iosSize',
          options: {
            showFileHeader: false,
          }
        },
        {
          destination: 'CdrSize.m',
          format: 'ios/static.m',
          type: 'float',
          className: 'CdrSize',
          filter: 'iosSize',
          options: {
            showFileHeader: false,
          }
        },
        {
          destination: 'CdrColor.h',
          format: 'ios/colors.h',
          className: 'CdrColor',
          type: 'CdrColorName',
          filter: 'iosColor',
          options: {
            showFileHeader: false,
          },
        },
        {
          destination: 'CdrColor.m',
          format: 'ios/colors.m',
          className: 'CdrColor',
          type: 'CdrColorName',
          filter: 'iosColor',
          options: {
            showFileHeader: false,
          },
        },
      ],
    }
  }
};

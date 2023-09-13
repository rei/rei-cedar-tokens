module.exports = function (theme) {
  return {
    android: {
      transformGroup: 'custom/android',
      buildPath: `dist/${theme}/android/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'colors.xml',
          options: {
            showFileHeader: false,
          },
          format: 'android/colors',
        },
        {
          destination: 'font_dimens.xml',
          options: {
            showFileHeader: false,
          },
          format: 'android/fontDimens',
        },
        {
          destination: 'dimens.xml',
          options: {
            showFileHeader: false,
          },
          format: 'android/dimens',
        },
      ],
    }
  }
};

module.exports = function (theme) {
  return {
    android: {
      transformGroup: 'custom/android',
      buildPath: `dist/${theme}/android/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'colors.xml',
          filter: "removeSourceTokens",
          options: {
            showFileHeader: false,
          },
          format: 'android/colors',
        },
        {
          destination: 'font_dimens.xml',
          filter: "removeSourceTokens",
          options: {
            showFileHeader: false,
          },
          format: 'android/fontDimens',
        },
        {
          destination: 'dimens.xml',
          filter: "removeSourceTokens",
          options: {
            showFileHeader: false,
          },
          format: 'android/dimens',
        },
      ],
    }
  }
};

module.exports = {
  android: {
    transformGroup: 'custom/android',
    buildPath: 'dist/android/',
    files: [
      {
        destination: 'colors.xml',
        format: 'android/colors',
        filter: {
          attributes: {
            foundation: false,
          },
        },
      },
      {
        destination: 'font_dimens.xml',
        format: 'android/fontDimens',
        filter: {
          attributes: {
            foundation: false,
          },
        },
      },
      {
        destination: 'dimens.xml',
        format: 'android/dimens',
        filter: {
          attributes: {
            foundation: false,
          },
        },
      },
      {
        destination: 'integers.xml',
        format: 'android/integers',
        filter: {
          attributes: {
            foundation: false,
          },
        },
      },
      {
        destination: 'strings.xml',
        format: 'android/strings',
        filter: {
          attributes: {
            foundation: false,
          },
        },
      },
    ],
  },
};

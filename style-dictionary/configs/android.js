module.exports = {
  android: {
    transformGroup: 'custom/android',
    buildPath: 'dist/android/',
    prefix: 'cdr',
    files: [
      {
        destination: 'colors.xml',
        format: 'android/colors',
      },
      {
        destination: 'font_dimens.xml',
        format: 'android/fontDimens',
      },
      {
        destination: 'dimens.xml',
        format: 'android/dimens',
      },
      {
        destination: 'integers.xml',
        format: 'android/integers',
      },
      {
        destination: 'strings.xml',
        format: 'android/strings',
      },
    ],
  },
};

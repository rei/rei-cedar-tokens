module.exports = {
  android: {
    transformGroup: 'custom/android',
    buildPath: 'dist/android/',
    prefix: 'cdr',
    files: [
      {
        destination: 'colors.xml',
        filter: "removeOptions",
        options: {
          showFileHeader: false,
        },
        format: 'android/colors',
      },
      {
        destination: 'font_dimens.xml',
        filter: "removeOptions",
        options: {
          showFileHeader: false,
        },
        format: 'android/fontDimens',
      },
      {
        destination: 'dimens.xml',
        filter: "removeOptions",
        options: {
          showFileHeader: false,
        },
        format: 'android/dimens',
      },
    ],
  },
};

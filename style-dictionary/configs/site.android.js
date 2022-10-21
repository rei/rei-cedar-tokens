module.exports = {
  siteAndroid: {
    transformGroup: 'custom/android',
    buildPath: 'dist/json/',
    prefix: 'cdr',
    files: [
      {
        destination: 'android.json',
        format: 'site',
        options: {
          showFileHeader: false,
        },
        filter: 'removeOptions',
      },
    ],
  },
};

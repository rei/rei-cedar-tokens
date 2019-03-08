module.exports = {
  siteAndroid: {
    transformGroup: 'custom/js',
    buildPath: 'dist/json/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'android.json',
        format: 'site',
      },
    ],
  },
};

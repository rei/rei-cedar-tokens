module.exports = {
  siteAndroid: {
    transformGroup: 'custom/js',
    buildPath: 'docs/src/assets/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.android.json',
        format: 'site',
      },
    ],
  },
};

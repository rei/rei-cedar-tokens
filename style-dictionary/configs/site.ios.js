module.exports = {
  siteIos: {
    transformGroup: 'custom/js',
    buildPath: 'docs/src/assets/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.ios.json',
        format: 'site',
      },
    ],
  },
};

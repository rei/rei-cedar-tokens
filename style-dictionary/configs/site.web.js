module.exports = {
  siteWeb: {
    transformGroup: 'custom/js',
    buildPath: 'docs/src/assets/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.web.json',
        format: 'site',
      },
    ],
  },
};

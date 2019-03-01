module.exports = {
  site: {
    transformGroup: 'custom/js',
    buildPath: 'docs/src/assets/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.json',
        format: 'site',
      },
    ],
  },
};

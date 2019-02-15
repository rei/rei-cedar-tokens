module.exports = {
  js: {
    transformGroup: 'custom/js',
    buildPath: 'docs/src/assets/',
    // prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.json',
        format: 'json/site',
      },
      // {
      //   destination: 'cdr-tokens.nested.json',
      //   format: 'json/nested',
      // },
    ],
  },
};

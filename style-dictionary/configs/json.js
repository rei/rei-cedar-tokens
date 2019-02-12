module.exports = {
  js: {
    transformGroup: 'custom/js',
    buildPath: 'dist/json/',
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

module.exports = {
  js: {
    transformGroup: 'custom/js',
    buildPath: 'dist/js/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.common.js',
        format: 'js/commonjs',
      },
      {
        destination: 'cdr-tokens.esm.js',
        format: 'javascript/es6',
      },
    ],
  },
};

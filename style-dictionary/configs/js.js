module.exports = {
  js: {
    transformGroup: 'custom/js',
    buildPath: 'dist/js/',
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

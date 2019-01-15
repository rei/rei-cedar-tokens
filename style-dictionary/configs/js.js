module.exports = {
  js: {
    transformGroup: 'custom/js',
    buildPath: 'dist/js/',
    files: [{
      destination: 'cdr-tokens.js',
      format: 'javascript/module',
    }],
  },
};

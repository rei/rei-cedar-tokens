module.exports = function (theme) { return {
  js: {
    transformGroup: 'custom/js',
    buildPath: `dist/${theme}/js/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.common.js',
        format: 'js/commonjs',
        filter: 'removeOptions',
        options: {
          showFileHeader: false,
        },
      },
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'removeOptions',
        options: {
          showFileHeader: false,
        },
      },
    ],
  },
}}

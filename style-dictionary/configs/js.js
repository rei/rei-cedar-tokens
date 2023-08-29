module.exports = function (theme) { return {
  js: {
    transformGroup: 'custom/js',
    buildPath: `dist/${theme}/js/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-tokens.common.js',
        format: 'js/commonjs',
        options: {
          showFileHeader: false,
        },
      },
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'removeSourceTokens',
        options: {
          showFileHeader: false,
        },
      },
      {
        "format": "typescript/es6-declarations",
        "destination": "cdr-tokens.d.ts"
      }
    ],
  },
}}

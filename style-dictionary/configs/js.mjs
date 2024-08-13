export const js = (theme) => ({
  js: {
    prefix: 'cdr',
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'color/alpha',
      'color/css-transitive'
    ],
    buildPath: `dist/${theme}/js/`,
    files: [
      {
        destination: 'cdr-tokens.cjs',
        format: 'js/commonjs',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'remove-source-tokens',
        options: {
          showFileHeader: false
        }
      },
      {
        format: 'typescript/es6-declarations',
        destination: 'cdr-tokens.d.mts'
      }
    ]
  }
})

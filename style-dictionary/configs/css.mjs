export const css = (theme) => ({
  css: {
    prefix: 'cdr',
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/kebab',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds'
    ],
    buildPath: `dist/${theme}/css/`,
    files: [
      {
        destination: 'cdr-tokens.css',
        format: 'css/variables',
        options: {
          showFileHeader: false,
          outputVariables: false
        }
      }
    ]
  }
})

export const figma = (theme) => ({
  figma: {
    prefix: 'cdr',
    transformGroup: 'tokens-studio',
    transform: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/kebab',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds'
    ],
    buildPath: `dist/${theme}/figma/`,
    files: [
      {
        destination: 'figma.json',
        format: 'figma',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

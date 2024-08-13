export const siteGlobal = (theme) => ({
  siteWeb: {
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'color/alpha',
      'color/css-transitive'
    ],
    buildPath: `dist/${theme}/json/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'global.json',
        format: 'site',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

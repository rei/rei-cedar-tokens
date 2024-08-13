export const siteIos = (theme) => ({
  siteIos: {
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'color/alpha',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float'
    ],
    buildPath: `dist/${theme}/json/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'ios.json',
        format: 'site',
        filter: 'remove-source-tokens',
        options: {
          showFileHeader: false
        }
      }
    ]
  }
})

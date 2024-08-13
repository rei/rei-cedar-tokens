export const siteAndroid = (theme) => ({
  siteAndroid: {
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp-transitive',
      'color/alpha',
      'color/hex8android-transitive'
    ],
    buildPath: `dist/${theme}/json/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'android.json',
        format: 'site',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

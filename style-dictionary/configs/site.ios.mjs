export const siteIos = (theme) => ({
  siteIos: {
    transformGroup: 'custom/ios',
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

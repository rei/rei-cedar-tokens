export const siteWeb = (theme) => ({
  siteWeb: {
    prefix: 'cdr',
    buildPath: `dist/${theme}/json/`,
    transformGroup: 'tokens-studio',
    transforms: ['attribute/deprecated', 'name/kebab', 'size/rem'],
    files: [
      {
        destination: 'web.json',
        format: 'site',
        options: {
          showFileHeader: false
        },
        filter: 'remove-source-tokens'
      }
    ]
  }
})

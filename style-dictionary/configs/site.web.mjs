import { commonConfig } from '../utils.mjs'

export const siteWeb = (theme) => ({
  siteWeb: {
    ...commonConfig(theme, 'json'),
    transformGroup: 'tokens-studio',
    transforms: ['attribute/deprecated', 'name/kebab'],
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

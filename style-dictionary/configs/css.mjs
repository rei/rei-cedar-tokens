import { commonConfig } from '../utils.mjs'

export const css = (theme) => ({
  css: {
    ...commonConfig(theme, 'css'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'color/alpha',
      'color/css-transitive'
    ],
    files: [
      {
        destination: 'cdr-tokens.css',
        format: 'css/variables',
        options: {
          showFileHeader: false
        }
      }
    ]
  }
})

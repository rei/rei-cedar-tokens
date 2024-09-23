import { commonConfig } from '../utils.mjs'

export const figma = (theme) => ({
  figma: {
    ...commonConfig(theme, 'figma'),
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
        destination: 'figma.json',
        format: 'figma',
        filter: 'remove-source-tokens'
      }
    ]
  }
})

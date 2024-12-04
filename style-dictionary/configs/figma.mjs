import { commonConfig } from '../utils.mjs'

export const figma = (theme) => ({
  figma: {
    ...commonConfig(theme, 'figma'),
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive'
    ],
    files: [
      {
        destination: 'figma.json',
        format: 'figma'
      }
    ]
  }
})

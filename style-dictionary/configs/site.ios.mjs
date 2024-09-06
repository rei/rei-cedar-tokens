import { commonConfig } from '../utils.mjs'

export const siteIos = (theme) => ({
  siteIos: {
    ...commonConfig(theme, 'json'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'color/alpha',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float'
    ],
    files: [
      {
        destination: 'ios.json',
        format: 'site',
        filter: 'remove-source-tokens'
      }
    ]
  }
})

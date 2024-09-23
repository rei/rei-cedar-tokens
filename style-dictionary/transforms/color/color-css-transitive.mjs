import tinycolor from 'tinycolor2'

export const colorCssTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/css-transitive',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'color',
    transform: (token) => {
      const color = tinycolor(token.$value)
      if (color.getAlpha() === 1) {
        return color.toHexString()
      } else {
        return color.toRgbString()
      }
    }
  })
}

import tinycolor from 'tinycolor2'

export const colorCssTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/css-transitive',
    type: 'value',
    filter: (prop) => prop.attributes.category === 'color',
    transform: (prop) => {
      const color = tinycolor(prop.value)
      if (color.getAlpha() === 1) {
        return color.toHexString()
      } else {
        return color.toRgbString()
      }
    },
    transitive: true
  })
}

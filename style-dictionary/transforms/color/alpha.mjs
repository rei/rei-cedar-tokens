import tinycolor from 'tinycolor2'

export const alpha = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/alpha',
    type: 'value',
    transitive: true,
    filter: (prop) => (prop.attributes.category === 'color') && prop.alpha,
    transform: (prop) => {
      const { value, alpha } = prop

      const color = tinycolor(value)
      color.setAlpha(alpha)
      return color.toRgbString()
    }
  })
}

import tinycolor from 'tinycolor2'

export const alpha = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/alpha',
    type: 'value',
    transitive: true,
    filter: (token) => (token.$type === 'color') && token.alpha,
    transform: (token) => {
      const { $value, alpha } = token
      const color = tinycolor($value)
      color.setAlpha(alpha)

      return color.toRgbString()
    }
  })
}

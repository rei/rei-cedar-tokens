import tinycolor from 'tinycolor2'

export const uiColorTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform(
    {
      name: 'color/UIColor-transitive',
      type: 'value',
      transitive: true,
      filter: (token) => token.$type === 'color',
      transform: (token) => {
        const rgb = tinycolor(token.$value).toRgb()
        return (
          '[UIColor colorWithRed:' +
          (rgb.r / 255).toFixed(3) +
          'f' +
          ' green:' +
          (rgb.g / 255).toFixed(3) +
          'f' +
          ' blue:' +
          (rgb.b / 255).toFixed(3) +
          'f' +
          ' alpha:' +
          rgb.a.toFixed(3) +
          'f]'
        )
      }
    }
  )
}

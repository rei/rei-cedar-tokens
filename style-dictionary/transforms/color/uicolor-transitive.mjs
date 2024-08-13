import tinycolor from 'tinycolor2'

export const uiColorTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform(
    {
      name: 'color/UIColor-transitive',
      type: 'value',
      filter: (prop) => prop.attributes.category === 'color',
      transform: (prop) => {
        const rgb = tinycolor(prop.value).toRgb()
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
      },
      transitive: true
    }
  )
}

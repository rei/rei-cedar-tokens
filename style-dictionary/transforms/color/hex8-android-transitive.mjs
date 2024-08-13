import tinycolor from 'tinycolor2'

export const hex8AndroidTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/hex8android-transitive',
    type: 'value',
    filter: (prop) => prop.attributes.category === 'color',
    transform: (token) => {
      const str = tinycolor(token.value).toHex8()
      return '#' + str.slice(6) + str.slice(0, 6)
    },
    transitive: true
  })
}

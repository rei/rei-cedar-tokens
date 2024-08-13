export const spTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/sp-transitive',
    type: 'value',
    transitive: true,
    filter: (token) => token.attributes.category === 'size' &&
    (token.attributes.type === 'font' || token.attributes.type === 'icon'),
    transform: (token) => {
      const val = parseFloat(token.value)
      if (isNaN(val)) console.error(token.name, token.value, 'sp')
      return val.toFixed(2) + 'sp'
    }
  })
}

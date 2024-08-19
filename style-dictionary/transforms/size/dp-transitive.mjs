export const dpTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/dp-transitive',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'dimension' &&
            token.$type !== 'fontSize',
    transform: (token) => {
      const val = parseFloat(token.$value)
      return val.toFixed(2) + 'dp'
    }
  })
}

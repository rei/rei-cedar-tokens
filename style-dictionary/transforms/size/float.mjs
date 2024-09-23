export const float = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/float',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'dimension' || token.$type === 'fontSize',
    transform: (token) => {
      const num = parseFloat(token.$value).toFixed(1)
      const unit = 'f'
      return `${num}${unit}`
    }
  })
}

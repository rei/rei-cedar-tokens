export const float = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/float',
    type: 'value',
    transitive: true,
    filter: (prop) => prop.attributes.category === 'size',
    transform: (prop) => {
      // convert integer to float format XX.Xf
      const num = parseFloat(prop.value).toFixed(1)
      const unit = 'f'
      return `${num}${unit}`
    }
  })
}

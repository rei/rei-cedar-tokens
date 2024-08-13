export const spaceJs = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/space-js',
    type: 'value',
    transitive: true,
    filter: (prop) => (prop.attributes.category === 'size') && prop.spacingModifier,
    transform: (prop) => {
      const { value, spacingModifier } = prop

      const num = (parseInt(value) * spacingModifier)
      return num.toString()
    }
  })
}

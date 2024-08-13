export const space = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/space',
    type: 'value',
    transitive: true,
    filter: (prop) => (prop.attributes.category === 'size') && prop.spacingModifier,
    transform: (prop) => {
      const { value, spacingModifier } = prop

      const num = (parseFloat(value) * spacingModifier).toFixed(1)
      return num
    }
  })
}

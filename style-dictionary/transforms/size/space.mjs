export const space = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/space',
    type: 'value',
    transitive: true,
    filter: (token) => (token.$type === 'dimension') && token.spacingModifier,
    transform: (token) => {
      const { $value, spacingModifier } = token
      const num = (parseFloat($value) * spacingModifier).toFixed(1)
      return num
    }
  })
}

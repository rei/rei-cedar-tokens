export const spaceJs = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/space-js',
    type: 'value',
    transitive: true,
    filter: (token) => (token.$type === 'dimension') && token.spacingModifier,
    transform: (token) => {
      const { $value, spacingModifier } = token
      const num = (parseInt($value) * spacingModifier)
      return num.toString()
    }
  })
}

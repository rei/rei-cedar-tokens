export const shadow = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'value/shadow',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'shadow',
    transform: (token) => {
      const value = token.$value

      if (value && Array.isArray(value)) {
        return value.map(({ color, offsetX, offsetY, blur, spread }) => `${offsetX} ${offsetY} ${blur} ${spread} ${color}`).join(', ')
      }

      return value
    }
  })
}

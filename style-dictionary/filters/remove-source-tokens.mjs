export const removeSourceTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'remove-source-tokens',
    filter: (token) => {
      return token.path[0] !== 'options' && token.path[0] !== 'theme'
    }
  })
}

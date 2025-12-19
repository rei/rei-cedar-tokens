export const formTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'form-tokens',
    filter: (token) => token.path[0] !== 'options' && token.path[0] === 'form'
  })
}

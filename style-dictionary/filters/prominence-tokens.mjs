export const prominenceTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'prominence-tokens',
    filter: (token) => token.path[0] !== 'options' && token.path[0] === 'prominence'
  })
}

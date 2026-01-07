export const iconTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'icon-tokens',
    filter: (token) => token.path[0] !== 'options' && token.path[0] === 'icon'
  })
}

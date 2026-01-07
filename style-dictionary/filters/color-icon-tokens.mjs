export const colorIconTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'color-icon-tokens',
    filter: (token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'icon'
  })
}

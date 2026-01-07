export const colorBackgroundTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'color-background-tokens',
    filter: (token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'background'
  })
}

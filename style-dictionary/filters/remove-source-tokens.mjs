export const removeSourceTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'remove-source-tokens',
    filter: (prop) => prop.path[0] !== 'options' && prop.path[0] !== 'theme'
  })
}

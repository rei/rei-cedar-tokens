export const membershipSubtleTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'membership-subtle-tokens',
    filter: (token) => token.path[0] === 'membership' && token.path[1] === 'subtle'
  })
}

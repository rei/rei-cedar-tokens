export const spaceTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'space-tokens',
    filter: (token) => token.path[0] !== 'options' && token.path[0] === 'space',
  });
};

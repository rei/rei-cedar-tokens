export const radiusTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'radius-tokens',
    filter: (token) => token.path[0] !== 'options' && token.path[0] === 'radius',
  });
};

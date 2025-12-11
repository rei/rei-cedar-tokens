export const colorTextTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'color-text-tokens',
    filter: (token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'text',
  });
};

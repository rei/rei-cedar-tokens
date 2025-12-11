export const colorBorderTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'color-border-tokens',
    filter: (token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'border',
  });
};

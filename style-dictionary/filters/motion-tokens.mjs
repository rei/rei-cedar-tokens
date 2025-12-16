export const motionTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'motion-tokens',
    filter: (token) =>
      token.path[0] !== 'options' &&
      (token.path.includes('timing') || token.path.includes('duration')),
  });
};

export const membershipVibrantTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'membership-vibrant-tokens',
    filter: (token) => token.path[0] === 'membership' && token.path[1] === 'vibrant',
  });
};

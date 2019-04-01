module.exports = (StyleDictionary) => {
  // Mark everything as either a options or not for filtering output
  StyleDictionary.registerTransform({
    name: 'attribute/utility',
    type: 'attribute',
    transformer(prop) {
      return prop.path[0] === 'utility-class' ? { 'utility-class': true } : { 'utility-class': false };
    },
  });
};

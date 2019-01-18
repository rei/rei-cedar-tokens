module.exports = (StyleDictionary) => {
  // Mark everything as either a options or not for filtering output
  StyleDictionary.registerTransform({
    name: 'attribute/option',
    type: 'attribute',
    transformer(prop) {
      return prop.path[0] === 'options' ? { option: true } : { option: false };
    },
  });
};

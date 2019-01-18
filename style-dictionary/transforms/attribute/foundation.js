module.exports = (StyleDictionary) => {
  // Mark everything as either a foundation or not for filtering output
  StyleDictionary.registerTransform({
    name: 'attribute/foundation',
    type: 'attribute',
    transformer(prop) {
      return prop.path[0] === 'foundations' ? { foundation: true } : { foundation: false };
    },
  });
};

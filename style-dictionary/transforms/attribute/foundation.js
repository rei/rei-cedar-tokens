module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/foundation',
    type: 'attribute',
    transformer(prop) {
      return prop.path[0] === 'foundations' ? { foundation: true } : { foundation: false };
    },
  });
};

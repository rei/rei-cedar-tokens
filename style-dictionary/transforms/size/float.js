module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/float',
    type: 'value',
    matcher(prop) {
      return prop.attributes.category === 'size';
    },
    transformer(prop) {
      // convert integer to float format XX.Xf
      const num = parseFloat(prop.value).toFixed(1);
      const unit = 'f';
      return `${num}${unit}`;
    },
  });
};

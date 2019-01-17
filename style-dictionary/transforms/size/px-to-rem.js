module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    matcher(prop) {
      return prop.attributes.category === 'size';
    },
    transformer(prop) {
      // update what this is divided by if body font-size changes in cdr-core.css
      return `${(parseFloat(prop.value, 10) / 10).toFixed(2)}rem`;
    },
  });
};

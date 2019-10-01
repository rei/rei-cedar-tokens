const Color = require('tinycolor2');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'color/custom-sketch',
    type: 'value',
    matcher(prop) {
      return prop.attributes.category === 'color';
    },
    transformer(prop) {
      const color = Color(prop.value);
      if (color.getAlpha() !== 1) {
        return Color(prop.value).toHex8String();
      }
      return color.toHexString();
    },
  });
};

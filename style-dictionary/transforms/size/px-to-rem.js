const _ =  require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    matcher(prop) {
      return prop.attributes.category === 'size';
    },
    transformer(prop) {
      // update what this is divided by if body font-size changes in rei-cedar
      return `${(parseFloat(prop.value, 10) / 10)}rem`;
    },
  });
};

const _ = require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    matcher(prop) {
      return prop.attributes.category !== 'breakpoint';
    },
    transformer(prop) {
      let cleanVal = prop.value;
      if (_.endsWith(prop.value, 'px')) {
        cleanVal = prop.value.slice(0, -2);
      }

      return cleanVal;
    },
  });
};

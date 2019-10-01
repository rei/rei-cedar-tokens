const _ = require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    matcher(prop) {
      let shouldStrip;
      switch (prop.attributes.category) {
        case 'breakpoint':
          shouldStrip = false;
          break;
        case 'letter-spacing':
          shouldStrip = false;
          break;
        default:
          shouldStrip = true;
          break;
      }
      return shouldStrip;
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

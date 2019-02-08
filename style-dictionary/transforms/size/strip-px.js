const _ = require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    transformer(prop) {
      let cleanVal = prop.value;
      if (_.endsWith(prop.value, 'px')) {
        cleanVal = prop.value.slice(0, -2);
        // console.log(prop.value, cleanVal);
      }

      // update what this is divided by if body font-size changes in rei-cedar
      return cleanVal;
    },
  });
};

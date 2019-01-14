const _ = require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/cdr-cti',
    type: 'attribute',
    transformer(prop) {
      const attrs = {};
      if (_.has(prop, 'category')) {
        attrs.category = prop.category;
      }
      if (_.has(prop, 'type')) {
        attrs.type = prop.type;
      }
      return attrs;
    },
  });
};

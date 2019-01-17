const _ = require('lodash');

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/cdr-cti',
    type: 'attribute',
    transformer(prop) {
      const attrs = {};
      if (_.has(prop, 'category')) {
        switch (prop.category) {
          // split font-size to category and type
          case 'font-size':
            attrs.category = 'size';
            attrs.type = 'font';
            break;
          default:
            attrs.category = prop.category;
            break;
        }
      }
      return attrs;
    },
  });
};

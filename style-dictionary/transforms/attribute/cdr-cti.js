const _ = require('lodash');

module.exports = (StyleDictionary) => {
  // Abstract out CTI from naming by using a separate "category" key
  StyleDictionary.registerTransform({
    name: 'attribute/cdr-cti',
    type: 'attribute',
    transformer(prop) {
      const attrs = {};
      if (_.has(prop, 'category')) {
        switch (prop.category) {
          case 'font-size':
            // split font-size to category and type
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

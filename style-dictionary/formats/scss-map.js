const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* scss mixin */
  StyleDictionary.registerFormat({
    name: 'scss/map',
    formatter(dictionary, config) {
      // const prefix = config.prefix ? `${config.prefix}-` : '';
      let scss = '';
      const categories = _.groupBy(dictionary.allProperties, 'docs.category');
      const catKeys = Object.keys(categories);

      // loop through categories
      catKeys.forEach(cat => {
        scss += `$${cat}: (\n  `;

        const types = _.groupBy(categories[cat], 'docs.type');
        const typeKeys = Object.keys(types);

        // loop through types
        typeKeys.forEach((type, idx) => {
          if (idx !== 0) {
            scss += `,\n  `;
          }

          // has a type --> make a map
          if (type !== 'undefined') {
            scss += `${type}: (\n    `;

            types[type].forEach((token, i) => {
              if (i !== 0) {
                scss += `,\n    `;
              }
              scss += `${token.name}: ${token.value}`;
            });

            scss += `\n  )`;

          }

          // no type --> just add tokens
          else {
            types[type].forEach((token, i) => {
              if (i !== 0) {
                scss += `,\n  `;
              }
              scss += `${token.name}: ${token.value}`;
            });
          }
        });

        scss += `\n);\n`
      })
      

      return scss;
    },
  });
};

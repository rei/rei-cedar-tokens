const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* scss mixin */
  StyleDictionary.registerFormat({
    name: 'scss/map',
    formatter(dictionary, config) {
      // const prefix = config.prefix ? `${config.prefix}-` : '';
      let scss = '';
      const utilityTokens = _.filter(dictionary.allProperties, o => o['utility-class'] === true);
      const categories = _.groupBy(utilityTokens, 'docs.category');
      
      // loop through categories
      const catKeys = Object.keys(categories);
      catKeys.forEach(cat => {
        
        // loop through types
        const types = _.groupBy(categories[cat], 'docs.type');
        const typeKeys = Object.keys(types);
        typeKeys.forEach((type, idx) => {
          const formattedType = type === 'undefined' ? '' : `-${type}`;

          scss += `$${cat}${formattedType}: (\n  `;

          types[type].forEach((token, i) => {
            if (i !== 0) {
              scss += `,\n  `;
            }
            if (token.name.includes('-family')) {
              scss += `${token.name}: '${token.value}'`;
            } else {
              scss += `${token.name}: ${token.value}`;
            }
          });

          scss += `\n);\n`
        });
      })
      

      return scss;
    },
  });
};

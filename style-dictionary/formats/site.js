const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'site',
    formatter(dictionary, config) {
      const toRet = {};
      const grouped = _.groupBy(dictionary.allProperties, 'docs.category');
      const keys = Object.keys(grouped)
      for(const key of keys) {
        const newKey = key === 'undefined' ? 'misc' : key;
        const catArr = grouped[key];
        toRet[newKey] = {};

        for (let i = 0, len = catArr.length; i < len; i++) {
          const current = catArr[i];
          let {name, value} = current;
          name = _.kebabCase(name);
          toRet[newKey][name] = current;
        }
      }

      return JSON.stringify(toRet, null, 2);
    },
  });
};

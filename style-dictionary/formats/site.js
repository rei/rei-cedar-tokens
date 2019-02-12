const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'json/site',
    formatter(dictionary) {
      const toRet = {};
      const grouped = _.groupBy(dictionary.allProperties, 'category');
      const keys = Object.keys(grouped)
      for(const key of keys) {
        const newKey = key === 'undefined' ? 'misc' : key;
        const catArr = grouped[key];
        toRet[newKey] = {};

        for (let i = 0, len = catArr.length; i < len; i++) {
          let {name, value} = catArr[i];
          name = _.kebabCase(name);
          toRet[newKey][name] = value;
        }
      }

      return JSON.stringify(toRet, null, 2);
    },
  });
};

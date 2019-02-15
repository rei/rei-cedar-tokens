const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'json/site',
    formatter(dictionary, config) {
      const toRet = {};
      const grouped = _.groupBy(dictionary.allProperties, 'docCategory');
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
          // toRet[newKey][name].value = value;

          // if (_.has(current, 'docExample')) {
          //   toRet[newKey][name].example = current.docExample;
          // }
        }
      }

      return JSON.stringify(toRet, null, 2);
    },
  });
};

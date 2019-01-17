const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'js/commonjs',
    formatter(dictionary) {
      const result = [];
      dictionary.allProperties.forEach((p) => {
        const k = _.camelCase(p.name);
        const v = JSON.stringify(p.value);
        result.push(`  ${k}: ${v},`);
      });

      return ['module.exports = {', result.join('\n'), '};'].join('\n');
    },
  });
};

const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* scss mixin */
  StyleDictionary.registerFormat({
    name: 'scss/deprecated',
    formatter(dictionary, config) {
      const prefix = config.prefix ? `${config.prefix}-` : '';
      let fileContents = '@import \'./deprecate.scss\';\n\n';

      // get all deprecated properties
      const allDeprecatedTokens = _.filter(dictionary.allProperties, o => o.attributes.deprecated === true);
      // filter out mixin parts (mixins+parts are deprecated in scss-mixin.js)
      const deprecatedTokens = _.filter(allDeprecatedTokens, o => !_.has(o, 'mixin'));

      // organize into year/release cycle
      const byYear = _.groupBy(deprecatedTokens, "attributes['deprecated-year']");
      Object.keys(byYear).forEach((year) => {
        byYear[year] = _.groupBy(byYear[year], "attributes['deprecated-release']");
      });

      // make list of deprecated variables by year & release
      Object.keys(byYear).forEach((year) => {
        Object.keys(byYear[year]).forEach((release) => {
          const deprecatedList = [];
          byYear[year][release].forEach((token) => {
            const tokenStr = _.has(token, 'newToken') ?
              `'${token.name}' use '${_.kebabCase([prefix, token.newToken])}' instead`
              : token.name;
            deprecatedList.push(tokenStr);
          });

          fileContents += `@include deprecate-variables(${year}, "${release}", "\n${deprecatedList.join('\n')}");\n`;
        });
      });

      return fileContents;
    },
  });
};

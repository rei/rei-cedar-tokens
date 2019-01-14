const _ = require('lodash');

module.exports = (StyleDictionary) => {
  /* scss mixin */
  StyleDictionary.registerFormat({
    name: 'scss/mixin',
    formatter(dictionary, config) {
      const prefix = config.prefix ? `${config.prefix}-` : '';
      const mixins = [];
      const mixinProperties = _.filter(dictionary.allProperties, o => _.has(o, 'mixin'));
      const mixinNames = _.uniq(mixinProperties.map(o => o.mixin));

      mixinNames.forEach((name) => {
        const singleMixinProps = _.filter(mixinProperties, o => o.mixin === name);
        const declarations = [];
        let mixin = '';

        singleMixinProps.forEach((o) => {
          declarations.push(`${o.property}: ${o.value};`);
        });

        mixin = `@mixin ${_.kebabCase([prefix, name])}() {
  ${declarations.join('\n  ')}
}`;

        mixins.push(mixin);
      });

      return `${mixins.join('\n\n')}\n`;
    },
  });
};

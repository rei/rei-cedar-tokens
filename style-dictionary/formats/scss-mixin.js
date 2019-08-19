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
        const prefixedName = _.kebabCase([prefix, name]);
        const declarations = [];
        let mixin = '';

        singleMixinProps.map(o => declarations.push(`${o.property}: ${o.value};`));

        if (singleMixinProps[0].attributes.deprecated === true) {
          // DEPRECATED
          const deprecateYear = singleMixinProps[0].attributes['deprecated-year'];
          const deprecateRelease = singleMixinProps[0].attributes['deprecated-release'];
          const deprecatedTokens = [];
          const prefixedNewName = _.has(singleMixinProps[0], 'newMixin') ?
            `"${_.kebabCase([prefix, singleMixinProps[0].newMixin])}"`
            : null;

          singleMixinProps.forEach((token) => {
            const tokenStr = _.has(token, 'newToken') ?
              `'${token.name}' use '${_.kebabCase([prefix, token.newToken])}' instead`
              : token.name;
            deprecatedTokens.push(tokenStr);
          });

          mixin = `// DEPRECATED
@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
  @include deprecate-mixin(${deprecateYear}, "${deprecateRelease}", "${prefixedName}", ${prefixedNewName}) {}
}
@include deprecate-variables(${deprecateYear}, "${deprecateRelease}", "\n${deprecatedTokens.join('\n')}");`;
        } else {
          // NOT DEPRECATED
          mixin = `@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
}`;
        }

        mixins.push(mixin);
      });

      return `${mixins.join('\n\n')}\n`;
    },
  });
};

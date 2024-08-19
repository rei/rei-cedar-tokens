import _ from 'lodash'

export const scssMixin = (StyleDictionary) => {
  /* scss mixin */
  StyleDictionary.registerFormat({
    name: 'scss/mixin',
    format: ({ dictionary, platform }) => {
      const prefix = platform.prefix ? `${platform.prefix}-` : ''
      const mixins = ['@import \'./deprecate.scss\';\n']
      const mixinProperties = _.filter(dictionary.allTokens, o => _.has(o, 'mixin'))
      const mixinNames = _.uniq(mixinProperties.map(o => o.mixin))

      mixinNames.forEach((name) => {
        const singleMixinProps = _.filter(mixinProperties, o => o.mixin === name)
        const prefixedName = _.kebabCase([prefix, name])
        const declarations = []
        let mixin = ''

        singleMixinProps.map(o => declarations.push(`${o.property}: ${o.$value};`))

        if (singleMixinProps[0].attributes.deprecated === true) {
          // DEPRECATED
          const deprecateYear = singleMixinProps[0].attributes['deprecated-year']
          const deprecateRelease = singleMixinProps[0].attributes['deprecated-release']
          const deprecatedTokens = []
          const prefixedNewName = _.has(singleMixinProps[0], 'newMixin')
            ? `"${_.kebabCase([prefix, singleMixinProps[0].newMixin])}"`
            : null

          singleMixinProps.forEach((token) => {
            const tokenStr = _.has(token, 'newToken')
              ? `'${token.name}' use '${_.kebabCase([prefix, token.newToken])}' instead`
              : token.name
            deprecatedTokens.push(tokenStr)
          })

          mixin = `// DEPRECATED
  @mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
  @include deprecate-mixin(${deprecateYear}, "${deprecateRelease}", "${prefixedName}", ${prefixedNewName});
}`
        } else {
          // NOT DEPRECATED
          mixin = `@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
}\n\n%${prefixedName} {
  ${declarations.join('\n  ')}
}`
        }

        mixins.push(mixin)
      })

      return `${mixins.join('\n\n')}\n`
    }
  })
}

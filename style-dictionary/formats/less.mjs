import _ from 'lodash'

export const less = (StyleDictionary) => {
  /* less mixin */
  StyleDictionary.registerFormat({
    name: 'less/mixin',
    format: ({ dictionary, platform }) => {
      const prefix = platform.prefix ? `${platform.prefix}-` : ''
      const mixins = []
      const mixinProperties = _.filter(dictionary.allTokens, o => _.has(o, 'mixin'))
      const mixinNames = _.uniq(mixinProperties.map(o => o.mixin))

      mixinNames.forEach((name) => {
        const singleMixinProps = _.filter(mixinProperties, o => o.mixin === name)
        const declarations = []
        let mixin = ''

        singleMixinProps.forEach((o) => {
          declarations.push(`${o.property}: ${o.value};`)
        })

        mixin = `.${_.kebabCase([prefix, name])}() {
  ${declarations.join('\n  ')}
}`

        mixins.push(mixin)
      })

      return `${mixins.join('\n\n')}\n`
    }
  })
}

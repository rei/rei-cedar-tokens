import _ from 'lodash'
import { pxToRem } from '../transforms/size/px-to-rem.mjs'

export const scssTypography = (StyleDictionary) => {
  /* scss typography - handles DTCG typography composite tokens */
  StyleDictionary.registerFormat({
    name: 'scss/typography',
    format: ({ dictionary, platform }) => {
      const prefix = platform.prefix ? `${platform.prefix}-` : ''
      const mixins = []

      // tokens-studio expands typography tokens into individual tokens
      // Group them by their parent path to recreate the mixin
      const allTokens = dictionary.allTokens

      // Find all tokens that came from typography expansion
      // They have paths like ['text-body', '300', 'fontFamily']
      const typographyProps = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textDecoration']

      // Group tokens by their parent typography token path
      const typographyGroups = {}

      allTokens.forEach((token) => {
        const lastPathPart = token.path[token.path.length - 1]
        if (typographyProps.includes(lastPathPart)) {
          const parentPath = token.path.slice(0, -1).join('.')
          if (!typographyGroups[parentPath]) {
            typographyGroups[parentPath] = {
              path: token.path.slice(0, -1),
              props: {},
              attributes: token.attributes
            }
          }
          typographyGroups[parentPath].props[lastPathPart] = token.$value
        }
      })

      Object.values(typographyGroups).forEach((group) => {
        const prefixedName = _.kebabCase([prefix, ...group.path])
        const declarations = []

        // Add declarations in a consistent order
        typographyProps.forEach((prop) => {
          if (group.props[prop] !== undefined) {
            // Convert fontSize and lineHeight from px to rem
            let value = group.props[prop]
            if (prop === 'fontSize' || prop === 'lineHeight') {
              value = pxToRem(value)
            }
            declarations.push(`${_.kebabCase(prop)}: ${value};`)
          }
        })

        if (declarations.length === 0) return

        let mixin = ''

        if (group.attributes?.deprecated === true) {
          // DEPRECATED
          const deprecateYear = group.attributes['deprecated-year']
          const deprecateRelease = group.attributes['deprecated-release']
          const prefixedNewName = group.newMixin
            ? `"${_.kebabCase([prefix, group.newMixin])}"`
            : null

          mixin = `// DEPRECATED
@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
  @include deprecate-mixin(${deprecateYear}, "${deprecateRelease}", "${prefixedName}", ${prefixedNewName});
}`
        } else {
          // NOT DEPRECATED
          mixin = `@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
}

%${prefixedName} {
  ${declarations.join('\n  ')}
}`
        }

        mixins.push(mixin)
      })

      return `${mixins.join('\n\n')}\n`
    }
  })
}

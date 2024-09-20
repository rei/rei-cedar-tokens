export const deprecated = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/deprecated',
    type: 'attribute',
    transform: (token) => {
      if (token.path[0].includes('deprecated')) {
        const [, year, release] = token.path[0].split('-')
        token.path.shift()

        return {
          deprecated: true,
          'deprecated-year': year,
          'deprecated-release': release
        }
      }

      return { deprecated: false }
    }
  })
}

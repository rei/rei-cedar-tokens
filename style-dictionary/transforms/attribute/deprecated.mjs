export const deprecated = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/deprecated',
    type: 'attribute',
    transform: (prop) => {
      if (prop.path[0].includes('deprecated')) {
        const [, year, release] = prop.path[0].split('-')
        prop.path.shift()

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

export const removeCategoriesTokens = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'remove-categories-tokens',
    filter: (token) => {
      const colorSubcategoriesToFilter = ['background', 'radius', 'icon', 'text', 'border']
      const categoriesToFilter = [
        'space',
        'radius',
        'icon',
        'text',
        'border',
        'prominence',
        'duration',
        'timing',
        'form'
      ]

      if (
        (token.path[0] === 'color' && colorSubcategoriesToFilter.includes(token.path[1])) ||
        categoriesToFilter.includes(token.path[0])
      ) { return false }

      return token.path[0] !== 'options' && token.path[0] !== 'theme'
    }
  })
}

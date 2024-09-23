import _ from 'lodash'

export const stripAllPxJs = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-all-px-js',
    type: 'value',
    transitive: true,
    filter: (token) => !token.name.match('Prominence'),
    transform: (token) => {
      let cleanVal = token.$value
      if (_.endsWith(token.$value, 'px')) {
        cleanVal = token.$value.slice(0, -2)
      }
      return cleanVal
    }
  })
}

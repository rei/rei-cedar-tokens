import _ from 'lodash'

export const stripAllPxJs = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-all-px-js',
    type: 'value',
    transitive: true,
    filter: (prop) => !prop.name.match('Prominence'),
    transform: (prop) => {
      let cleanVal = prop.value
      if (_.endsWith(prop.value, 'px')) {
        cleanVal = prop.value.slice(0, -2)
      }

      return cleanVal
    }
  })
}

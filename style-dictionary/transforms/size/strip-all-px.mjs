import _ from 'lodash'

export const stripAllPx = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-all-px',
    type: 'value',
    transitive: true,
    transform: (prop) => {
      let cleanVal = prop.value

      if (_.endsWith(prop.value, 'px')) {
        cleanVal = prop.value.slice(0, -2)
      }

      return cleanVal
    }
  })
}

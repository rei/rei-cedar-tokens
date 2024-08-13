import _ from 'lodash'

export const stripPx = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    transitive: true,
    filter: (prop) => {
      let shouldStrip
      switch (prop.attributes.category) {
        case 'breakpoint':
          shouldStrip = false
          break
        case 'letter-spacing':
          shouldStrip = false
          break
        default:
          shouldStrip = true
          break
      }
      return shouldStrip
    },
    transform: (prop) => {
      let cleanVal = prop.value
      if (_.endsWith(prop.value, 'px')) {
        cleanVal = prop.value.slice(0, -2)
      }

      return cleanVal
    }
  })
}

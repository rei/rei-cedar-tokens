import _ from 'lodash'

export const stripPx = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    transitive: true,
    filter: (token) => {
      let shouldStrip
      switch (token.$type) {
        case 'breakpoint':
          shouldStrip = false
          break
        case 'letterSpacing':
          shouldStrip = false
          break
        default:
          shouldStrip = true
          break
      }
      return shouldStrip
    },
    transform: (token) => {
      let cleanVal = token.$value
      if (_.endsWith(token.$value, 'px')) {
        cleanVal = token.$value.slice(0, -2)
      }
      return cleanVal
    }
  })
}

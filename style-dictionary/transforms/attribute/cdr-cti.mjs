import _ from 'lodash'

export const cdrCti = (StyleDictionary) => {
  // Abstract out CTI from naming by using a separate "category" key
  StyleDictionary.registerTransform({
    name: 'attribute/cdr-cti',
    type: 'attribute',
    transform: (prop) => {
      const attrs = {}
      if (_.has(prop, 'category')) {
        switch (prop.category) {
          case 'font-size':
            // split font-size to category and type
            attrs.category = 'size'
            attrs.type = 'font'
            break
          default:
            attrs.category = prop.category
            break
        }
      }
      return attrs
    }
  })
}

export const iosSize = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'ios-size',
    filter: (prop) => prop.attributes.category === 'size'
  })
}

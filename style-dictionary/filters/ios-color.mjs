export const iosColor = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'ios-color',
    filter: (prop) => prop.attributes.category === 'color'
  })
}

export const iosSize = (StyleDictionary) => {
  StyleDictionary.registerFilter({
    name: 'ios-size',
    filter: (token) => token.$type === 'dimension' || token.$type === 'fontSize'
  })
}

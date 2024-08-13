export const dpTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/dp-transitive',
    type: 'value',
    transitive: true,
    filter: (prop) => prop.attributes.category === 'size' &&
            prop.attributes.type !== 'font' &&
            prop.attributes.type !== 'icon',
    transform: (prop) => {
      const val = parseFloat(prop.value)
      if (isNaN(val)) console.error(`The value of ${prop.path.join('.')} is not a number.`)
      return val.toFixed(2) + 'dp'
    }
  })
}

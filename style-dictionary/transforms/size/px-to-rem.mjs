export const pxToRem = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem',
    type: 'value',
    transitive: true,
    filter: (prop) => prop.attributes.category === 'size',
    transform: (prop) => {
      // update what this is divided by if body font-size changes in rei-cedar
      const REM = 10

      if (`${prop.value}`.indexOf('rem') === -1) {
        const num = (parseFloat(prop.value, 10) / REM)
        const unit = num !== 0 ? 'rem' : ''
        return `${num}${unit}`
      }

      return prop.value
    }
  })
}

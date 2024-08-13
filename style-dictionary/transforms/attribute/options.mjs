export const options = (StyleDictionary) => {
  // Mark everything as either an options or not for filtering output
  StyleDictionary.registerTransform({
    name: 'attribute/option',
    type: 'attribute',
    transform: (prop) => prop.path[0] === 'options' ? { option: true } : { option: false }
  })
}

export const figma = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/figma',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/kebab',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds'
    ]
  })
}

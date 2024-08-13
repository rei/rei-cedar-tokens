export const css = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/css',
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

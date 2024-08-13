export const js = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/js',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'color/alpha',
      'color/css-transitive'
    ]
  })
}

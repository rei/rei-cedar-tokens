export const ios = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/ios',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/pascal',
      'color/alpha',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float'
    ]
  })
}

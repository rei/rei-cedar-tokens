export const less = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/less',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/kebab',
      'size/strip-px',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds'
    ]
  })
}

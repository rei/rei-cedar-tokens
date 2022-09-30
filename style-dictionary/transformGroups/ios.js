module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/ios',
    transforms: [
      'attribute/option',
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/pascal',
      'color/UIColor',
      'size/strip-px',
      'size/space',
      'size/float',
    ],
  });
};

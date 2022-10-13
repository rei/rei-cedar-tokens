module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/ios',
    transforms: [
      'attribute/option',
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/pascal',
      'color/alpha-hex',
      'color/UIColor-transitive',
      'size/strip-px',
      'size/space',
      'size/float',
    ],
  });
};

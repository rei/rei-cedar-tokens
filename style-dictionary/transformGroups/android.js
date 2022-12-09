module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/android',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/alpha',
      'color/hex8android-transitive',
    ],
  });
};

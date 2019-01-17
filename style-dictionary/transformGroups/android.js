module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/android',
    transforms: [
      'attribute/foundation',
      'attribute/cdr-cti',
      'name/cti/snake',
      'color/hex8android',
      'size/sp',
      'size/dp',
    ],
  });
};

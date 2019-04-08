module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/android',
    transforms: [
      'attribute/option',
      'attribute/cdr-cti',
      'name/cti/snake',
      'size/dp',
      'size/sp',
      'color/hex8android',
    ],
  });
};

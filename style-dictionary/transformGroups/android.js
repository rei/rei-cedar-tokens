module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/android',
    transforms: [
      'attribute/option',
      'attribute/utility',
      'attribute/cdr-cti',
      'name/cti/snake',
      'size/strip-px',
      'color/hex8android',
      'size/sp',
      'size/dp',
    ],
  });
};

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/js',
    transforms: [
      'attribute/option',
      'attribute/cdr-cti',
      'name/cti/pascal',
      'size/px-to-rem',
      'color/hex',
    ],
  });
};

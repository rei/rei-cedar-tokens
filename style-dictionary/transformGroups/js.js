module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/js',
    transforms: [
      'attribute/option',
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/pascal',
      'size/strip-px',
      'size/px-to-rem',
      'color/css',
    ],
  });
};

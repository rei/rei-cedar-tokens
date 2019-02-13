module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/scss',
    transforms: [
      'attribute/option',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-px',
      'size/px-to-rem',
      'color/css',
      'time/seconds',
      // 'content/icon',
    ],
  });
};

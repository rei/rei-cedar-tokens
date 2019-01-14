module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/scss',
    transforms: [
      'attribute/foundation',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/px-to-rem',
      'color/css',
      'time/seconds',
      // 'content/icon',
    ],
  });
};

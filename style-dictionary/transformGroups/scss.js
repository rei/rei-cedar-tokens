module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/scss',
    transforms: [
      'attribute/option',
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'color/alpha',
      'size/space',
      'size/px-to-rem',
      'color/css',
      'time/seconds',
      // 'content/icon',
    ],
  });
};

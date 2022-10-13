module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/less',
    transforms: [
      'attribute/option',
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-px',
      'color/alpha',
      'size/space',
      'size/px-to-rem',
      'color/css',
      'time/seconds',
      // 'content/icon',
    ],
  });
};

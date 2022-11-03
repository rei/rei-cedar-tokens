module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/less',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-px',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds',
      // 'content/icon',
    ],
  });
};

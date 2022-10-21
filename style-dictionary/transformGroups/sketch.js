module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/sketch',
    transforms: [
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-all-px',
      'size/space',
      'color/custom-sketch',
      'time/seconds',
    ],
  });
};

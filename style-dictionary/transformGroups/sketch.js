module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/sketch',
    transforms: [
      'attribute/option',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-all-px',
      'size/space',
      'color/custom-sketch',
      'time/seconds',
    ],
  });
};

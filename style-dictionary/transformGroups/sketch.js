module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/sketch',
    transforms: [
      'attribute/option',
      'attribute/utility',
      'attribute/cdr-cti',
      'name/cti/kebab',
      'size/strip-all-px',
      'color/custom-sketch',
      'time/seconds',
    ],
  });
};

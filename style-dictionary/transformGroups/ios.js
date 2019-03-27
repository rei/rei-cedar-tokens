module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransformGroup({
    name: 'custom/ios',
    transforms: [
      'attribute/option',
      'attribute/utility',
      'attribute/cdr-cti',
      'name/cti/pascal',
      'color/UIColor',
      'content/objC/literal',
      'asset/objC/literal',
      'size/remToPt',
      'font/objC/literal'
    ],
  });
};
module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransformGroup({
      name: 'custom/figma',
      transforms: [
        'attribute/deprecated',
        'attribute/cdr-cti',
        'name/cti/kebab',
        'size/space',
        'size/px-to-rem',
        'color/css',
        'time/seconds',
        // 'content/icon',
      ],
    });
  };
  
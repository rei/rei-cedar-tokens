module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransformGroup({
      name: 'custom/figma',
      transforms: [
        'attribute/deprecated',
        'attribute/cdr-cti',
        'name/cti/kebab',
        'size/space',
        'size/px-to-rem',
        'color/alpha',
        'color/css-transitive',
        'time/seconds',
        // 'content/icon',
      ],
    });
  };
  
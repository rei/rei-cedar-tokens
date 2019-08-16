module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'attribute/deprecated',
    type: 'attribute',
    transformer(prop) {
      if (prop.path[0].includes('deprecated')) {
        // eslint-disable-next-line no-unused-vars
        const [ignore, year, release] = prop.path[0].split('-');
        prop.path.shift();
        return {
          deprecated: true,
          'deprecated-year': year,
          'deprecated-release': release,
        };
      }
      return { deprecated: false };
    },
  });
};

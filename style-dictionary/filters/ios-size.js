module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'iosSize',
        matcher: function(prop) {
          return prop.attributes.category === 'size';
        }
    });
}
module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'iosColor',
        matcher: function(prop) {
          return prop.attributes.category === 'color';
        }
    });
}
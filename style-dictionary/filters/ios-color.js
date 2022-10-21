module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'iosColor',
        matcher: function(prop) {
          return prop.path[0] !== 'options' && prop.attributes.category === 'color';
        }
    });
}
module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'iosColor',
        matcher: function(prop) {
          return prop.path[0] !== 'options' &&
          prop.path[0] !== 'theme' &&
          prop.attributes.category === 'color';
        }
    });
}
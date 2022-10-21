module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'iosSize',
        matcher: function(prop) {
          return prop.path[0] !== 'options' && prop.attributes.category === 'size';
        }
    });
}
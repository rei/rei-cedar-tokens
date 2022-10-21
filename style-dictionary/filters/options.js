module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'removeOptions',
        matcher: function(prop) {
          return prop.path[0] !== 'options'
        }
    });
}
module.exports = (StyleDictionary) => {
    StyleDictionary.registerFilter({
        name: 'removeSourceTokens',
        matcher: function(prop) {
          return prop.path[0] !== 'options' && prop.path[0] !== 'theme'
        }
    });
}
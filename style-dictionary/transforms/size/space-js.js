const _ = require('lodash');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'size/space-js',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return (prop.attributes.category === 'size') && prop.spacingModifier;
        },
        transformer(prop) {
            const { value, spacingModifier } = prop;

            const num = (parseInt(value) * spacingModifier);
            return num.toString();
        },
    });
};
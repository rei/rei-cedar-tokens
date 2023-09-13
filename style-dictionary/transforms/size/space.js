const _ = require('lodash');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'size/space',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return (prop.attributes.category === 'size') && prop.spacingModifier;
        },
        transformer(prop) {
            const { value, spacingModifier } = prop;

            const num = (parseFloat(value) * spacingModifier).toFixed(1);
            return num;
        },
    });
};
const tinycolor = require('tinycolor2');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'color/alpha',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return (prop.attributes.category === 'color') && prop.alpha;
        },
        transformer(prop) {
            const { value, alpha } = prop;

            let color = tinycolor(value);
            color.setAlpha(alpha)
            return color.toRgbString();
        },
    });
};
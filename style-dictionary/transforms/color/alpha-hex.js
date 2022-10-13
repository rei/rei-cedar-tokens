// const tinycolor = require('tinycolor2');

// module.exports = (StyleDictionary) => {
//     StyleDictionary.registerTransform({
//         name: 'color/alpha-hex',
//         type: 'value',
//         transitive: true,
//         matcher(prop) {
//             return (prop.attributes.category === 'color') && prop.alpha;
//         },
//         transformer(prop) {
//             let { value, alpha } = prop;
//             let color = tinycolor(value);
//             color.setAlpha(alpha);
//             let rgb = color.toRgb();
//             value.replace('alpha:1.000f', `alpha:${rgb.a.toFixed(3)}f`)
//             return value;
//         },

//     });
// };


const tinycolor = require('tinycolor2');
const chroma = require('chroma-js');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'color/alpha-hex',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return (prop.attributes.category === 'color') && prop.alpha;
        },
        transformer(prop) {
            let { value, alpha } = prop;
            let color = chroma(value);
            color.alpha(alpha);
            return color.hex()
        },

    });
};
const tinycolor = require('tinycolor2');
const chroma = require('chroma-js');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'color/UIColor-transitive',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return (prop.attributes.category === 'color')
        },
        transformer: function (prop) {
            const { value, alpha } = prop;


            if (value.indexOf('UIColor') === -1){
                let color = tinycolor(prop.value);
                let rgb = color.toRgb();

                return '[UIColor colorWithRed:' + (rgb.r/255).toFixed(3) + 'f' +
                       ' green:' + (rgb.g/255).toFixed(3) + 'f' +
                       ' blue:' + (rgb.b/255).toFixed(3) + 'f' +
                       ' alpha:' + rgb.a.toFixed(3) + 'f]';
            }
            return value;
    }

})};
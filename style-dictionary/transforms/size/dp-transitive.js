module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform({
        name: 'size/dp-transitive',
        type: 'value',
        transitive: true,
        matcher(prop) {
            return prop.attributes.category === 'size' &&
            prop.attributes.type !== 'font' &&
            prop.attributes.type !== 'icon';
        },
        transformer: function (prop) {
            const val = parseFloat(prop.value);
            if (isNaN(val)) throwSizeError(prop.name, prop.value, 'dp');
            return val.toFixed(2) + 'dp';
        }
    })
}
module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform(
        Object.assign({}, StyleDictionary.transform[`color/css`], {
            name: 'color/css-transitive',
            transitive: true
        }),
    )
}
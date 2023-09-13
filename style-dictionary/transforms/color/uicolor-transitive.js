module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform(
        Object.assign({}, StyleDictionary.transform[`color/UIColor`], {
            name: 'color/UIColor-transitive',
            transitive: true
        }),
    )
}
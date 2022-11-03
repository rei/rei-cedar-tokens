module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform(
        Object.assign({}, StyleDictionary.transform[`color/hex8android`], {
            name: 'color/hex8android-transitive',
            transitive: true
        }),
    )
}
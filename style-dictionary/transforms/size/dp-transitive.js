module.exports = (StyleDictionary) => {
    StyleDictionary.registerTransform(
        Object.assign({}, StyleDictionary.transform[`size/dp`], {
            name: 'size/dp-transitive',
            transitive: true
        }),
    )
}
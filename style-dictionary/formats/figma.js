const {transform, cleanMeta, markTokenset, trimName, trimValue } = require('@divriots/style-dictionary-to-figma');
const _ = require('lodash');

_.mixin({
    deep: function (obj, mapper) {
        return mapper(_.mapValues(obj, function (v) {
            return _.isPlainObject(v) ? _.deep(v, mapper) : v;
        }));
    },
});

module.exports = (StyleDictionary) => {
    StyleDictionary.registerFormat({
        name: 'figma',
        formatter: ({ dictionary }) => {
            //const transformedTokens = transform(dictionary.tokens);
            const propsToRemove = ['filePath', 'isSource', 'original', 'attributes', 'path', 'docs', 'newToken', 'name'];
            const transformedTokens = cleanMeta(dictionary.tokens, {cleanMeta: propsToRemove});
            const mappedObject = _.deep(transformedTokens, function(x) {
                return _.mapKeys(x, function (val, key) {
                    if (key === 'category'){
                        return 'type'
                    }
                    return key;
                });
            });

            return JSON.stringify(mappedObject, null, 2);
        },
    });
}
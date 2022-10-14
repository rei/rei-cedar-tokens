const { transform } = require('@divriots/style-dictionary-to-figma');

module.exports = (StyleDictionary) => {
    StyleDictionary.registerFormat({
        name: 'figma',
        formatter: ({ dictionary }) => {
            const transformedTokens = transform(dictionary.tokens);
            return JSON.stringify(transformedTokens, null, 2);
        },
    });
}
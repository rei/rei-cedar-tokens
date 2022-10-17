const StyleDictionary = require('style-dictionary');

const {
  sortByReference
} = StyleDictionary.formatHelpers;



module.exports = (StyleDictionary) => {

  StyleDictionary.registerFormat({
    name: `scss/foo`,
    formatter: ({ dictionary }) => {

      return dictionary.allTokens
        .sort(sortByReference(dictionary))
        .map(token => {
          let value = JSON.stringify(token.value);
          //if (dictionary.usesReference(token.original.value)) {
            const refs = dictionary.getReferences(token.original.value);
            refs.forEach(ref => {
              if (ref.name && ref.name.indexOf('cdr-options') === -1) {
                value = value.replace(ref.value, function () {
                  return `$${ref.name}`;
                });
              }
            });
//}
          return `$${token.name}: ${value};`
            .replaceAll('\"', '')
            .replaceAll('\\', '\"') //for font quotes
        })
        .join('\n');
    }
  })
}
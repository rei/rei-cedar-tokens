import _ from 'lodash'
import { cleanMeta } from '@divriots/style-dictionary-to-figma'

_.mixin({
  deep: (obj, mapper) => mapper(_.mapValues(obj, (v) => _.isPlainObject(v) ? _.deep(v, mapper) : v))
})

export const figma = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'figma',
    format: ({ dictionary }) => {
      const propsToRemove = ['isSource', 'attributes', 'path', 'docs', 'newToken', 'name', 'docCategory', 'docExample']
      // Custom transformer that preserves original references
      const preserveReferences = (tokens) => {
        return _.deep(tokens, (obj) => {
          return _.mapValues(obj, (value) => {
            if (value && value.original && value.original.$value) {
              // Preserve the original reference value and remove the 'options.' prefix
              return {
                $value: value.original.$value.replace('options.', ''),
                $type: value.$type,
                ...(value.original.$description && { $description: value.original.$description }),
                ...(value.filePath && { filePath: value.filePath })
              };
            }
            return value;
          });
        });
      };

      // First preserve references, then clean metadata
      const transformedTokens = cleanMeta(
        preserveReferences(dictionary.tokens),
        { cleanMeta: propsToRemove }
      );

      return JSON.stringify(transformedTokens, null, 2);
    }
  })
}

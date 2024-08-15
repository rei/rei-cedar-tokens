import _ from 'lodash'
import { cleanMeta } from '@divriots/style-dictionary-to-figma'

_.mixin({
  deep: (obj, mapper) => mapper(_.mapValues(obj, (v) => _.isPlainObject(v) ? _.deep(v, mapper) : v))
})

export const figma = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'figma',
    format: ({ dictionary }) => {
      const propsToRemove = ['isSource', 'original', 'attributes', 'path', 'docs', 'newToken', 'name']
      const transformedTokens = cleanMeta(dictionary.tokens, { cleanMeta: propsToRemove })
      const mappedObject = _.deep(transformedTokens, (x) => _.mapKeys(x, (val, key) => {
        if (key === 'category') {
          return 'type'
        }

        return key
      }))

      return JSON.stringify(mappedObject, null, 2)
    }
  })
}

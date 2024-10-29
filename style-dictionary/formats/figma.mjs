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
      const transformedTokens = cleanMeta(dictionary.tokens, { cleanMeta: propsToRemove })

      return JSON.stringify(transformedTokens, null, 2)
    }
  })
}

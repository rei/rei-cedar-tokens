import _ from 'lodash'

export const site = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'site',
    format: ({ dictionary, platform }) => {
      const prefix = platform.prefix ? `${platform.prefix}-` : ''
      const toRet = {}
      const grouped = _.groupBy(dictionary.allTokens, 'docs.category')
      const keys = Object.keys(grouped)

      for (const key of keys) {
        const newKey = key === 'undefined' ? 'misc' : key
        const catArr = grouped[key]
        toRet[newKey] = []

        for (let i = 0, len = catArr.length; i < len; i++) {
          const current = catArr[i]

          if (_.has(current, 'mixin')) {
            current.mixin = `${prefix}${current.mixin}`
          }

          // delete current.original;
          delete current.path
          toRet[newKey].push(current)
        }
      }

      return JSON.stringify(toRet, null, 2)
    }
  })
}

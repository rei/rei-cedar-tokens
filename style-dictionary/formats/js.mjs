export const js = (StyleDictionary) => {
  /* js module */
  StyleDictionary.registerFormat({
    name: 'js/commonjs',
    format: ({ dictionary }) => {
      const result = []
      dictionary.allTokens.forEach((p) => {
        const k = p.name
        const v = JSON.stringify(p.value)
        result.push(`  ${k}: ${v},`)
      })

      return ['module.exports = {', result.join('\n'), '};'].join('\n')
    }
  })
}

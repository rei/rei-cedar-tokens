import { BASE_FONT_SIZE } from '../../utils.mjs'

export const pxToRemTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem-transitive',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'dimension' || token.$type === 'fontSize',
    transform: (token, config) => {
      const REM = config.basePxFontSize || BASE_FONT_SIZE
      const tokens = token.$value.split(' ')

      const result = tokens.map((value) => {
        const parsedValue = parseFloat(value, 10)

        if (parsedValue === 0 || !value) {
          return '0'
        }

        if (!value.includes('rem')) {
          const num = (parseFloat(value, 10) / REM)
          const unit = num !== 0 ? 'rem' : ''

          return `${num}${unit}`
        }

        return value
      })

      return result.join(' ')
    }
  })
}

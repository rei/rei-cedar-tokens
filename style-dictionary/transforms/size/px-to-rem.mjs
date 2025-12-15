import { BASE_FONT_SIZE } from '../../utils.mjs'

export const pxToRem = (value, baseFontSize = BASE_FONT_SIZE) => {
  if (typeof value !== 'string') return value
  
  const tokens = value.split(' ')
  const result = tokens.map((token) => {
    const parsedValue = parseFloat(token, 10)

    if (parsedValue === 0 || !token) {
      return '0'
    }

    if (!token.includes('rem')) {
      const num = (parseFloat(token, 10) / baseFontSize)
      const unit = num !== 0 ? 'rem' : ''

      return `${num}${unit}`
    }

    return token
  })

  return result.join(' ')
}

export const pxToRemTransitive = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'size/px-to-rem-transitive',
    type: 'value',
    transitive: true,
    filter: (token) => {
      // Include dimension, fontSize, and check if value contains 'px' for expanded typography tokens
      return token.$type === 'dimension' || 
             token.$type === 'fontSize' || 
             (typeof token.$value === 'string' && token.$value.includes('px'))
    },
    transform: (token, config) => {
      const REM = config.basePxFontSize || BASE_FONT_SIZE
      return pxToRem(token.$value, REM)
    }
  })
}

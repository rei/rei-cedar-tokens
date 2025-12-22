import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export const getDirname = (filename) => dirname(fileURLToPath(filename))

export const BASE_FONT_SIZE = 10

export const commonConfig = (theme, platform) => ({
  prefix: 'cdr',
  buildPath: `dist/${theme}/${platform}/`,
  options: {
    showFileHeader: false
  }
})

export const filterSourceTokensAndType = (token, type) => {
  const types = Array.isArray(type) ? type : [type]
  return token.path[0] !== 'options' && token.path[0] !== 'theme' && types.includes(token.$type)
}

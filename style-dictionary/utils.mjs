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

import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeDisplayScss = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'include-display-scss',
    do: async (dictionary, config) => {
      const scss = path.join(__dirname, '../utilities/display.scss')
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'display.scss')
      await fs.copyFile(scss, outputDir)
    },
    undo: async (dictionary, config) => {
      await fs.remove(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

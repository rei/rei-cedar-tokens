import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeDisplayScss = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'include-display-scss',
    do: (dictionary, config) => {
      const scss = path.join(__dirname, '../utilities/display.scss')
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'display.scss')
      fs.copyFileSync(scss, outputDir)
    },
    undo: (dictionary, config) => {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

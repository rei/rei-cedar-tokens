import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeDeprecateScss = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include-deprecate-scss',
    do: (dictionary, config) => {
      const deprecateScss = path.join(__dirname, '../utilities/deprecate.scss')
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'deprecate.scss')
      fs.copyFileSync(deprecateScss, outputDir)
    },
    undo: (dictionary, config) => {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

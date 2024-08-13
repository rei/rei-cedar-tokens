import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeMediaQueriesScss = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include-media-queries-scss',
    do: async (dictionary, config) => {
      const scss = path.join(__dirname, '../utilities/media-queries.scss')
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'media-queries.scss')
      await fs.copyFile(scss, outputDir)
    },
    undo: async (dictionary, config) => {
      await fs.remove(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeMediaQueriesLess = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include-media-queries-less',
    do: (dictionary, config) => {
      const less = path.join(__dirname, '../utilities/media-queries.less')
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'media-queries.less')
      fs.copyFileSync(less, outputDir)
    },
    undo: (dictionary, config) => {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

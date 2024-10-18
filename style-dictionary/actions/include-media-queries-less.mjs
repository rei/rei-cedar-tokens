import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeMediaQueriesLess = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'include-media-queries-less',
    do: (dictionary, config) => {
      try {
        const lessFile = path.join(__dirname, '../utilities/media-queries.less')
        const outputDir = path.join(__dirname, '../../', config.buildPath)
        const outputFile = path.join(outputDir, 'media-queries.less')

        // Ensure the output directory exists
        fs.ensureDirSync(outputDir)

        // Copy the LESS file to the output directory
        fs.copyFileSync(lessFile, outputFile)
        console.log(`Successfully copied ${lessFile} to ${outputFile}`)
      } catch (error) {
        console.error('Error including media queries LESS file:', error)
      }
    },
    undo: (dictionary, config) => {
      try {
        const outputDir = path.join(__dirname, '../../', config.buildPath)

        // Remove the output directory and its contents
        fs.removeSync(outputDir)
        console.log(`Successfully removed ${outputDir}`)
      } catch (error) {
        console.error('Error removing media queries LESS file directory:', error)
      }
    }
  })
}

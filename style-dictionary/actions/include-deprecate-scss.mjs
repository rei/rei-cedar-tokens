import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const includeDeprecateScss = (StyleDictionary) => {
  // Register custom action for Style Dictionary
  StyleDictionary.registerAction({
    name: 'include-deprecate-scss',
    do: (dictionary, config) => {
      try {
        const deprecateScss = path.join(__dirname, '../utilities/deprecate.scss')
        const outputDir = path.join(__dirname, '../../', config.buildPath)
        const outputFile = path.join(outputDir, 'deprecate.scss')

        // Ensure the output directory exists
        fs.ensureDirSync(outputDir)

        // Copy the SCSS file
        fs.copyFileSync(deprecateScss, outputFile)
        console.log(`Successfully copied to ${outputFile}`)
      } catch (error) {
        console.error('Error including deprecate SCSS:', error)
      }
    },
    undo: (dictionary, config) => {
      try {
        const outputDir = path.join(__dirname, '../../', config.buildPath)

        // Remove the output directory and its contents
        fs.removeSync(outputDir)
        console.log(`Successfully removed ${outputDir}`)
      } catch (error) {
        console.error('Error removing deprecate SCSS directory:', error)
      }
    }
  })
}

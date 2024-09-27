import fs from 'fs-extra'
import concat from 'concat'
import path from 'path'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const concatFiles = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'concat-files',
    do: (dictionary, config) => {
      try {
        // Read files from the specified build path
        const buildPath = path.join(__dirname, '../../', config.buildPath)
        const files = fs.readdirSync(buildPath)

        if (files.length === 0) {
          console.warn('No files found in the build path.')
          return
        }

        // Determine the file extension from the first file
        const extension = path.extname(files[0])
        const allPaths = files.map(f => path.join(buildPath, f))
        const concatPaths = allPaths.filter(p => !path.basename(p).includes('no_concat'))
        const noConcatPaths = allPaths.filter(p => path.basename(p).includes('no_concat'))

        // Rename files with 'no_concat' in their name
        noConcatPaths.forEach(p => {
          const newPath = p.replace('.no_concat', '')
          fs.renameSync(p, newPath)
        })

        // Concatenate files
        concat(concatPaths).then((r) => {
          const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`)
          fs.outputFileSync(outFile, r)
        })

        // Remove concatenated files
        concatPaths.forEach(p => {
          fs.removeSync(p)
        })

        console.log('Successfully removed concatenated files')
      } catch (error) {
        console.error('Error during file concatenation process:', error)
      }
    },
    undo: (dictionary, config) => {
      try {
        const buildPath = path.join(__dirname, '../../', config.buildPath)
        fs.removeSync(buildPath)
        console.log(`Successfully removed ${buildPath}`)
      } catch (error) {
        console.error('Error removing build path:', error)
      }
    }
  })
}

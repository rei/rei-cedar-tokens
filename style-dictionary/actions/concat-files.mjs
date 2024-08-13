import fs from 'fs-extra'
import concat from 'concat'
import path from 'path'
import _ from 'lodash'
import { getDirname } from '../utils.mjs'

const __dirname = getDirname(import.meta.url)

export const concatFiles = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'concat-files',
    do: async (dictionary, config) => {
      await fs.readdir(config.buildPath, async (err, files) => {
        if (err) { throw err }

        const extension = path.extname(files[0])
        const concatPaths = files.map(f => path.join(__dirname, '../../', config.buildPath, f))

        _.pullAllWith([...concatPaths], '.', async (v1) => {
          if (v1.includes('.no_concat')) {
            const newPath = v1.replace('.no_concat', '')
            // rename file that won't be concated to remove the .no_concat
            await fs.rename(v1, newPath)
            return true
          }
          return false
        })

        const newConcatPaths = concatPaths.map(f => f.replace('.no_concat', ''))

        // output concat paths
        concat(newConcatPaths)
          .then(async (r) => {
            const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`)
            await fs.outputFile(outFile, r)
          }).catch((err) => {
            console.error('Error concatenating files', err)
          })

        // remove concated files
        concatPaths.forEach(async (p) => {
          await fs.remove(p)
        })
      })
    },
    undo: async (dictionary, config) => {
      await fs.removeSync(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

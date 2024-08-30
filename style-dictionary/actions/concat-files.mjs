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
    do: (dictionary, config) => {
      fs.readdir(config.buildPath, async (error, files) => {
        if (error) {
          throw error
        }

        const extension = path.extname(files[0])
        const allPaths = files.map(f => path.join(__dirname, '../../', config.buildPath, f))
        const concatPaths = allPaths.filter(p => !p.includes('no_concat'))
        const noConcatPaths = allPaths.filter(p => p.includes('no_concat'))
        const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`)

        noConcatPaths.forEach(async (p) => {
          const newPath = p.replace('.no_concat', '')
          fs.renameSync(p, newPath)
        })

        // output concat paths
        concat(concatPaths)
          .then(async (r) =>
            fs.outputFileSync(outFile, r)
          ).catch((err) => {
            console.error('Error concatenating files', err)
          })

        // remove concatenated files
        concatPaths.forEach(async (p) => {
          fs.removeSync(p)
        })
      })
    },
    undo: async (dictionary, config) => {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath))
    }
  })
}

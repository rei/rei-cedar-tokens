import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export const getDirname = (filename) => dirname(fileURLToPath(filename))

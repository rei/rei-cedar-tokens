import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../style-dictionary/utils.mjs'

const __dirname = getDirname(import.meta.url)
const FIGMA_TOKENS_PATH = path.resolve(__dirname, '../dist/rei-dot-com/figma/figma.json')

function flattenTokens (obj, parentPath = [], result = {}, filePathMap = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]

    if (value.$value !== undefined && value.$type !== undefined) {
      const tokenPath = currentPath.join('.')
      result[tokenPath] = {
        ...value, // Keep all properties
        filePath: value.filePath
      }

      if (value.filePath) {
        const filePath = value.filePath
        if (!filePathMap[filePath]) {
          filePathMap[filePath] = {}
        }
        filePathMap[filePath][tokenPath] = result[tokenPath]
      }
    } else if (typeof value === 'object' && value !== null) {
      flattenTokens(value, currentPath, result, filePathMap)
    }
  }

  return { flatTokens: result, filePathMap }
}

async function updateTokensInPlace (obj, sourceTokens, parentPath = []) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]
    const tokenPath = currentPath.join('.')

    if (value.$value !== undefined) {
      // If this path exists in source tokens, update only the $value
      const sourceToken = sourceTokens[tokenPath]
      if (sourceToken?.$value !== undefined) {
        value.$value = sourceToken.$value
      }
    } else if (typeof value === 'object' && value !== null) {
      await updateTokensInPlace(value, sourceTokens, currentPath)
    }
  }
}

async function updateTokens (targetFilePath) {
  try {
    // Read both source and target files
    const targetContent = await fs.readJson(targetFilePath)
    const sourceContent = await fs.readJson(FIGMA_TOKENS_PATH)

    // Flatten source tokens
    const { flatTokens: sourceFlatTokens } = flattenTokens(sourceContent)

    // Update the target content in place
    await updateTokensInPlace(targetContent, sourceFlatTokens)

    // Write the updated content back to the file
    await fs.writeJson(targetFilePath, targetContent, { spaces: 2 })

    return {
      file: targetFilePath,
      updated: true
    }
  } catch (error) {
    console.error(`Error updating tokens in ${targetFilePath}:`, error)
    throw error
  }
}

async function getUniqueFilePaths () {
  try {
    const content = await fs.readJson(FIGMA_TOKENS_PATH)
    const { filePathMap } = flattenTokens(content)
    return Object.keys(filePathMap)
  } catch (error) {
    console.error('Error getting unique files:', error)
    throw error
  }
}

async function main () {
  try {
    const files = await getUniqueFilePaths()
    const results = []

    for (const file of files.slice(0, 1)) {
      const update = await updateTokens(file)
      results.push(update)
      console.log(`Updated ${file}`)
    }

    return results
  } catch (error) {
    console.error('Error in main:', error)
    throw error
  }
}

main()

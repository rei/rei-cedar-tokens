import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../style-dictionary/utils.mjs'

const __dirname = getDirname(import.meta.url)
const FIGMA_TOKENS_PATH = path.resolve(__dirname, '../dist/rei-dot-com/figma/figma.json')
const OPTIONS_FOLDER = path.resolve(__dirname, '../tokens/_options')

let optionsTokens = new Set()

async function loadOptionsTokens() {
  try {
    const files = await fs.readdir(OPTIONS_FOLDER)
    
    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.json5')) {
        const content = await fs.readJson(path.join(OPTIONS_FOLDER, file))
        
        if (content.options) {
          traverseAndStoreColorTokens(content.options, [])
        }
      }
    }
  } catch (error) {
    console.error('Error loading options tokens:', error)
    throw error
  }
}

function traverseAndStoreColorTokens(obj, parentPath) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]
    
    if (value.$value !== undefined) {
      optionsTokens.add(currentPath.join('.'))
    } else if (typeof value === 'object' && value !== null && !key.startsWith('$')) {
      traverseAndStoreColorTokens(value, currentPath)
    }
  }
}

function isColorToken(value, parentType = null) {
  if (value.$type === 'color') return true
  if (parentType === 'color') return true
  return false
}

function flattenTokens(obj, parentPath = [], result = {}, filePathMap = {}, parentType = null) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]
    const currentType = value.$type || parentType

    if (value.$value !== undefined) {
      if (isColorToken(value, currentType)) {
        const tokenPath = currentPath.join('.')
        result[tokenPath] = {
          ...value,
          filePath: value.filePath,
          parentType: currentType
        }

        if (value.filePath) {
          const filePath = value.filePath
          if (!filePathMap[filePath]) {
            filePathMap[filePath] = {}
          }
          filePathMap[filePath][tokenPath] = result[tokenPath]
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      flattenTokens(value, currentPath, result, filePathMap, currentType)
    }
  }

  return { flatTokens: result, filePathMap }
}

function isReference(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
}

function normalizeReference(reference) {
  // Remove the curly braces and any existing options prefix
  const cleanPath = reference.replace(/[{}]/g, '').replace(/^options\./, '')
  
  // Check if this reference is to an options token
  const refParts = cleanPath.split('.')
  let testPath = ''
  
  // Try to match increasingly specific paths
  for (const part of refParts) {
    testPath = testPath ? `${testPath}.${part}` : part
    if (optionsTokens.has(testPath)) {
      return `options.${cleanPath}`
    }
  }
  
  return cleanPath
}

async function updateTokensInPlace(obj, sourceTokens, parentPath = [], parentType = null) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]
    const tokenPath = currentPath.join('.')
    const currentType = value.$type || parentType

    if (value.$value !== undefined && isColorToken(value, currentType)) {
      const sourceToken = sourceTokens[tokenPath]
      if (sourceToken) {
        if (isReference(sourceToken.$value)) {
          const normalizedRef = normalizeReference(sourceToken.$value)
          const newValue = `{${normalizedRef}}`
          if (value.$value !== newValue) {
            console.log(`Updating token ${tokenPath} from ${value.$value} to ${newValue}`)
            value.$value = newValue
          }
        } else if (value.$value !== sourceToken.$value) {
          console.log(`Updating token ${tokenPath} from ${value.$value} to ${sourceToken.$value}`)
          value.$value = sourceToken.$value
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      await updateTokensInPlace(value, sourceTokens, currentPath, currentType)
    }
  }
}

async function updateTokens(targetFilePath) {
  try {
    console.log(`Processing file: ${targetFilePath}`)
    
    const targetContent = await fs.readJson(targetFilePath)
    const sourceContent = await fs.readJson(FIGMA_TOKENS_PATH)

    const { flatTokens: sourceFlatTokens } = flattenTokens(sourceContent)
    
    await updateTokensInPlace(targetContent, sourceFlatTokens)

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

async function getUniqueFilePaths() {
  try {
    const content = await fs.readJson(FIGMA_TOKENS_PATH)
    const { filePathMap } = flattenTokens(content)
    return Object.keys(filePathMap)
  } catch (error) {
    console.error('Error getting unique files:', error)
    throw error
  }
}

async function main() {
  try {
    await loadOptionsTokens()
    
    const files = await getUniqueFilePaths()
    const results = []

    for (const file of files) {
      const update = await updateTokens(file)
      results.push(update)
    }

    return results
  } catch (error) {
    console.error('Error in main:', error)
    throw error
  }
}

main()
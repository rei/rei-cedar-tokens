import fs from 'fs-extra'
import path from 'path'
import { getDirname } from '../style-dictionary/utils.mjs'

const __dirname = getDirname(import.meta.url)
const FIGMA_TOKENS_PATH = path.resolve(__dirname, '../dist/rei-dot-com/figma/figma.json')
const OPTIONS_FOLDER = path.resolve(__dirname, '../tokens/_options')

const optionsTokens = new Set()

async function loadOptionsTokens () {
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

function traverseAndStoreColorTokens (obj, parentPath) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]

    if (value.$value !== undefined) {
      optionsTokens.add(currentPath.join('.'))
    } else if (typeof value === 'object' && value !== null && !key.startsWith('$')) {
      traverseAndStoreColorTokens(value, currentPath)
    }
  }
}

function isColorToken (value, parentType = null) {
  if (value.$type === 'color') return true
  if (parentType === 'color') return true
  return false
}

function isReference (value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
}

function normalizeReference (reference) {
  const cleanPath = reference.replace(/[{}]/g, '').replace(/^options\./, '')

  const refParts = cleanPath.split('.')
  let testPath = ''

  for (const part of refParts) {
    testPath = testPath ? `${testPath}.${part}` : part
    if (optionsTokens.has(testPath)) {
      return `options.${cleanPath}`
    }
  }

  return cleanPath
}

// Get all tokens from an object with their full paths
function getAllTokens (obj, parentPath = [], parentType = null, result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key]
    const currentType = value.$type || parentType

    if (value.$value !== undefined) {
      if (isColorToken(value, currentType)) {
        const tokenPath = currentPath.join('.')
        result[tokenPath] = {
          ...value,
          parentType: currentType
        }
      }
    } else if (typeof value === 'object' && value !== null && !key.startsWith('$')) {
      getAllTokens(value, currentPath, currentType, result)
    }
  }

  return result
}

// Clean up empty objects after deleting tokens
function cleanupEmptyObjects (obj) {
  if (typeof obj !== 'object' || obj === null) return

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      cleanupEmptyObjects(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  }
}

// Update or delete tokens in target file based on source
async function updateFile (targetPath, sourceTokens) {
  console.log(`Processing file: ${targetPath}`)

  try {
    // Ensure directory exists
    await fs.ensureDir(path.dirname(targetPath))

    // Read or create target file
    let targetContent
    try {
      targetContent = await fs.readJson(targetPath)
    } catch (error) {
      targetContent = {}
    }

    const targetTokens = getAllTokens(targetContent)
    let hasChanges = false

    // Handle updates and deletions
    for (const [tokenPath, targetValue] of Object.entries(targetTokens)) {
      const sourceToken = sourceTokens[tokenPath]
      const pathParts = tokenPath.split('.')
      let current = targetContent

      if (!sourceToken || sourceToken.filePath !== targetPath) {
        console.log(`Deleting token ${tokenPath}`)
        for (let i = 0; i < pathParts.length - 1; i++) {
          current = current[pathParts[i]]
          if (!current) break
        }
        if (current) {
          delete current[pathParts[pathParts.length - 1]]
          hasChanges = true
        }
      } else if (sourceToken) {
        const newValue = isReference(sourceToken.$value)
          ? `{${normalizeReference(sourceToken.$value)}}`
          : sourceToken.$value

        if (targetValue.$value !== newValue) {
          console.log(`Updating token ${tokenPath}`)
          for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]]
          }
          current[pathParts[pathParts.length - 1]].$value = newValue
          hasChanges = true
        }
      }
    }

    // Add new tokens
    for (const [tokenPath, sourceToken] of Object.entries(sourceTokens)) {
      if (sourceToken.filePath === targetPath && !targetTokens[tokenPath]) {
        console.log(`Restoring token ${tokenPath}`)
        const pathParts = tokenPath.split('.')
        let current = targetContent

        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {}
          }
          current = current[pathParts[i]]
        }

        const newValue = isReference(sourceToken.$value)
          ? `{${normalizeReference(sourceToken.$value)}}`
          : sourceToken.$value

        current[pathParts[pathParts.length - 1]] = {
          $value: newValue,
          $type: sourceToken.$type
        }
        hasChanges = true
      }
    }

    if (hasChanges) {
      cleanupEmptyObjects(targetContent)
      await fs.writeJson(targetPath, targetContent, { spaces: 2 })
    }

    return { file: targetPath, updated: hasChanges }
  } catch (error) {
    console.error(`Error processing file ${targetPath}:`, error)
    throw error
  }
}
async function main () {
  try {
    // Load options tokens first
    await loadOptionsTokens()

    // Read source Figma tokens
    const sourceContent = await fs.readJson(FIGMA_TOKENS_PATH)
    const sourceTokens = getAllTokens(sourceContent)

    // Get unique file paths from source tokens
    const filePaths = new Set()
    for (const token of Object.values(sourceTokens)) {
      if (token.filePath) {
        filePaths.add(token.filePath)
      }
    }

    // Process each file
    const results = []
    for (const filePath of filePaths) {
      const result = await updateFile(filePath, sourceTokens)
      results.push(result)
    }

    return results
  } catch (error) {
    console.error('Error in main:', error)
    throw error
  }
}

main()

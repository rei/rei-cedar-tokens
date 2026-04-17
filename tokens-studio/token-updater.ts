import fs from 'fs-extra';
import path from 'path';
import type { DesignToken, DesignTokens } from 'style-dictionary/types';
import { getDirname } from '../style-dictionary/utils';

const __dirname = getDirname(import.meta.url);
const FIGMA_TOKENS_PATH = path.resolve(__dirname, '../dist/rei-dot-com/figma/figma.json');
const OPTIONS_FOLDER = path.resolve(__dirname, '../tokens/_options');

const optionsTokens = new Set<string>();

interface FlatTokens {
  [path: string]: DesignToken;
}

interface FilePathMap {
  [filePath: string]: FlatTokens;
}

async function loadOptionsTokens(): Promise<void> {
  try {
    const files = await fs.readdir(OPTIONS_FOLDER);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readJson(path.join(OPTIONS_FOLDER, file));

        if (content.options) {
          traverseAndStoreColorTokens(content.options, []);
        }
      }
    }
  } catch (error) {
    console.error('Error loading options tokens:', error);
    throw error;
  }
}

function traverseAndStoreColorTokens(obj: DesignTokens, parentPath: string[]): void {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key];

    if (typeof value === 'object' && value !== null) {
      if ((value as DesignToken).$value !== undefined) {
        optionsTokens.add(currentPath.join('.'));
      } else if (!key.startsWith('$')) {
        traverseAndStoreColorTokens(value as DesignTokens, currentPath);
      }
    }
  }
}

function isColorToken(value: DesignToken, parentType: string | null = null): boolean {
  if (value.$type === 'color') return true;
  if (parentType === 'color') return true;
  return false;
}

function flattenTokens(
  obj: DesignTokens,
  parentPath: string[] = [],
  result: FlatTokens = {},
  filePathMap: FilePathMap = {},
  parentType: string | null = null,
): { flatTokens: FlatTokens; filePathMap: FilePathMap } {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key];
    const currentType = (value as DesignToken).$type || parentType;

    if (typeof value === 'object' && value !== null) {
      if ((value as DesignToken).$value !== undefined) {
        if (isColorToken(value as DesignToken, currentType)) {
          const tokenPath = currentPath.join('.');
          result[tokenPath] = {
            ...value,
            filePath: (value as DesignToken).filePath,
            parentType: currentType,
          } as DesignToken;

          if ((value as DesignToken).filePath) {
            const filePath = String((value as DesignToken).filePath);
            if (!filePathMap[filePath]) {
              filePathMap[filePath] = {};
            }
            filePathMap[filePath][tokenPath] = result[tokenPath];
          }
        }
      } else {
        flattenTokens(value as DesignTokens, currentPath, result, filePathMap, currentType);
      }
    }
  }

  return { flatTokens: result, filePathMap };
}

function isReference(value: string): boolean {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function normalizeReference(reference: string): string {
  // Remove the curly braces and any existing options prefix
  const cleanPath = reference.replace(/[{}]/g, '').replace(/^options\./, '');

  // Check if this reference is to an options token
  const refParts = cleanPath.split('.');
  let testPath = '';

  // Try to match increasingly specific paths
  for (const part of refParts) {
    testPath = testPath ? `${testPath}.${part}` : part;
    if (optionsTokens.has(testPath)) {
      return `options.${cleanPath}`;
    }
  }

  return cleanPath;
}

async function updateTokensInPlace(
  obj: DesignTokens,
  sourceTokens: FlatTokens,
  parentPath: string[] = [],
  parentType: string | null = null,
): Promise<void> {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...parentPath, key];
    const tokenPath = currentPath.join('.');
    const currentType = (value as DesignToken).$type || parentType;

    if (typeof value === 'object' && value !== null) {
      if (
        (value as DesignToken).$value !== undefined &&
        isColorToken(value as DesignToken, currentType)
      ) {
        const sourceToken = sourceTokens[tokenPath];
        if (sourceToken && typeof sourceToken.$value === 'string') {
          if (isReference(sourceToken.$value)) {
            const normalizedRef = normalizeReference(sourceToken.$value);
            const newValue = `{${normalizedRef}}`;
            if ((value as DesignToken).$value !== newValue) {
              console.log(
                `Updating token ${tokenPath} from ${(value as DesignToken).$value} to ${newValue}`,
              );
              (value as DesignToken).$value = newValue;
            }
          } else if ((value as DesignToken).$value !== sourceToken.$value) {
            console.log(
              `Updating token ${tokenPath} from ${(value as DesignToken).$value} to ${sourceToken.$value}`,
            );
            (value as DesignToken).$value = sourceToken.$value;
          }
        }
      } else {
        await updateTokensInPlace(value as DesignTokens, sourceTokens, currentPath, currentType);
      }
    }
  }
}

async function updateTokens(targetFilePath: string): Promise<{ file: string; updated: boolean }> {
  try {
    console.log(`Processing file: ${targetFilePath}`);

    const targetContent = await fs.readJson(targetFilePath);
    const sourceContent = await fs.readJson(FIGMA_TOKENS_PATH);

    const { flatTokens: sourceFlatTokens } = flattenTokens(sourceContent);

    await updateTokensInPlace(targetContent, sourceFlatTokens);

    await fs.writeJson(targetFilePath, targetContent, { spaces: 2 });

    return {
      file: targetFilePath,
      updated: true,
    };
  } catch (error) {
    console.error(`Error updating tokens in ${targetFilePath}:`, error);
    throw error;
  }
}

async function getUniqueFilePaths(): Promise<string[]> {
  try {
    const content = await fs.readJson(FIGMA_TOKENS_PATH);
    const { filePathMap } = flattenTokens(content);
    return Object.keys(filePathMap);
  } catch (error) {
    console.error('Error getting unique files:', error);
    throw error;
  }
}

async function main(): Promise<Array<{ file: string; updated: boolean }>> {
  try {
    await loadOptionsTokens();

    const files = await getUniqueFilePaths();
    const results: Array<{ file: string; updated: boolean }> = [];

    for (const file of files) {
      const update = await updateTokens(file);
      results.push(update);
    }

    return results;
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

main();

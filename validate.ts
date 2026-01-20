import { glob } from 'glob';
import _ from 'lodash';
import process from 'process';
import dirToJson from 'dir-to-json';
import fs from 'fs';
import type { DesignToken, DesignTokens } from 'style-dictionary/types';

const args = process.argv.slice(2);

// Utility function to add delimiters
const addDelimiter = (a: string, b: string): string => (a ? `${a}-${b}` : b);

// Check if object has a `value` property and if any children also have `value` (style dictionary
// will only process the topmost object with `value`)
const validate = (obj: DesignToken | DesignTokens, path = '', toRet: string[] = []): string[] => {
  const hasValue = _.has(obj, 'value');

  for (const key in obj) {
    const value = obj[key];
    const fullPath = addDelimiter(path, key);

    if (hasValue && _.has(value, 'value')) {
      toRet.push(fullPath);
      validate(value as DesignToken, fullPath, toRet);
    } else if (_.isPlainObject(value)) {
      validate(value as DesignTokens, fullPath, toRet);
    }
  }

  return toRet;
};

// Validate function for file structure
const validateStructure = async (): Promise<void> => {
  const isUpdating = args.includes('--update');
  const validationFile = 'validate-structure.json';
  const newData = await dirToJson('./dist', { sortType: true });
  let existingData: unknown;

  try {
    const raw = fs.readFileSync(validationFile, 'utf8');
    existingData = JSON.parse(raw);
  } catch {
    existingData = null;
  }

  // If no existing data found or is updating, create it
  if (!existingData || isUpdating) {
    fs.writeFileSync(validationFile, JSON.stringify(newData));
    console.log('Created new validation data');
    return;
  }

  if (!_.isEqual(existingData, newData)) {
    throw new Error('Structure in dist folder has changed!');
  }

  console.log('Dist data structure has not changed');
};

// Main execution flow
const main = async (): Promise<void> => {
  const files = glob.sync('./tokens/**/*.json');
  const results: string[] = [];

  // Process each file
  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf8');
    const response = validate(JSON.parse(fileContent));

    if (response.length > 0) {
      results.push(`  In ${file}:`);
      results.push(`    ${response.join('\r\n    ')}`);
    }
  }

  if (results.length > 0) {
    console.log('The following tokens are being skipped:');
    console.log(results.join('\r\n'));
    process.exitCode = 1;
  } else {
    console.log('All files successfully validated');
  }

  // Validate structure
  try {
    await validateStructure();
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
};

main();

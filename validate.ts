import { glob } from "glob";
import _ from "lodash";
import process from "process";
import dirToJson from "dir-to-json";
import fs from "fs";
import type { DesignToken, DesignTokens } from "style-dictionary/types";

const args = process.argv.slice(2);

// Recursively collect paths where two objects differ
const diffPaths = (
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  path = "",
): string[] => {
  const changes: string[] = [];
  const allKeys = _.union(Object.keys(oldObj), Object.keys(newObj));

  for (const key of allKeys) {
    const fullPath = addDelimiter(path, key);
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    // Replace your existing if/else logic inside the loop with this:
    if (!(key in oldObj)) {
      changes.push(`ADDED:   ${fullPath}`);
    } else if (!(key in newObj)) {
      changes.push(`REMOVED: ${fullPath}`);
    } else if (_.isPlainObject(oldVal) && _.isPlainObject(newVal)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      changes.push(...diffPaths(oldVal as any, newVal as any, fullPath));
    } else if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      // Optional: Recurse into arrays to find exactly which index changed
      const maxLen = Math.max(oldVal.length, newVal.length);
      for (let i = 0; i < maxLen; i++) {
        changes.push(
          ...diffPaths({ [i]: oldVal[i] }, { [i]: newVal[i] }, fullPath),
        );
      }
    } else if (!_.isEqual(oldVal, newVal)) {
      // Use JSON.stringify for a readable output of the final values
      const oldStr =
        typeof oldVal === "object" ? JSON.stringify(oldVal) : oldVal;
      const newStr =
        typeof newVal === "object" ? JSON.stringify(newVal) : newVal;
      changes.push(`CHANGED: ${fullPath} ("${oldStr}" → "${newStr}")\n`);
    }
  }

  return changes;
};

// Utility function to add delimiters
const addDelimiter = (a: string, b: string): string => (a ? `${a}-${b}` : b);

// Check if object has a `value` property and if any children also have `value` (style dictionary
// will only process the topmost object with `value`)
const validate = (
  obj: DesignToken | DesignTokens,
  path = "",
  toRet: string[] = [],
): string[] => {
  const hasValue = _.has(obj, "value");

  for (const key in obj) {
    const value = obj[key];
    const fullPath = addDelimiter(path, key);

    if (hasValue && _.has(value, "value")) {
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
  const isUpdating = args.includes("--update");
  const validationFile = "validate-structure.json";
  const newData = await dirToJson("./dist", { sortType: true });
  let existingData: unknown;

  try {
    const raw = fs.readFileSync(validationFile, "utf8");
    existingData = JSON.parse(raw);
  } catch {
    existingData = null;
  }

  // If no existing data found or is updating, create it
  if (!existingData || isUpdating) {
    fs.writeFileSync(validationFile, JSON.stringify(newData));
    console.log("Created new validation data");
    return;
  }

  if (!_.isEqual(existingData, newData)) {
    const changes = diffPaths(
      existingData as Record<string, unknown>,
      newData as Record<string, unknown>,
    );

    console.error("Structure in dist folder has changed:");
    changes.forEach((line) => console.error(`  ${line}`));

    throw new Error(
      `Structure in dist folder has changed (${changes.length} difference(s) found)`,
    );
  }

  console.log("Dist data structure has not changed");
};

// Main execution flow
const main = async (): Promise<void> => {
  const files = glob.sync("./tokens/**/*.json");
  const results: string[] = [];

  // Process each file
  for (const file of files) {
    const fileContent = fs.readFileSync(file, "utf8");
    const response = validate(JSON.parse(fileContent));

    if (response.length > 0) {
      results.push(`  In ${file}:`);
      results.push(`    ${response.join("\r\n    ")}`);
    }
  }

  if (results.length > 0) {
    console.log("The following tokens are being skipped:");
    console.log(results.join("\r\n"));
    process.exitCode = 1;
  } else {
    console.log("All files successfully validated");
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

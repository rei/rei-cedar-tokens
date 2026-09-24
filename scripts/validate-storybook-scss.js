#!/usr/bin/env node

/**
 * validate-storybook-scss.js
 *
 * Validates that all SCSS variables used in Storybook files are defined.
 * This prevents rendering errors like "Undefined variable" in the browser.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// SCSS files to validate
const scssFiles = [
  '.storybook/_content.scss',
  '.storybook/cedar.scss',
  '.storybook/preview.ts', // Contains inline styles
];

// Extract all SCSS variables used in a file (ignores comments)
function extractScssVariables(content) {
  // Strip block comments and line comments so commented-out
  // variable references don't produce false positives
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const variables = new Set();
  const regex = /\$[a-zA-Z][a-zA-Z0-9_-]*/g;
  let match;

  while ((match = regex.exec(stripped)) !== null) {
    variables.add(match[0]);
  }

  return Array.from(variables);
}

// Check if a variable is defined in any SCSS file or in the current file
function isVariableDefined(variable, allScssFiles, currentContent) {
  // First check if it's defined in the current file
  const defRegex = new RegExp(`^\\s*\\$${variable.substring(1)}\\s*:`, 'm');
  if (defRegex.test(currentContent)) {
    return true;
  }

  // Then check other SCSS files
  for (const file of allScssFiles) {
    try {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
      if (defRegex.test(content)) {
        return true;
      }
    } catch {
      // File doesn't exist or can't be read
      continue;
    }
  }
  return false;
}

// Get all SCSS files in the project
function getAllScssFiles() {
  const files = [];

  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.scss')) {
          files.push(path.relative(rootDir, fullPath));
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  scanDir(rootDir);
  return files;
}

function main() {
  console.log('🔍 Validating Storybook SCSS variables...\n');

  const allScssFiles = getAllScssFiles();
  const errors = [];

  for (const file of scssFiles) {
    try {
      const filePath = path.join(rootDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const variables = extractScssVariables(content);

      console.log(`📄 Checking ${file}...`);

      for (const variable of variables) {
        if (!isVariableDefined(variable, allScssFiles, content)) {
          errors.push({
            file,
            variable,
            message: `Undefined variable: ${variable}`,
          });
        }
      }

      if (variables.length > 0) {
        console.log(`   Found ${variables.length} variables`);
      }
    } catch (err) {
      errors.push({
        file,
        variable: null,
        message: `Error reading file: ${err.message}`,
      });
    }
  }

  console.log('\n' + '='.repeat(50));

  if (errors.length === 0) {
    console.log('✅ All SCSS variables are defined!');
    process.exit(0);
  } else {
    console.log(`❌ Found ${errors.length} undefined variables:\n`);

    for (const error of errors) {
      console.log(`   ${error.file}: ${error.message}`);
    }

    console.log('\n💡 Fix these issues before committing to avoid Storybook rendering errors.');
    process.exit(1);
  }
}

main();

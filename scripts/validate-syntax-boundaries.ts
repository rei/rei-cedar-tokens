import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const rules = {
  '.json': (content: string, filePath: string) => {
    try {
      JSON.parse(content);
      return [];
    } catch (e) {
      return [`[Syntax Drift]: File '${filePath}' is not valid JSON. Error: ${e}`];
    }
  },

  '.scss': (content: string, filePath: string) => {
    const errors: string[] = [];

    // SCSS should use $ variables, not CSS custom properties (unless explicitly mapped)
    if (
      !content.includes('$cdr-') &&
      !content.includes('$spacing-') &&
      !content.includes('@mixing') &&
      !content.includes('%cdr-') &&
      !content.includes('@forward') &&
      content.length > 50
    ) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' does not appear to contain SCSS variables (e.g., $cdr-...).`,
      );
    }

    // SCSS files should never contain TS/JS exports
    if (content.includes('export const ') || content.includes('module.exports')) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' contains JavaScript/TypeScript export statements.`,
      );
    }

    return errors;
  },

  '.css': (content: string, filePath: string) => {
    const errors: string[] = [];

    // CSS should use CSS custom properties (--var)
    if (
      !content.includes('--cdr-') &&
      !content.includes('--space-') &&
      !content.includes('@import') &&
      content.length > 50
    ) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' does not appear to contain CSS custom properties (e.g., --cdr-...).`,
      );
    }

    // CSS files should never contain SCSS variables or TS exports
    if (content.includes('$cdr-')) {
      errors.push(`[Syntax Drift]: File '${filePath}' contains SCSS variables ($).`);
    }
    if (content.includes('export const ')) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' contains JavaScript/TypeScript export statements.`,
      );
    }

    return errors;
  },

  '.ts': (content: string, filePath: string) => {
    const errors: string[] = [];

    // TS files should have export statements
    if (!content.includes('export ') && !content.includes('declare ')) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' is missing TypeScript export or declare statements.`,
      );
    }

    // TS files should not contain raw CSS or SCSS variable declarations
    if (content.includes('--cdr-') && !content.includes('`--cdr-')) {
      // Note: We allow `--cdr-` if it's inside a template literal (e.g., value is a CSS var)
      // but standalone `--cdr-` is a CSS syntax leak.
      const rawCSSRegex = /^[\s]*--[a-zA-Z0-9-]+:/m;
      if (rawCSSRegex.test(content)) {
        errors.push(
          `[Syntax Drift]: File '${filePath}' contains raw CSS syntax leaking into TypeScript.`,
        );
      }
    }

    if (content.includes('$cdr-')) {
      errors.push(
        `[Syntax Drift]: File '${filePath}' contains raw SCSS variables leaking into TypeScript.`,
      );
    }

    return errors;
  },
};

function runSyntaxBoundaryCheck() {
  console.log('********** Running Syntax Boundary & Drift Check on dist/rei-dot-com... **********');

  const outputFiles = globSync('dist/rei-dot-com/**/**/*.{css,scss,json,ts}');
  let totalErrors: string[] = [];

  outputFiles.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    const content = fs.readFileSync(file, 'utf-8');

    // Skip empty files
    if (content.trim().length === 0) {
      totalErrors.push(`[Syntax Drift]: File '${file}' is completely empty.`);
      return;
    }

    // Apply the specific rule based on the file extension
    if (rules[ext as keyof typeof rules]) {
      const fileErrors = rules[ext as keyof typeof rules](content, file);
      totalErrors = totalErrors.concat(fileErrors);
    }
  });

  if (totalErrors.length > 0) {
    console.error('\nSyntax Boundary Validation Failed:');
    totalErrors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(
    '********** Syntax Boundaries Validated Successfully. No format drifting detected. **********',
  );
}

runSyntaxBoundaryCheck();

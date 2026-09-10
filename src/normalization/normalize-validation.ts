import {
  extractColorMode,
  extractPrimitiveMode,
  type TokenMapping,
  type ParsedFile,
} from './normalize-utils.js';

export type ValidationLevel = 'warn' | 'error';

export type ValidationIssue = {
  level: ValidationLevel;
  code:
    | 'MISSING_OPTION_PRIMITIVE_MODE'
    | 'MISSING_MAPPED_COLLECTION'
    | 'EMPTY_COLLECTION_MAPPING'
    | 'UNMAPPED_IMPORTED_COLLECTION'
    | 'NO_ALIAS_COLOR_FILES'
    | 'NO_PARSED_FILES';
  message: string;
};

function expectedPrimitiveModesFromFiles(files: string[]): string[] {
  const primitiveModes = new Set<string>();
  for (const file of files) {
    const mode = extractPrimitiveMode(file);
    if (mode) primitiveModes.add(mode);
  }
  return Array.from(primitiveModes).sort();
}

export function validateFigmaInputs(params: {
  parsedFiles: Array<ParsedFile>;
  optionsFiles: Array<ParsedFile>;
  otherFiles: Array<ParsedFile>;
  tokenMapping: TokenMapping;
}): ValidationIssue[] {
  const { parsedFiles, optionsFiles, otherFiles, tokenMapping } = params;
  const issues: ValidationIssue[] = [];

  const mappedCollections = new Set(Object.keys(tokenMapping.collections ?? {}));

  for (const collection of mappedCollections) {
    const entry = tokenMapping.collections[collection];
    if (!entry || (entry.tokens !== 'auto' && Object.keys(entry.tokens ?? {}).length === 0)) {
      issues.push({
        level: 'error',
        code: 'EMPTY_COLLECTION_MAPPING',
        message:
          `Schema mapping for collection "${collection}" has no token mappings. ` +
          `Add inputs.figma.collections.${collection}.tokens entries in token-schema.json.`,
      });
    }
  }

  const importedPrimitiveModes = expectedPrimitiveModesFromFiles(
    optionsFiles.map(({ file }) => file),
  );

  // Require at least one primitive mode file to serve as canonical fallback
  if (importedPrimitiveModes.length === 0) {
    issues.push({
      level: 'error',
      code: 'MISSING_OPTION_PRIMITIVE_MODE',
      message:
        `No options.color.<mode>.json files were found. ` +
        `Normalization cannot proceed without at least one primitive mode file.`,
    });
  }

  // Warn if fewer than 2 modes (light/dark) are imported
  if (importedPrimitiveModes.length < 2) {
    issues.push({
      level: 'warn',
      code: 'MISSING_OPTION_PRIMITIVE_MODE',
      message:
        `Only ${
          importedPrimitiveModes.length
        } primitive mode file(s) found (${importedPrimitiveModes.join(', ')}). ` +
        `Expected at least 2 modes (e.g., light and dark) for full platform/appearance resolution.`,
    });
  }

  const importedCollections = new Set<string>();

  for (const { file, data } of optionsFiles) {
    for (const collectionName of Object.keys(data)) {
      importedCollections.add(collectionName);
      if (!mappedCollections.has(collectionName)) {
        issues.push({
          level: 'error',
          code: 'UNMAPPED_IMPORTED_COLLECTION',
          message:
            `Imported collection "${collectionName}" from ${file} is not mapped in token-schema.json. ` +
            `Add inputs.figma.collections.${collectionName}.`,
        });
      }
    }
  }

  for (const collectionName of mappedCollections) {
    if (!importedCollections.has(collectionName)) {
      issues.push({
        level: 'warn',
        code: 'MISSING_MAPPED_COLLECTION',
        message:
          `Mapped collection "${collectionName}" is not present in any imported options.*.*.json file. ` +
          `If this is intentional, no action is required; otherwise verify Figma export and mapping names.`,
      });
    }
  }

  const hasAliasColor = otherFiles.some(({ file }) => extractColorMode(file) !== null);
  if (!hasAliasColor) {
    issues.push({
      level: 'warn',
      code: 'NO_ALIAS_COLOR_FILES',
      message:
        `No alias.color.<mode>.json files were found. ` +
        `Only option/primitives data will be normalized for color.`,
    });
  }

  if (parsedFiles.length === 0) {
    issues.push({
      level: 'error',
      code: 'NO_PARSED_FILES',
      message: 'No token JSON files were parsed from tokens/.',
    });
  }

  return issues;
}

export function reportValidationIssues(issues: ValidationIssue[]) {
  const errors = issues.filter((issue) => issue.level === 'error');
  const warnings = issues.filter((issue) => issue.level === 'warn');

  if (warnings.length > 0) {
    console.warn('\n[normalize] Input validation warnings:');
    for (const warning of warnings) {
      console.warn(`  - [${warning.code}] ${warning.message}`);
    }
  }

  if (errors.length > 0) {
    const lines = errors.map((error) => `  - [${error.code}] ${error.message}`).join('\n');
    throw new Error(`Input validation failed with ${errors.length} error(s):\n${lines}`);
  }
}

import fs from 'fs';
import { globSync } from 'glob';
import semver from 'semver';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const CURRENT_VERSION = pkg.version;
const ALLOWED_FALLBACKS = ['options.color', 'options.space', 'options.font'];

const globalTokenRegistry = new Map<string, string>();
const errors: string[] = [];
const warnings: string[] = [];

function isAllowedFallback(reference: string): boolean {
  return ALLOWED_FALLBACKS.some((allowed) => reference.startsWith(allowed));
}

function validateDeprecationLifecycle(token: any, tokenName: string, filePath: string) {
  // If the file itself is a deprecation file, or the token has a deprecation object
  const { oldName, newName, introducedVersion, removalTargetVersion, migrationNote } = token;

  if (!oldName || !newName || !introducedVersion || !removalTargetVersion || !migrationNote) {
    errors.push(
      `[Rename Governance]: ${tokenName} in ${filePath} is missing required deprecation fields.`,
    );
    return;
  }

  const diff = semver.major(CURRENT_VERSION) - semver.major(introducedVersion);

  if (semver.gte(CURRENT_VERSION, removalTargetVersion)) {
    errors.push(
      `[Lifecycle N+2 Error]: Token ${oldName} has reached its removal target version (${removalTargetVersion}) and must be deleted.`,
    );
  } else if (diff === 1) {
    warnings.push(
      `[Lifecycle N+1 Warning]: Token ${oldName} is deprecated. Elevated warning: removal imminent in next major release. Migrate to ${newName}. Note: ${migrationNote}`,
    );
  } else {
    warnings.push(`[Lifecycle N Warning]: Token ${oldName} is deprecated. Migrate to ${newName}.`);
  }
}

function validateToken(token: any, currentPath: string[], filePath: string) {
  const tokenName = currentPath.join('.');
  const isDeprecationFile = filePath.includes('deprecated');

  // Rule: Duplicate Assignment Detection
  if (globalTokenRegistry.has(tokenName)) {
    errors.push(
      `[Duplicate Assignment]: ${tokenName} defined in ${filePath} AND ${globalTokenRegistry.get(
        tokenName,
      )}`,
    );
  }
  globalTokenRegistry.set(tokenName, filePath);

  // Skip standard metadata checks for deprecation files, route to governance
  if (isDeprecationFile) {
    validateDeprecationLifecycle(token, tokenName, filePath);
    return;
  }

  // Rule: Missing Metadata (Metadata-first enforcement)
  if (!token.docs || !token.docs.category || !token.docs.description) {
    errors.push(
      `[Missing Metadata]: ${tokenName} in ${filePath} lacks required 'docs', 'docs.category' or 'docs.description' fields.`,
    );
  }

  // Rule: Disallowed Fallback
  if (token.$value && typeof token.$value === 'string' && token.$value.includes('{')) {
    const references = token.$value.match(/\{([^}]+)\}/g);
    if (references) {
      references.forEach((ref: string) => {
        const cleanRef = ref.replace(/[{}]/g, '');
        if (!isAllowedFallback(cleanRef)) {
          errors.push(
            `[Disallowed Fallback]: ${tokenName} references '${cleanRef}' outside the allowlist.`,
          );
        }
      });
    }
  }
}

function traverseTokens(obj: any, currentPath: string[], filePath: string) {
  if (obj && typeof obj === 'object' && ('$value' in obj || 'oldName' in obj)) {
    // Added oldName to catch deprecations natively
    validateToken(obj, currentPath, filePath);
    return;
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      traverseTokens(obj[key], [...currentPath, key], filePath);
    }
  }
}

function runStaticAnalysis() {
  console.log('********** Running Token Contract Validation **********');
  const tokenFiles = globSync('tokens/global/*.json');

  tokenFiles.forEach((file) => {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    traverseTokens(content, [], file);
  });

  if (warnings.length > 0) {
    warnings.forEach((warn) => console.warn(`Warning: ${warn}`));
  }

  if (errors.length > 0) {
    console.error('\nToken Contract Validation Failed:');
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('********** Token Contract Validated Successfully **********\n');
}

runStaticAnalysis();

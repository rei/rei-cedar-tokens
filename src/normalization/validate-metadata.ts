import { isRecord, isTokenLeaf } from '../utils.js';

/**
 * validate-metadata.ts
 *
 * Validation for token metadata during build/CI. Checks for:
 *   1. Tokens in canonical with no metadata entry (unreviewed)
 *   2. Metadata entries for tokens that don't exist in canonical
 *     (orphaned or renamed governance)
 *   3. Deprecated tokens with missing deprecation guidance
 *   4. Tokens missing required governance fields (status, usage, etc.)
 *
 * Can run in warn-only mode (default) or strict/fail mode for CI.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { TokenMetadataManifest } from '../types/token-metadata.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const canonicalFile = path.resolve(repoRoot, 'canonical/tokens.json');
const metadataFile = path.resolve(repoRoot, 'metadata/tokens.json');

interface ValidationIssue {
  type: 'unreviewed' | 'orphaned' | 'incomplete' | 'deprecated-missing-migration';
  path: string;
  message: string;
  severity: 'warn' | 'error';
}

function collectCanonicalPaths(node: unknown, path: string[] = []): string[] {
  const paths: string[] = [];

  if (isTokenLeaf(node)) {
    paths.push(path.join('.'));
    return paths;
  }

  if (!isRecord(node)) {
    return paths;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    paths.push(...collectCanonicalPaths(child, [...path, key]));
  }

  return paths;
}

export async function validateMetadata(strict = false): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  if (!fs.existsSync(canonicalFile)) {
    console.warn(`⊘ canonical/tokens.json not found. Skipping validation.`);
    return issues;
  }

  const canonical = JSON.parse(fs.readFileSync(canonicalFile, 'utf-8'));
  const canonicalPaths = new Set(collectCanonicalPaths(canonical));

  let metadata: TokenMetadataManifest = {};
  if (fs.existsSync(metadataFile)) {
    metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
  }

  const metadataPaths = new Set(Object.keys(metadata));

  // ── Check 1: Unreviewed tokens (in canonical, no metadata entry) ──────────────
  for (const path of canonicalPaths) {
    if (!metadataPaths.has(path)) {
      issues.push({
        type: 'unreviewed',
        path,
        message: `No metadata entry for token "${path}"`,
        severity: 'warn',
      });
    }
  }

  // ── Check 2: Orphaned metadata (in metadata, but not in canonical) ───────────
  for (const path of metadataPaths) {
    if (!canonicalPaths.has(path)) {
      issues.push({
        type: 'orphaned',
        path,
        message: `Metadata entry for non-existent token "${path}" (token was removed or renamed?)`,
        severity: strict ? 'error' : 'warn',
      });
    }
  }

  // ── Check 3: Deprecated tokens missing migration guidance ───────────────────
  for (const [path, gov] of Object.entries(metadata)) {
    if (gov.status === 'deprecated') {
      if (!gov.deprecation?.migrateToToken) {
        issues.push({
          type: 'deprecated-missing-migration',
          path,
          message: `Deprecated token "${path}" has no deprecation.migrateToToken guidance`,
          severity: 'warn',
        });
      }
      if (!gov.deprecation?.removedIn) {
        issues.push({
          type: 'deprecated-missing-migration',
          path,
          message: `Deprecated token "${path}" has no deprecation.removedIn timeline`,
          severity: 'warn',
        });
      }
    }
  }

  // ── Check 4: Incomplete governance entries ────────────────────────────────────
  for (const [path, gov] of Object.entries(metadata)) {
    if (!gov.status) {
      issues.push({
        type: 'incomplete',
        path,
        message: `Metadata for "${path}" is missing required "status" field`,
        severity: strict ? 'error' : 'warn',
      });
    }
    if (gov.status !== 'unreviewed' && !gov.usage) {
      issues.push({
        type: 'incomplete',
        path,
        message: `Metadata for "${path}" (status: ${gov.status}) is missing "usage" guidance`,
        severity: 'warn',
      });
    }
  }

  return issues;
}

export function reportMetadataIssues(issues: ValidationIssue[], strict = false): number {
  if (issues.length === 0) {
    console.log('✓ No metadata validation issues.');
    return 0;
  }

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warns = issues.filter((i) => i.severity === 'warn').length;

  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '✗' : '⊘';
    console.log(`  ${icon} ${issue.type}: ${issue.message}`);
  }

  if (errors > 0) {
    console.error(`\n✗ ${errors} validation error(s) found.`);
    return 1;
  }

  if (warns > 0 && strict) {
    console.warn(`\n⊘ ${warns} validation warning(s) found (strict mode).`);
    return 1;
  }

  if (warns > 0) {
    console.warn(`\n⊘ ${warns} validation warning(s) found (non-strict mode — build continues).`);
    return 0;
  }

  return 0;
}

// CLI entrypoint
async function main() {
  const strict = process.argv.includes('--strict');
  const issues = await validateMetadata(strict);
  const exitCode = reportMetadataIssues(issues, strict);
  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Metadata validation failed:', error);
    process.exit(1);
  });
}

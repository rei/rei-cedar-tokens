/**
 * sync-metadata.ts
 *
 * Synchronizes metadata/tokens.json with canonical/tokens.json:
 *   1. Converts old hyphenated metadata keys to dot-notation.
 *   2. Removes orphaned metadata entries that no longer exist in canonical.
 *   3. Adds default governance metadata entries for newly discovered tokens.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const canonicalFile = path.resolve(repoRoot, 'canonical/tokens.json');
const metadataFile = path.resolve(repoRoot, 'metadata/tokens.json');

function isTokenLeaf(node: unknown): boolean {
  return typeof node === 'object' && node !== null && '$value' in node;
}

function collectCanonicalPaths(node: unknown, currentPath: string[] = []): string[] {
  const paths: string[] = [];

  if (isTokenLeaf(node)) {
    paths.push(currentPath.join('.'));
    return paths;
  }

  if (typeof node !== 'object' || node === null) {
    return paths;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    paths.push(...collectCanonicalPaths(child, [...currentPath, key]));
  }

  return paths;
}

function syncMetadata() {
  if (!fs.existsSync(canonicalFile)) {
    console.error('✗ canonical/tokens.json not found. Run pnpm build first.');
    process.exit(1);
  }

  const canonical = JSON.parse(fs.readFileSync(canonicalFile, 'utf-8'));
  const canonicalPaths = new Set(collectCanonicalPaths(canonical));

  let existingMetadata: Record<string, any> = {};
  if (fs.existsSync(metadataFile)) {
    existingMetadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
  }

  const updatedMetadata: Record<string, any> = {};

  // 1. Migrate existing metadata keys (convert hyphens to dots if needed)
  for (const [oldKey, value] of Object.entries(existingMetadata)) {
    const dotKey = oldKey.replace(/-/g, '.');

    if (canonicalPaths.has(dotKey)) {
      updatedMetadata[dotKey] = value;
    } else if (canonicalPaths.has(oldKey)) {
      updatedMetadata[oldKey] = value;
    } else {
      console.log(`  - Removed orphaned metadata: "${oldKey}"`);
    }
  }

  // 2. Add default entries for new / unreviewed tokens
  let addedCount = 0;
  for (const tokenPath of canonicalPaths) {
    if (!updatedMetadata[tokenPath]) {
      updatedMetadata[tokenPath] = {
        status: 'unreviewed',
        usage: 'Token automatically added during metadata sync.',
      };
      addedCount++;
    }
  }

  // 3. Write back sorted metadata file
  const sortedMetadata = Object.keys(updatedMetadata)
    .sort()
    .reduce((acc: Record<string, any>, key) => {
      acc[key] = updatedMetadata[key];
      return acc;
    }, {});

  fs.writeFileSync(metadataFile, JSON.stringify(sortedMetadata, null, 2), 'utf-8');

  console.log(`\n✓ Metadata synchronization complete:`);
  console.log(`  - Total valid metadata entries: ${Object.keys(sortedMetadata).length}`);
  console.log(`  - New tokens initialized: ${addedCount}`);
}

syncMetadata();

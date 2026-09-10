/**
 * src/snapshot.ts
 *
 * Captures the current normalized token tree as either the baseline or the
 * current snapshot used by the Semantic Diff story in Storybook.
 *
 * The current snapshot also archives a timestamped copy under
 * canonical/snapshots/ and updates canonical/snapshots/index.json so
 * Storybook can browse and compare historical PR snapshots.
 *
 * Usage:
 *   pnpm tokens:snapshot baseline   # save as dist/normalized/baseline.json
 *   pnpm tokens:snapshot current    # save as dist/normalized/current.json
 *
 * Source: canonical/tokens.json  (produced by `pnpm tokens:normalize`)
 * Dest:   dist/normalized/<slot>.json
 * Archive: canonical/snapshots/<timestamp>.json  (current slot only)
 *
 * The script is intentionally minimal — it reads canonical/tokens.json verbatim and
 * writes it to the target path. No transformation is applied; the diff engine
 * in stories/lib/diff-engine.ts handles all semantic interpretation at render
 * time.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface SnapshotManifestEntry {
  id: string;
  createdAt: string;
  slot: 'current';
  label: string;
  file: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ─── Validate argument ────────────────────────────────────────────────────────

const slot = process.argv[2];

if (slot !== 'baseline' && slot !== 'current') {
  console.error(
    'Usage: pnpm tokens:snapshot <baseline|current>\n' +
      '\n' +
      '  baseline  — save the current canonical/tokens.json as the "before" snapshot\n' +
      '  current   — save the current canonical/tokens.json as the "after" snapshot\n',
  );
  process.exit(1);
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const src = path.join(root, 'canonical/tokens.json');
const destDir = path.join(root, 'dist/normalized');
const dest = path.join(destDir, `${slot}.json`);
const archiveDir = path.join(root, 'canonical/snapshots');
const timestamp = new Date().toISOString();
const snapshotId = timestamp.replace(/[:.]/g, '-');
const manifestFile = path.join(archiveDir, 'index.json');

// ─── Read source ──────────────────────────────────────────────────────────────

if (!fs.existsSync(src)) {
  console.error(
    `Source file not found: ${src}\n` +
      '\n' +
      'Run the normalization pipeline first:\n' +
      '  pnpm tokens:normalize\n',
  );
  process.exit(1);
}

const raw = fs.readFileSync(src, 'utf-8');

// Validate it is parseable JSON before writing
try {
  JSON.parse(raw);
} catch (e) {
  console.error(`canonical/tokens.json is not valid JSON: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
}

// ─── Write dest ───────────────────────────────────────────────────────────────

fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(dest, raw, 'utf-8');

let archivePath: string | null = null;

if (slot === 'current') {
  fs.mkdirSync(archiveDir, { recursive: true });
  const archiveFile = path.join(archiveDir, `${snapshotId}.json`);
  const archiveRel = path.relative(path.join(root, 'canonical'), archiveFile).replaceAll('\\', '/');
  fs.writeFileSync(archiveFile, raw, 'utf-8');

  const manifest: SnapshotManifestEntry[] = fs.existsSync(manifestFile)
    ? (JSON.parse(fs.readFileSync(manifestFile, 'utf-8')) as SnapshotManifestEntry[])
    : [];

  manifest.unshift({
    id: snapshotId,
    createdAt: timestamp,
    slot: 'current',
    label: timestamp,
    file: archiveRel,
  });

  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  archivePath = archiveFile;
}

const rel = path.relative(root, dest);
const srcRel = path.relative(root, src);
console.log(`✓ Snapshot written: ${srcRel} → ${rel}`);
console.log(`  Slot: ${slot}`);
if (archivePath) {
  console.log(`  Archive: ${path.relative(root, archivePath)}`);
  console.log(`  Manifest: ${path.relative(root, manifestFile)}`);
}

if (slot === 'baseline') {
  console.log('\nNext: make your token changes, re-run pnpm tokens:normalize, then:');
  console.log('  pnpm tokens:snapshot current');
  console.log('  pnpm storybook  # open Cedar Tokens / Semantic Diff / Live Diff');
} else {
  console.log('\nRestart Storybook to pick up the new files:');
  console.log('  pnpm storybook  # open Cedar Tokens / Semantic Diff / Live Diff');
}

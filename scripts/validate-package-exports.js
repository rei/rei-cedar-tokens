// validate-package-exports.js
//
// Validates that every entry in package.json's "exports" map resolves to a
// file that actually exists in dist/ after a build. This is a build-time
// consumer-contract check (Doc 03 Story 3.3: "test consumer imports across
// all entrypoints") — it catches two classes of bug:
//
//   1. An export target path that doesn't exist (typo, stale path, a build
//      step that was supposed to produce the file but didn't run).
//   2. A subpath pattern ("./foo/*") whose wildcard substitution convention
//      doesn't match any real file for a representative sample subpath —
//      i.e. the pattern looks right but nothing a consumer would plausibly
//      import actually resolves.
//
// Run after `pnpm build:package` (dist/ and legacy-dist merge must exist).
// All wildcard export targets in this package put "*" inside the filename
// itself (e.g. "cdr-*.css", "*.mjs"), not across directory boundaries, so
// prefix/suffix matching within a single directory is sufficient here.

import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(process.cwd());
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const exportsMap = pkg.exports ?? {};

/**
 * Flatten a conditional exports value ({types, import, require, default, ...}
 * or a plain string) into a list of target path templates.
 */
function collectTargets(value, out = []) {
  if (typeof value === 'string') {
    out.push(value);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectTargets(v, out);
  }
  return out;
}

/**
 * For a pattern target like "./dist/foo/cdr-*.css", find a real file in
 * "./dist/foo" whose name matches the "cdr-" / ".css" prefix+suffix, and
 * return its full path — or null if no file matches.
 */
function resolvePatternSample(targetTemplate) {
  const starIdx = targetTemplate.indexOf('*');
  const beforeStar = targetTemplate.slice(0, starIdx); // e.g. ".../js/" or ".../foundations/cdr-"
  const suffix = targetTemplate.slice(starIdx + 1); // e.g. ".d.ts"

  // Split beforeStar into its directory and file-prefix parts manually
  // (rather than path.dirname/basename, which mishandle a trailing "/" by
  // treating the last path segment as the basename instead of an empty
  // file prefix).
  const lastSlash = beforeStar.lastIndexOf('/');
  const dirPart = beforeStar.slice(0, lastSlash);
  const filePrefix = beforeStar.slice(lastSlash + 1);

  const dir = path.join(rootDir, dirPart);
  if (!fs.existsSync(dir)) return null;

  const match = fs
    .readdirSync(dir)
    .find((name) => name.startsWith(filePrefix) && name.endsWith(suffix));

  return match ? path.join(dir, match) : null;
}

const errors = [];
let checkedExact = 0;
let checkedPatterns = 0;

for (const [specifier, value] of Object.entries(exportsMap)) {
  if (specifier === './package.json') continue; // always resolves to itself, no dist dependency

  for (const target of collectTargets(value)) {
    if (target.includes('*')) {
      checkedPatterns++;
      const sample = resolvePatternSample(target);
      if (!sample) {
        errors.push(
          `Pattern export "${specifier}" -> "${target}": could not find any real file in ` +
            `${path.dirname(target)} matching the wildcard convention. The pattern may not ` +
            `match how consumers actually import from this subpath.`,
        );
      }
    } else {
      checkedExact++;
      const resolvedPath = path.join(rootDir, target);
      if (!fs.existsSync(resolvedPath)) {
        errors.push(
          `Export "${specifier}" -> "${target}": file does not exist at ${resolvedPath}.`,
        );
      }
    }
  }
}

console.log(`\n==============================================`);
console.log(`Validating package.json exports map`);
console.log(`  Checked ${checkedExact} exact export target(s)`);
console.log(`  Checked ${checkedPatterns} pattern export target(s)`);

if (errors.length > 0) {
  console.error(`\n${errors.length} export validation error(s):\n`);
  for (const err of errors) console.error(`  ✗ ${err}`);
  console.log(`==============================================\n`);
  process.exit(1);
}

console.log(`  ✓ All export targets resolve to real files`);
console.log(`==============================================\n`);

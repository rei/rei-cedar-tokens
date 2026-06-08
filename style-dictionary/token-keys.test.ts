/**
 * Regression tests: runtime key arrays for token modules.
 *
 * Verifies that generated .keys.mjs files exist and export the same canonical
 * semantic keys as the source token modules.
 */
import { describe, expect, it, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_ROOT = resolve(__dirname, '../dist/rei-dot-com');
const BP_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-breakpoint.mjs');
const BP_KEYS_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-breakpoint.keys.mjs');
const SPACE_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-space.mjs');
const SPACE_KEYS_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-space.keys.mjs');
const COLOR_BACKGROUND_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-color-background.mjs');
const COLOR_BACKGROUND_KEYS_MJS = resolve(
  DIST_ROOT,
  'types/foundations/cdr-color-background.keys.mjs',
);

const distFilesExist = [
  BP_MJS,
  BP_KEYS_MJS,
  SPACE_MJS,
  SPACE_KEYS_MJS,
  COLOR_BACKGROUND_MJS,
  COLOR_BACKGROUND_KEYS_MJS,
].every(existsSync);

function toSemanticKey(tokenName: string, prefix: string): string {
  const withoutPrefix = tokenName.startsWith(prefix) ? tokenName.slice(prefix.length) : tokenName;
  return withoutPrefix
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function deriveExpectedKeys(srcPath: string, prefix: string): string[] {
  const src = readFileSync(srcPath, 'utf8');
  const keys = [...src.matchAll(/export const (\w+) = /g)].map((match) =>
    toSemanticKey(match[1], prefix),
  );

  return [...new Set(keys)].sort((left, right) => left.localeCompare(right));
}

function parseRuntimeArray(mjsPath: string, exportName: string): string[] {
  const src = readFileSync(mjsPath, 'utf8');
  const match = src.match(new RegExp(`export const ${exportName} = (\\[[\\s\\S]*?\\]);`));
  expect(match).not.toBeNull();
  return JSON.parse(match![1].replace(/,\s*\]$/, ']'));
}

describe.skipIf(!distFilesExist)('Runtime token key arrays', () => {
  let expectedBreakpointKeys: string[];
  let expectedSpaceKeys: string[];
  let expectedColorBackgroundKeys: string[];

  beforeAll(() => {
    expectedBreakpointKeys = deriveExpectedKeys(BP_MJS, 'CdrBreakpoint');
    expectedSpaceKeys = deriveExpectedKeys(SPACE_MJS, 'CdrSpace');
    expectedColorBackgroundKeys = deriveExpectedKeys(COLOR_BACKGROUND_MJS, 'CdrColorBackground');
  });

  it('exports breakpoint keys as a runtime array', () => {
    expect(parseRuntimeArray(BP_KEYS_MJS, 'CdrBreakpointKeys')).toEqual(expectedBreakpointKeys);
  });

  it('exports space keys as a runtime array', () => {
    expect(parseRuntimeArray(SPACE_KEYS_MJS, 'CdrSpaceKeys')).toEqual(expectedSpaceKeys);
  });

  it('exports color background keys as a runtime array', () => {
    expect(parseRuntimeArray(COLOR_BACKGROUND_KEYS_MJS, 'CdrColorBackgroundKeys')).toEqual(
      expectedColorBackgroundKeys,
    );
  });
});

/**
 * Regression tests: ordered token modules in dist artifacts.
 *
 * Verifies that after a build:
 * 1. Runtime order arrays match expected canonical ordering
 * 2. .d.ts declarations match .mjs arrays and use readonly tuples
 * 3. Root and ./types barrel re-exports use extensionless paths
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_ROOT = resolve(__dirname, '../dist/rei-dot-com');
const BP_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-breakpoint.mjs');
const BP_ORDER_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-breakpoint-order.mjs');
const BP_ORDER_DTS = resolve(DIST_ROOT, 'types/foundations/cdr-breakpoint-order.d.ts');
const SPACE_SCALE_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-space-scale.mjs');
const SPACE_SCALE_ORDER_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-space-scale-order.mjs');
const SPACE_SCALE_ORDER_DTS = resolve(DIST_ROOT, 'types/foundations/cdr-space-scale-order.d.ts');
const TEXT_SIZE_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-text-size.mjs');
const TEXT_SIZE_ORDER_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-text-size-order.mjs');
const TEXT_SIZE_ORDER_DTS = resolve(DIST_ROOT, 'types/foundations/cdr-text-size-order.d.ts');
const INDEX_DTS = resolve(DIST_ROOT, 'types/index.d.ts');
const TOKENS_DTS = resolve(DIST_ROOT, 'types/tokens.d.ts');

const distFilesExist = [
  BP_MJS,
  BP_ORDER_MJS,
  BP_ORDER_DTS,
  SPACE_SCALE_MJS,
  SPACE_SCALE_ORDER_MJS,
  SPACE_SCALE_ORDER_DTS,
  TEXT_SIZE_MJS,
  TEXT_SIZE_ORDER_MJS,
  TEXT_SIZE_ORDER_DTS,
  INDEX_DTS,
  TOKENS_DTS,
].every(existsSync);

function toSemanticKey(tokenName: string, prefix: string): string {
  const withoutPrefix = tokenName.startsWith(prefix) ? tokenName.slice(prefix.length) : tokenName;
  return withoutPrefix
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function spaceScaleRank(semanticKey: string): number {
  if (!/^\d+$/.test(semanticKey)) {
    return Number.POSITIVE_INFINITY;
  }
  if (semanticKey.length === 1) {
    return Number.parseInt(semanticKey, 10);
  }
  if (semanticKey.startsWith('0')) {
    return Number.parseFloat(`0.${semanticKey.slice(1)}`);
  }
  return Number.parseFloat(`${semanticKey[0]}.${semanticKey.slice(1)}`);
}

/**
 * Derive canonical breakpoint order from cdr-breakpoint.mjs — same algorithm as build.ts.
 */
function deriveExpectedOrder(): string[] {
  const src = readFileSync(BP_MJS, 'utf8');
  const entries: Array<[string, number]> = [];
  for (const match of src.matchAll(/export const CdrBreakpoint(\w+) = "(\d+)"/g)) {
    entries.push([match[1].toLowerCase(), parseInt(match[2])]);
  }
  entries.sort((a, b) => a[1] - b[1]);
  return entries.map(([key]) => key);
}

function deriveExpectedSpaceScaleOrder(): string[] {
  const src = readFileSync(SPACE_SCALE_MJS, 'utf8');
  const entries: Array<{ key: string }> = [];
  for (const match of src.matchAll(/export const (\w+) = "([^"]+)"/g)) {
    entries.push({
      key: toSemanticKey(match[1], 'CdrSpaceScale'),
    });
  }
  entries.sort((a, b) => {
    const rankDiff = spaceScaleRank(a.key) - spaceScaleRank(b.key);
    if (rankDiff !== 0) {
      return rankDiff;
    }
    return a.key.localeCompare(b.key);
  });
  return entries.map((entry) => entry.key);
}

function deriveExpectedTextSizeOrder(): string[] {
  const src = readFileSync(TEXT_SIZE_MJS, 'utf8');
  const entries: Array<{ key: string; numeric: number }> = [];
  for (const match of src.matchAll(/export const (\w+) = "(\d+)"/g)) {
    entries.push({
      key: toSemanticKey(match[1], 'CdrTextSize'),
      numeric: Number.parseInt(match[2], 10),
    });
  }
  entries.sort((a, b) => {
    const numericDiff = a.numeric - b.numeric;
    if (numericDiff !== 0) {
      return numericDiff;
    }
    return a.key.localeCompare(b.key);
  });
  return entries.map((entry) => entry.key);
}

function parseReadonlyTuple(dtsPath: string): string[] {
  const dts = readFileSync(dtsPath, 'utf8');
  const match = dts.match(/readonly (\[.*?\])/s);
  expect(match).not.toBeNull();
  return JSON.parse(match![1]);
}

describe.skipIf(!distFilesExist)('Ordered dist artifacts (skipped if dist not built)', () => {
  let expectedBreakpointOrder: string[];
  let expectedSpaceScaleOrder: string[];
  let expectedTextSizeOrder: string[];

  beforeAll(() => {
    expectedBreakpointOrder = deriveExpectedOrder();
    expectedSpaceScaleOrder = deriveExpectedSpaceScaleOrder();
    expectedTextSizeOrder = deriveExpectedTextSizeOrder();
  });

  it('derives non-empty expected order arrays', () => {
    expect(expectedBreakpointOrder.length).toBeGreaterThan(0);
    expect(expectedSpaceScaleOrder.length).toBeGreaterThan(0);
    expect(expectedTextSizeOrder.length).toBeGreaterThan(0);
  });

  it('cdr-breakpoint-order.mjs runtime array matches token values sorted by px', async () => {
    const mod = await import(BP_ORDER_MJS);
    expect(Array.isArray(mod.CdrBreakpointOrder)).toBe(true);
    expect([...mod.CdrBreakpointOrder]).toEqual(expectedBreakpointOrder);
  });

  it('cdr-space-scale-order.mjs runtime array matches canonical scale order', async () => {
    const mod = await import(SPACE_SCALE_ORDER_MJS);
    expect(Array.isArray(mod.CdrSpaceScaleOrder)).toBe(true);
    expect([...mod.CdrSpaceScaleOrder]).toEqual(expectedSpaceScaleOrder);
  });

  it('cdr-text-size-order.mjs runtime array matches canonical text size order', async () => {
    const mod = await import(TEXT_SIZE_ORDER_MJS);
    expect(Array.isArray(mod.CdrTextSizeOrder)).toBe(true);
    expect([...mod.CdrTextSizeOrder]).toEqual(expectedTextSizeOrder);
  });

  it('order .d.ts files declare readonly tuples matching runtime order', () => {
    const bpDts = readFileSync(BP_ORDER_DTS, 'utf8');
    const spaceDts = readFileSync(SPACE_SCALE_ORDER_DTS, 'utf8');
    const textDts = readFileSync(TEXT_SIZE_ORDER_DTS, 'utf8');
    expect(bpDts).toMatch(/readonly \[/);
    expect(spaceDts).toMatch(/readonly \[/);
    expect(textDts).toMatch(/readonly \[/);
    expect(bpDts).not.toMatch(/as const/);
    expect(spaceDts).not.toMatch(/as const/);
    expect(textDts).not.toMatch(/as const/);

    expect(parseReadonlyTuple(BP_ORDER_DTS)).toEqual(expectedBreakpointOrder);
    expect(parseReadonlyTuple(SPACE_SCALE_ORDER_DTS)).toEqual(expectedSpaceScaleOrder);
    expect(parseReadonlyTuple(TEXT_SIZE_ORDER_DTS)).toEqual(expectedTextSizeOrder);
  });

  it('index.d.ts re-exports order modules with extensionless paths', () => {
    const dts = readFileSync(INDEX_DTS, 'utf8');
    expect(dts).toContain("from './foundations/cdr-breakpoint-order'");
    expect(dts).toContain("from './foundations/cdr-space-scale-order'");
    expect(dts).toContain("from './foundations/cdr-text-size-order'");
    // Must NOT use .d.ts extension (TS2846)
    expect(dts).not.toContain("from './foundations/cdr-breakpoint-order.d.ts'");
    expect(dts).not.toContain("from './foundations/cdr-space-scale-order.d.ts'");
    expect(dts).not.toContain("from './foundations/cdr-text-size-order.d.ts'");
  });

  it('index.d.ts uses extensionless paths for all re-exports', () => {
    const dts = readFileSync(INDEX_DTS, 'utf8');
    const badPaths = [...dts.matchAll(/from '\.\/foundations\/.*?\.d\.ts'/g)];
    expect(badPaths).toHaveLength(0);
  });

  it('tokens.d.ts re-exports all order modules with extensionless paths', () => {
    const dts = readFileSync(TOKENS_DTS, 'utf8');
    expect(dts).toContain("from './foundations/cdr-breakpoint-order'");
    expect(dts).toContain("from './foundations/cdr-space-scale-order'");
    expect(dts).toContain("from './foundations/cdr-text-size-order'");
    expect(dts).not.toContain("from './foundations/cdr-breakpoint-order.d.ts'");
    expect(dts).not.toContain("from './foundations/cdr-space-scale-order.d.ts'");
    expect(dts).not.toContain("from './foundations/cdr-text-size-order.d.ts'");
  });
});

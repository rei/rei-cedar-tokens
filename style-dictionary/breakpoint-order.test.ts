/**
 * Regression test: CdrBreakpointOrder dist artifact sync
 *
 * Verifies that after a build:
 * 1. The runtime order array matches breakpoint tokens sorted by px value
 * 2. The .d.ts declaration matches the .mjs runtime array
 * 3. The @rei/cdr-tokens/types barrel also exposes the same order
 *
 * This test guards against the order array drifting from actual token values
 * and against generator bugs that break the .d.ts (e.g. 'as const' in declaration files,
 * or .d.ts extension specifiers).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST_ROOT = resolve(__dirname, '../dist/rei-dot-com');
const BP_MJS = resolve(DIST_ROOT, 'js/foundations/cdr-breakpoint.mjs');
const BP_ORDER_MJS = resolve(DIST_ROOT, 'types/foundations/cdr-breakpoint-order.mjs');
const BP_ORDER_DTS = resolve(DIST_ROOT, 'types/foundations/cdr-breakpoint-order.d.ts');
const INDEX_DTS = resolve(DIST_ROOT, 'types/index.d.ts');
const TOKENS_DTS = resolve(DIST_ROOT, 'types/tokens.d.ts');

const distFilesExist = [BP_MJS, BP_ORDER_MJS, BP_ORDER_DTS, INDEX_DTS, TOKENS_DTS].every(
  existsSync,
);

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

describe.skipIf(!distFilesExist)(
  'CdrBreakpointOrder dist artifact (skipped if dist not built)',
  () => {
    let expectedOrder: string[];

    beforeAll(() => {
      expectedOrder = deriveExpectedOrder();
    });

    it('derives a non-empty order array from cdr-breakpoint.mjs', () => {
      expect(expectedOrder.length).toBeGreaterThan(0);
    });

    it('cdr-breakpoint-order.mjs runtime array matches token values sorted by px', async () => {
      const mod = await import(BP_ORDER_MJS);
      expect(Array.isArray(mod.CdrBreakpointOrder)).toBe(true);
      expect([...mod.CdrBreakpointOrder]).toEqual(expectedOrder);
    });

    it('cdr-breakpoint-order.d.ts declares readonly tuple matching runtime order', () => {
      const dts = readFileSync(BP_ORDER_DTS, 'utf8');
      // Verify readonly tuple syntax (not 'as const' which is invalid in .d.ts)
      expect(dts).toMatch(/readonly \[/);
      expect(dts).not.toMatch(/as const/);

      // Extract declared values from the readonly tuple
      const match = dts.match(/readonly (\[.*?\])/s);
      expect(match).not.toBeNull();
      const declared: string[] = JSON.parse(match![1]);
      expect(declared).toEqual(expectedOrder);
    });

    it('index.d.ts re-exports CdrBreakpointOrder with extensionless path', () => {
      const dts = readFileSync(INDEX_DTS, 'utf8');
      expect(dts).toContain("from './foundations/cdr-breakpoint-order'");
      // Must NOT use .d.ts extension (TS2846)
      expect(dts).not.toContain("from './foundations/cdr-breakpoint-order.d.ts'");
    });

    it('index.d.ts uses extensionless paths for all re-exports', () => {
      const dts = readFileSync(INDEX_DTS, 'utf8');
      const badPaths = [...dts.matchAll(/from '\.\/foundations\/.*?\.d\.ts'/g)];
      expect(badPaths).toHaveLength(0);
    });

    it('tokens.d.ts re-exports CdrBreakpointOrder with extensionless path', () => {
      const dts = readFileSync(TOKENS_DTS, 'utf8');
      expect(dts).toContain("from './foundations/cdr-breakpoint-order'");
      expect(dts).not.toContain("from './foundations/cdr-breakpoint-order.d.ts'");
    });
  },
);

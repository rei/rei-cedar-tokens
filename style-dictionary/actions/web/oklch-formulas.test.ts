import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  hexToCustomOklch,
  calculateChroma,
  buildCustomOklch,
  COLOR_FAMILIES,
  LMAX,
  LMIN,
} from './oklch-formulas.js';

/**
 * Read colorFamily names from token-schema.json dynamically.
 * This ensures tests automatically cover new families added to the schema
 * without hardcoding palette names in the test file.
 */
function getSchemaColorFamilies(): string[] {
  const schemaPath = path.resolve(__dirname, '../../../src/schema/token-schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const collections = schema.inputs?.figma?.collections ?? {};

  return Object.values(collections)
    .filter((c: any) => typeof c.colorFamily === 'string')
    .map((c: any) => c.colorFamily as string);
}

/** Parse oklch(L% C H) or oklch(L% C H / A) into components */
function parseOklch(str: string): { l: number; c: number; h: number } {
  const m = str.match(/oklch\(([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) throw new Error(`Cannot parse oklch string: ${str}`);
  let l = parseFloat(m[1]);
  if (m[2] === '%') l = l / 100;
  return { l, c: parseFloat(m[3]), h: parseFloat(m[4]) };
}

describe('oklch-formulas', () => {
  describe('calculateChroma', () => {
    it('peaks at Lo and returns Cmax', () => {
      for (const [name, family] of Object.entries(COLOR_FAMILIES)) {
        const peak = calculateChroma(family.lo, family);
        expect(peak, `${name} peak`).toBeCloseTo(family.cmax, 4);
      }
    });

    it('returns values between Cmin and Cmax for all families across L range', () => {
      for (const [name, family] of Object.entries(COLOR_FAMILIES)) {
        for (let l = LMIN; l <= LMAX; l += 0.05) {
          const c = calculateChroma(l, family);
          const cmin = l >= family.lo ? family.clightMin : family.cdarkMin;
          expect(c, `${name} at L=${l.toFixed(2)}`).toBeGreaterThanOrEqual(cmin - 1e-10);
          expect(c, `${name} at L=${l.toFixed(2)}`).toBeLessThanOrEqual(family.cmax + 1e-10);
        }
      }
    });

    it('clamps lightness to valid range without throwing', () => {
      for (const family of Object.values(COLOR_FAMILIES)) {
        expect(calculateChroma(-0.5, family)).toBeGreaterThanOrEqual(0);
        expect(calculateChroma(2.0, family)).toBeGreaterThanOrEqual(0);
      }
    });

    it('throws on non-finite lightness instead of silently returning NaN', () => {
      const family = Object.values(COLOR_FAMILIES)[0];
      expect(() => calculateChroma(NaN, family)).toThrow(/non-finite/);
      expect(() => calculateChroma(Infinity, family)).toThrow(/non-finite/);
      expect(() => calculateChroma(-Infinity, family)).toThrow(/non-finite/);
    });
  });

  describe('buildCustomOklch', () => {
    it('throws for a color value that cannot be parsed', () => {
      expect(() => buildCustomOklch('not-a-color', 'warm-grey')).toThrow();
    });

    it('reports a lightness consistent with the chroma it computed, even at gamut extremes', () => {
      // Regression test: previously `l` was returned unclamped while `c` was
      // computed from a lightness clamped to [LMIN, LMAX] internally, so a
      // near-black/near-white token could report an L that didn't match the
      // chroma value actually used. Both must now reflect the same clamped L.
      const family = COLOR_FAMILIES['warm-grey'];

      const black = buildCustomOklch('#000000', 'warm-grey');
      const white = buildCustomOklch('#ffffff', 'warm-grey');

      expect(black.l).toBeGreaterThanOrEqual(LMIN);
      expect(black.l).toBeLessThanOrEqual(LMAX);
      expect(black.c).toBeCloseTo(calculateChroma(black.l, family), 10);

      expect(white.l).toBeGreaterThanOrEqual(LMIN);
      expect(white.l).toBeLessThanOrEqual(LMAX);
      expect(white.c).toBeCloseTo(calculateChroma(white.l, family), 10);
    });

    it('does not clamp lightness for the culori-passthrough path (no color family)', () => {
      // Clamping only applies to the custom parabolic-chroma formula path;
      // passthrough colors (Storybook previews, etc.) should keep culori's
      // raw lightness.
      const black = buildCustomOklch('#000000');
      expect(black.l).toBeLessThan(LMIN);
    });
  });

  describe('hexToCustomOklch', () => {
    it('produces valid OKLCH syntax for known color family', () => {
      const result = hexToCustomOklch('#EDEAE3', 'warm-grey');
      expect(result).toMatch(/^oklch\(\d+(\.\d+)?%\s+\d+(\.\d+)?\s+\d+(\.\d+)?\)$/);
    });

    it('falls back to culori for unmapped colors (no family)', () => {
      const result = hexToCustomOklch('#FFFFFF');
      expect(result).toMatch(/^oklch\(\d+(\.\d+)?%\s+\d+(\.\d+)?\s+\d+(\.\d+)?\)$/);
    });

    it('is deterministic — same inputs always produce same output', () => {
      const hex = '#EDEAE3';
      const result1 = hexToCustomOklch(hex, 'warm-grey');
      const result2 = hexToCustomOklch(hex, 'warm-grey');
      expect(result1).toBe(result2);
    });

    it('handles alpha channel in 8-digit hex', () => {
      const result = hexToCustomOklch('#EDEAE380', 'warm-grey');
      expect(result).toMatch(
        /^oklch\(\d+(\.\d+)?%\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?\)$/,
      );
    });

    it('uses family hue (not culori hue) when color family is provided', () => {
      for (const [name, family] of Object.entries(COLOR_FAMILIES)) {
        const result = hexToCustomOklch('#888888', name);
        const parsed = parseOklch(result);
        expect(parsed.h, `${name} hue`).toBe(family.hue);
      }
    });

    it('produces different chroma for different families given same hex', () => {
      const hex = '#888888';
      const results = Object.keys(COLOR_FAMILIES).map((name) => ({
        name,
        chroma: parseOklch(hexToCustomOklch(hex, name)).c,
      }));

      // Not all families should have the same chroma for a mid-grey
      const unique = new Set(results.map((r) => r.chroma));
      expect(unique.size).toBeGreaterThan(1);
    });

    it('warns and falls back to culori for unknown color family', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = hexToCustomOklch('#EDEAE3', 'nonexistent-family');

      expect(spy).toHaveBeenCalledOnce();
      expect(spy.mock.calls[0][0]).toContain('nonexistent-family');
      expect(result).toMatch(/^oklch\(/);

      spy.mockRestore();
    });
  });

  describe('schema-driven coverage', () => {
    /**
     * Dynamically reads color families from token-schema.json and verifies
     * that every family declared in the schema has a corresponding entry
     * in COLOR_FAMILIES. This ensures the Figma sync and formula params
     * stay in sync — when a new family is added to the schema, this test
     * will fail until COLOR_FAMILIES is updated with formula parameters.
     */
    const schemaFamilies = getSchemaColorFamilies();

    it('token-schema declares at least one color family', () => {
      expect(schemaFamilies.length).toBeGreaterThan(0);
    });

    for (const familyName of schemaFamilies) {
      it(`COLOR_FAMILIES has formula params for schema family "${familyName}"`, () => {
        expect(
          COLOR_FAMILIES[familyName],
          `Missing COLOR_FAMILIES entry for "${familyName}". ` +
            `Add formula parameters (hue, cmax, lo, wlight, clightMin, wdark, cdarkMin) ` +
            `to COLOR_FAMILIES in oklch-formulas.ts.`,
        ).toBeDefined();
      });
    }

    it('every COLOR_FAMILIES entry has valid parameter ranges', () => {
      for (const [name, f] of Object.entries(COLOR_FAMILIES)) {
        expect(f.hue, `${name}.hue`).toBeGreaterThanOrEqual(0);
        expect(f.hue, `${name}.hue`).toBeLessThan(360);
        expect(f.cmax, `${name}.cmax`).toBeGreaterThanOrEqual(0);
        expect(f.lo, `${name}.lo`).toBeGreaterThan(LMIN);
        expect(f.lo, `${name}.lo`).toBeLessThan(LMAX);
        expect(f.wlight, `${name}.wlight`).toBeGreaterThan(0);
        expect(f.wdark, `${name}.wdark`).toBeGreaterThan(0);
        expect(f.clightMin, `${name}.clightMin`).toBeGreaterThanOrEqual(0);
        expect(f.cdarkMin, `${name}.cdarkMin`).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

/**
 * normalize-utils.test.ts
 *
 * Unit tests for the pure normalization helpers: clean, deepMerge,
 * buildCollectionToSection, nestUnderSections, extractColorMode.
 *
 * Covers:
 *  - Stripping $extensions / $description
 *  - Preserving $value / $type on all token types (color, dimension, fontFamily, boolean)
 *  - Alias rewriting for color collections (bare → prefixed)
 *  - Alias references that already point to a section root are left unchanged
 *  - Spacing tokens: aliases within spacing stay as-is
 *  - Typography tokens: string and number $values
 *  - Deep merge: sibling keys merged, conflicts resolved (last-write-wins)
 *  - buildCollectionToSection: alias file, options file, spacing file, typography file
 *  - extractColorMode: alias color files return mode name; others return null
 *  - nestUnderSections: color mode files nest under color.modes.<mode>
 */

import { describe, it, expect } from 'vitest';
import {
  clean,
  deepMerge,
  buildCollectionToSection,
  nestUnderSections,
  extractColorMode,
  extractPrimitiveMode,
  buildSpacingClamp,
  applyTokenMapping,
  buildOptionTree,
  parseTokenDescription,
  fixStaticReferencePaths,
} from './normalize-utils.js';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const FIGMA_LEAF = (value: unknown, type = 'color', description = '') => ({
  $value: value,
  $type: type,
  $description: description,
  $extensions: { 'com.figma': { hiddenFromPublishing: false } },
});

// ─── extractColorMode ─────────────────────────────────────────────────────────

describe('extractColorMode', () => {
  it('returns the mode for alias.color.<mode>.json files', () => {
    expect(extractColorMode('alias.color.light.json')).toBe('light');
    expect(extractColorMode('alias.color.default.json')).toBe('default');
    expect(extractColorMode('alias.color.sale.json')).toBe('sale');
  });

  it('returns null for options color files', () => {
    expect(extractColorMode('options.color.light.json')).toBeNull();
    expect(extractColorMode('options.color.web-light.json')).toBeNull();
    expect(extractColorMode('options.color.ios-dark.json')).toBeNull();
  });

  it('returns null for spacing files', () => {
    expect(extractColorMode('spacing.default.json')).toBeNull();
  });

  it('returns null for files with fewer than three segments', () => {
    expect(extractColorMode('alias.json')).toBeNull();
  });
});

// ─── extractPrimitiveMode ─────────────────────────────────────────────────────

describe('extractPrimitiveMode', () => {
  it('returns the mode for options.color.<mode>.json files', () => {
    expect(extractPrimitiveMode('options.color.light.json')).toBe('light');
    expect(extractPrimitiveMode('options.color.web-light.json')).toBe('web-light');
    expect(extractPrimitiveMode('options.color.web-dark.json')).toBe('web-dark');
    expect(extractPrimitiveMode('options.color.ios-light.json')).toBe('ios-light');
    expect(extractPrimitiveMode('options.color.ios-dark.json')).toBe('ios-dark');
  });

  it('returns null for alias color files', () => {
    expect(extractPrimitiveMode('alias.color.default.json')).toBeNull();
    expect(extractPrimitiveMode('alias.color.light.json')).toBeNull();
  });

  it('returns null for spacing files', () => {
    expect(extractPrimitiveMode('spacing.default.json')).toBeNull();
  });

  it('returns null for files with fewer than three segments', () => {
    expect(extractPrimitiveMode('options.json')).toBeNull();
  });
});

// ─── buildCollectionToSection ─────────────────────────────────────────────────

describe('buildCollectionToSection', () => {
  it('maps bare collection keys to the section derived from the filename', () => {
    const parsed = [
      {
        file: 'options.color.light.json',
        data: { 'neutral-palette': {}, 'brand-palette': {} },
      },
    ];
    const map = buildCollectionToSection(parsed);
    expect(map.get('neutral-palette')).toBe('color');
    expect(map.get('brand-palette')).toBe('color');
  });

  it('maps a section-wrapper key and its children when topKey matches filename section', () => {
    const parsed = [
      {
        file: 'alias.color.light.json',
        data: { color: { surface: {}, text: {}, border: {} } },
      },
    ];
    const map = buildCollectionToSection(parsed);
    expect(map.get('color')).toBe('color');
    expect(map.get('surface')).toBe('color');
    expect(map.get('text')).toBe('color');
    expect(map.get('border')).toBe('color');
  });

  it('maps spacing collection to itself when topKey matches filename section', () => {
    const parsed = [
      {
        file: 'spacing.default.json',
        data: { spacing: { sm: {}, md: {}, lg: {} } },
      },
    ];
    const map = buildCollectionToSection(parsed);
    expect(map.get('spacing')).toBe('spacing');
    expect(map.get('sm')).toBe('spacing');
  });

  it('maps typography bare collections to the filename-derived section', () => {
    const parsed = [
      {
        file: 'typography.font.regular.json',
        data: { 'font-size': {}, 'font-weight': {}, 'font-family': {} },
      },
    ];
    const map = buildCollectionToSection(parsed);
    expect(map.get('font-size')).toBe('font');
    expect(map.get('font-weight')).toBe('font');
    expect(map.get('font-family')).toBe('font');
  });

  it('handles multiple files correctly', () => {
    const parsed = [
      { file: 'options.color.light.json', data: { 'neutral-palette': {}, 'brand-palette': {} } },
      { file: 'alias.color.light.json', data: { color: { surface: {}, text: {} } } },
      { file: 'spacing.default.json', data: { spacing: { sm: {}, md: {} } } },
    ];
    const map = buildCollectionToSection(parsed);
    expect(map.get('neutral-palette')).toBe('color');
    expect(map.get('brand-palette')).toBe('color');
    expect(map.get('color')).toBe('color');
    expect(map.get('surface')).toBe('color');
    expect(map.get('spacing')).toBe('spacing');
    expect(map.get('sm')).toBe('spacing');
  });
});

// ─── clean ────────────────────────────────────────────────────────────────────

describe('clean', () => {
  it('strips $extensions and $description from leaf tokens', () => {
    const map = new Map<string, string>();
    const input = { token: FIGMA_LEAF('#ff0000') };
    const result = clean(input, map) as Record<string, unknown>;
    expect(result.token).toEqual({ $value: '#ff0000', $type: 'color' });
    expect((result.token as Record<string, unknown>).$extensions).toBeUndefined();
    expect((result.token as Record<string, unknown>).$description).toBeUndefined();
  });

  it('preserves $value and $type for color tokens', () => {
    const map = new Map<string, string>();
    const input = { primary: FIGMA_LEAF('#0b2d60') };
    const result = clean(input, map) as Record<string, unknown>;
    expect(result.primary).toEqual({ $value: '#0b2d60', $type: 'color' });
  });

  it('preserves numeric $value for dimension/spacing tokens', () => {
    const map = new Map<string, string>();
    const input = { sm: FIGMA_LEAF(8, 'dimension') };
    const result = clean(input, map) as Record<string, unknown>;
    expect(result.sm).toEqual({ $value: 8, $type: 'dimension' });
  });

  it('preserves string $value for fontFamily tokens', () => {
    const map = new Map<string, string>();
    const input = { body: FIGMA_LEAF('Inter', 'fontFamily') };
    const result = clean(input, map) as Record<string, unknown>;
    expect(result.body).toEqual({ $value: 'Inter', $type: 'fontFamily' });
  });

  it('preserves boolean $value for tokens', () => {
    const map = new Map<string, string>();
    const input = { visible: FIGMA_LEAF(true, 'boolean') };
    const result = clean(input, map) as Record<string, unknown>;
    expect(result.visible).toEqual({ $value: true, $type: 'boolean' });
  });

  it('rewrites bare color alias references with the section prefix', () => {
    const map = new Map([
      ['neutral-palette', 'color'],
      ['brand-palette', 'color'],
    ]);
    const input = {
      color: {
        surface: {
          base: FIGMA_LEAF('{neutral-palette.base-neutrals.white}'),
        },
      },
    };
    const result = clean(input, map) as Record<string, Record<string, Record<string, unknown>>>;
    expect(result.color.surface.base).toEqual({
      $value: '{color.neutral.palette.base.neutrals.white}',
      $type: 'color',
    });
  });

  it('does NOT rewrite alias references that already point to a section root', () => {
    // "color" maps to itself — no double-prefixing
    const map = new Map([['color', 'color']]);
    const input = {
      text: { link: FIGMA_LEAF('{color.brand-palette.blue.600}') },
    };
    const result = clean(input, map) as Record<string, Record<string, unknown>>;
    expect((result.text.link as Record<string, unknown>).$value).toBe(
      '{color.brand.palette.blue.600}',
    );
  });

  it('does NOT rewrite spacing alias references that reference the spacing section', () => {
    const map = new Map([
      ['spacing', 'spacing'],
      ['sm', 'spacing'],
    ]);
    const input = {
      spacing: {
        component: { button: FIGMA_LEAF('{spacing.sm}', 'dimension') },
      },
    };
    const result = clean(input, map) as Record<string, Record<string, Record<string, unknown>>>;
    expect((result.spacing.component.button as Record<string, unknown>).$value).toBe(
      '{spacing.sm}',
    );
  });

  it('handles deeply nested token groups', () => {
    const map = new Map<string, string>();
    const input = {
      a: { b: { c: { d: FIGMA_LEAF('#123456') } } },
    };
    const result = clean(input, map) as Record<
      string,
      Record<string, Record<string, Record<string, unknown>>>
    >;
    expect(result.a.b.c.d).toEqual({ $value: '#123456', $type: 'color' });
  });

  it('preserves parsed docs metadata from Figma descriptions on alias tokens', () => {
    const map = new Map<string, string>();
    const input = {
      text: {
        link: FIGMA_LEAF(
          '{brand-palette.blue.600}',
          'color',
          [
            'Text color for interactive links.',
            'usage: Use for inline navigation and hyperlinks.',
            'design: Brand blue interaction ramp.',
          ].join('\n'),
        ),
      },
    };

    const result = clean(input, map) as Record<string, Record<string, Record<string, unknown>>>;
    expect(result.text.link).toEqual({
      $value: '{brand.palette.blue.600}',
      $type: 'color',
      $extensions: {
        cedar: {
          docs: {
            summary: 'Text color for interactive links.',
            usage: 'Use for inline navigation and hyperlinks.',
            design: 'Brand blue interaction ramp.',
          },
        },
      },
    });
  });
});

// ─── deepMerge ────────────────────────────────────────────────────────────────

describe('deepMerge', () => {
  it('merges non-overlapping top-level keys', () => {
    const dest = { a: { x: 1 } };
    deepMerge(dest, { b: { y: 2 } });
    expect(dest).toEqual({ a: { x: 1 }, b: { y: 2 } });
  });

  it('deep-merges overlapping group keys without clobbering siblings', () => {
    const dest = { color: { surface: { base: '#fff' } } };
    deepMerge(
      dest as Record<string, unknown>,
      { color: { text: { base: '#000' } } } as Record<string, unknown>,
    );
    expect(dest.color as Record<string, unknown>).toEqual({
      surface: { base: '#fff' },
      text: { base: '#000' },
    });
  });

  it('later values overwrite earlier leaf values on conflict', () => {
    const dest: Record<string, unknown> = {
      color: { surface: { base: { $value: '#fff', $type: 'color' } } },
    };
    deepMerge(dest, {
      color: { surface: { base: { $value: '#f5f2eb', $type: 'color' } } },
    } as Record<string, unknown>);
    expect(
      ((dest.color as Record<string, unknown>).surface as Record<string, unknown>).base,
    ).toEqual({ $value: '#f5f2eb', $type: 'color' });
  });

  it('does not mutate the src object', () => {
    const dest: Record<string, unknown> = {};
    const src = { a: { b: 1 } };
    deepMerge(dest, src as Record<string, unknown>);
    expect(src).toEqual({ a: { b: 1 } });
  });
});

// ─── nestUnderSections ───────────────────────────────────────────────────────

describe('nestUnderSections', () => {
  it('nests bare collections under their section (options file)', () => {
    const parsed = [
      {
        file: 'options.color.light.json',
        data: { 'neutral-palette': {}, 'brand-palette': {} },
      },
    ];
    const map = buildCollectionToSection(parsed);
    const cleaned = {
      'neutral-palette': { white: { $value: '#fff', $type: 'color' } },
      'brand-palette': {},
    };
    const result = nestUnderSections(cleaned, map);
    expect(Object.keys(result)).toEqual(['color']);
    expect(Object.keys(result.color as object)).toContain('neutral-palette');
    expect(Object.keys(result.color as object)).toContain('brand-palette');
  });

  it('keeps section wrapper keys at the top level when no colorMode given (alias file)', () => {
    const parsed = [
      {
        file: 'alias.color.light.json',
        data: { color: { surface: {}, text: {} } },
      },
    ];
    const map = buildCollectionToSection(parsed);
    const cleaned = { color: { surface: { base: { $value: '#fff', $type: 'color' } }, text: {} } };
    const result = nestUnderSections(cleaned, map);
    expect(Object.keys(result)).toEqual(['color']);
    expect((result.color as Record<string, unknown>).surface).toBeDefined();
  });

  it('nests color section wrapper under color.modes.<mode> when colorMode is given', () => {
    const parsed = [
      {
        file: 'alias.color.sale.json',
        data: { color: { surface: {}, text: {} } },
      },
    ];
    const map = buildCollectionToSection(parsed);
    const cleaned = {
      color: {
        surface: { base: { $value: '{color.brand-palette.red.400}', $type: 'color' } },
        text: { base: { $value: '{color.neutral-palette.warm-grey.900}', $type: 'color' } },
      },
    };
    const result = nestUnderSections(cleaned, map, 'sale');
    expect(Object.keys(result)).toEqual(['color']);
    const colorSection = result.color as Record<string, unknown>;
    expect(colorSection.modes).toBeDefined();
    const modes = colorSection.modes as Record<string, unknown>;
    expect(modes.sale).toBeDefined();
    const saleMode = modes.sale as Record<string, unknown>;
    expect(saleMode.surface).toBeDefined();
    expect(saleMode.text).toBeDefined();
    // Should NOT have surface/text directly on color (only under modes.sale)
    expect(colorSection.surface).toBeUndefined();
    expect(colorSection.text).toBeUndefined();
  });

  it('accumulates multiple modes under color.modes without clobbering each other', () => {
    const map = new Map([['color', 'color']]);
    const cleanedDefault = {
      color: { surface: { base: { $value: '#ffffff', $type: 'color' } } },
    };
    const cleanedSale = {
      color: { surface: { base: { $value: '#c7370f', $type: 'color' } } },
    };

    const canonical: Record<string, unknown> = {};
    deepMerge(canonical, nestUnderSections(cleanedDefault, map, 'default'));
    deepMerge(canonical, nestUnderSections(cleanedSale, map, 'sale'));

    const modes = (canonical.color as Record<string, unknown>).modes as Record<string, unknown>;
    expect(Object.keys(modes).sort()).toEqual(['default', 'sale']);
    expect(
      ((modes.default as Record<string, unknown>).surface as Record<string, unknown>).base,
    ).toEqual({ $value: '#ffffff', $type: 'color' });
    expect(
      ((modes.sale as Record<string, unknown>).surface as Record<string, unknown>).base,
    ).toEqual({ $value: '#c7370f', $type: 'color' });
  });

  it('merges bare collections and mode wrapper under the same section key', () => {
    const parsed = [
      { file: 'options.color.light.json', data: { 'neutral-palette': {} } },
      { file: 'alias.color.default.json', data: { color: { text: {} } } },
    ];
    const map = buildCollectionToSection(parsed);

    const cleanedOptions = { 'neutral-palette': { white: { $value: '#fff', $type: 'color' } } };
    const cleanedAlias = {
      color: { text: { link: { $value: '{color.neutral-palette.white}', $type: 'color' } } },
    };

    const canonical: Record<string, unknown> = {};
    deepMerge(canonical, nestUnderSections(cleanedOptions, map));
    deepMerge(canonical, nestUnderSections(cleanedAlias, map, 'default'));

    expect(Object.keys(canonical)).toEqual(['color']);
    const colorSection = canonical.color as Record<string, unknown>;
    // Primitive palette stays at top level of color
    expect(colorSection['neutral-palette']).toBeDefined();
    // Alias tokens are nested under color.modes.default
    const modes = colorSection.modes as Record<string, unknown>;
    expect(modes).toBeDefined();
    expect((modes.default as Record<string, unknown>).text).toBeDefined();
  });

  it('does not create color.primitives when bare collections are nested', () => {
    // Option files are processed upstream via applyTokenMapping + buildOptionTree.
    // If a bare color collection reaches nestUnderSections, it should still avoid
    // introducing the legacy color.primitives structure.
    const map = new Map([['neutral-palette', 'color']]);
    const cleaned = { 'neutral-palette': { white: { $value: '#fff', $type: 'color' } } };
    const result = nestUnderSections(cleaned, map);
    // color section may or may not exist; what matters is no "primitives" key.
    const colorSection = result.color as Record<string, unknown> | undefined;
    expect(colorSection?.['primitives']).toBeUndefined();
  });

  it('nests spacing section wrapper unchanged (no colorMode effect)', () => {
    const parsed = [{ file: 'spacing.default.json', data: { spacing: { sm: {}, md: {} } } }];
    const map = buildCollectionToSection(parsed);
    const cleaned = { spacing: { sm: { $value: '4', $type: 'dimension' } } };
    const result = nestUnderSections(cleaned, map);
    expect(Object.keys(result)).toEqual(['spacing']);
    expect((result.spacing as Record<string, unknown>).sm).toBeDefined();
  });
});

// ─── buildSpacingClamp ────────────────────────────────────────────────────────

/** Helper to build a minimal spacing bp file with a single scale token. */
function bpFile(breakpoint: number, tokenKey: string, value: number) {
  return {
    breakpoint,
    data: { spacing: { scale: { [tokenKey]: { $value: value, $type: 'dimension' } } } },
  };
}

describe('buildSpacingClamp', () => {
  it('returns empty object when given no files', () => {
    expect(buildSpacingClamp([])).toEqual({});
  });

  it('returns a static px value (not clamp) when only one breakpoint is provided', () => {
    const result = buildSpacingClamp([bpFile(320, '-50', 2.48)]);
    const token = (result as any).spacing.scale['-50'];
    expect(token.$value).toMatch(/px$/);
    expect(token.$type).toBe('dimension');
    expect(token.$value).not.toContain('clamp');
  });

  it('produces correct clamp() for -50 token (320→1440px range)', () => {
    // Known values from the design token dataset
    // v_min=2.48@320, v_max=4@1440
    // slope = (4 - 2.48) / (14.4 - 3.2) = 1.52 / 11.2 ≈ 0.1357
    // intercept = 2.48 - 0.1357 * 3.2 ≈ 2.0457
    const files = [
      bpFile(320, '-50', 2.48),
      bpFile(1440, '-50', 4),
      bpFile(2560, '-50', 4), // plateau — should NOT shift saturation past 1440
    ];
    const result = buildSpacingClamp(files);
    const token = (result as any).spacing.scale['-50'];
    expect(token.$type).toBe('dimension');
    expect(token.$value).toMatch(/^clamp\(/);
    // Min and max values should appear in the output
    expect(token.$value).toContain('2.48px');
    expect(token.$value).toContain('4px');
    // Slope and intercept should be present (approximate check)
    expect(token.$value).toContain('vw');
  });

  it('produces correct clamp() for -100 token (320→1600px range)', () => {
    // v_min=4.8@320, v_max=8@1600
    // slope = (8 - 4.8) / (16 - 3.2) = 3.2 / 12.8 = 0.25
    // intercept = 4.8 - 0.25 * 3.2 = 4.0
    const files = [bpFile(320, '-100', 4.8), bpFile(1600, '-100', 8), bpFile(2560, '-100', 8)];
    const result = buildSpacingClamp(files);
    const token = (result as any).spacing.scale['-100'];
    expect(token.$type).toBe('dimension');
    expect(token.$value).toBe('clamp(4.8px, 0.25vw + 4px, 8px)');
  });

  it('saturation detection uses first breakpoint where value equals vMax', () => {
    // Token reaches max at 744, then stays there at 1440 and 2560
    const files = [
      bpFile(320, 'custom', 10),
      bpFile(744, 'custom', 20),
      bpFile(1440, 'custom', 20),
      bpFile(2560, 'custom', 20),
    ];
    const result = buildSpacingClamp(files);
    const token = (result as any).spacing.scale.custom;
    // Max bp should be 744 (first saturation), not 2560
    // slope = (20 - 10) / (7.44 - 3.2) = 10 / 4.24 ≈ 2.3585
    // intercept = 10 - 2.3585 * 3.2 ≈ 2.4528
    expect(token.$type).toBe('dimension');
    expect(token.$value).toContain('20px'); // vMax
    expect(token.$value).toContain('10px'); // vMin
    // Saturation bp of 744 should yield a steeper slope than using 2560
    const slopeMatch = token.$value.match(/([\d.]+)vw/);
    expect(slopeMatch).not.toBeNull();
    const slope = parseFloat(slopeMatch![1]);
    // slope based on 744 bp ≈ 2.3585; slope based on 2560 bp would be ≈ 0.4348
    expect(slope).toBeGreaterThan(2);
  });

  it('handles multiple tokens in the same file set independently', () => {
    const files = [
      {
        breakpoint: 320,
        data: {
          spacing: {
            scale: {
              '-50': { $value: 2.48, $type: 'dimension' },
              '-100': { $value: 4.8, $type: 'dimension' },
            },
          },
        },
      },
      {
        breakpoint: 1440,
        data: {
          spacing: {
            scale: {
              '-50': { $value: 4, $type: 'dimension' },
              '-100': { $value: 8, $type: 'dimension' },
            },
          },
        },
      },
    ];
    const result = buildSpacingClamp(files);
    const scale = (result as any).spacing.scale;
    expect(scale['-50'].$type).toBe('dimension');
    expect(scale['-100'].$type).toBe('dimension');
    // Each token should have independent clamp values
    expect(scale['-50'].$value).not.toBe(scale['-100'].$value);
  });

  it('wraps output under spacing.scale key', () => {
    const result = buildSpacingClamp([bpFile(320, '-50', 2.48), bpFile(1440, '-50', 4)]);
    expect(result).toHaveProperty('spacing');
    expect((result as any).spacing).toHaveProperty('scale');
    expect((result as any).spacing.scale).toHaveProperty('-50');
  });

  it('sorts breakpoints regardless of input order', () => {
    // Provide out-of-order — result should be same as in-order
    const filesAsc = [bpFile(320, 'tok', 10), bpFile(1440, 'tok', 20)];
    const filesDesc = [bpFile(1440, 'tok', 20), bpFile(320, 'tok', 10)];
    const r1 = buildSpacingClamp(filesAsc);
    const r2 = buildSpacingClamp(filesDesc);
    expect((r1 as any).spacing.scale.tok.$value).toBe((r2 as any).spacing.scale.tok.$value);
  });

  it('handles string $value in bp files (Figma exports as string)', () => {
    const files = [
      {
        breakpoint: 320,
        data: { spacing: { scale: { '-50': { $value: '2.48', $type: 'dimension' } } } },
      },
      {
        breakpoint: 1440,
        data: { spacing: { scale: { '-50': { $value: '4', $type: 'dimension' } } } },
      },
    ];
    const result = buildSpacingClamp(files);
    const token = (result as any).spacing.scale['-50'];
    expect(token.$type).toBe('dimension');
    expect(token.$value).toContain('clamp(');
  });

  it('skips files that have no spacing.scale section', () => {
    const files = [
      bpFile(320, '-50', 2.48),
      { breakpoint: 500, data: { spacing: {} } }, // no scale key
      bpFile(1440, '-50', 4),
    ];
    // Should still compute clamp correctly from the two valid files
    const result = buildSpacingClamp(files);
    const token = (result as any).spacing.scale['-50'];
    expect(token.$type).toBe('dimension');
    expect(token.$value).toContain('4px');
  });
});

// ─── applyTokenMapping ────────────────────────────────────────────────────────

describe('applyTokenMapping', () => {
  const entry = {
    canonicalPrefix: 'color.option.neutral',
    tokens: {
      'warm-grey.900': 'warm.grey.900',
      'warm-grey.600': 'warm.grey.600',
      'base-neutrals.white': 'white',
      'base-neutrals.white-85': 'overlay.light',
    },
  };

  it('maps known Figma token paths to canonical color.option.* paths', () => {
    const data = {
      'warm-grey': {
        '900': { $value: '#2e2e2b', $type: 'color' },
        '600': { $value: '#736e65', $type: 'color' },
      },
      'base-neutrals': {
        white: { $value: '#ffffff', $type: 'color' },
      },
    };
    const results = applyTokenMapping('neutral-palette', data, entry, 'web-light');
    const paths = results.map((r) => r.canonicalPath);
    expect(paths).toContain('color.option.neutral.warm.grey.900');
    expect(paths).toContain('color.option.neutral.warm.grey.600');
    expect(paths).toContain('color.option.neutral.white');
  });

  it('applies semantic renames (white-85 → overlay.light)', () => {
    const data = {
      'base-neutrals': {
        'white-85': { $value: '#ffffffd9', $type: 'color' },
      },
    };
    const results = applyTokenMapping('neutral-palette', data, entry, 'web-light');
    expect(results[0].canonicalPath).toBe('color.option.neutral.overlay.light');
    expect(results[0].token.$value).toBe('#ffffffd9');
  });

  it('throws for unmapped Figma token paths', () => {
    const data = {
      'warm-grey': {
        '999': { $value: '#abcdef', $type: 'color' }, // not in mapping
      },
    };
    expect(() => applyTokenMapping('neutral-palette', data, entry, 'web-light')).toThrow(
      /warm-grey\.999/,
    );
    expect(() => applyTokenMapping('neutral-palette', data, entry, 'web-light')).toThrow(
      /token-mapping/,
    );
  });

  it('preserves $type from the token', () => {
    const data = {
      'warm-grey': {
        '900': { $value: '#2e2e2b', $type: 'color' },
      },
    };
    const results = applyTokenMapping('neutral-palette', data, entry, 'web-light');
    expect(results[0].token.$type).toBe('color');
  });
});

// ─── applyTokenMapping (auto mode) ───────────────────────────────────────────

describe('applyTokenMapping — auto mode', () => {
  const autoEntry = {
    canonicalPrefix: 'color.option.warm-grey',
    colorFamily: 'warm-grey',
    tokens: 'auto' as const,
  };

  it('uses Figma token path as canonical sub-path (identity)', () => {
    const data = {
      '010': { $value: '#faf9f6', $type: 'color' },
      '100': { $value: '#f5f3ef', $type: 'color' },
      '900': { $value: '#2e2e2b', $type: 'color' },
    };
    const results = applyTokenMapping('warm-grey', data, autoEntry, 'web-light');
    const paths = results.map((r) => r.canonicalPath);
    expect(paths).toContain('color.option.warm-grey.010');
    expect(paths).toContain('color.option.warm-grey.100');
    expect(paths).toContain('color.option.warm-grey.900');
  });

  it('never throws for unknown paths (all Figma paths pass through)', () => {
    const data = {
      '9999': { $value: '#abcdef', $type: 'color' },
    };
    const results = applyTokenMapping('warm-grey', data, autoEntry, 'web-light');
    expect(results[0].canonicalPath).toBe('color.option.warm-grey.9999');
  });

  it('preserves colorFamily from entry', () => {
    const data = {
      '100': { $value: '#f5f3ef', $type: 'color' },
    };
    const results = applyTokenMapping('warm-grey', data, autoEntry, 'web-light');
    expect(results[0].token.colorFamily).toBe('warm-grey');
  });
});

// ─── buildOptionTree ──────────────────────────────────────────────────────────

describe('buildOptionTree', () => {
  it('builds a nested object from flat canonical path entries', () => {
    const entries = [
      {
        canonicalPath: 'color.option.neutral.warm.grey.900',
        token: { $type: 'color', $value: '#2e2e2b' },
      },
      { canonicalPath: 'color.option.neutral.white', token: { $type: 'color', $value: '#ffffff' } },
      {
        canonicalPath: 'color.option.brand.blue.400',
        token: { $type: 'color', $value: '#406eb5' },
      },
    ];
    const tree = buildOptionTree(entries) as any;
    expect(tree.color.option.neutral.warm.grey['900'].$value).toBe('#2e2e2b');
    expect(tree.color.option.neutral.white.$value).toBe('#ffffff');
    expect(tree.color.option.brand.blue['400'].$value).toBe('#406eb5');
  });

  it('does not clobber sibling paths', () => {
    const entries = [
      {
        canonicalPath: 'color.option.neutral.warm.grey.900',
        token: { $type: 'color', $value: '#aaa' },
      },
      {
        canonicalPath: 'color.option.neutral.warm.grey.600',
        token: { $type: 'color', $value: '#bbb' },
      },
    ];
    const tree = buildOptionTree(entries) as any;
    expect(tree.color.option.neutral.warm.grey['900'].$value).toBe('#aaa');
    expect(tree.color.option.neutral.warm.grey['600'].$value).toBe('#bbb');
  });

  it('returns an empty object for empty input', () => {
    expect(buildOptionTree([])).toEqual({});
  });

  it('writes docs into $extensions.cedar.docs when token has a docs field', () => {
    const entries = [
      {
        canonicalPath: 'color.option.neutral.warm.grey.100',
        token: { $type: 'color', $value: '#edeae3', docs: { summary: 'Warm neutral base' } },
      },
      {
        canonicalPath: 'color.option.neutral.white',
        token: { $type: 'color', $value: '#ffffff' },
      },
    ];
    const tree = buildOptionTree(entries) as any;
    expect(tree.color.option.neutral.warm.grey['100'].$extensions.cedar.docs.summary).toBe(
      'Warm neutral base',
    );
    expect(tree.color.option.neutral.white.$extensions).toBeUndefined();
  });
});

// ─── parseTokenDescription ───────────────────────────────────────────────────

describe('parseTokenDescription', () => {
  it('returns undefined for empty string', () => {
    expect(parseTokenDescription('')).toBeUndefined();
    expect(parseTokenDescription('   ')).toBeUndefined();
  });

  it('returns summary-only for plain text with no recognised keys', () => {
    expect(parseTokenDescription('Warm neutral base.')).toEqual({ summary: 'Warm neutral base.' });
  });

  it('parses all four fields', () => {
    const raw = [
      'Warm neutral, used for backgrounds.',
      'usage: Use for page and container backgrounds, never for text.',
      'design: Anchors the warm grey scale; the lightest neutral step.',
      'aliases: surface-default, surface-subtle',
    ].join('\n');
    expect(parseTokenDescription(raw)).toEqual({
      summary: 'Warm neutral, used for backgrounds.',
      usage: 'Use for page and container backgrounds, never for text.',
      design: 'Anchors the warm grey scale; the lightest neutral step.',
      aliases: ['surface-default', 'surface-subtle'],
    });
  });

  it('parses usage and design without a summary', () => {
    const raw = 'usage: Use for borders.\ndesign: Part of the neutral scale.';
    expect(parseTokenDescription(raw)).toEqual({
      usage: 'Use for borders.',
      design: 'Part of the neutral scale.',
    });
  });

  it('handles aliases with a single value', () => {
    const raw = 'Light surface.\naliases: surface-default';
    expect(parseTokenDescription(raw)).toEqual({
      summary: 'Light surface.',
      aliases: ['surface-default'],
    });
  });

  it('ignores unrecognised keys — folds them into summary', () => {
    const raw = 'A colour token.\nunknown: some value';
    expect(parseTokenDescription(raw)).toEqual({ summary: 'A colour token. unknown: some value' });
  });

  it('treats whitespace-only aliases as absent', () => {
    const raw = 'Summary.\naliases:  ,  ';
    const result = parseTokenDescription(raw)!;
    expect(result.aliases).toBeUndefined();
  });
});

// ─── Integration: clean + nestUnderSections + deepMerge ──────────────────────

describe('clean + nestUnderSections + deepMerge integration', () => {
  it('produces a section-nested canonical tree with color.modes for alias files', () => {
    const parsed = [
      {
        file: 'options.color.light.json',
        data: {
          'neutral-palette': {
            white: FIGMA_LEAF('#ffffff'),
          },
          'brand-palette': {
            blue: { '600': FIGMA_LEAF('#0b2d60') },
          },
        },
      },
      {
        file: 'alias.color.default.json',
        data: {
          color: {
            text: {
              link: FIGMA_LEAF('{brand-palette.blue.600}'),
            },
          },
        },
      },
      {
        file: 'alias.color.sale.json',
        data: {
          color: {
            text: {
              link: FIGMA_LEAF('{brand-palette.blue.600}'),
            },
            surface: {
              base: FIGMA_LEAF('{brand-palette.red.400}'),
            },
          },
        },
      },
      {
        file: 'spacing.default.json',
        data: {
          spacing: {
            sm: FIGMA_LEAF(4, 'dimension'),
            component: {
              button: FIGMA_LEAF('{spacing.sm}', 'dimension'),
            },
          },
        },
      },
    ];

    const collectionToSection = buildCollectionToSection(parsed);
    const canonical: Record<string, unknown> = {};

    for (const { file, data } of parsed) {
      const cleaned = clean(data, collectionToSection);
      const colorMode = extractColorMode(file);
      const nested = nestUnderSections(
        cleaned as Record<string, unknown>,
        collectionToSection,
        colorMode,
      );
      deepMerge(canonical, nested);
    }

    // Top-level keys should only be section names
    expect(Object.keys(canonical).sort()).toEqual(['color', 'spacing']);

    const colorSection = canonical.color as Record<string, unknown>;

    // NOTE: this integration fixture keeps option collections at the top level
    // of color to exercise the legacy nestUnderSections path in isolation.
    // Real pipeline option files are handled upstream via applyTokenMapping +
    // buildOptionTree, so they do not produce color.primitives.
    expect(colorSection['neutral-palette']).toBeDefined();
    expect(colorSection['brand-palette']).toBeDefined();

    // Alias tokens under color.modes.*
    const modes = colorSection.modes as Record<string, unknown>;
    expect(modes).toBeDefined();
    expect(Object.keys(modes).sort()).toEqual(['default', 'sale']);

    // default mode: text.link alias was rewritten
    const defaultMode = modes.default as Record<string, unknown>;
    const defaultTextLink = (defaultMode.text as Record<string, unknown>).link as Record<
      string,
      unknown
    >;
    expect(defaultTextLink.$value).toBe('{color.brand.palette.blue.600}');
    expect(defaultTextLink.$extensions).toBeUndefined();

    // sale mode has both text and surface
    const saleMode = modes.sale as Record<string, unknown>;
    expect((saleMode.text as Record<string, unknown>).link).toBeDefined();
    expect((saleMode.surface as Record<string, unknown>).base).toBeDefined();

    // Spacing alias pointing to its own section should NOT be prefixed
    const spacingSection = canonical.spacing as Record<string, unknown>;
    const buttonSpacing = (spacingSection.component as Record<string, unknown>).button as Record<
      string,
      unknown
    >;
    expect(buttonSpacing.$value).toBe('{spacing.sm}');
    expect(buttonSpacing.$type).toBe('dimension');
  });
});

// ─── fixStaticReferencePaths ────────────────────────────────────────────────

describe('fixStaticReferencePaths', () => {
  it('replaces trailing -x with .x', () => {
    expect(fixStaticReferencePaths('{spacing.static.two-x}')).toBe('{spacing.static.two.x}');
  });

  it('replaces all hyphens in multi-segment names', () => {
    expect(fixStaticReferencePaths('{spacing.static.one-and-a-half-x}')).toBe(
      '{spacing.static.one.and.a.half.x}',
    );
  });

  it('handles single-segment names with no hyphens', () => {
    expect(fixStaticReferencePaths('{spacing.static.sm}')).toBe('{spacing.static.sm}');
  });

  it('rewrites color family references with hyphens to dots', () => {
    expect(fixStaticReferencePaths('{color.option.warm-grey.100}')).toBe(
      '{color.option.warm.grey.100}',
    );
  });

  it('passes through non-string values', () => {
    expect(fixStaticReferencePaths(42)).toBe(42);
    expect(fixStaticReferencePaths(null)).toBe(null);
  });
});

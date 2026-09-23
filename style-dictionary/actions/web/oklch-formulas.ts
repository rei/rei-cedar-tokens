import { parse, converter } from 'culori';
import { formatNumber } from '../../utils/format-number.js';

const toOklch = converter('oklch');

/**
 * Custom OKLCH formulas from Cedar design spec
 *
 * Formula:
 *   C(L) = Cmin + (Cmax - Cmin) * (1 - ((L - Lo) / W)^2)
 *
 * Where:
 *   - L: Lightness (0-1 in formula, 0-100 in OKLCH)
 *   - C(L): Chroma at lightness L
 *   - Cmax: Chroma Peak
 *   - Lo: Lightness level at Chroma Peak
 *   - W: Width of curve (Wlight for L >= Lo, Wdark for L <= Lo)
 *   - Cmin: Chroma floor (Clight-min for light side, Cdark-min for dark side)
 *   - Lmax: 0.98
 *   - Lmin: 0.20
 */

export const LMAX = 0.98;
export const LMIN = 0.2;

export type ColorFamily = {
  hue: number;
  cmax: number;
  lo: number;
  wlight: number;
  clightMin: number;
  wdark: number;
  cdarkMin: number;
};

export const COLOR_FAMILIES: Record<string, ColorFamily> = {
  'alpine-lake-blue': {
    hue: 259,
    cmax: 0.13,
    lo: 0.55,
    wlight: 0.65,
    clightMin: 0.025,
    wdark: 0.3,
    cdarkMin: 0.0625,
  },
  'appex-moss': {
    hue: 116,
    cmax: 0.2,
    lo: 0.76,
    wlight: 0.2393,
    clightMin: 0.03,
    wdark: 0.52,
    cdarkMin: 0.0625,
  },
  'blue-spruce-green': {
    hue: 166,
    cmax: 0.1,
    lo: 0.71,
    wlight: 0.265,
    clightMin: 0.01,
    wdark: 0.43,
    cdarkMin: 0.04,
  },
  'error-red': {
    hue: 30,
    cmax: 0.185,
    lo: 0.46,
    wlight: 0.46,
    clightMin: 0.015,
    wdark: 0.2432,
    cdarkMin: 0.08,
  },
  'golden-moss': {
    hue: 104,
    cmax: 0.1355,
    lo: 0.755,
    wlight: 0.225,
    clightMin: 0.006,
    wdark: 0.377,
    cdarkMin: 0.04,
  },
  'golden-yellow': {
    hue: 78,
    cmax: 0.175,
    lo: 0.82,
    wlight: 0.15,
    clightMin: 0.0015,
    wdark: 0.62,
    cdarkMin: 0.04,
  },
  'highlight-lichen': {
    hue: 120,
    cmax: 0.22,
    lo: 0.8792,
    wlight: 0.1008,
    clightMin: 0.05,
    wdark: 0.6292,
    cdarkMin: 0.05,
  },
  'info-blue': {
    hue: 200,
    cmax: 0.0825,
    lo: 0.6,
    wlight: 0.36,
    clightMin: 0.0075,
    wdark: 0.3,
    cdarkMin: 0.03,
  },
  'membership-text': {
    hue: 173,
    cmax: 0.13,
    lo: 0.62,
    wlight: 0.36,
    clightMin: 0.01,
    wdark: 0.3433,
    cdarkMin: 0.03,
  },
  'membership-yellow': {
    hue: 95,
    cmax: 0.2,
    lo: 0.86,
    wlight: 0.12,
    clightMin: 0.0115,
    wdark: 0.61,
    cdarkMin: 0.05,
  },
  'natural-grey': {
    hue: 89,
    cmax: 0.035,
    lo: 0.84,
    wlight: 0.14,
    clightMin: 0.004,
    wdark: 0.59,
    cdarkMin: 0.01,
  },
  'new-sale-red': {
    hue: 39,
    cmax: 0.19,
    lo: 0.54,
    wlight: 0.44,
    clightMin: 0.015,
    wdark: 0.315,
    cdarkMin: 0.045,
  },
  'sage-green': {
    hue: 158,
    cmax: 0.055,
    lo: 0.72,
    wlight: 0.26,
    clightMin: 0.012,
    wdark: 0.47,
    cdarkMin: 0.022,
  },
  'success-green': {
    hue: 146,
    cmax: 0.1154,
    lo: 0.5803,
    wlight: 0.4097,
    clightMin: 0.015,
    wdark: 0.3803,
    cdarkMin: 0.005,
  },
  'warm-grey': {
    hue: 82,
    cmax: 0.0185,
    lo: 0.52,
    wlight: 0.465,
    clightMin: 0.0015,
    wdark: 0.335,
    cdarkMin: 0.005,
  },
  'warning-yellow': {
    hue: 92,
    cmax: 0.155,
    lo: 0.53,
    wlight: 0.33,
    clightMin: 0.012,
    wdark: 0.29,
    cdarkMin: 0.04,
  },
  greyscale: {
    hue: 89.88,
    cmax: 0,
    lo: 0.5,
    wlight: 0.48,
    clightMin: 0,
    wdark: 0.3,
    cdarkMin: 0,
  },
};

/**
 * Legacy aliases for color family names that changed in the v1.8 Figma update.
 * Keeps existing token schema/tokens resolving while the canonical names move
 * to the new design vocabulary.
 */
export const COLOR_FAMILY_ALIASES: Record<string, string> = {
  lichen: 'highlight-lichen',
  'apex-moss': 'appex-moss',
  'sale-red': 'new-sale-red',
};

/**
 * Resolve a color family by its canonical or legacy alias name.
 */
export function resolveColorFamily(name?: string): ColorFamily | undefined {
  if (!name) return undefined;
  return COLOR_FAMILIES[name] ?? COLOR_FAMILIES[COLOR_FAMILY_ALIASES[name]];
}

/**
 * Calculate chroma at a given lightness using the design spec formula.
 *
 * Throws if `l` is not a finite number rather than silently propagating NaN
 * into the formula (which would otherwise surface as the literal string
 * "NaN" in generated CSS/JSON output).
 */
export function calculateChroma(l: number, family: ColorFamily): number {
  if (!Number.isFinite(l)) {
    throw new Error(`[oklch] calculateChroma received a non-finite lightness value: ${l}`);
  }

  // Clamp lightness to valid range
  const clampedL = Math.max(LMIN, Math.min(LMAX, l));

  if (clampedL >= family.lo) {
    // Light side formula
    const width = family.wlight;
    const cmin = family.clightMin;
    const normalizedL = (clampedL - family.lo) / width;
    const chroma = cmin + (family.cmax - cmin) * (1 - normalizedL * normalizedL);
    return Math.max(cmin, chroma);
  } else {
    // Dark side formula
    const width = family.wdark;
    const cmin = family.cdarkMin;
    const normalizedL = (clampedL - family.lo) / width;
    const chroma = cmin + (family.cmax - cmin) * (1 - normalizedL * normalizedL);
    return Math.max(cmin, chroma);
  }
}

/**
 * Convert hex to OKLCH using custom design spec formulas.
 *
 * Resolution tiers:
 *   1. If colorFamily is provided and found in COLOR_FAMILIES → use culori hex→L
 *      plus the parabolic chroma formula with the family's fixed hue.
 *   2. If colorFamily is provided but NOT found → log a warning and fall back
 *      to culori's default OKLCH conversion (no custom chroma).
 *   3. If colorFamily is omitted → culori passthrough (Storybook, previews, etc.)
 *
 * @param hex - The hex color value to convert
 * @param colorFamily - The color family name from token schema (e.g., 'warm-grey', 'alpine-lake-blue').
 *                      If not provided, falls back to culori's default conversion.
 */
export function buildCustomOklch(
  hex: string,
  colorFamily?: string,
): { mode: 'oklch'; l: number; c: number; h: number; alpha?: number } {
  const family = resolveColorFamily(colorFamily);

  if (colorFamily && !family) {
    console.warn(
      `[oklch] Unknown color family "${colorFamily}". ` +
        `Add an entry to COLOR_FAMILIES in oklch-formulas.ts. Falling back to culori default.`,
    );
  }

  // Parse hex via culori (needed for L and alpha detection)
  const parsed = parse(hex);

  if (!parsed) {
    throw new Error(`[oklch] Could not parse color value "${hex}".`);
  }

  const oklch = toOklch(parsed) as
    | { l?: number; c?: number; h?: number; alpha?: number }
    | undefined;
  const l = oklch?.l;
  const c = oklch?.c;

  if (
    typeof l !== 'number' ||
    !Number.isFinite(l) ||
    typeof c !== 'number' ||
    !Number.isFinite(c)
  ) {
    throw new Error(
      `[oklch] Could not convert color value "${hex}" to a valid oklch() (got l=${l}, c=${c}).`,
    );
  }

  // Only carry alpha when it differs from fully opaque
  const rawAlpha =
    typeof oklch?.alpha === 'number' && Number.isFinite(oklch.alpha) ? oklch.alpha : undefined;
  const alpha = rawAlpha !== undefined && rawAlpha < 1 ? rawAlpha : undefined;

  if (!family) {
    // Culori passthrough — no custom chroma
    const hue =
      typeof oklch?.h === 'number' && Number.isFinite(oklch.h) ? ((oklch.h % 360) + 360) % 360 : 0;

    return {
      mode: 'oklch',
      l,
      c,
      h: hue,
      alpha,
    };
  }

  // Custom formula path: culori L (clamped to the formula's valid domain) +
  // parabolic chroma + fixed hue.
  //
  // calculateChroma() clamps its lightness input to [LMIN, LMAX] internally
  // before computing chroma. The `l` returned here is clamped the same way
  // so the reported lightness always matches the lightness the chroma value
  // was actually computed for — otherwise a token with a raw L outside
  // [LMIN, LMAX] (e.g. true black/white) would report an L that doesn't
  // correspond to its own chroma, producing a visually inconsistent color.
  const clampedL = Math.max(LMIN, Math.min(LMAX, l));

  return {
    mode: 'oklch',
    l: clampedL,
    c: calculateChroma(clampedL, family),
    h: family.hue,
    alpha,
  };
}

/**
 * Convert hex to OKLCH using custom design spec formulas.
 *
 * Resolution tiers:
 *   1. If colorFamily is provided and found in COLOR_FAMILIES → use culori hex→L
 *      plus the parabolic chroma formula with the family's fixed hue.
 *   2. If colorFamily is provided but NOT found → log a warning and fall back
 *      to culori's default OKLCH conversion (no custom chroma).
 *   3. If colorFamily is omitted → culori passthrough (Storybook, previews, etc.)
 *
 * @param hex - The hex color value to convert
 * @param colorFamily - The color family name from token schema (e.g., 'warm-grey', 'alpine-lake-blue').
 *                      If not provided, falls back to culori's default conversion.
 */
export function hexToCustomOklch(hex: string, colorFamily?: string): string {
  const color = buildCustomOklch(hex, colorFamily);

  const lightness = formatNumber(Math.min(100, Math.max(0, color.l * 100)), 3);
  const chroma = formatNumber(Math.max(0, color.c), 4);
  const hue = formatNumber(color.h, 2);
  const alpha =
    typeof color.alpha === 'number'
      ? ` / ${formatNumber(Math.min(1, Math.max(0, color.alpha)), 3)}`
      : '';

  return `oklch(${lightness}% ${chroma} ${hue}${alpha})`;
}

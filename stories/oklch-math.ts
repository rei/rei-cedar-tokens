// Shared OKLCH color math for Storybook demos.
// Duplicated-free single source used by the OKLCH/* stories.

export type Rgb = { r: number; g: number; b: number };
export type Oklch = { l: number; c: number; h: number };
export type Oklab = { l: number; a: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function delinearize(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToOklab({ r, g, b }: Rgb): Oklab {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    l: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const { l, a, b } = rgbToOklab(rgb);
  return {
    l,
    c: Math.sqrt(a * a + b * b),
    h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  };
}

export function oklchToRgb({ l, c, h }: Oklch): { rgb: Rgb; inGamut: boolean } {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b2 = c * Math.sin((h * Math.PI) / 180);
  const l_ = Math.pow(l + 0.3963377774 * a + 0.2158037573 * b2, 3);
  const m_ = Math.pow(l - 0.1055613458 * a - 0.0638541728 * b2, 3);
  const s_ = Math.pow(l - 0.0894841775 * a - 1.291485548 * b2, 3);
  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  const rgb = { r: delinearize(lr), g: delinearize(lg), b: delinearize(lb) };
  const inGamut = [rgb.r, rgb.g, rgb.b].every((v) => v >= -0.001 && v <= 1.001);
  return { rgb, inGamut };
}

export function hexToOklch(hex: string): Oklch {
  return rgbToOklch(hexToRgb(hex));
}

// Perceptual distance between two colors in OKLab space (ΔE_OK).
export function deltaE(hex1: string, hex2: string): number {
  const p = rgbToOklab(hexToRgb(hex1));
  const q = rgbToOklab(hexToRgb(hex2));
  return Math.sqrt((p.l - q.l) ** 2 + (p.a - q.a) ** 2 + (p.b - q.b) ** 2);
}

export function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(hexToRgb(fg));
  const l2 = luminance(hexToRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ─── Color-vision deficiency simulation ──────────────────────────────────────
// Linear-sRGB deficiency matrices (Viénot/Brettel/Mollon reduced-form, the same
// approximations used by most design-tool simulators).

const CVD_MATRICES: Record<string, number[]> = {
  protanopia: [
    0.152286, 1.052893, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039,
  ],
};

export function simulateCvd(
  hex: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia',
): string {
  const { r, g, b } = hexToRgb(hex);
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  const m = CVD_MATRICES[type];
  const nr = m[0] * lr + m[1] * lg + m[2] * lb;
  const ng = m[3] * lr + m[4] * lg + m[5] * lb;
  const nb = m[6] * lr + m[7] * lg + m[8] * lb;
  return rgbToHex({ r: delinearize(nr), g: delinearize(ng), b: delinearize(nb) });
}

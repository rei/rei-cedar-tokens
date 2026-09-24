import type { StoryObj, Meta } from '@storybook/html-vite';
import { OPTION_RAMPS } from './cedar-color-data';
import { oklchToRgb, rgbToHex } from './oklch-math';

const meta: Meta = {
  title: 'OKLCH/Wide Gamut Showcase',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// Maximum in-sRGB chroma at a given L/H — binary search against oklchToRgb's
// gamut check. This measures how much headroom each token has before it would
// require a wider gamut than sRGB.
function maxSrgbChroma(l: number, h: number): number {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (oklchToRgb({ l, c: mid, h }).inGamut) lo = mid;
    else hi = mid;
  }
  return lo;
}

type HeadroomRow = {
  ramp: string;
  step: string;
  hex: string;
  l: number;
  c: number;
  h: number;
  maxC: number;
  headroom: number;
};

function computeHeadroom(): HeadroomRow[] {
  const rows: HeadroomRow[] = [];
  for (const [ramp, steps] of Object.entries(OPTION_RAMPS)) {
    for (const s of steps) {
      if (s.l === null || s.c === null || s.h === null) continue;
      const maxC = maxSrgbChroma(s.l, s.h);
      rows.push({
        ramp,
        step: s.step,
        hex: s.hex,
        l: s.l,
        c: s.c,
        h: s.h,
        maxC,
        headroom: maxC - s.c,
      });
    }
  }
  return rows.sort((a, b) => a.headroom - b.headroom);
}

const headroom = computeHeadroom();
const tightest = headroom.slice(0, 12);
const avgHeadroom = headroom.reduce((a, b) => a + b.headroom, 0) / headroom.length;
const outOfGamut = headroom.filter((r) => r.headroom < 0);

// Experimental P3 swatches — generated, NOT approved tokens. Chroma is pushed
// past the sRGB boundary so the clipped fallback is visibly different on wide
// gamut displays.
const EXPERIMENTAL: { label: string; l: number; c: number; h: number }[] = [
  { label: 'P3 green (experimental)', l: 0.75, c: 0.28, h: 150 },
  { label: 'P3 red (experimental)', l: 0.6, c: 0.29, h: 30 },
  { label: 'P3 blue (experimental)', l: 0.55, c: 0.27, h: 260 },
];

const experimentalRows = EXPERIMENTAL.map((e) => {
  const { rgb, inGamut } = oklchToRgb({ l: e.l, c: e.c, h: e.h });
  const clipped = rgbToHex(rgb);
  const maxC = maxSrgbChroma(e.l, e.h);
  const srgbFallback = oklchToRgb({ l: e.l, c: maxC, h: e.h });
  return { ...e, inGamut, clipped, srgbHex: rgbToHex(srgbFallback.rgb) };
});

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .wg-finding { background:#eefbee; border:1px solid #c8e8c9; border-radius:12px; padding:16px 20px; margin-bottom:24px; color:#2e6b34; font-size:14px; line-height:1.5; }
    .wg-finding strong { display:block; margin-bottom:4px; }
    .wg-table { width:100%; border-collapse:collapse; background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; overflow:hidden; font-size:12px; margin-bottom:32px; }
    .wg-table th { text-align:left; padding:8px 12px; background:var(--cedar-warm-100); font-family:Pressura,monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-700); }
    .wg-table td { padding:6px 12px; border-top:1px solid var(--cedar-warm-200); font-family:monospace; }
    .wg-chip { display:inline-block; width:16px; height:16px; border-radius:3px; border:1px solid rgba(0,0,0,0.12); vertical-align:middle; margin-right:8px; }
    .wg-headroom-bar { height:8px; border-radius:2px; background:#3b8349; display:inline-block; vertical-align:middle; margin-right:8px; }
    .wg-experimental { background:white; border:2px dashed #c33122; border-radius:12px; padding:24px; margin-bottom:32px; }
    .wg-exp-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:16px; font-weight:600; color:#811823; margin:0 0 4px 0; }
    .wg-exp-note { font-size:12px; color:#811823; margin-bottom:20px; }
    .wg-exp-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
    .wg-exp-card { border:1px solid var(--cedar-warm-200); border-radius:8px; padding:14px; }
    .wg-exp-card h4 { font-family:Pressura,monospace; font-size:11px; margin:0 0 10px 0; color:var(--cedar-warm-700); }
    .wg-exp-swatches { display:flex; gap:8px; margin-bottom:10px; }
    .wg-exp-swatch { flex:1; height:48px; border-radius:6px; border:1px solid rgba(0,0,0,0.12); position:relative; }
    .wg-exp-swatch span { position:absolute; bottom:2px; left:4px; font-family:monospace; font-size:9px; background:rgba(255,255,255,0.85); padding:0 3px; border-radius:2px; }
    .wg-exp-code { font-family:monospace; font-size:10px; color:var(--cedar-warm-600); }
    .wg-notes { background:var(--cedar-warm-50); border:1px solid var(--cedar-warm-200); border-radius:12px; padding:24px; }
    .wg-notes h3 { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:16px; font-weight:600; color:var(--cedar-warm-900); margin:0 0 12px 0; }
    .wg-notes li { color:var(--cedar-warm-800); line-height:1.6; font-size:14px; margin-bottom:8px; }
    .wg-notes ul { margin:0; padding-left:20px; }
  </style>
`;

export const WideGamutShowcase: Story = {
  name: 'Wide Gamut Showcase',
  render: () => {
    const rows = tightest
      .map(
        (r) => `<tr>
        <td>${r.ramp}</td>
        <td>${r.step}</td>
        <td><span class="wg-chip" style="background:${r.hex}"></span><code>${r.hex}</code></td>
        <td>${r.c.toFixed(4)}</td>
        <td>${r.maxC.toFixed(4)}</td>
        <td><span class="wg-headroom-bar" style="width:${Math.max(2, r.headroom * 600)}px"></span>${r.headroom.toFixed(4)}</td>
      </tr>`,
      )
      .join('');

    const expCards = experimentalRows
      .map(
        (e) => `<div class="wg-exp-card">
        <h4>${e.label}</h4>
        <div class="wg-exp-swatches">
          <div class="wg-exp-swatch" style="background:oklch(${(e.l * 100).toFixed(0)}% ${e.c} ${e.h})"><span>P3 request</span></div>
          <div class="wg-exp-swatch" style="background:${e.srgbHex}"><span>sRGB clip</span></div>
        </div>
        <div class="wg-exp-code">oklch(${(e.l * 100).toFixed(0)}% ${e.c} ${e.h})<br>
        ${e.inGamut ? 'inside sRGB' : `outside sRGB → clips to ${e.srgbHex}`}</div>
      </div>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Wide Gamut: Measured Headroom</h2>
        </div>

        <div class="wg-finding">
          <strong>Finding: no semantic token currently resolves outside sRGB.</strong>
          Every shipped color was checked against the sRGB gamut boundary. Wide gamut is a
          capability the pipeline supports — not something any approved token uses today.
        </div>

        <h3 style="font-family:Stuart,'Stuart fallback',Georgia,serif;font-size:16px;margin:0 0 12px 0;color:var(--cedar-warm-900);">
          Steps nearest the sRGB boundary (${headroom.length} steps measured · avg headroom ${avgHeadroom.toFixed(3)})
        </h3>
        <table class="wg-table">
          <thead><tr><th>Ramp</th><th>Step</th><th>Value</th><th>Chroma</th><th>Max sRGB chroma</th><th>Headroom</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${outOfGamut.length > 0 ? `<p style="color:#811823;">${outOfGamut.length} steps exceed sRGB — see validation.</p>` : ''}

        <div class="wg-experimental">
          <h3 class="wg-exp-title">Experimental — not approved tokens</h3>
          <p class="wg-exp-note">
            These colors are generated in this demo to show Display-P3 capability and clipping
            behavior. They are not part of the Cedar token system. On sRGB displays the browser
            clips them to the right-hand swatch; on P3 displays the left swatch renders visibly
            more saturated.
          </p>
          <div class="wg-exp-grid">${expCards}</div>
        </div>

        <div class="wg-notes">
          <h3>How to read this</h3>
          <ul>
            <li><strong>Headroom</strong> = max in-sRGB chroma at that step's lightness/hue minus the token's actual chroma. Smaller = closer to the gamut edge.</li>
            <li><strong>Clipping</strong> is the fallback: browsers map out-of-gamut requests to the nearest displayable color, losing saturation — shown side by side above.</li>
            <li><strong>Device support:</strong> modern Apple devices, recent P3 monitors, and flagship Android phones render P3; everything else sees the clipped value.</li>
            <li><strong>Adoption path:</strong> if design approves P3 values, they'd ship as tokens with measured sRGB fallbacks — never raw P3-only colors.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

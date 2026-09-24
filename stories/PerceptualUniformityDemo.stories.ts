import type { StoryObj, Meta } from '@storybook/html-vite';
import { OPTION_RAMPS, LEGACY_RAMPS } from './cedar-color-data';
import { hexToOklch, deltaE, contrastRatio } from './oklch-math';
import { resolvePath } from './color-registry';

const meta: Meta = {
  title: 'OKLCH/Perceptual Uniformity',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// Ramp pairs under evaluation: the legacy ramp vs its OKLCH-constructed
// successor. These are the ramps brand, sale, and membership colors come from.
const RAMP_PAIRS: Record<string, { label: string; legacy: string; next: string }> = {
  brand: {
    label: 'Brand (blue-spruce-green)',
    legacy: 'blue-spruce-green',
    next: 'blue-spruce-green',
  },
  sale: { label: 'Sale (sale-red)', legacy: 'sale-red', next: 'sale-red' },
  membership: {
    label: 'Membership (golden → membership-yellow)',
    legacy: 'golden-yellow',
    next: 'membership-yellow',
  },
};

const TRACE = resolvePath('color/surface/neutral/trace');

// Adjacent perceptual distance stats for a hex sequence.
function rampStats(hexes: string[]) {
  const deltas = hexes.slice(1).map((h, i) => deltaE(hexes[i], h));
  const mean = deltas.reduce((a, b) => a + b, 0) / (deltas.length || 1);
  const variance = deltas.reduce((a, b) => a + (b - mean) ** 2, 0) / (deltas.length || 1);
  return {
    deltas,
    mean,
    sd: Math.sqrt(variance),
    min: Math.min(...deltas),
    max: Math.max(...deltas),
  };
}

function swatchStrip(steps: { step: string; hex: string }[], showSteps: boolean): string {
  return `<div class="pu-strip">${steps
    .map(
      (s) => `<div class="pu-chip" style="background:${s.hex}" title="${s.step}: ${s.hex}">
        ${showSteps ? `<span>${s.step}</span>` : ''}</div>`,
    )
    .join('')}</div>`;
}

function metricChart(
  label: string,
  values: number[],
  color: string,
  format: (v: number) => string,
): string {
  const max = Math.max(...values, 0.0001);
  return `<div class="pu-chart">
    <div class="pu-chart-label">${label}</div>
    ${values
      .map(
        (v) => `<div class="pu-bar-row">
          <div class="pu-bar" style="width:${(v / max) * 100}%;background:${color}"></div>
          <span class="pu-bar-val">${format(v)}</span>
        </div>`,
      )
      .join('')}
  </div>`;
}

function renderComparison(pairKey: string): string {
  const pair = RAMP_PAIRS[pairKey];
  const legacy = LEGACY_RAMPS[pair.legacy].map((s) => ({ ...s, oklch: hexToOklch(s.hex) }));
  const next = OPTION_RAMPS[pair.next].map((s) => ({ ...s, oklch: { l: s.l!, c: s.c!, h: s.h! } }));

  const legacyStats = rampStats(legacy.map((s) => s.hex));
  const nextStats = rampStats(next.map((s) => s.hex));
  const improvement =
    legacyStats.sd > 0 ? ((legacyStats.sd - nextStats.sd) / legacyStats.sd) * 100 : 0;

  const contrastLegacy = legacy.map((s) => contrastRatio(s.hex, TRACE));
  const contrastNext = next.map((s) => contrastRatio(s.hex, TRACE));

  const fmt2 = (v: number) => v.toFixed(2);
  const fmt1 = (v: number) => `${v.toFixed(1)}:1`;

  return `
    <div class="pu-pair">
      <h3 class="pu-pair-title">${pair.label}</h3>

      <div class="pu-cols">
        <div class="pu-col">
          <div class="pu-col-head">Legacy construction <span class="pu-tag">${legacy.length} steps</span></div>
          ${swatchStrip(legacy, true)}
          ${metricChart('Adjacent perceptual distance (ΔE)', legacyStats.deltas, '#b68b37', fmt2)}
          ${metricChart('Contrast vs surface/neutral/trace', contrastLegacy, '#958e83', fmt1)}
          <div class="pu-stats">ΔE spread: ${legacyStats.min.toFixed(2)}–${legacyStats.max.toFixed(2)} · σ ${legacyStats.sd.toFixed(3)}</div>
        </div>

        <div class="pu-col">
          <div class="pu-col-head">OKLCH construction <span class="pu-tag">${next.length} steps</span></div>
          ${swatchStrip(next, true)}
          ${metricChart('Adjacent perceptual distance (ΔE)', nextStats.deltas, '#3b8349', fmt2)}
          ${metricChart('Contrast vs surface/neutral/trace', contrastNext, '#958e83', fmt1)}
          <div class="pu-stats">ΔE spread: ${nextStats.min.toFixed(2)}–${nextStats.max.toFixed(2)} · σ ${nextStats.sd.toFixed(3)}</div>
        </div>
      </div>

      <div class="pu-verdict ${improvement > 0 ? 'good' : 'warn'}">
        ${
          improvement > 0
            ? `Adjacent-step distance is ${improvement.toFixed(0)}% more uniform (σ ${legacyStats.sd.toFixed(3)} → ${nextStats.sd.toFixed(3)}).`
            : `Adjacent-step distance is not more uniform in this ramp (σ ${legacyStats.sd.toFixed(3)} → ${nextStats.sd.toFixed(3)}) — worth flagging to design.`
        }
      </div>
    </div>`;
}

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .pu-pair { background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; padding:24px; margin-bottom:32px; }
    .pu-pair-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:16px; font-weight:600; color:var(--cedar-warm-900); margin:0 0 16px 0; }
    .pu-cols { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
    .pu-col-head { font-family:Pressura,monospace; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-700); margin-bottom:10px; }
    .pu-tag { background:var(--cedar-warm-100); border-radius:10px; padding:1px 8px; margin-left:6px; }
    .pu-strip { display:flex; gap:2px; margin-bottom:14px; }
    .pu-chip { flex:1; height:36px; border-radius:4px; display:flex; align-items:flex-end; justify-content:center; }
    .pu-chip span { font-family:monospace; font-size:8px; color:rgba(0,0,0,0.55); background:rgba(255,255,255,0.7); padding:0 2px; border-radius:2px; margin-bottom:2px; }
    .pu-chart { margin-bottom:14px; }
    .pu-chart-label { font-family:Pressura,monospace; font-size:10px; color:var(--cedar-warm-600); margin-bottom:6px; }
    .pu-bar-row { display:flex; align-items:center; gap:8px; margin-bottom:2px; }
    .pu-bar { height:8px; border-radius:2px; min-width:1px; }
    .pu-bar-val { font-family:monospace; font-size:10px; color:var(--cedar-warm-700); }
    .pu-stats { font-family:monospace; font-size:11px; color:var(--cedar-warm-600); }
    .pu-verdict { margin-top:16px; padding:10px 14px; border-radius:8px; font-size:13px; }
    .pu-verdict.good { background:#eefbee; color:#2e6b34; border:1px solid #c8e8c9; }
    .pu-verdict.warn { background:#fef7e1; color:#854714; border:1px solid #f2dd9f; }
    .pu-explainer { background:var(--cedar-green-50); border:1px solid var(--cedar-green-200); border-radius:12px; padding:24px; }
    .pu-explainer h3 { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:18px; font-weight:600; color:var(--cedar-green-900); margin:0 0 12px 0; }
    .pu-explainer p, .pu-explainer li { color:var(--cedar-green-800); line-height:1.6; font-size:14px; }
    .pu-explainer ul { margin:0; padding-left:20px; }
  </style>
`;

export const PerceptualUniformityDemo: Story = {
  name: 'Perceptual Uniformity',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Perceptual Uniformity: Cedar Ramp Evidence</h2>
        </div>
        <p style="margin-bottom:32px; color:var(--cedar-warm-700); line-height:1.6; max-width:780px;">
          Each pair below compares the legacy ramp against its OKLCH-constructed successor —
          same hue family, measured in OKLab perceptual distance (ΔE). A systematic ramp should
          show roughly equal distance between adjacent steps and a monotonic contrast progression.
        </p>
        ${Object.keys(RAMP_PAIRS).map(renderComparison).join('')}

        <div class="pu-explainer">
          <h3>What this proves — and what it doesn't</h3>
          <ul>
            <li><strong>Measured, not asserted:</strong> ΔE is computed between actual shipped token values, not generated swatches.</li>
            <li><strong>Uniformity is about steps, not endpoints:</strong> low variance in adjacent ΔE means equal numeric steps feel like equal visual steps.</li>
            <li><strong>Step counts differ:</strong> the new ramps have more stops (010–1500), so finer-grained control is expected — compare spread, not raw totals.</li>
            <li><strong>Not all ramps may improve equally:</strong> a warn verdict is real evidence to bring back to design, not a rendering bug.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

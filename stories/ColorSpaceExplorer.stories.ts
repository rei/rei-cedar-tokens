import type { StoryObj, Meta } from '@storybook/html-vite';
import { OPTION_RAMPS, LEGACY_RAMPS, type RampStep } from './cedar-color-data';
import { hexToOklch, deltaE } from './oklch-math';

const meta: Meta = {
  title: 'OKLCH/Color Space Explorer',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

type Row = { step: string; hex: string; l: number; c: number; h: number; dPrev: number | null };

function rowsFromOption(steps: RampStep[]): Row[] {
  return steps.map((s, i) => ({
    step: s.step,
    hex: s.hex,
    l: s.l ?? hexToOklch(s.hex).l,
    c: s.c ?? hexToOklch(s.hex).c,
    h: s.h ?? hexToOklch(s.hex).h,
    dPrev: i === 0 ? null : deltaE(steps[i - 1].hex, s.hex),
  }));
}

function rowsFromLegacy(steps: { step: string; hex: string }[]): Row[] {
  return steps.map((s, i) => {
    const o = hexToOklch(s.hex);
    return {
      step: s.step,
      hex: s.hex,
      l: o.l,
      c: o.c,
      h: o.h,
      dPrev: i === 0 ? null : deltaE(steps[i - 1].hex, s.hex),
    };
  });
}

function renderExplorer(rampName: string, construction: 'legacy' | 'oklch'): string {
  const rows =
    construction === 'oklch' && OPTION_RAMPS[rampName]
      ? rowsFromOption(OPTION_RAMPS[rampName])
      : LEGACY_RAMPS[rampName]
        ? rowsFromLegacy(LEGACY_RAMPS[rampName])
        : [];

  if (rows.length === 0) {
    return `<div class="ce-empty">No ${construction} ramp named "${rampName}" exists in the token source.</div>`;
  }

  const deltas = rows.map((r) => r.dPrev).filter((d): d is number => d !== null);
  const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const sd = Math.sqrt(deltas.reduce((a, b) => a + (b - mean) ** 2, 0) / deltas.length);
  const lValues = rows.map((r) => r.l);
  const lMonotonic = lValues.every((v, i) => i === 0 || v <= lValues[i - 1] + 0.0001);
  const hRange = Math.max(...rows.map((r) => r.h)) - Math.min(...rows.map((r) => r.h));

  const strip = `<div class="ce-strip">${rows
    .map((r) => `<div class="ce-chip" style="background:${r.hex}" title="${r.step}"></div>`)
    .join('')}</div>`;

  const tableRows = rows
    .map(
      (r) => `<tr>
      <td class="ce-step">${r.step}</td>
      <td><span class="ce-chip-sm" style="background:${r.hex}"></span><code>${r.hex}</code></td>
      <td>${(r.l * 100).toFixed(1)}</td>
      <td>${r.c.toFixed(4)}</td>
      <td>${r.h.toFixed(1)}°</td>
      <td>${r.dPrev === null ? '—' : r.dPrev.toFixed(3)}</td>
    </tr>`,
    )
    .join('');

  return `
    <div class="ce-result">
      ${strip}
      <div class="ce-metrics">
        <div class="ce-metric"><span class="ce-metric-label">Steps</span><span class="ce-metric-val">${rows.length}</span></div>
        <div class="ce-metric"><span class="ce-metric-label">ΔE mean</span><span class="ce-metric-val">${mean.toFixed(3)}</span></div>
        <div class="ce-metric"><span class="ce-metric-label">ΔE σ</span><span class="ce-metric-val">${sd.toFixed(3)}</span></div>
        <div class="ce-metric"><span class="ce-metric-label">L monotonic</span><span class="ce-metric-val">${lMonotonic ? 'yes' : 'no'}</span></div>
        <div class="ce-metric"><span class="ce-metric-label">Hue drift</span><span class="ce-metric-val">${hRange.toFixed(1)}°</span></div>
      </div>
      <table class="ce-table">
        <thead><tr><th>Step</th><th>Value</th><th>L</th><th>C</th><th>H</th><th>ΔE prev</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
}

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .ce-controls { display:flex; flex-wrap:wrap; gap:16px; padding:16px; margin-bottom:24px; background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; }
    .ce-field { display:flex; flex-direction:column; gap:4px; }
    .ce-field label { font-family:Pressura,monospace; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); }
    .ce-field select { padding:6px 10px; border:1px solid var(--cedar-warm-300); border-radius:6px; font-family:Pressura,monospace; font-size:12px; background:white; }
    .ce-strip { display:flex; gap:2px; margin-bottom:16px; }
    .ce-chip { flex:1; height:40px; border-radius:4px; }
    .ce-chip-sm { display:inline-block; width:16px; height:16px; border-radius:3px; border:1px solid rgba(0,0,0,0.12); vertical-align:middle; margin-right:8px; }
    .ce-metrics { display:flex; flex-wrap:wrap; gap:20px; margin-bottom:16px; padding:12px 16px; background:var(--cedar-warm-50); border-radius:8px; }
    .ce-metric { display:flex; flex-direction:column; }
    .ce-metric-label { font-family:Pressura,monospace; font-size:9px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); }
    .ce-metric-val { font-family:monospace; font-size:14px; font-weight:600; color:var(--cedar-warm-900); }
    .ce-table { width:100%; border-collapse:collapse; background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; overflow:hidden; font-size:12px; }
    .ce-table th { text-align:left; padding:8px 12px; background:var(--cedar-warm-100); font-family:Pressura,monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-700); }
    .ce-table td { padding:6px 12px; border-top:1px solid var(--cedar-warm-200); font-family:monospace; }
    .ce-step { font-weight:600; }
    .ce-empty { padding:24px; background:var(--cedar-warm-50); border-radius:8px; color:var(--cedar-warm-700); font-size:13px; }
    .ce-explainer { background:var(--cedar-green-50); border:1px solid var(--cedar-green-200); border-radius:12px; padding:24px; margin-top:24px; }
    .ce-explainer h3 { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:18px; font-weight:600; color:var(--cedar-green-900); margin:0 0 12px 0; }
    .ce-explainer li { color:var(--cedar-green-800); line-height:1.6; font-size:14px; margin-bottom:8px; }
    .ce-explainer ul { margin:0; padding-left:20px; }
  </style>
`;

export const ColorSpaceExplorer: Story = {
  name: 'Color Space Explorer',
  render: () => {
    const rampNames = Object.keys(OPTION_RAMPS);
    const options = rampNames.map((n) => `<option value="${n}">${n}</option>`).join('');
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Color Space Explorer: Cedar Ramps in OKLCH</h2>
        </div>
        <p style="margin-bottom:24px; color:var(--cedar-warm-700); line-height:1.6; max-width:780px;">
          Pick an approved Cedar option ramp and toggle between its legacy construction and the
          OKLCH-constructed successor. Measurements are computed from the actual token source
          (<code>options.color.web-light.json</code> vs <code>legacy/_options/color.json</code>) —
          no generated stand-ins.
        </p>
        <div class="ce-controls">
          <div class="ce-field">
            <label for="ce-ramp">Approved ramp</label>
            <select id="ce-ramp">${options}</select>
          </div>
          <div class="ce-field">
            <label for="ce-construction">Construction</label>
            <select id="ce-construction">
              <option value="oklch">OKLCH (current source)</option>
              <option value="legacy">Legacy (previous source)</option>
            </select>
          </div>
        </div>
        <div id="ce-output">${renderExplorer('sale-red', 'oklch')}</div>

        <div class="ce-explainer">
          <h3>What to look for</h3>
          <ul>
            <li><strong>ΔE prev</strong> — perceptual distance to the previous step. Even values mean the ramp feels evenly graded.</li>
            <li><strong>L monotonic</strong> — lightness should descend without reversals; a reversal is a visual "jump".</li>
            <li><strong>Hue drift</strong> — small drift keeps the family on-hue; large drift means steps shift toward a different color.</li>
            <li><strong>Chroma arc</strong> — chroma rising then falling is intentional: mid-tones carry the most saturation.</li>
            <li><strong>Legacy gaps</strong> — ramps missing from the legacy source render an explicit notice, not a guess.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const rampEl = canvasElement.querySelector<HTMLSelectElement>('#ce-ramp');
    const consEl = canvasElement.querySelector<HTMLSelectElement>('#ce-construction');
    const output = canvasElement.querySelector<HTMLElement>('#ce-output');
    if (!rampEl || !consEl || !output) return;
    const update = () => {
      output.innerHTML = renderExplorer(rampEl.value, consEl.value as 'legacy' | 'oklch');
    };
    rampEl.addEventListener('change', update);
    consEl.addEventListener('change', update);
    // Ensure initial paint matches the selected ramp
    rampEl.value = 'sale-red';
    update();
  },
};

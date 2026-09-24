import type { StoryObj, Meta } from '@storybook/html-vite';
import { combinations, resolvePath } from './color-registry';
import { contrastRatio, deltaE, simulateCvd } from './oklch-math';

const meta: Meta = {
  title: 'OKLCH/Color Blindness Simulator',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const VISION_TYPES = [
  { key: 'normal', label: 'Normal', sim: null },
  { key: 'protanopia', label: 'Protanopia', sim: 'protanopia' as const },
  { key: 'deuteranopia', label: 'Deuteranopia', sim: 'deuteranopia' as const },
  { key: 'tritanopia', label: 'Tritanopia', sim: 'tritanopia' as const },
];

// Combinations from the canonical registry that exercise color-as-meaning:
// feedback banners (hue carries intent) plus sale/brand text and selection.
const SHOWCASE = [
  'feedback-error-banner',
  'feedback-success-banner',
  'feedback-warning-banner',
  'feedback-info-banner',
  'sale-text-on-trace',
  'brand-text-on-trace',
  'selection-trigger',
];

function renderCombination(name: string): string {
  const combo = combinations[name];
  const surface = resolvePath(combo.surface);
  const content = resolvePath(combo.content);
  const border = combo.border ? resolvePath(combo.border) : null;
  const wcag = contrastRatio(content, surface);

  const cells = VISION_TYPES.map((v) => {
    const simSurface = v.sim ? simulateCvd(surface, v.sim) : surface;
    const simContent = v.sim ? simulateCvd(content, v.sim) : content;
    const simBorder = border && v.sim ? simulateCvd(border, v.sim) : border;
    // Distinguishability: perceptual distance between content and surface
    // as perceived under this vision type.
    const distinguish = deltaE(simContent, simSurface);
    return `<div class="cb-cell">
      <div class="cb-cell-label">${v.label}</div>
      <div class="cb-preview" style="background:${simSurface};border:2px solid ${simBorder ?? 'transparent'};">
        <span style="color:${simContent}">Sample text</span>
      </div>
      <div class="cb-delta" title="Perceptual distance between content and surface under this vision type">ΔE ${distinguish.toFixed(3)}</div>
    </div>`;
  }).join('');

  return `<div class="cb-card">
    <div class="cb-card-head">
      <div>
        <div class="cb-card-name">${name}</div>
        <div class="cb-card-paths"><code>${combo.content}</code> on <code>${combo.surface}</code></div>
      </div>
      <div class="cb-wcag" title="WCAG contrast — a single measurement, independent of vision simulation">
        <span class="cb-wcag-label">WCAG</span>
        <span class="cb-wcag-val ${wcag >= 4.5 ? 'pass' : wcag >= 3 ? 'warn' : 'fail'}">${wcag.toFixed(1)}:1</span>
      </div>
    </div>
    <div class="cb-grid">${cells}</div>
    <div class="cb-cue"><span class="cb-cue-label">Non-color cue:</span> ${combo.nonColorCue}</div>
  </div>`;
}

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .cb-card { background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; padding:20px; margin-bottom:20px; }
    .cb-card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
    .cb-card-name { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:14px; font-weight:600; color:var(--cedar-warm-900); }
    .cb-card-paths { font-size:11px; color:var(--cedar-warm-600); margin-top:2px; }
    .cb-wcag { text-align:right; }
    .cb-wcag-label { font-family:Pressura,monospace; font-size:9px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); display:block; }
    .cb-wcag-val { font-family:monospace; font-size:14px; font-weight:700; padding:1px 8px; border-radius:4px; }
    .cb-wcag-val.pass { color:#2e6b34; }
    .cb-wcag-val.warn { color:#854714; }
    .cb-wcag-val.fail { color:#811823; }
    .cb-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:12px; }
    .cb-cell-label { font-family:Pressura,monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); margin-bottom:6px; }
    .cb-preview { height:56px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-family:Graphik,'Helvetica Neue',sans-serif; font-size:13px; font-weight:500; }
    .cb-delta { font-family:monospace; font-size:10px; color:var(--cedar-warm-600); margin-top:4px; }
    .cb-cue { font-size:12px; color:var(--cedar-warm-700); border-top:1px solid var(--cedar-warm-200); padding-top:10px; }
    .cb-cue-label { font-weight:600; }
    .cb-explainer { background:var(--cedar-green-50); border:1px solid var(--cedar-green-200); border-radius:12px; padding:24px; }
    .cb-explainer h3 { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:18px; font-weight:600; color:var(--cedar-green-900); margin:0 0 12px 0; }
    .cb-explainer li { color:var(--cedar-green-800); line-height:1.6; font-size:14px; margin-bottom:8px; }
    .cb-explainer ul { margin:0; padding-left:20px; }
  </style>
`;

export const ColorBlindnessSimulator: Story = {
  name: 'Color Blindness Simulator',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Color-Vision Simulation: Approved Combinations</h2>
        </div>
        <p style="margin-bottom:24px; color:var(--cedar-warm-700); line-height:1.6; max-width:780px;">
          Each card renders an approved combination from
          <code>tokens/compatibility-registry.json</code> under simulated color-vision
          deficiencies. The WCAG ratio is a single measurement of the real colors — it does not
          change per vision type. ΔE shows how distinguishable the pairing remains under
          simulation.
        </p>
        ${SHOWCASE.map(renderCombination).join('')}
        <div class="cb-explainer">
          <h3>Reading the results</h3>
          <ul>
            <li><strong>WCAG contrast ≠ simulation:</strong> WCAG measures the actual colors against a fixed formula. Simulation asks a different question — does the pairing still look different to someone with a CVD? Both are shown, separately.</li>
            <li><strong>ΔE under simulation</strong> is perceptual distance between the simulated content and surface colors. Larger = easier to tell apart. There is no universal pass threshold; compare relative values.</li>
            <li><strong>Color is never the only signal:</strong> every registry entry declares a non-color cue — icon, copy, border, or shape — so meaning survives even when hues converge.</li>
            <li><strong>Simulation is approximate:</strong> linear-sRGB deficiency matrices (Viénot/Brettel) approximate how these colors may appear; they are a review aid, not a certification.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

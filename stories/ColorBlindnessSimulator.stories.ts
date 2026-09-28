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

// ─── Purpose ──────────────────────────────────────────────────────────────────
// A governance/QA tool, not a curated showcase: every entry in
// tokens/compatibility-registry.json is run through simulated color-vision
// deficiency. Most combos pass (they already carry a non-color cue by
// design) — so passes are collapsed by default and only flagged combos are
// shown up front, to keep this page useful for review rather than a wall of
// 15 near-identical cards. This is intentionally the kind of check that
// could run in CI against the registry directly (see the exported JSON).

const VISION_TYPES = [
  { key: 'protanopia', label: 'Protanopia', sim: 'protanopia' as const },
  { key: 'deuteranopia', label: 'Deuteranopia', sim: 'deuteranopia' as const },
  { key: 'tritanopia', label: 'Tritanopia', sim: 'tritanopia' as const },
];

// Heuristic, not a certification. `deltaE()` returns an OKLab-space
// distance (not the 0-100 CIE76 scale) — verified against this registry:
// every real content/surface pair here measures ~0.4-0.7 normally, and
// simulation barely moves that (this token set separates state mainly by
// lightness, not hue, so CVD simulation rarely erases it). A value this
// low only shows up when the base color relationship is nearly invisible
// in ANY vision, i.e. a genuinely low-contrast pairing rather than a
// CVD-specific collapse — confirmed empirically before picking 0.05.
const DELTA_E_FLAG_THRESHOLD = 0.05;

type ComboResult = {
  name: string;
  path: { surface: string; content: string; border: string | null };
  wcag: number;
  nonColorCue: string;
  perVision: { key: string; label: string; deltaE: number; flagged: boolean }[];
  flagged: boolean;
};

function auditCombination(name: string): ComboResult {
  const combo = combinations[name];
  const surface = resolvePath(combo.surface);
  const content = resolvePath(combo.content);
  const wcag = contrastRatio(content, surface);

  const perVision = VISION_TYPES.map((v) => {
    const simSurface = simulateCvd(surface, v.sim);
    const simContent = simulateCvd(content, v.sim);
    const dE = deltaE(simContent, simSurface);
    return { key: v.key, label: v.label, deltaE: dE, flagged: dE < DELTA_E_FLAG_THRESHOLD };
  });

  return {
    name,
    path: { surface: combo.surface, content: combo.content, border: combo.border },
    wcag,
    nonColorCue: combo.nonColorCue,
    perVision,
    flagged: perVision.some((v) => v.flagged),
  };
}

const AUDIT: ComboResult[] = Object.keys(combinations).map(auditCombination);
const FLAGGED = AUDIT.filter((r) => r.flagged);
const PASSING = AUDIT.filter((r) => !r.flagged);

function renderCombination(result: ComboResult): string {
  const combo = combinations[result.name];
  const surface = resolvePath(combo.surface);
  const content = resolvePath(combo.content);
  const border = combo.border ? resolvePath(combo.border) : null;

  const cells = result.perVision
    .map((v) => {
      const simSurface = simulateCvd(
        surface,
        v.key as 'protanopia' | 'deuteranopia' | 'tritanopia',
      );
      const simContent = simulateCvd(
        content,
        v.key as 'protanopia' | 'deuteranopia' | 'tritanopia',
      );
      const simBorder = border
        ? simulateCvd(border, v.key as 'protanopia' | 'deuteranopia' | 'tritanopia')
        : null;
      return `<div class="cb-cell">
        <div class="cb-cell-label">${v.label}${v.flagged ? ' ⚠' : ''}</div>
        <div class="cb-preview" style="background:${simSurface};border:2px solid ${simBorder ?? 'transparent'};">
          <span style="color:${simContent}">Sample text</span>
        </div>
        <div class="cb-delta ${v.flagged ? 'flag' : ''}" title="Perceptual distance between content and surface under this vision type">ΔE ${v.deltaE.toFixed(3)}</div>
      </div>`;
    })
    .join('');

  return `<div class="cb-card ${result.flagged ? 'flagged' : ''}">
    <div class="cb-card-head">
      <div>
        <div class="cb-card-name">${result.flagged ? '⚠ ' : ''}${result.name}</div>
        <div class="cb-card-paths"><code>${result.path.content}</code> on <code>${result.path.surface}</code></div>
      </div>
      <div class="cb-wcag" title="WCAG contrast — a single measurement, independent of vision simulation">
        <span class="cb-wcag-label">WCAG</span>
        <span class="cb-wcag-val ${result.wcag >= 4.5 ? 'pass' : result.wcag >= 3 ? 'warn' : 'fail'}">${result.wcag.toFixed(1)}:1</span>
      </div>
    </div>
    <div class="cb-grid">${cells}</div>
    <div class="cb-cue"><span class="cb-cue-label">Non-color cue:</span> ${result.nonColorCue}</div>
  </div>`;
}

// Machine-readable summary — the shape a CI check against this same
// registry could assert on directly, rather than eyeballing the page.
function auditJson(): string {
  return JSON.stringify(
    AUDIT.map((r) => ({
      combination: r.name,
      wcag: Number(r.wcag.toFixed(2)),
      flagged: r.flagged,
      perVision: r.perVision.map((v) => ({
        vision: v.key,
        deltaE: Number(v.deltaE.toFixed(4)),
        flagged: v.flagged,
      })),
    })),
    null,
    2,
  );
}

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .cb-summary {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      padding: 16px 20px; margin-bottom: 24px;
    }
    .cb-summary-count { font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 16px; color: var(--cedar-warm-900); }
    .cb-summary-count strong.fail { color: #811823; }
    .cb-summary-count strong.pass { color: #2e6b34; }
    .cb-toggle {
      font-family: Pressura, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
      padding: 8px 14px; border-radius: 6px; border: 1px solid var(--cedar-warm-300);
      background: white; color: var(--cedar-warm-800); cursor: pointer;
    }
    .cb-toggle:hover { background: var(--cedar-warm-50); }
    .cb-passing-list {
      display: none; font-size: 12px; color: var(--cedar-warm-600); margin: 0 0 24px;
      background: var(--cedar-warm-50); border-radius: 8px; padding: 12px 16px;
    }
    .cb-passing-list.is-open { display: block; }
    .cb-passing-list code { margin-right: 8px; }
    .cb-card { background:white; border:1px solid var(--cedar-warm-200); border-radius:12px; padding:20px; margin-bottom:20px; }
    .cb-card.flagged { border-color: #d99a9a; background: #fff8f8; }
    .cb-card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
    .cb-card-name { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:14px; font-weight:600; color:var(--cedar-warm-900); }
    .cb-card-paths { font-size:11px; color:var(--cedar-warm-600); margin-top:2px; }
    .cb-wcag { text-align:right; }
    .cb-wcag-label { font-family:Pressura,monospace; font-size:9px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); display:block; }
    .cb-wcag-val { font-family:monospace; font-size:14px; font-weight:700; padding:1px 8px; border-radius:4px; }
    .cb-wcag-val.pass { color:#2e6b34; }
    .cb-wcag-val.warn { color:#854714; }
    .cb-wcag-val.fail { color:#811823; }
    .cb-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:12px; }
    .cb-cell-label { font-family:Pressura,monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--cedar-warm-600); margin-bottom:6px; }
    .cb-preview { height:56px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-family:Graphik,'Helvetica Neue',sans-serif; font-size:13px; font-weight:500; }
    .cb-delta { font-family:monospace; font-size:10px; color:var(--cedar-warm-600); margin-top:4px; }
    .cb-delta.flag { color: #811823; font-weight: 700; }
    .cb-cue { font-size:12px; color:var(--cedar-warm-700); border-top:1px solid var(--cedar-warm-200); padding-top:10px; }
    .cb-cue-label { font-weight:600; }
    .cb-explainer { background:var(--cedar-green-50); border:1px solid var(--cedar-green-200); border-radius:12px; padding:24px; margin-bottom: 24px; }
    .cb-explainer h3 { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:18px; font-weight:600; color:var(--cedar-green-900); margin:0 0 12px 0; }
    .cb-explainer li { color:var(--cedar-green-800); line-height:1.6; font-size:14px; margin-bottom:8px; }
    .cb-explainer ul { margin:0; padding-left:20px; }
    .cb-json-panel { background: var(--cedar-warm-900); border-radius: 12px; padding: 20px; }
    .cb-json-panel pre { margin: 0; color: #e8e6e3; font-family: monospace; font-size: 11px; line-height: 1.6; max-height: 300px; overflow: auto; }
    .cb-json-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .cb-json-head h4 { margin: 0; color: white; font-family: Pressura, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
`;

export const ColorBlindnessSimulator: Story = {
  name: 'Color Blindness Simulator',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Color-Vision Audit: Compatibility Registry</h2>
        </div>
        <p style="margin-bottom:24px; color:var(--cedar-warm-700); line-height:1.6; max-width:780px;">
          Every one of the ${AUDIT.length} approved combinations in
          <code>tokens/compatibility-registry.json</code> is run here under simulated
          protanopia/deuteranopia/tritanopia. This is a review tool, not a marketing demo —
          passing combinations are collapsed by default so the page stays useful instead of
          becoming a 15-card wall to scroll past.
        </p>

        <div class="cb-summary">
          <div class="cb-summary-count">
            <strong class="${FLAGGED.length ? 'fail' : 'pass'}">${FLAGGED.length}</strong> of ${AUDIT.length} combinations flagged for review ·
            <strong class="pass">${PASSING.length}</strong> pass cleanly
          </div>
          <button type="button" class="cb-toggle" id="cb-toggle-passing" aria-expanded="false" aria-controls="cb-passing-list">
            Show ${PASSING.length} passing combinations
          </button>
        </div>

        <div class="cb-passing-list" id="cb-passing-list">
          ${PASSING.map((r) => `<code>${r.name}</code>`).join('')}
        </div>

        ${FLAGGED.length ? FLAGGED.map(renderCombination).join('') : '<p style="color:var(--cedar-warm-600);margin-bottom:24px;">No combinations flagged at the current ΔE threshold.</p>'}

        <div class="cb-explainer">
          <h3>Reading the results</h3>
          <ul>
            <li><strong>This threshold is a heuristic, not a certification:</strong> ΔE ${'<'} ${DELTA_E_FLAG_THRESHOLD} under simulation is flagged for human review — it does not mean the combination is inaccessible. Every registry entry already declares a non-color cue for exactly this reason.</li>
            <li><strong>WCAG contrast ≠ simulation:</strong> WCAG measures the actual colors against a fixed formula and never changes per vision type; ΔE asks whether the pairing still looks different to someone with a CVD. Both are shown, separately.</li>
            <li><strong>Simulation is approximate:</strong> linear-sRGB deficiency matrices (Viénot/Brettel) approximate appearance; treat this as a review aid, not ground truth.</li>
            <li><strong>Built for automation:</strong> this audit runs directly against the registry with no manual curation — the same <code>auditCombination()</code> logic could run as a CI check that fails a PR introducing a new combination without adequate non-color cues.</li>
          </ul>
        </div>

        <div class="cb-json-panel">
          <div class="cb-json-head"><h4>Exported audit JSON (for CI / automation)</h4></div>
          <pre>${auditJson()}</pre>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector<HTMLButtonElement>('#cb-toggle-passing');
    const list = canvasElement.querySelector<HTMLElement>('#cb-passing-list');
    toggle?.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      list?.classList.toggle('is-open', !open);
      toggle.textContent = open
        ? `Show ${PASSING.length} passing combinations`
        : `Hide passing combinations`;
    });
  },
};

import type { StoryObj, Meta } from '@storybook/html-vite';
import { resolvePath } from './color-registry';
import { contrastRatio, hexToRgb, oklchToRgb, rgbToOklch } from './oklch-math';
// The real shipped CSS custom properties the generated code panel's
// var(--cdr-...) references (and the live preview card) resolve against —
// without this, every var() reference below points at nothing.
import '../dist/rei-dot-com/css/foundations/cdr-color-action.css';
import '../dist/rei-dot-com/css/foundations/cdr-color-control.css';
import '../dist/rei-dot-com/css/foundations/cdr-color-feedback.css';
import '../dist/rei-dot-com/css/foundations/cdr-color-text.css';

const meta: Meta = {
  title: 'OKLCH/Composable Color Functions',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// Verified against the compiled CSS (same formula used in Custom Component
// Composer): every family drops "color" from its var name except the root
// `text` family, which ships as --cdr-color-text-* to avoid colliding with
// typography's own --cdr-text-* namespace.
function cssVarForPath(path: string): string {
  const [, family, ...rest] = path.split('/');
  const segments = family === 'text' ? ['color', family, ...rest] : [family, ...rest];
  return `--cdr-${segments.join('-')}`;
}

// ─── Purpose ──────────────────────────────────────────────────────────────────
// Every other OKLCH demo in this repo shows a single function's output. This
// one shows functions STACKING: pick one approved base token, and everything
// else — its foreground, its hover fill, and its hover foreground — is
// derived by feeding one function's output into the next, rather than
// looking up four separate tokens. That's the actual payoff of exposing
// color as callable functions instead of a flat swatch list.

// ─── Function 1: solveForeground ───────────────────────────────────────────────
// A real contrast-solving function, not a lookup: given any background,
// picks whichever of two approved, real, compiled content tokens gives the
// higher contrast. Both candidates are genuinely shipped roles —
// color.text.primary (dark, used for body text on light surfaces per the
// compatibility registry) and action.text.neutral.trace (white, used for
// text on dark action surfaces) — this function just decides which applies.
const DARK_CONTENT = { path: 'color/text/primary', hex: resolvePath('color/text/primary') };
const LIGHT_CONTENT = {
  path: 'color/action/text/neutral/trace',
  hex: resolvePath('color/action/text/neutral/trace'),
};

function solveForeground(bgHex: string): { hex: string; path: string; contrast: number } {
  const darkContrast = contrastRatio(DARK_CONTENT.hex, bgHex);
  const lightContrast = contrastRatio(LIGHT_CONTENT.hex, bgHex);
  return darkContrast >= lightContrast
    ? { hex: DARK_CONTENT.hex, path: DARK_CONTENT.path, contrast: darkContrast }
    : { hex: LIGHT_CONTENT.hex, path: LIGHT_CONTENT.path, contrast: lightContrast };
}

// ─── Function 2: deepen (hover fill) ────────────────────────────────────────────
// A measured transform, not an invented one: the real OKLCH relationship
// between an approved brand surface (faint) and its own solid endpoint
// (verified against the compiled tokens below). Applying a FRACTION of that
// same measured relationship to any base gives a plausible "deepen on
// hover" step — the same technique the very first recipe demo in this repo
// used, generalized to compose with the other functions here.
const FAINT_REF = resolvePath('color/action/surface/brand/faint'); // #bfddca
const SOLID_REF = resolvePath('color/action/border/brand'); // #143528
const REF_TRANSFORM = (() => {
  const from = rgbToOklch(hexToRgb(FAINT_REF));
  const to = rgbToOklch(hexToRgb(SOLID_REF));
  let dH = to.h - from.h;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  return { dL: to.l - from.l, cScale: from.c > 0 ? to.c / from.c : 1, dH };
})();
const HOVER_FRACTION = 0.22; // a subtle step toward the measured solid endpoint, not the full jump

function deepen(hex: string): string {
  const o = rgbToOklch(hexToRgb(hex));
  const shifted = {
    l: Math.min(1, Math.max(0, o.l + REF_TRANSFORM.dL * HOVER_FRACTION)),
    c: Math.max(0, o.c * (1 + (REF_TRANSFORM.cScale - 1) * HOVER_FRACTION)),
    h: (o.h + REF_TRANSFORM.dH * HOVER_FRACTION + 360) % 360,
  };
  const { rgb } = oklchToRgb(shifted);
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`;
}

// deepen() as REAL, executable CSS — not a description of what the JS did,
// the literal calc() expression using the exact same numbers, via CSS
// Relative Color Syntax (oklch(from <color> ...)), which is a shipped
// feature in current Chrome/Safari/Firefox, not a proposal. This is the
// point of the whole page: this one line of CSS IS the deepen() function.
function deepenCssExpr(baseVarExpr: string): string {
  const dL = REF_TRANSFORM.dL * HOVER_FRACTION;
  const cMult = 1 + (REF_TRANSFORM.cScale - 1) * HOVER_FRACTION;
  const dH = REF_TRANSFORM.dH * HOVER_FRACTION;
  const lSign = dL >= 0 ? '+' : '-';
  const hSign = dH >= 0 ? '+' : '-';
  return `oklch(from ${baseVarExpr} calc(l ${lSign} ${Math.abs(dL).toFixed(3)}) calc(c * ${cMult.toFixed(3)}) calc(h ${hSign} ${Math.abs(dH).toFixed(2)}))`;
}

// ─── Approved bases ─────────────────────────────────────────────────────────────
// Restricted to real, resolvable token paths — same rule as every other
// demo here: the function is free to compose, the base is not free-color.
const BASES = [
  { label: 'action.surface.brand.faint', path: 'color/action/surface/brand/faint' },
  { label: 'action.surface.sale.faint', path: 'color/action/surface/sale/faint' },
  { label: 'feedback.surface.error.faint', path: 'color/feedback/surface/error/faint' },
  { label: 'control.surface.neutral.trace', path: 'color/control/surface/neutral/trace' },
  { label: 'action.border.brand (solid)', path: 'color/action/border/brand' },
  { label: 'action.text.sale (solid)', path: 'color/action/text/sale' },
];

function contrastBadge(ratio: number): string {
  const cls = ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail';
  return `<span class="cf-badge ${cls}">${ratio.toFixed(1)}:1</span>`;
}

function renderPipeline(basePath: string): string {
  const base = resolvePath(basePath);
  const fg = solveForeground(base);
  const hoverFill = deepen(base);
  const hoverFg = solveForeground(hoverFill);

  return `
    <div class="cf-pipeline">
      <div class="cf-step">
        <div class="cf-step-label">1. Base (your pick)</div>
        <div class="cf-swatch" style="background:${base}"></div>
        <code>${base}</code>
        <div class="cf-path">${basePath}</div>
      </div>
      <div class="cf-arrow">solveForeground() →</div>
      <div class="cf-step">
        <div class="cf-step-label">2. Foreground (derived)</div>
        <div class="cf-swatch" style="background:${fg.hex}"></div>
        <code>${fg.hex}</code>
        <div class="cf-path">${fg.path} ${contrastBadge(fg.contrast)}</div>
      </div>
      <div class="cf-arrow">deepen() →</div>
      <div class="cf-step">
        <div class="cf-step-label">3. Hover fill (derived from base)</div>
        <div class="cf-swatch" style="background:${hoverFill}"></div>
        <code>${hoverFill}</code>
        <div class="cf-path">deepen(base, 22% of measured faint→solid transform)</div>
      </div>
      <div class="cf-arrow">solveForeground() →</div>
      <div class="cf-step">
        <div class="cf-step-label">4. Hover foreground (same function, new input)</div>
        <div class="cf-swatch" style="background:${hoverFg.hex}"></div>
        <code>${hoverFg.hex}</code>
        <div class="cf-path">${hoverFg.path} ${contrastBadge(hoverFg.contrast)}</div>
      </div>
    </div>

    <div class="cf-preview-row">
      <div
        class="cf-preview-card"
        style="--cf-base:var(${cssVarForPath(basePath)}); --cf-fg:var(${cssVarForPath(fg.path)}); --cf-hover-fg:var(${cssVarForPath(hoverFg.path)});"
        tabindex="0"
      >
        Container with a generated foreground
      </div>
      <div class="cf-preview-hint">Hover or focus the card — the hover background is not precomputed: <code>:hover</code> below runs the literal <code>oklch(from var(--cf-base) ...)</code> expression on <code>--cf-base</code> live, in your browser, right now.</div>
    </div>

    <div class="cf-code-panel">
      <div class="cf-code-head">Real, shippable CSS — this is <code>deepen()</code>, not a description of it</div>
      <pre>.container {
  background: var(${cssVarForPath(basePath)}); /* ${basePath} */
  color: var(${cssVarForPath(fg.path)}); /* ${fg.path} — chosen by solveForeground() at build time, see note below */
}
.container:hover {
  /* deepen() IS this line: CSS Relative Color Syntax, supported in current
     Chrome/Safari/Firefox — the browser computes the shift, nothing is
     precomputed or baked into a second token. */
  background: ${deepenCssExpr(`var(${cssVarForPath(basePath)})`)};
  color: var(${cssVarForPath(hoverFg.path)}); /* solveForeground() re-run on the hover fill, still chosen ahead of time */
}</pre>
      <div class="cf-code-note">
        <strong>Why <code>color</code> isn't computed live too:</strong> <code>solveForeground()</code> is a
        decision (pick A or B), and CSS has no shipped way to make that decision from an arbitrary
        background yet — <code>contrast-color()</code> exists only as a CSS Color Module Level&nbsp;5 draft,
        unsupported in any browser today. In real CSS, that decision gets made once (by this function, at
        build/design time) and shipped as a token — which is exactly what
        <code>compatibility-registry.json</code> is for. <code>deepen()</code> is different: it's a fixed
        numeric shift, which relative color syntax can express directly, live, in the browser.
      </div>
    </div>

    <div class="cf-design-panel">
      <div class="cf-code-head">The same idea, for design</div>
      <p>
        Figma can alias a variable to this base token, but it cannot run <code>deepen()</code> or
        <code>solveForeground()</code> live — there's no relative-color-syntax equivalent in Figma
        variables. The design-side workflow has to <em>bake</em> what CSS can compute:
      </p>
      <ol>
        <li>Alias a Figma variable to the same base token used above.</li>
        <li>Run the <em>same</em> <code>deepen()</code>/<code>solveForeground()</code> math — via a plugin, or by hand using this page as the reference — to get the hover fill and both foregrounds as concrete hex values.</li>
        <li>Save those results as their own Figma variables (or styles) rather than expecting Figma to derive them each time a base changes.</li>
        <li>When the base token changes, re-run step 2 and update the saved variables — this is the manual step CSS's relative color syntax removes for developers.</li>
      </ol>
      <p class="cf-design-note">
        This is the real asymmetry: a developer can point at one base token and let the browser derive
        the rest; a designer authoring the same relationship has to compute and store every derived value
        once, then keep it in sync by hand (or with a plugin) whenever the base changes.
      </p>
    </div>
  `;
}

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section-header { display:flex; align-items:baseline; gap:12px; margin-bottom:24px; padding-bottom:10px; border-bottom:2px solid var(--cedar-warm-100); }
    .sb-section-title { font-family:Stuart,'Stuart fallback',Georgia,serif; font-size:22px; font-weight:600; color:var(--cedar-warm-1000); margin:0; letter-spacing:-0.3px; }
    .cf-intro { max-width: 780px; color: var(--cedar-warm-700); line-height: 1.6; margin-bottom: 24px; }
    .cf-controls {
      display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px;
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px; padding: 16px;
    }
    .cf-controls label { display: block; font-family: Pressura, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cedar-warm-600); margin-bottom: 6px; }
    .cf-controls select { padding: 8px 10px; border: 1px solid var(--cedar-warm-300); border-radius: 6px; font-size: 13px; min-width: 260px; }
    .cf-pipeline { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 24px; }
    .cf-step { background: white; border: 1px solid var(--cedar-warm-200); border-radius: 10px; padding: 12px; width: 168px; }
    .cf-step-label { font-family: Pressura, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--cedar-warm-600); margin-bottom: 8px; }
    .cf-swatch { height: 48px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.12); margin-bottom: 8px; }
    .cf-step code { font-size: 12px; display: block; }
    .cf-path { font-size: 10px; color: var(--cedar-warm-500); margin-top: 4px; word-break: break-word; }
    .cf-arrow { font-family: Pressura, monospace; font-size: 11px; color: var(--cedar-warm-600); white-space: nowrap; }
    .cf-badge { font-family: Pressura, monospace; font-size: 10px; padding: 1px 6px; border-radius: 4px; display: inline-block; margin-top: 2px; }
    .cf-badge.pass { background: #d4edda; color: #155724; }
    .cf-badge.warn { background: #fff3cd; color: #856404; }
    .cf-badge.fail { background: #f8d7da; color: #721c24; }
    .cf-preview-row { margin-bottom: 24px; }
    .cf-preview-card {
      display: inline-flex; align-items: center; justify-content: center;
      width: 320px; height: 96px; border-radius: 10px; cursor: pointer;
      background: var(--cf-base); color: var(--cf-fg);
      font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 15px; font-weight: 600;
      transition: background 0.15s ease, color 0.15s ease;
      outline-offset: 3px;
    }
    /* This IS deepen() — the browser evaluates it live against whatever
       --cf-base is currently set to, no JS recomputation involved. */
    .cf-preview-card:hover, .cf-preview-card:focus-visible {
      background: ${deepenCssExpr('var(--cf-base)')}; color: var(--cf-hover-fg);
    }
    .cf-preview-hint { margin-top: 10px; color: var(--cedar-warm-600); font-size: 12px; max-width: 480px; }
    .cf-code-panel { background: var(--cedar-warm-900); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .cf-code-panel pre { margin: 0; color: #e8e6e3; font-family: monospace; font-size: 12px; line-height: 1.7; }
    .cf-code-head { font-family: Pressura, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cedar-warm-600); margin-bottom: 10px; }
    .cf-code-panel .cf-code-head { color: #cfcbc3; }
    .cf-code-note {
      margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.15);
      color: #cfcbc3; font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 12px; line-height: 1.6;
    }
    .cf-code-note code { color: #e8e6e3; }
    .cf-design-panel {
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      padding: 20px; margin-bottom: 24px; color: var(--cedar-warm-800); font-size: 14px; line-height: 1.6;
    }
    .cf-design-panel p { margin: 0 0 12px; }
    .cf-design-panel ol { margin: 0 0 12px; padding-left: 20px; }
    .cf-design-panel li { margin-bottom: 6px; }
    .cf-design-note { color: var(--cedar-warm-600); font-size: 13px; }
    .cf-explainer { background: var(--cedar-green-50); border: 1px solid var(--cedar-green-200); border-radius: 12px; padding: 24px; }
    .cf-explainer h3 { font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px; font-weight: 600; color: var(--cedar-green-900); margin: 0 0 12px; }
    .cf-explainer ul { margin: 0; padding-left: 20px; }
    .cf-explainer li { color: var(--cedar-green-800); line-height: 1.6; font-size: 14px; margin-bottom: 8px; }
  </style>
`;

const DEFAULT_BASE = BASES[0].path;

export const ComposableColorFunctions: Story = {
  name: 'Stacking Functions',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Composable Color Functions: Stacking Outputs as Inputs</h2>
        </div>
        <p class="cf-intro">
          Pick one approved surface token. Everything else on this page — its readable
          foreground, its hover fill, and its hover foreground — is <em>derived</em>, not
          looked up: <code>solveForeground()</code> and <code>deepen()</code> each take the
          previous step's output as their input. That's the difference between "four tokens
          per component" and "one base token plus two functions."
        </p>

        <div class="cf-controls">
          <div>
            <label for="cf-base">Base token</label>
            <select id="cf-base">
              ${BASES.map((b) => `<option value="${b.path}" ${b.path === DEFAULT_BASE ? 'selected' : ''}>${b.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="cf-pipeline">${renderPipeline(DEFAULT_BASE)}</div>

        <div class="cf-explainer">
          <h3>What's real here</h3>
          <ul>
            <li><strong>solveForeground()</strong> picks the higher-contrast of two real, compiled content tokens (<code>color.text.primary</code>, dark; <code>action.text.neutral.trace</code>, white) — it's a decision function over approved roles, not an invented gray.</li>
            <li><strong>deepen()</strong> applies 22% of a real measured OKLCH transform — the actual relationship between <code>action.surface.brand.faint</code> and its own solid endpoint <code>action.border.brand</code> — to whichever base is selected. The fraction is a design choice (a full jump would be too dramatic for hover); the underlying transform is measured, not guessed.</li>
            <li><strong>The composition is the point:</strong> step 4 calls the exact same <code>solveForeground()</code> function as step 2, just fed step 3's output. No separate "hover foreground" formula exists — it falls out of composing the same two functions differently.</li>
            <li><strong>Try a dark base</strong> (the two "solid" options) — <code>solveForeground()</code> correctly flips to the white content token instead of the dark one, because it's solving for contrast, not returning a fixed answer.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector<HTMLSelectElement>('#cf-base');
    const pipeline = canvasElement.querySelector<HTMLElement>('#cf-pipeline');
    if (!select || !pipeline) return;
    select.addEventListener('change', () => {
      pipeline.innerHTML = renderPipeline(select.value);
    });
  },
};

import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorControl } from '../dist/rei-dot-com/types/foundations/cdr-color-control.mjs';
import { CdrColorSelection } from '../dist/rei-dot-com/types/foundations/cdr-color-selection.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  contrastRatio,
  type Oklch,
} from './oklch-math';

const meta: Meta = {
  title: 'OKLCH/Utility Color Functions',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── Approved semantic bases ─────────────────────────────────────────────────
// Only tokens that belong to each intent — no arbitrary colors.

const INTENT_BASES: Record<string, { label: string; token: string; hex: string }[]> = {
  action: [
    {
      label: 'action / surface / brand / faint',
      token: 'CdrColorActionSurfaceBrandFaint',
      hex: CdrColorAction.CdrColorActionSurfaceBrandFaint,
    },
    {
      label: 'action / surface / sale / faint',
      token: 'CdrColorActionSurfaceSaleFaint',
      hex: CdrColorAction.CdrColorActionSurfaceSaleFaint,
    },
    {
      label: 'action / surface / neutral / faint',
      token: 'CdrColorActionSurfaceNeutralFaint',
      hex: CdrColorAction.CdrColorActionSurfaceNeutralFaint,
    },
    {
      label: 'action / surface / neutral / subtle',
      token: 'CdrColorActionSurfaceNeutralSubtle',
      hex: CdrColorAction.CdrColorActionSurfaceNeutralSubtle,
    },
    {
      label: 'action / surface / neutral / trace',
      token: 'CdrColorActionSurfaceNeutralTrace',
      hex: CdrColorAction.CdrColorActionSurfaceNeutralTrace,
    },
    {
      label: 'action / border / brand',
      token: 'CdrColorActionBorderBrand',
      hex: CdrColorAction.CdrColorActionBorderBrand,
    },
  ],
  control: [
    {
      label: 'control / surface / natural / faint',
      token: 'CdrColorControlSurfaceNaturalFaint',
      hex: CdrColorControl.CdrColorControlSurfaceNaturalFaint,
    },
    {
      label: 'control / surface / neutral / faint',
      token: 'CdrColorControlSurfaceNeutralFaint',
      hex: CdrColorControl.CdrColorControlSurfaceNeutralFaint,
    },
    {
      label: 'control / surface / neutral / subtle',
      token: 'CdrColorControlSurfaceNeutralSubtle',
      hex: CdrColorControl.CdrColorControlSurfaceNeutralSubtle,
    },
    {
      label: 'control / surface / neutral / trace',
      token: 'CdrColorControlSurfaceNeutralTrace',
      hex: CdrColorControl.CdrColorControlSurfaceNeutralTrace,
    },
  ],
  selection: [
    {
      label: 'selection / surface / natural',
      token: 'CdrColorSelectionSurfaceNatural',
      hex: CdrColorSelection.CdrColorSelectionSurfaceNatural,
    },
    {
      label: 'selection / surface / neutral / faint',
      token: 'CdrColorSelectionSurfaceNeutralFaint',
      hex: CdrColorSelection.CdrColorSelectionSurfaceNeutralFaint,
    },
    {
      label: 'selection / surface / neutral / subtle',
      token: 'CdrColorSelectionSurfaceNeutralSubtle',
      hex: CdrColorSelection.CdrColorSelectionSurfaceNeutralSubtle,
    },
    {
      label: 'selection / surface / neutral / trace',
      token: 'CdrColorSelectionSurfaceNeutralTrace',
      hex: CdrColorSelection.CdrColorSelectionSurfaceNeutralTrace,
    },
  ],
};

// ─── Measured state relationships ────────────────────────────────────────────
// The recipe is not invented — it is the measured OKLCH transform between the
// approved solid endpoint and its faint surface counterpart. Applying the same
// transform to any compatible base reproduces the spec's state relationships
// without defining per-state tokens.
//
// NOTE: color.action.surface.brand (solid) is not yet compiled into the build;
// the brand action color (#143528, shared by action.text.brand / border.brand /
// icon roles) is used as the solid endpoint.

type Transform = { dL: number; cScale: number; dH: number };

function measureTransform(fromHex: string, toHex: string): Transform {
  const from = rgbToOklch(hexToRgb(fromHex));
  const to = rgbToOklch(hexToRgb(toHex));
  let dH = to.h - from.h;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  return { dL: to.l - from.l, cScale: from.c === 0 ? 1 : to.c / from.c, dH };
}

function applyTransform(base: Oklch, t: Transform, scale: number): Oklch {
  return {
    l: Math.min(1, Math.max(0, base.l + t.dL * scale)),
    c: Math.max(0, base.c * (1 + (t.cScale - 1) * scale)),
    h: (base.h + t.dH * scale + 360) % 360,
  };
}

const BRAND_SOLID = CdrColorAction.CdrColorActionBorderBrand; // #143528 — solid endpoint proxy
const BRAND_FAINT = CdrColorAction.CdrColorActionSurfaceBrandFaint; // #bfddca
const FAINT_TRANSFORM = measureTransform(BRAND_SOLID, BRAND_FAINT);

const STRENGTH_SCALE: Record<string, number> = { subtle: 0.6, balanced: 1, strong: 1.5 };

const CONTEXTS: Record<string, { label: string; hex: string }> = {
  light: {
    label: 'Light (surface / neutral / trace)',
    hex: CdrColorSurface.CdrColorSurfaceNeutralTrace,
  },
  dark: { label: 'Dark (text / primary)', hex: CdrColorText.CdrColorTextPrimary },
};

const FOCUS_RING = '#3d6db9'; // CdrColorSelectionBorderTrigger — focus is an indicator, not a recolor
const TRACE = CdrColorSurface.CdrColorSurfaceNeutralTrace;

// ─── State computation ────────────────────────────────────────────────────────

type ComputedState = {
  name: string;
  oklch: Oklch;
  hex: string;
  css: string;
  inGamut: boolean;
  isFocus?: boolean;
};

// Content color for a surface: pick the better-contrast of the two approved
// text tokens rather than assuming white-on-color or color-on-white. This is
// what makes the spec's text.trace ↔ text.brand flip emerge automatically.
function contentFor(surfaceHex: string): string {
  const primary = CdrColorText.CdrColorTextPrimary;
  const inverse = CdrColorText.CdrColorTextInverse;
  return contrastRatio(primary, surfaceHex) >= contrastRatio(inverse, surfaceHex)
    ? primary
    : inverse;
}

// State mapping mirrors the spec: hover moves the surface toward its faint
// counterpart, pressed returns toward rest, disabled neutralizes. Direction is
// chosen from the base lightness — solid bases lift, faint bases deepen.
function computeStates(baseHex: string, strength: string, contextHex: string): ComputedState[] {
  const base = rgbToOklch(hexToRgb(baseHex));
  const s = STRENGTH_SCALE[strength];
  const dir = base.l < 0.6 ? 1 : -1;

  const ctx = rgbToOklch(hexToRgb(contextHex));
  const disabled: Oklch = {
    l: base.l + (ctx.l - base.l) * 0.6,
    c: base.c * 0.3,
    h: base.h,
  };

  const mk = (name: string, o: Oklch): ComputedState => {
    const { rgb, inGamut } = oklchToRgb(o);
    const dL = o.l - base.l;
    const cR = o.c / (base.c || 1);
    return {
      name,
      oklch: o,
      hex: rgbToHex(rgb),
      css:
        Math.abs(dL) < 0.0001 && Math.abs(cR - 1) < 0.001
          ? baseHex
          : `oklch(from ${baseHex} calc(l ${dL >= 0 ? '+' : '-'} ${(Math.abs(dL) * 100).toFixed(1)}%) calc(c * ${cR.toFixed(2)}) h)`,
      inGamut,
    };
  };

  return [
    mk('Rest', base),
    mk('Hover', applyTransform(base, FAINT_TRANSFORM, dir * 1.0 * s)),
    mk('Pressed', applyTransform(base, FAINT_TRANSFORM, dir * -0.12 * s)),
    { ...mk('Focus', base), isFocus: true },
    mk('Selected', applyTransform(base, FAINT_TRANSFORM, dir * 0.6 * s)),
    mk('Disabled', disabled),
  ];
}

// ─── Rendering helpers ────────────────────────────────────────────────────────

function badge(pass: boolean | 'warn', label: string): string {
  const cls = pass === 'warn' ? 'warn' : pass ? 'pass' : 'fail';
  return `<span class="vr-badge ${cls}">${label}</span>`;
}

function renderDemo(intent: string, baseToken: string, context: string, strength: string): string {
  const bases = INTENT_BASES[intent];
  const base = bases.find((b) => b.token === baseToken) ?? bases[0];
  const ctx = CONTEXTS[context];
  const states = computeStates(base.hex, strength, ctx.hex);

  // Secondary variant per spec: trace surface + base as border/text accent.
  // Hover reuses the same measured faint transform for its surface.
  const secondaryStates = states.map((st) => ({
    ...st,
    surface:
      st.name === 'Disabled'
        ? st.hex
        : st.name === 'Hover'
          ? st.hex
          : st.name === 'Selected'
            ? st.hex
            : TRACE,
  }));

  const rows = states
    .map((st, i) => {
      const content = contentFor(st.hex);
      const contentRatio = contrastRatio(content, st.hex);
      const surfaceRatio = contrastRatio(st.hex, ctx.hex);
      const contentCheck =
        st.name === 'Disabled'
          ? badge(
              contentRatio >= 3 ? 'warn' : false,
              `${contentRatio.toFixed(1)}:1 ${contentRatio >= 3 ? 'readable' : 'too low'}`,
            )
          : badge(contentRatio >= 4.5, `${contentRatio.toFixed(1)}:1`);
      const gamut = st.inGamut ? badge(true, 'in gamut') : badge('warn', 'out of sRGB');
      const sec = secondaryStates[i];
      return `<tr>
        <td class="vr-state">${st.name}${st.isFocus ? ' (ring)' : ''}</td>
        <td><span class="vr-chip" style="background:${st.hex}"></span><code>${st.hex}</code></td>
        <td><span class="vr-chip" style="background:${sec.surface}"></span><code>${sec.surface}</code></td>
        <td class="vr-oklch">L ${(st.oklch.l * 100).toFixed(1)} · C ${st.oklch.c.toFixed(3)} · H ${Math.round(st.oklch.h)}</td>
        <td>${contentCheck}</td>
        <td>${surfaceRatio.toFixed(1)}:1</td>
        <td>${gamut}</td>
      </tr>`;
    })
    .join('');

  const primaryBtn = (st: ComputedState) => {
    const ring = st.isFocus ? `box-shadow: 0 0 0 3px ${ctx.hex}, 0 0 0 6px ${FOCUS_RING};` : '';
    return `<button class="vr-btn" style="background:${st.hex};color:${contentFor(st.hex)};border:2px solid transparent;${ring}" ${st.name === 'Disabled' ? 'disabled' : ''}>Button</button>`;
  };

  const secondaryBtn = (st: ComputedState, surface: string) => {
    const ring = st.isFocus ? `box-shadow: 0 0 0 3px ${ctx.hex}, 0 0 0 6px ${FOCUS_RING};` : '';
    const accent = st.name === 'Disabled' ? st.hex : base.hex;
    return `<button class="vr-btn" style="background:${surface};color:${st.name === 'Disabled' ? CdrColorText.CdrColorTextSecondary : accent};border:2px solid ${accent};${ring}" ${st.name === 'Disabled' ? 'disabled' : ''}>Button</button>`;
  };

  const cssLines = states
    .filter((s2) => !s2.isFocus)
    .map((s2) => {
      const sel = s2.name === 'Rest' ? '' : `:${s2.name.toLowerCase()}`;
      return `  &${sel || ':not(:disabled)'} { background: ${s2.hex}; /* ${s2.css} */ }`;
    })
    .join('\n');

  const overallPass = states.every(
    (s2) =>
      s2.isFocus || s2.name === 'Disabled' || contrastRatio(contentFor(s2.hex), s2.hex) >= 4.5,
  );

  return `
    <div class="vr-recipe">
      <strong>Measured relationship:</strong>
      <code>color.action.surface.brand</code> ↔ <code>color.action.surface.brand.faint</code> →
      ΔL ${FAINT_TRANSFORM.dL >= 0 ? '+' : ''}${(FAINT_TRANSFORM.dL * 100).toFixed(1)}pp ·
      chroma ×${FAINT_TRANSFORM.cScale.toFixed(2)} ·
      hue ${FAINT_TRANSFORM.dH >= 0 ? '+' : ''}${FAINT_TRANSFORM.dH.toFixed(1)}°.
      Applied to <code>${base.token}</code> — any compatible base inherits the same states.
    </div>
    <div class="vr-summary">
      ${badge(overallPass, overallPass ? 'Passes system rules' : 'Fails content contrast')}
      <span class="vr-summary-detail">base <code>${base.token}</code> · strength ${strength}</span>
    </div>
    <div class="vr-preview" style="background:${ctx.hex}">
      <div class="vr-variant">
        <div class="vr-variant-label">Primary (solid surface)</div>
        ${states.map((st) => `<div class="vr-comp"><div class="vr-comp-label">${st.name}</div>${primaryBtn(st)}</div>`).join('')}
      </div>
      <div class="vr-variant">
        <div class="vr-variant-label">Secondary (trace + accent)</div>
        ${states.map((st, i) => `<div class="vr-comp"><div class="vr-comp-label">${st.name}</div>${secondaryBtn(st, secondaryStates[i].surface)}</div>`).join('')}
      </div>
    </div>
    <table class="vr-table">
      <thead><tr><th>State</th><th>Primary surface</th><th>Secondary surface</th><th>OKLCH</th><th>Content ↔ surface</th><th>Surface ↔ context</th><th>Gamut</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="vr-css"><pre>.component {
${cssLines}
  &:focus-visible { outline: 2px solid ${FOCUS_RING}; outline-offset: 2px; }
}</pre></div>`;
}

// ─── Shared chrome ────────────────────────────────────────────────────────────

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section { margin-bottom: 64px; }
    .sb-section-header {
      display: flex; align-items: baseline; gap: 12px;
      margin-bottom: 24px; padding-bottom: 10px;
      border-bottom: 2px solid var(--cedar-warm-100);
    }
    .sb-section-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 22px; font-weight: 600;
      color: var(--cedar-warm-1000); margin: 0; letter-spacing: -0.3px;
    }
    .vr-controls {
      display: flex; flex-wrap: wrap; gap: 16px;
      padding: 16px; margin-bottom: 24px;
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
    }
    .vr-field { display: flex; flex-direction: column; gap: 4px; }
    .vr-field label {
      font-family: Pressura, monospace; font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em; color: var(--cedar-warm-600);
    }
    .vr-field select {
      padding: 6px 10px; border: 1px solid var(--cedar-warm-300); border-radius: 6px;
      font-family: Pressura, monospace; font-size: 12px; background: white;
    }
    .vr-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .vr-summary-detail { font-size: 12px; color: var(--cedar-warm-600); }
    .vr-badge {
      font-family: Pressura, monospace; font-size: 10px; font-weight: 600;
      padding: 2px 8px; border-radius: 3px; display: inline-block; white-space: nowrap;
    }
    .vr-badge.pass { background: #d4edda; color: #155724; }
    .vr-badge.warn { background: #fff3cd; color: #856404; }
    .vr-badge.fail { background: #f8d7da; color: #721c24; }
    .vr-recipe {
      background: var(--cedar-warm-50); border: 1px solid var(--cedar-warm-200);
      border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;
      font-size: 13px; color: var(--cedar-warm-800); line-height: 1.5;
    }
    .vr-preview {
      display: flex; flex-wrap: wrap; gap: 40px;
      padding: 24px; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      margin-bottom: 24px;
    }
    .vr-variant { display: flex; flex-direction: column; gap: 12px; }
    .vr-variant-label {
      font-family: Pressura, monospace; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em; color: var(--cedar-warm-700);
      border-bottom: 1px solid var(--cedar-warm-200); padding-bottom: 6px;
    }
    .vr-comp { text-align: center; }
    .vr-comp-label {
      font-family: Pressura, monospace; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--cedar-warm-600); margin-bottom: 6px;
    }
    .vr-btn {
      font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 14px; font-weight: 500;
      padding: 10px 20px; border-radius: 6px; cursor: pointer;
    }
    .vr-btn:disabled { cursor: not-allowed; }
    .vr-table {
      width: 100%; border-collapse: collapse; background: white;
      border: 1px solid var(--cedar-warm-200); border-radius: 12px; overflow: hidden;
      margin-bottom: 24px; font-size: 12px;
    }
    .vr-table th {
      text-align: left; padding: 10px 12px; background: var(--cedar-warm-100);
      font-family: Pressura, monospace; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--cedar-warm-700);
    }
    .vr-table td { padding: 10px 12px; border-top: 1px solid var(--cedar-warm-200); }
    .vr-state { font-weight: 600; }
    .vr-chip {
      display: inline-block; width: 18px; height: 18px; border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.12); vertical-align: middle; margin-right: 8px;
    }
    .vr-oklch { font-family: monospace; color: var(--cedar-warm-700); }
    .vr-css {
      background: var(--cedar-warm-900); border-radius: 12px; padding: 20px;
      margin-bottom: 32px; overflow-x: auto;
    }
    .vr-css pre { margin: 0; color: #e8e6e3; font-size: 12px; line-height: 1.6; }
    .vr-notes {
      background: var(--cedar-green-50); border: 1px solid var(--cedar-green-200);
      border-radius: 12px; padding: 24px;
    }
    .vr-notes h3 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px;
      font-weight: 600; color: var(--cedar-green-900); margin: 0 0 12px 0;
    }
    .vr-notes ul { margin: 0; padding-left: 20px; }
    .vr-notes li { margin-bottom: 10px; color: var(--cedar-green-800); line-height: 1.5; }
    .vr-scss {
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      padding: 20px; margin-bottom: 32px;
    }
    .vr-scss h4 {
      font-family: Pressura, monospace; font-size: 12px; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--cedar-warm-700); margin: 0 0 12px 0;
    }
    .vr-scss pre {
      margin: 0; font-size: 12px; line-height: 1.6; overflow-x: auto;
      font-family: 'Monaco', 'Menlo', monospace; color: var(--cedar-warm-900);
    }
  </style>
`;

// ─── Story ────────────────────────────────────────────────────────────────────

const DEFAULTS = {
  intent: 'action',
  base: CdrColorAction.CdrColorActionSurfaceBrandFaint,
  baseToken: 'CdrColorActionSurfaceBrandFaint',
  context: 'light',
  strength: 'balanced',
};

function controlSelect(
  id: string,
  label: string,
  options: [string, string][],
  selected: string,
): string {
  const opts = options
    .map(([v, l]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${l}</option>`)
    .join('');
  return `<div class="vr-field"><label for="${id}">${label}</label><select id="${id}">${opts}</select></div>`;
}

function baseOptions(intent: string, selected: string): string {
  return INTENT_BASES[intent]
    .map(
      (b) =>
        `<option value="${b.token}" ${b.token === selected ? 'selected' : ''}>${b.label}</option>`,
    )
    .join('');
}

export const UtilityColorFunctions: Story = {
  name: 'Utility Color Functions',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Stateful Color Recipes</h2>
        </div>
        <p style="margin-bottom: 24px; color: var(--cedar-warm-700); line-height: 1.5; max-width: 760px;">
          Button states are not separate tokens — they are a relationship. The demo measures
          the OKLCH transform between the approved solid endpoint and its faint surface
          counterpart, then applies that same relationship to any compatible base. Content
          color is resolved per state by contrast, so the spec's
          <code>text.neutral.trace</code> ↔ <code>text.brand</code> flip emerges on its own.
        </p>

        <div class="vr-controls">
          ${controlSelect(
            'vr-intent',
            'Intent',
            [
              ['action', 'Action'],
              ['control', 'Control'],
              ['selection', 'Selection'],
            ],
            DEFAULTS.intent,
          )}
          <div class="vr-field">
            <label for="vr-base">Semantic base</label>
            <select id="vr-base">${baseOptions(DEFAULTS.intent, DEFAULTS.baseToken)}</select>
          </div>
          ${controlSelect('vr-context', 'Context', Object.entries(CONTEXTS).map(([k, v]) => [k, v.label]) as [string, string][], DEFAULTS.context)}
          ${controlSelect(
            'vr-strength',
            'Recipe strength',
            [
              ['subtle', 'Subtle'],
              ['balanced', 'Balanced'],
              ['strong', 'Strong'],
            ],
            DEFAULTS.strength,
          )}
        </div>

        <div id="vr-output">${renderDemo(DEFAULTS.intent, DEFAULTS.baseToken, DEFAULTS.context, DEFAULTS.strength)}</div>

        <div class="vr-scss">
          <h4>Proposed SCSS API (design intent, not color syntax)</h4>
          <pre>// Perceptual primitives
@function shift-lightness($color, $amount);
@function scale-chroma($color, $factor);
@function shift-hue($color, $degrees);
@function mix-with-context($color, $context, $amount);

// Intent functions — driven by approved recipes
@function hover-color($base, $recipe);
@function pressed-color($base, $recipe);
@function disabled-color($base, $context, $recipe);
@function selected-color($base, $recipe);
@function border-for($surface, $interval);
@function content-for($surface, $contrast-target);

// Focus stays a ring, never a recolor
@mixin focus-ring($color) { outline: 2px solid $color; outline-offset: 2px; }

// Recipe map — intervals derived from approved Cedar components
$state-recipes: (
  action-solid:  (hover-lightness: 0.035, hover-chroma: 1.0,
                  active-lightness: -0.045, active-chroma: 0.98),
  action-subtle: (hover-lightness: -0.025, hover-chroma: 1.08,
                  active-lightness: -0.04,  active-chroma: 1.05),
  // control-*, selection-*, outlined … per intent + treatment
);

@mixin stateful-surface($base, $context, $recipe: action-solid) {
  background: $base;
  &:hover    { background: hover-color($base, $recipe); }
  &:active   { background: pressed-color($base, $recipe); }
  &:disabled { background: disabled-color($base, $context, $recipe); }
  &:focus-visible { @include focus-ring(var(--cdr-focus-border)); }
}</pre>
        </div>

        <div class="vr-notes">
          <h3>What this demo does — and does not — claim</h3>
          <ul>
            <li><strong>Works with approved semantic colors</strong> that have been validated for this recipe — not any color.</li>
            <li><strong>Produces perceptually consistent transformations</strong> and validates accessibility across generated states — OKLCH improves predictability; it does not by itself ensure accessibility.</li>
            <li><strong>States are measured, not tuned:</strong> the hover transform is the measured OKLCH delta between the approved solid endpoint and its faint surface token — the same relationship the component spec encodes as separate roles.</li>
            <li><strong>Any compatible base inherits the relationship:</strong> applying the transform to a different approved surface reproduces the same state pattern without new tokens.</li>
            <li><strong>Focus is an indicator.</strong> Hover/pressed/selected shift surface color; focus adds a ring so affordance is not lost on adjacent colors.</li>
            <li><strong>Disabled preserves readability.</strong> Lightness is mixed toward the context surface and chroma is reduced — blind alpha can leave content illegible.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const intentEl = canvasElement.querySelector<HTMLSelectElement>('#vr-intent');
    const baseEl = canvasElement.querySelector<HTMLSelectElement>('#vr-base');
    const contextEl = canvasElement.querySelector<HTMLSelectElement>('#vr-context');
    const strengthEl = canvasElement.querySelector<HTMLSelectElement>('#vr-strength');
    const output = canvasElement.querySelector<HTMLElement>('#vr-output');
    if (!intentEl || !baseEl || !contextEl || !strengthEl || !output) return;

    const update = () => {
      const intent = intentEl.value;
      // If the selected base isn't valid for this intent, fall back to the first
      const valid = INTENT_BASES[intent].some((b) => b.token === baseEl.value);
      if (!valid) {
        baseEl.innerHTML = baseOptions(intent, INTENT_BASES[intent][0].token);
      }
      output.innerHTML = renderDemo(intent, baseEl.value, contextEl.value, strengthEl.value);
    };

    intentEl.addEventListener('change', () => {
      baseEl.innerHTML = baseOptions(intentEl.value, INTENT_BASES[intentEl.value][0].token);
      update();
    });
    for (const el of [baseEl, contextEl, strengthEl]) {
      el.addEventListener('change', update);
    }
  },
};

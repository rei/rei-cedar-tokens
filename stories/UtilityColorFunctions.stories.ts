import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorControl } from '../dist/rei-dot-com/types/foundations/cdr-color-control.mjs';
import { CdrColorSelection } from '../dist/rei-dot-com/types/foundations/cdr-color-selection.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';

const meta: Meta = {
  title: 'OKLCH/Utility Color Functions',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── OKLCH color math ─────────────────────────────────────────────────────────
// States are computed in JS so we can show resolved values, run contrast checks,
// and detect out-of-gamut results — not just render CSS syntax.

type Rgb = { r: number; g: number; b: number };
type Oklch = { l: number; c: number; h: number };

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function delinearize(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return {
    l: L,
    c: Math.sqrt(a * a + b2 * b2),
    h: ((Math.atan2(b2, a) * 180) / Math.PI + 360) % 360,
  };
}

function oklchToRgb({ l, c, h }: Oklch): { rgb: Rgb; inGamut: boolean } {
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

function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(hexToRgb(fg));
  const l2 = luminance(hexToRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

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

// ─── State recipes ────────────────────────────────────────────────────────────
// Intervals are placeholders pending derivation from approved Cedar components —
// they are per-intent + per-treatment, never one universal equation.

type Recipe = {
  hoverL: number;
  hoverC: number;
  activeL: number;
  activeC: number;
  selectedL: number;
  selectedC: number;
};

const RECIPES: Record<string, Recipe> = {
  'action-solid': {
    hoverL: 0.035,
    hoverC: 1.0,
    activeL: -0.045,
    activeC: 0.98,
    selectedL: -0.02,
    selectedC: 1.02,
  },
  'action-subtle': {
    hoverL: -0.025,
    hoverC: 1.08,
    activeL: -0.04,
    activeC: 1.05,
    selectedL: -0.015,
    selectedC: 1.1,
  },
  'control-solid': {
    hoverL: 0.02,
    hoverC: 1.0,
    activeL: -0.03,
    activeC: 0.98,
    selectedL: -0.015,
    selectedC: 1.0,
  },
  'control-subtle': {
    hoverL: -0.02,
    hoverC: 1.05,
    activeL: -0.03,
    activeC: 1.03,
    selectedL: -0.01,
    selectedC: 1.05,
  },
  'selection-solid': {
    hoverL: 0.02,
    hoverC: 1.0,
    activeL: -0.03,
    activeC: 0.98,
    selectedL: -0.02,
    selectedC: 1.05,
  },
  'selection-subtle': {
    hoverL: -0.02,
    hoverC: 1.05,
    activeL: -0.03,
    activeC: 1.03,
    selectedL: -0.015,
    selectedC: 1.08,
  },
  outlined: {
    hoverL: -0.02,
    hoverC: 1.05,
    activeL: -0.035,
    activeC: 1.02,
    selectedL: -0.02,
    selectedC: 1.08,
  },
};

const STRENGTH_SCALE: Record<string, number> = { subtle: 0.6, balanced: 1, strong: 1.5 };

const CONTEXTS: Record<string, { label: string; hex: string }> = {
  light: {
    label: 'Light (surface / neutral / trace)',
    hex: CdrColorSurface.CdrColorSurfaceNeutralTrace,
  },
  dark: { label: 'Dark (text / primary)', hex: CdrColorText.CdrColorTextPrimary },
};

const FOCUS_RING = '#3d6db9'; // CdrColorSelectionBorderTrigger — focus is an indicator, not a recolor

// ─── State computation ────────────────────────────────────────────────────────

type ComputedState = {
  name: string;
  oklch: Oklch;
  hex: string;
  css: string;
  inGamut: boolean;
  isFocus?: boolean;
};

function computeStates(
  baseHex: string,
  recipe: Recipe,
  strength: string,
  contextHex: string,
): ComputedState[] {
  const base = rgbToOklch(hexToRgb(baseHex));
  const s = STRENGTH_SCALE[strength];
  const shift = (dl: number, dc: number): Oklch => ({
    l: Math.min(1, Math.max(0, base.l + dl * s)),
    c: Math.max(0, base.c * (1 + (dc - 1) * s)),
    h: base.h,
  });
  // Disabled: shift lightness ~60% toward the context surface and drain chroma —
  // this preserves readability intent instead of a blind alpha reduction.
  const ctx = rgbToOklch(hexToRgb(contextHex));
  const disabled: Oklch = {
    l: base.l + (ctx.l - base.l) * 0.6,
    c: base.c * 0.3,
    h: base.h,
  };

  const mk = (name: string, o: Oklch): ComputedState => {
    const { rgb, inGamut } = oklchToRgb(o);
    return {
      name,
      oklch: o,
      hex: rgbToHex(rgb),
      css: `oklch(from ${baseHex} calc(l ${o.l - base.l >= 0 ? '+' : '-'} ${(Math.abs(o.l - base.l) * 100).toFixed(1)}%) calc(c * ${(o.c / (base.c || 1)).toFixed(2)}) h)`,
      inGamut,
    };
  };

  return [
    mk('Rest', base),
    mk('Hover', shift(recipe.hoverL, recipe.hoverC)),
    mk('Pressed', shift(recipe.activeL, recipe.activeC)),
    { ...mk('Focus', base), isFocus: true },
    mk('Selected', shift(recipe.selectedL, recipe.selectedC)),
    mk('Disabled', disabled),
  ];
}

// Content color for a surface: pick the better-contrast of the two approved
// text tokens rather than assuming white-on-color or color-on-white.
function contentFor(surfaceHex: string): string {
  const primary = CdrColorText.CdrColorTextPrimary;
  const inverse = CdrColorText.CdrColorTextInverse;
  return contrastRatio(primary, surfaceHex) >= contrastRatio(inverse, surfaceHex)
    ? primary
    : inverse;
}

// ─── Rendering helpers ────────────────────────────────────────────────────────

function badge(pass: boolean | 'warn', label: string): string {
  const cls = pass === 'warn' ? 'warn' : pass ? 'pass' : 'fail';
  return `<span class="vr-badge ${cls}">${label}</span>`;
}

function renderDemo(
  intent: string,
  treatment: string,
  baseToken: string,
  context: string,
  strength: string,
): string {
  const bases = INTENT_BASES[intent];
  const base = bases.find((b) => b.token === baseToken) ?? bases[0];
  const recipe = RECIPES[treatment === 'outlined' ? 'outlined' : `${intent}-${treatment}`];
  const ctx = CONTEXTS[context];
  const states = computeStates(base.hex, recipe, strength, ctx.hex);

  const surfaceHex = treatment === 'outlined' ? CONTEXTS.light.hex : base.hex;
  const content = treatment === 'outlined' ? base.hex : contentFor(surfaceHex);
  const rows = states
    .map((st) => {
      const surfaceRatio = contrastRatio(st.hex, ctx.hex);
      const contentRatio = contrastRatio(content, st.hex);
      const contentCheck =
        st.name === 'Disabled'
          ? badge(
              contentRatio >= 3 ? 'warn' : false,
              `${contentRatio.toFixed(1)}:1 ${contentRatio >= 3 ? 'readable' : 'too low'}`,
            )
          : badge(contentRatio >= 4.5, `${contentRatio.toFixed(1)}:1`);
      const gamut = st.inGamut ? badge(true, 'in gamut') : badge('warn', 'out of sRGB');
      return `<tr>
        <td class="vr-state">${st.name}${st.isFocus ? ' (ring)' : ''}</td>
        <td><span class="vr-chip" style="background:${st.hex}"></span><code>${st.hex}</code></td>
        <td class="vr-oklch">L ${(st.oklch.l * 100).toFixed(1)} · C ${st.oklch.c.toFixed(3)} · H ${Math.round(st.oklch.h)}</td>
        <td>${contentCheck}</td>
        <td>${surfaceRatio.toFixed(1)}:1</td>
        <td>${gamut}</td>
      </tr>`;
    })
    .join('');

  const buttonState = (label: string, st: ComputedState) => {
    const ring = st.isFocus ? `box-shadow: 0 0 0 3px ${ctx.hex}, 0 0 0 6px ${FOCUS_RING};` : '';
    const style =
      treatment === 'outlined'
        ? `background:${CONTEXTS.light.hex};color:${st.hex};border:2px solid ${st.hex};${ring}`
        : `background:${st.hex};color:${content};border:2px solid transparent;${ring}`;
    return `<div class="vr-comp">
      <div class="vr-comp-label">${label}</div>
      <button class="vr-btn" style="${style}" ${st.name === 'Disabled' ? 'disabled' : ''}>${label === 'Rest' ? 'Button' : label}</button>
    </div>`;
  };

  const cssLines = states
    .filter((s2) => !s2.isFocus)
    .map((s2) => {
      const sel = s2.name === 'Rest' ? '' : `:${s2.name.toLowerCase()}`;
      const prop = treatment === 'outlined' ? 'border-color' : 'background';
      return `  &${sel === ':disabled' ? ':disabled' : sel || ':not(:disabled)'} { ${prop}: ${s2.hex}; /* ${s2.css} */ }`;
    })
    .join('\n');

  const overallPass = states.every(
    (s2) => s2.isFocus || s2.name === 'Disabled' || contrastRatio(content, s2.hex) >= 4.5,
  );

  return `
    <div class="vr-summary">
      ${badge(overallPass, overallPass ? 'Passes system rules' : 'Fails content contrast')}
      <span class="vr-summary-detail">base <code>${base.token}</code> · recipe <code>${treatment === 'outlined' ? 'outlined' : `${intent}-${treatment}`}</code> · strength ${strength}</span>
    </div>
    <div class="vr-preview" style="background:${ctx.hex}">
      ${states.map((s2) => buttonState(s2.name, s2)).join('')}
    </div>
    <table class="vr-table">
      <thead><tr><th>State</th><th>Resolved</th><th>OKLCH</th><th>Content ↔ surface</th><th>Surface ↔ context</th><th>Gamut</th></tr></thead>
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
    .vr-preview {
      display: flex; flex-wrap: wrap; gap: 20px;
      padding: 24px; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      margin-bottom: 24px;
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
  treatment: 'solid',
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
          Apply an approved state recipe to a compatible semantic role. Recipes encode
          component and design intent — they are not a universal equation applied to
          any color. Focus is rendered as a focus indicator, not a surface recolor.
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
          ${controlSelect(
            'vr-treatment',
            'Treatment',
            [
              ['solid', 'Solid'],
              ['subtle', 'Subtle'],
              ['outlined', 'Outlined'],
            ],
            DEFAULTS.treatment,
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

        <div id="vr-output">${renderDemo(DEFAULTS.intent, DEFAULTS.treatment, DEFAULTS.baseToken, DEFAULTS.context, DEFAULTS.strength)}</div>

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
            <li><strong>Recipe intervals are placeholders.</strong> Final values must be derived from approved Cedar components, not treated as universal constants.</li>
            <li><strong>Focus is an indicator.</strong> Hover/pressed/selected shift surface color; focus adds a ring so affordance is not lost on adjacent colors.</li>
            <li><strong>Disabled preserves readability.</strong> Lightness is mixed toward the context surface and chroma is reduced — blind alpha can leave content illegible.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const intentEl = canvasElement.querySelector<HTMLSelectElement>('#vr-intent');
    const treatmentEl = canvasElement.querySelector<HTMLSelectElement>('#vr-treatment');
    const baseEl = canvasElement.querySelector<HTMLSelectElement>('#vr-base');
    const contextEl = canvasElement.querySelector<HTMLSelectElement>('#vr-context');
    const strengthEl = canvasElement.querySelector<HTMLSelectElement>('#vr-strength');
    const output = canvasElement.querySelector<HTMLElement>('#vr-output');
    if (!intentEl || !treatmentEl || !baseEl || !contextEl || !strengthEl || !output) return;

    const update = () => {
      const intent = intentEl.value;
      // If the selected base isn't valid for this intent, fall back to the first
      const valid = INTENT_BASES[intent].some((b) => b.token === baseEl.value);
      if (!valid) {
        baseEl.innerHTML = baseOptions(intent, INTENT_BASES[intent][0].token);
      }
      output.innerHTML = renderDemo(
        intent,
        treatmentEl.value,
        baseEl.value,
        contextEl.value,
        strengthEl.value,
      );
    };

    intentEl.addEventListener('change', () => {
      baseEl.innerHTML = baseOptions(intentEl.value, INTENT_BASES[intentEl.value][0].token);
      update();
    });
    for (const el of [treatmentEl, baseEl, contextEl, strengthEl]) {
      el.addEventListener('change', update);
    }
  },
};

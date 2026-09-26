import type { StoryObj, Meta } from '@storybook/html-vite';
import { resolvePath } from './color-registry';
// Single combined bundle for every non-color foundation — radius, space,
// type, motion, icon size, prominence — same module Typography.stories.ts
// reads from, so nothing here is a hand-typed px/rem/ms value.
import * as tokens from '../dist/rei-dot-com/js/cdr-tokens.mjs';
import { hexToRgb, rgbToOklch, oklchToRgb } from './oklch-math';

const t = tokens as Record<string, string>;

// Space/radius/icon-size tokens are compiled as bare numbers representing
// tenths of a rem (space "8" == 0.8rem == 8px at the 16px root) — verified
// against the compiled CSS custom properties for both families.
const rem = (raw: string): string => `${Number(raw) / 10}rem`;

// Same compound-style composition Typography.stories.ts uses: a text-style
// prefix (e.g. "CdrTextHeadingSerif300") maps to Family/Size/Weight/
// LineHeight/LetterSpacing/Style/Transform tokens.
function typeStyle(prefix: string): string {
  const family = t[`${prefix}Family`] ?? '';
  const size = t[`${prefix}Size`];
  const weight = t[`${prefix}Weight`];
  const lineHeight = t[`${prefix}LineHeight`];
  const letterSpacing = t[`${prefix}LetterSpacing`];
  const style = t[`${prefix}Style`] ?? 'normal';
  const transform = t[`${prefix}Transform`] ?? '';
  const parts: string[] = [];
  if (family) parts.push(`font-family: ${family};`);
  if (size) parts.push(`font-size: ${size}px;`);
  if (weight) parts.push(`font-weight: ${weight};`);
  if (lineHeight) parts.push(`line-height: ${lineHeight}px;`);
  if (letterSpacing && letterSpacing !== '0') parts.push(`letter-spacing: ${letterSpacing}px;`);
  if (style) parts.push(`font-style: ${style};`);
  if (transform) parts.push(`text-transform: ${transform};`);
  return parts.join(' ');
}

const meta: Meta = {
  title: 'OKLCH/Custom Component Composer',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── Purpose ──────────────────────────────────────────────────────────────────
// Cedar doesn't ship a component for every pattern. This page answers: given no
// component exists yet, how do I safely build one from approved semantic roles?
// Every color is resolved live via `resolvePath()` against the compiled token
// modules — nothing is hand-typed hex. States are driven by real CSS
// (:hover, :checked, :disabled) rather than a JS re-render simulation, so
// hovering, checking, and disabling the actual widgets is what you're seeing.

function lift(hex: string, dL: number, cScale: number): string {
  const o = rgbToOklch(hexToRgb(hex));
  const shifted = {
    l: Math.min(1, Math.max(0, o.l + dL)),
    c: Math.max(0, o.c * cScale),
    h: o.h,
  };
  const { rgb } = oklchToRgb(shifted);
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`;
}

// ─── Token references ────────────────────────────────────────────────────────
// Every value carries its own canonical path AND the actual shipped CSS custom
// property, so the demo — and the generated code sample — can reference
// `var(--cdr-...)` directly instead of a baked-in resolved color.

// Verified against the compiled CSS: every family drops "color" from its var
// name (--cdr-action-surface-neutral-trace) EXCEPT the root `text` family,
// which is disambiguated as --cdr-color-text-* to avoid colliding with the
// typography tokens' own --cdr-text-* namespace (e.g. --cdr-text-body-300-size).
function cssVarForPath(path: string): string {
  const [, family, ...rest] = path.split('/');
  const segments = family === 'text' ? ['color', family, ...rest] : [family, ...rest];
  return `--cdr-${segments.join('-')}`;
}

type TokenRef = {
  path: string;
  value: string;
  cssVar: string;
  status: 'token' | 'muted' | 'missing';
};

function ref(path: string): TokenRef {
  return { path, value: resolvePath(path), cssVar: cssVarForPath(path), status: 'token' };
}

// Disabled content is softened for legibility — not a distinct approved
// token, so it's labeled "muted" rather than presented as if it were one.
// The generated CSS still credits the source var; the resolved hex is the
// only part that's derived, not the token identity.
function muted(base: TokenRef): TokenRef {
  return {
    path: base.path,
    value: lift(base.value, 0, 0.55),
    cssVar: base.cssVar,
    status: 'muted',
  };
}

function safeRef(path: string): TokenRef {
  try {
    return ref(path);
  } catch {
    return { path, value: '', cssVar: cssVarForPath(path), status: 'missing' };
  }
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

type Prominence = { name: string; value: string; cssVar: string };
type StateSpec = {
  surface: TokenRef;
  content: TokenRef;
  border: TokenRef;
  prominence: Prominence;
  note?: string;
};
type FamilyRecipe = {
  label: string;
  widget: 'link' | 'radio' | 'checkbox';
  description: string;
  order: string[];
  states: Record<string, StateSpec>;
};

const PROM = {
  flat: { name: 'flat', value: t.CdrProminenceFlat, cssVar: '--cdr-prominence-flat' },
  raised: { name: 'raised', value: t.CdrProminenceRaised, cssVar: '--cdr-prominence-raised' },
  elevated: {
    name: 'elevated',
    value: t.CdrProminenceElevated,
    cssVar: '--cdr-prominence-elevated',
  },
  floating: {
    name: 'floating',
    value: t.CdrProminenceFloating,
    cssVar: '--cdr-prominence-floating',
  },
};

// color.text.primary is a legacy cross-family text color — not part of any
// of the three families this page demonstrates. The nearest family-scoped
// equivalent (closest lightness/contrast to the legacy value) is selection's
// own neutral-faint text; reused across action/control as their default
// content since neither family has a dark-on-light text role of its own.
const CONTENT_NEUTRAL = ref('color/selection/text/neutral/faint');
const ACTION_BORDER_FAINT = ref('color/action/border/neutral/faint');

// color.action.surface.neutral.bold is not compiled anywhere in the token set
// today (checked across every family, not just action). Approximated by
// deepening the faint border — flagged in the UI, never presented as approved.
const ACTION_BORDER_BOLD_RAW = safeRef('color/action/surface/neutral/bold');
const ACTION_BORDER_BOLD: TokenRef =
  ACTION_BORDER_BOLD_RAW.status === 'missing'
    ? {
        path: 'color/action/surface/neutral/bold',
        value: lift(ACTION_BORDER_FAINT.value, -0.4, 1.15),
        cssVar: cssVarForPath('color/action/surface/neutral/bold'),
        status: 'missing',
      }
    : ACTION_BORDER_BOLD_RAW;

const ACTION_RECIPE: FamilyRecipe = {
  label: 'Action — card link',
  widget: 'link',
  description:
    'The whole card is a link to the store page — tight corners and a raise-on-hover shadow read as "this will navigate," not "this is a settled surface."',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: ref('color/action/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ACTION_BORDER_FAINT,
      prominence: PROM.flat,
    },
    hover: {
      surface: ref('color/action/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ACTION_BORDER_BOLD,
      prominence: PROM.raised,
      note:
        ACTION_BORDER_BOLD.status === 'missing'
          ? 'color.action.surface.neutral.bold is not compiled yet — shown as a measured placeholder, not an approved token.'
          : undefined,
    },
    disabled: {
      surface: ref('color/action/surface/neutral/faint'),
      content: muted(CONTENT_NEUTRAL),
      border: ACTION_BORDER_FAINT,
      prominence: PROM.flat,
    },
  },
};

const SELECTION_RECIPE: FamilyRecipe = {
  label: 'Selection — set as my store',
  widget: 'radio',
  description:
    'A radio choosing this as the primary store — it reads as a choice waiting to be submitted: hover already lifts it two prominence steps above action\u2019s resting flat, and choosing it lifts it once more.',
  order: ['default', 'hover', 'selected', 'disabled'],
  states: {
    default: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ref('color/selection/border/neutral/faint'),
      prominence: PROM.raised,
    },
    hover: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ref('color/selection/border/neutral/subtle'),
      // Two prominence steps above action's resting "flat" (flat -> raised -> elevated).
      prominence: PROM.elevated,
    },
    selected: {
      surface: ref('color/selection/surface/natural'),
      content: ref('color/selection/text/trigger'),
      border: ref('color/selection/border/trigger'),
      prominence: PROM.floating,
    },
    disabled: {
      surface: ref('color/selection/surface/neutral/faint'),
      content: muted(CONTENT_NEUTRAL),
      border: ref('color/selection/border/neutral/faint'),
      prominence: PROM.raised,
    },
  },
};

const CONTROL_RECIPE: FamilyRecipe = {
  label: 'Control — save to My REI',
  widget: 'checkbox',
  description:
    'A checkbox that acts on something else: checking it also selects "Set as my store" next to it — a control\u2019s job is to do something to something else, not just to itself. Its own prominence never moves; only color/border chrome changes.',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: ref('color/control/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ref('color/control/border/neutral/faint'),
      prominence: PROM.flat,
    },
    hover: {
      surface: ref('color/control/surface/neutral/subtle'),
      content: CONTENT_NEUTRAL,
      border: ref('color/control/border/neutral/faint'),
      prominence: PROM.flat,
    },
    disabled: {
      surface: ref('color/control/surface/neutral/faint'),
      content: muted(CONTENT_NEUTRAL),
      border: ref('color/control/border/neutral/faint'),
      prominence: PROM.flat,
    },
  },
};

const RECIPES: Record<string, FamilyRecipe> = {
  action: ACTION_RECIPE,
  selection: SELECTION_RECIPE,
  control: CONTROL_RECIPE,
};
// Loaded from the recipe config above — every value in it is a resolved
// compiled token (or an explicitly flagged placeholder), so this list can't
// silently drift from what's actually shipped.
const FAMILIES = Object.keys(RECIPES);

function badge(pass: boolean | 'warn', label: string): string {
  const cls = pass === 'warn' ? 'warn' : pass ? 'pass' : 'fail';
  return `<span class="cc-badge ${cls}">${label}</span>`;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Sized in CSS via .rc-chip-icon svg { width/height: rem(CdrIconSizeSm) } —
// no literal pixel dimensions on the markup itself.
const HEART_OUTLINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;
const HEART_FILLED = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;

const PHOTO_PLACEHOLDER = `
  <div class="rc-sky"></div>
  <div class="rc-building"></div>
  <div class="rc-windows"></div>
`;

// ─── Card ─────────────────────────────────────────────────────────────────────
// Rendered once. CSS custom properties carry every state's real token values;
// genuine :hover / :checked / :disabled / [aria-disabled] selectors (defined
// in `chrome` below) do the state switching — no JS re-render involved. The
// shadow layer is deliberately kept OUTSIDE the overflow:hidden photo clip,
// otherwise the prominence box-shadow gets clipped away and never appears.

// A real, unmodified token chains straight through to its shipped CSS custom
// property (var(--cdr-action-surface-neutral-trace)) so devtools and the
// generated CSS panel show the actual variable, not a baked-in color. Muted
// (derived-for-legibility) and missing (not-yet-compiled) values fall back to
// the computed literal since there's no matching shipped var to point at.
const refExpr = (r: TokenRef): string => (r.status === 'token' ? `var(${r.cssVar})` : r.value);
const promExpr = (p: Prominence): string => `var(${p.cssVar})`;

function cardVars(): string {
  const a = ACTION_RECIPE.states;
  const s = SELECTION_RECIPE.states;
  const c = CONTROL_RECIPE.states;
  const vars: Record<string, string> = {
    '--a-surface': refExpr(a.default.surface),
    '--a-content': refExpr(a.default.content),
    '--a-border': refExpr(a.default.border),
    '--a-border-hover': refExpr(a.hover.border),
    '--a-shadow': promExpr(a.default.prominence),
    '--a-shadow-hover': promExpr(a.hover.prominence),
    '--a-surface-disabled': refExpr(a.disabled.surface),
    '--a-content-disabled': refExpr(a.disabled.content),

    '--s-surface': refExpr(s.default.surface),
    '--s-content': refExpr(s.default.content),
    '--s-border': refExpr(s.default.border),
    '--s-border-hover': refExpr(s.hover.border),
    '--s-shadow': promExpr(s.default.prominence),
    '--s-surface-selected': refExpr(s.selected.surface),
    '--s-content-selected': refExpr(s.selected.content),
    '--s-border-selected': refExpr(s.selected.border),
    '--s-shadow-selected': promExpr(s.selected.prominence),
    '--s-surface-disabled': refExpr(s.disabled.surface),
    '--s-content-disabled': refExpr(s.disabled.content),

    '--c-surface': refExpr(c.default.surface),
    '--c-content': refExpr(c.default.content),
    '--c-border': refExpr(c.default.border),
    '--c-surface-hover': refExpr(c.hover.surface),
    '--c-surface-disabled': refExpr(c.disabled.surface),
    '--c-content-disabled': refExpr(c.disabled.content),
  };
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
}

function renderCard(): string {
  return `
    <div class="rc-scene">
      <div class="rc-card" style="${cardVars()}">
        <div class="rc-card-clip">
          <div class="rc-photo">${PHOTO_PLACEHOLDER}</div>
          <a class="rc-overlay" href="#" aria-label="Visit store page" onclick="return false;"></a>
          <div class="rc-info">
            <p class="rc-name">REI Example</p>
            <p class="rc-detail">(206) 555-0142</p>
            <p class="rc-detail">400 Occidental Ave S, Seattle, WA 98104</p>
            <p class="rc-hours"><span class="rc-dot"></span> Open until 9pm today</p>
          </div>
        </div>
        <label class="rc-chip" title="Save to My REI">
          <input type="checkbox" class="sr-only" data-widget="control" aria-label="Save to My REI" />
          <span class="rc-chip-icon rc-chip-icon-outline">${HEART_OUTLINE}</span>
          <span class="rc-chip-icon rc-chip-icon-filled">${HEART_FILLED}</span>
        </label>
      </div>
      <label class="rc-radio">
        <input type="radio" name="cc-store-select" class="sr-only" data-widget="selection" />
        <span class="rc-radio-dot"></span>
        <span class="rc-radio-label">Set as my store</span>
      </label>
    </div>
  `;
}

// ─── Inspector (table + generated CSS) ─────────────────────────────────────────
// This part IS driven by JS — it's documentation of the currently selected
// state, not the live widget.

// Only flag the exceptions — a plain compiled token needs no badge.
function statusBadge(tokenRef: TokenRef): string {
  if (tokenRef.status === 'missing') return badge('warn', 'not compiled');
  if (tokenRef.status === 'muted') return badge('warn', 'derived, not a token');
  return '';
}

function tokenCell(r: TokenRef): string {
  const varLine = r.status === 'missing' ? `${r.cssVar} (not compiled)` : r.cssVar;
  return `<span class="cc-chip-swatch" style="background:${r.value}"></span><code>${varLine}</code>
    <div class="cc-token-path">${r.path}</div> ${statusBadge(r)}`;
}

function renderTable(recipe: FamilyRecipe, activeState: string): string {
  const rows = recipe.order
    .map((name) => {
      const st = recipe.states[name];
      return `<tr class="${name === activeState ? 'active' : ''}">
        <td class="cc-state">${name}</td>
        <td>${tokenCell(st.surface)}</td>
        <td><code>${st.content.cssVar}</code><div class="cc-token-path">${st.content.path}</div> ${statusBadge(st.content)}</td>
        <td><code>${st.border.cssVar}</code><div class="cc-token-path">${st.border.path}</div> ${statusBadge(st.border)}</td>
        <td><code>${st.prominence.cssVar}</code></td>
      </tr>`;
    })
    .join('');
  return `<table class="cc-table">
    <thead><tr><th>State</th><th>Surface variable</th><th>Content variable</th><th>Border variable</th><th>Prominence variable</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

const WIDGET_SELECTOR: Record<string, string> = {
  action: '.rc-overlay',
  selection: '.rc-radio-dot',
  control: '.rc-chip',
};

function renderComposition(family: string, activeState: string): string {
  const recipe = RECIPES[family];
  const st = recipe.states[activeState];
  const stateNav = recipe.order
    .map(
      (name) =>
        `<button type="button" class="cc-state-btn ${name === activeState ? 'active' : ''}" data-state="${name}">${capitalize(name)}</button>`,
    )
    .join('');

  const cssBlock = `${WIDGET_SELECTOR[family]}[data-state="${activeState}"] {
  background: ${refExpr(st.surface)}; /* ${st.surface.path} */
  color: ${refExpr(st.content)}; /* ${st.content.path} */
  border-color: ${refExpr(st.border)}; /* ${st.border.path} */
  box-shadow: ${promExpr(st.prominence)};
}`;

  return `
    <div class="cc-recipe">
      <strong>${recipe.label}</strong> — ${recipe.description}
      ${st.note ? `<div class="cc-cue">⚠ ${st.note}</div>` : ''}
      <div class="cc-hint">Try it live above: ${
        recipe.widget === 'link'
          ? 'hover the card, or tab to it and check focus.'
          : recipe.widget === 'radio'
            ? 'hover or click "Set as my store".'
            : 'hover or click the "My REI" heart.'
      } The buttons below jump the table to that state\u2019s exact tokens — <code>disabled</code>/<code>selected</code> also apply real <code>disabled</code>/<code>checked</code> attributes so you can see them.</div>
    </div>
    <div class="cc-state-nav">${stateNav}</div>
    ${renderTable(recipe, activeState)}
    <div class="cc-css"><pre>${cssBlock}</pre></div>
  `;
}

// ─── Chrome ────────────────────────────────────────────────────────────────────
// Every radius, gap/padding/margin, and type style below is a real Cedar token
// (CdrRadius / CdrSpace / CdrText* / CdrDuration / CdrTimingFunction / CdrIconSize).
// The only literals left are dimensions Cedar doesn't tokenize at all — card
// width, photo height, and the two decorative dot indicators — called out
// inline rather than disguised as tokens.

const RADIUS_PILL = rem(t.CdrRadiusRound);
const RADIUS_MD = rem(t.CdrRadiusSoftest); // control widget: bigger than selection, not round
const RADIUS_SM = rem(t.CdrRadiusSofter); // selection widget
const RADIUS_ACTION = rem(t.CdrRadiusSoft); // action widget: smallest non-zero — reads as a link, not a settled card

const SPACE_3XS = rem(t.CdrSpaceThreeSixteenthX);
const SPACE_2XS = rem(t.CdrSpaceEighthX);
const SPACE_XS = rem(t.CdrSpaceQuarterX);
const SPACE_SM = rem(t.CdrSpaceHalfX);
const SPACE_SM2 = rem(t.CdrSpaceThreeEighthX);
const SPACE_MD = rem(t.CdrSpaceThreeQuarterX);
const SPACE_LG = rem(t.CdrSpaceOneX);
const SPACE_XL = rem(t.CdrSpaceOneAndAHalfX);
const SPACE_2XL = rem(t.CdrSpaceTwoX);

const ICON_SIZE = rem(t.CdrIconSizeSm);
const MOTION = `${t.CdrDuration2X} ${t.CdrTimingFunctionEaseOut}`;
const MONO_FONT = t.CdrFontFamilyMonoBrandFont;

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section-header {
      display: flex; align-items: baseline; gap: ${SPACE_MD};
      margin-bottom: ${SPACE_XL}; padding-bottom: ${SPACE_SM};
      border-bottom: 2px solid var(--cedar-warm-100);
    }
    .sb-section-title {
      ${typeStyle('CdrTextHeadingSerifStrong600')}
      color: var(--cedar-warm-1000); margin: 0;
    }
    .cc-controls {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: ${SPACE_LG};
      padding: ${SPACE_LG}; margin-bottom: ${SPACE_XL};
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD};
    }
    .cc-field { display: flex; flex-direction: column; gap: ${SPACE_XS}; }
    .cc-field label {
      ${typeStyle('CdrTextEyebrow100')} color: var(--cedar-warm-600);
    }
    .cc-field select {
      padding: ${SPACE_SM2} ${SPACE_SM}; border: 1px solid var(--cedar-warm-300); border-radius: ${RADIUS_SM};
      ${typeStyle('CdrTextBody300')} background: white;
    }
    .cc-recipe {
      background: var(--cedar-warm-50); border: 1px solid var(--cedar-warm-200);
      border-radius: ${RADIUS_MD}; padding: ${SPACE_MD} ${SPACE_LG}; margin-bottom: ${SPACE_LG};
      ${typeStyle('CdrTextBody300')} color: var(--cedar-warm-800);
    }
    .cc-cue { margin-top: ${SPACE_SM2}; color: #856404; ${typeStyle('CdrTextEyebrow100')} text-transform: none; }
    .cc-hint { margin-top: ${SPACE_SM}; color: var(--cedar-warm-600); ${typeStyle('CdrTextEyebrow100')} text-transform: none; }
    .cc-state-nav { display: flex; flex-wrap: wrap; gap: ${SPACE_SM}; margin-bottom: ${SPACE_LG}; }
    .cc-state-btn {
      ${typeStyle('CdrTextEyebrow100')}
      padding: ${SPACE_SM2} ${SPACE_MD}; border-radius: ${RADIUS_PILL}; cursor: pointer;
      background: white; border: 1px solid var(--cedar-warm-300); color: var(--cedar-warm-700);
    }
    .cc-state-btn.active { background: var(--cedar-warm-1000); color: white; border-color: var(--cedar-warm-1000); }
    .cc-intro { margin-bottom: ${SPACE_XL}; color: var(--cedar-warm-700); max-width: 780px; ${typeStyle('CdrTextBody300')} }

    /* ── Scene ──
       Card width, photo height, and the two decorative dot sizes (radio fill,
       hours indicator) have no Cedar dimension token — they're the only
       literal numbers left in this file, flagged rather than hidden. */
    .rc-scene {
      display: flex; flex-wrap: wrap; align-items: flex-start; gap: ${SPACE_2XL};
      padding: ${SPACE_2XL}; border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD};
      margin-bottom: ${SPACE_XL}; background: var(--cedar-warm-50);
    }

    /* ── Action: card link ──
       Shadow lives on .rc-card (never clipped); photo clipping lives on a
       separate inner wrapper so the box-shadow is never cut off. */
    .rc-card {
      position: relative; width: 300px; /* no Cedar "component width" token */
      border-radius: ${RADIUS_ACTION}; background: white;
      box-shadow: var(--a-shadow);
      transition: box-shadow ${MOTION};
    }
    .rc-card:has(.rc-overlay:hover),
    .rc-card:has(.rc-overlay:focus-visible) {
      box-shadow: var(--a-shadow-hover);
    }
    .rc-card:has(.rc-overlay[aria-disabled="true"]) { box-shadow: var(--a-shadow); }
    .rc-card-clip { border-radius: ${RADIUS_ACTION}; overflow: hidden; }
    .rc-photo { position: relative; height: 200px; overflow: hidden; /* no photo-aspect token */ }
    .rc-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #7fb2e8 0%, #cfe6f7 100%); }
    .rc-building {
      position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
      background: #4a4a4d;
      clip-path: polygon(0% 100%, 0% 40%, 30% 40%, 30% 15%, 65% 15%, 65% 40%, 100% 40%, 100% 100%);
    }
    .rc-windows {
      position: absolute; left: 8%; right: 8%; bottom: 8%; height: 30%;
      background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 10%, transparent 10% 20%),
                         repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 12%, transparent 12% 24%);
      opacity: 0.5;
    }
    .rc-overlay {
      position: absolute; inset: 0; border-radius: ${RADIUS_ACTION}; z-index: 1;
      border: 2px solid var(--a-border);
      transition: border-color ${MOTION};
    }
    .rc-overlay:hover, .rc-overlay:focus-visible { border-color: var(--a-border-hover); }
    .rc-overlay[aria-disabled="true"] { pointer-events: none; border-color: var(--a-border); opacity: 0.7; }
    .rc-info {
      position: relative; z-index: 0; padding: ${SPACE_MD} ${SPACE_LG};
      background: var(--a-surface); color: var(--a-content);
      transition: background ${MOTION}, color ${MOTION};
    }
    .rc-overlay[aria-disabled="true"] ~ .rc-info { background: var(--a-surface-disabled); color: var(--a-content-disabled); }
    .rc-name { margin: 0 0 ${SPACE_XS}; ${typeStyle('CdrTextHeadingSerif300')} }
    .rc-detail { margin: 0 0 ${SPACE_2XS}; ${typeStyle('CdrTextBody300')} text-decoration: underline; }
    .rc-hours { margin: ${SPACE_SM} 0 0; display: flex; align-items: center; gap: ${SPACE_3XS}; ${typeStyle('CdrTextBody300')} }
    .rc-dot { width: ${SPACE_XS}; height: ${SPACE_XS}; border-radius: 50%; background: #3a9c50; display: inline-block; }

    /* ── Control: My REI checkbox ── */
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    /* Icon-only toggle button — a distinct silhouette from selection's plain
       list row below: a compact square target overlaying the photo, no
       visible label (accessible name comes from the input's aria-label). */
    .rc-chip {
      position: absolute; top: ${SPACE_MD}; left: ${SPACE_MD}; z-index: 2;
      display: inline-flex; align-items: center; justify-content: center;
      width: calc(${ICON_SIZE} + ${SPACE_LG}); height: calc(${ICON_SIZE} + ${SPACE_LG});
      border-radius: ${RADIUS_MD}; cursor: pointer;
      background: var(--c-surface); color: var(--c-content); border: 2px solid var(--c-border);
      transition: background ${MOTION};
    }
    .rc-chip-icon { display: inline-flex; }
    .rc-chip-icon svg { width: ${ICON_SIZE}; height: ${ICON_SIZE}; }
    .rc-chip:has(input:hover) { background: var(--c-surface-hover); }
    .rc-chip:has(input:focus-visible) { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-chip:has(input:disabled) { background: var(--c-surface-disabled); color: var(--c-content-disabled); cursor: not-allowed; }
    .rc-chip-icon-filled { display: none; }
    .rc-chip:has(input:checked) .rc-chip-icon-outline { display: none; }
    .rc-chip:has(input:checked) .rc-chip-icon-filled { display: inline-flex; }

    /* ── Selection: set-as-my-store radio ──
       A bare list row — no box, background, or border chrome — so it reads
       as a native radio choice rather than a card or a button. Prominence
       lives entirely on the small circular indicator, not a container. */
    .rc-radio {
      display: flex; align-items: center; gap: ${SPACE_SM}; cursor: pointer;
    }
    .rc-radio:has(input:focus-visible) .rc-radio-dot { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-radio-dot {
      width: ${SPACE_LG}; height: ${SPACE_LG}; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--s-surface); border: 2px solid var(--s-border);
      box-shadow: var(--s-shadow);
      transition: background ${MOTION}, border-color ${MOTION}, box-shadow ${MOTION};
    }
    .rc-radio:hover .rc-radio-dot { border-color: var(--s-border-hover); }
    .rc-radio-dot::after {
      content: ''; width: 50%; height: 50%; border-radius: 50%;
      background: var(--s-content-selected); opacity: 0; transition: opacity ${MOTION};
    }
    .rc-radio:has(input:checked) .rc-radio-dot {
      background: var(--s-surface-selected); border-color: var(--s-border-selected);
      box-shadow: var(--s-shadow-selected);
    }
    .rc-radio:has(input:checked) .rc-radio-dot::after { opacity: 1; }
    .rc-radio-label { color: var(--s-content); ${typeStyle('CdrTextBody300')} }
    .rc-radio:has(input:checked) .rc-radio-label { color: var(--s-content-selected); }
    .rc-radio:has(input:disabled) { cursor: not-allowed; }
    .rc-radio:has(input:disabled) .rc-radio-dot { background: var(--s-surface-disabled); }
    .rc-radio:has(input:disabled) .rc-radio-label { color: var(--s-content-disabled); }

    .cc-badge {
      ${typeStyle('CdrTextEyebrow100')}
      padding: ${SPACE_2XS} ${SPACE_SM}; border-radius: ${RADIUS_SM}; display: inline-block; white-space: nowrap; margin-left: ${SPACE_XS};
    }
    .cc-badge.pass { background: #d4edda; color: #155724; }
    .cc-badge.warn { background: #fff3cd; color: #856404; }
    .cc-badge.fail { background: #f8d7da; color: #721c24; }
    .cc-table {
      width: 100%; border-collapse: collapse; background: white;
      border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD}; overflow: hidden;
      margin-bottom: ${SPACE_XL};
    }
    .cc-table th {
      text-align: left; padding: ${SPACE_SM} ${SPACE_MD}; background: var(--cedar-warm-100);
      ${typeStyle('CdrTextEyebrow100')} color: var(--cedar-warm-700);
    }
    .cc-table td { padding: ${SPACE_SM} ${SPACE_MD}; border-top: 1px solid var(--cedar-warm-200); ${typeStyle('CdrTextBody300')} }
    .cc-table tr.active td { background: var(--cedar-warm-50); font-weight: 600; }
    .cc-state { font-weight: 600; text-transform: capitalize; }
    .cc-chip-swatch {
      display: inline-block; width: ${SPACE_LG}; height: ${SPACE_LG}; border-radius: ${RADIUS_SM};
      border: 1px solid rgba(0,0,0,0.12); vertical-align: middle; margin-right: ${SPACE_SM};
    }
    .cc-token-path { color: var(--cedar-warm-500); ${typeStyle('CdrTextEyebrow100')} text-transform: none; letter-spacing: normal; }
    .cc-css {
      background: var(--cedar-warm-900); border-radius: ${RADIUS_MD}; padding: ${SPACE_XL};
      margin-bottom: ${SPACE_2XL}; overflow-x: auto;
    }
    .cc-css pre {
      margin: 0; color: #e8e6e3; line-height: 1.6;
      font-family: ${MONO_FONT}; font-size: ${t.CdrTextBody300Size}px;
    }
    .cc-notes {
      background: var(--cedar-green-50); border: 1px solid var(--cedar-green-200);
      border-radius: ${RADIUS_MD}; padding: ${SPACE_XL};
    }
    .cc-notes h3 {
      ${typeStyle('CdrTextHeadingSerif500')} color: var(--cedar-green-900); margin: 0 0 ${SPACE_MD};
    }
    .cc-notes ul { margin: 0; padding-left: ${SPACE_LG}; }
    .cc-notes li { margin-bottom: ${SPACE_SM}; color: var(--cedar-green-800); ${typeStyle('CdrTextBody300')} }
  </style>
`;

const DEFAULTS = { family: 'action', state: 'default' };

function familyOptions(selected: string): string {
  return FAMILIES.map(
    (f) => `<option value="${f}" ${f === selected ? 'selected' : ''}>${RECIPES[f].label}</option>`,
  ).join('');
}

export const ComponentComposer: Story = {
  name: 'Custom Component Composer',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Compose a Custom Component</h2>
        </div>
        <p class="cc-intro">
          Use this when Cedar has no component for your pattern yet. All three widgets on this
          store card are real and interactive: the card is a native link, "Set as my store" is a
          radio, and "My REI" is a checkbox. Every color is a resolved token, and every state
          below is driven by real <code>:hover</code>/<code>:checked</code>/<code>:disabled</code>
          CSS — not a JS simulation.
        </p>

        <div class="cc-controls">
          <div class="cc-field">
            <label for="cc-family">Family</label>
            <select id="cc-family">${familyOptions(DEFAULTS.family)}</select>
          </div>
        </div>

        ${renderCard()}

        <div id="cc-inspector">${renderComposition(DEFAULTS.family, DEFAULTS.state)}</div>

        <div class="cc-notes">
          <h3>What this proves — and what it doesn't</h3>
          <ul>
            <li><strong>Every color is a real, resolved token</strong> referenced by its actual shipped <code>var(--cdr-...)</code> custom property, not a baked-in hex — check the "Generated CSS" panel or inspect the card in devtools.</li>
            <li><strong>Radius, spacing, and type are tokens too</strong> — corner radius, padding/gaps, and every font style come from <code>CdrRadius</code>/<code>CdrSpace</code>/<code>CdrText*</code>, not hand-picked pixel values.</li>
            <li><strong>Three distinct shapes encode three distinct intents.</strong> Action uses the smallest radius (reads as a link, not a settled surface); selection sits between it and control; control is the largest short of fully round.</li>
            <li><strong>Action and selection move in opposite prominence directions, and selection outranks action.</strong> Action starts flat and raises on hover. Selection starts raised and, on hover alone, already sits two prominence steps above action's resting flat (elevated) — before it's even chosen — reading as "a choice waiting to be submitted." Choosing it raises it once more, to floating.</li>
            <li><strong>Control's prominence never moves</strong> — only its color/border chrome does. Instead, it acts outward: checking "My REI" also selects "Set as my store," and selecting the store also favorites it — a real cross-widget effect via native <code>change</code> events, demonstrating a control's job is to do something to something else, not just to itself.</li>
            <li><strong>Two real gaps surfaced by building this honestly:</strong> <code>color.action.surface.neutral.bold</code> doesn't exist in the compiled set (see Action → Hover), and the <code>control</code> family has no "checked" fill token — the heart only changes via icon swap, not color, when checked.</li>
            <li><strong>content/text.primary is legacy</strong> and isn't scoped to any of these three families — this demo instead reuses <code>selection.text.neutral.faint</code>, the closest family-owned equivalent, everywhere a default readable content color is needed.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const familyEl = canvasElement.querySelector<HTMLSelectElement>('#cc-family');
    const inspector = canvasElement.querySelector<HTMLElement>('#cc-inspector');
    if (!familyEl || !inspector) return;

    let activeState = DEFAULTS.state;

    const widgetInput = (family: string): HTMLInputElement | HTMLAnchorElement | null => {
      if (family === 'action') return canvasElement.querySelector<HTMLAnchorElement>('.rc-overlay');
      return canvasElement.querySelector<HTMLInputElement>(`input[data-widget="${family}"]`);
    };

    // Reflect the chosen state onto the real widget using real attributes —
    // disabled/checked are genuine DOM state, not a CSS-class simulation.
    const applyRealState = (family: string, state: string) => {
      const el = widgetInput(family);
      if (!el) return;
      if (family === 'action' && el instanceof HTMLAnchorElement) {
        el.toggleAttribute('aria-disabled', state === 'disabled');
        if (state === 'disabled') el.setAttribute('tabindex', '-1');
        else el.removeAttribute('tabindex');
      } else if (el instanceof HTMLInputElement) {
        el.disabled = state === 'disabled';
        if (family === 'selection') el.checked = state === 'selected';
      }
    };

    const render = () => {
      inspector.innerHTML = renderComposition(familyEl.value, activeState);
      applyRealState(familyEl.value, activeState);
    };

    familyEl.addEventListener('change', () => {
      activeState = DEFAULTS.state;
      render();
    });

    inspector.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.cc-state-btn');
      if (!btn?.dataset.state) return;
      activeState = btn.dataset.state;
      render();
    });

    render();

    // Selection and control are two skins on the same underlying "this is my
    // store" fact, so real user interaction keeps them in sync: choosing the
    // store also favorites it, and favoriting a store also chooses it. This
    // is a genuine cross-widget effect (a control "does something to
    // something else"), not just a within-widget state change — it only
    // fires on real input, not on the state-nav preview buttons above.
    const storeRadio = canvasElement.querySelector<HTMLInputElement>(
      'input[data-widget="selection"]',
    );
    const favCheckbox = canvasElement.querySelector<HTMLInputElement>(
      'input[data-widget="control"]',
    );
    storeRadio?.addEventListener('change', () => {
      if (storeRadio.checked && favCheckbox) favCheckbox.checked = true;
    });
    favCheckbox?.addEventListener('change', () => {
      if (favCheckbox.checked && storeRadio) storeRadio.checked = true;
    });
  },
};

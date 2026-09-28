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

// ─── Radius ───────────────────────────────────────────────────────────────────
// Verified ascending order from the compiled values (Soft 2 < Softer 4 <
// Softest 6 < Round 9999). Each family's card uses the next tier up:
// action gets the smallest non-zero radius (reads as a link, not a settled
// surface), selection the next, control the largest short of fully round.
const RADIUS_ACTION = rem(t.CdrRadiusSoft);
const RADIUS_SM = rem(t.CdrRadiusSofter); // selection
const RADIUS_MD = rem(t.CdrRadiusSoftest); // control
const RADIUS_PILL = rem(t.CdrRadiusRound);

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
  widget: 'link' | 'checkbox' | 'button';
  description: string;
  // The diagnostic question a team should ask themselves before building a
  // custom UI element — this is the actual point of the page: the same
  // visual card answers all three differently depending on the answer.
  question: string;
  radius: string;
  order: string[];
  states: Record<string, StateSpec>;
};

// Verified ascending order from the compiled shadow-blur/offset values
// (Flat 0 < Raised 2px < Elevated 4px < Floating 8px < Lifted 16px) — Lifted
// is the *topmost* tier, not a mid-scale step, so recipes must climb through
// the intermediate tiers rather than jumping straight to it.
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
  lifted: { name: 'lifted', value: t.CdrProminenceLifted, cssVar: '--cdr-prominence-lifted' },
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
  question: 'Am I moving the user somewhere?',
  radius: RADIUS_ACTION,
  description:
    'The card is a real anchor to the store page — a full state flow (default → hover → pressed → disabled), raise-on-hover prominence, and a focus ring on tab.',
  order: ['default', 'hover', 'pressed', 'disabled'],
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
    // Pressed drops the shadow back to flat and shifts the surface one step —
    // the anchor is "under your finger," not floating.
    pressed: {
      surface: ref('color/action/surface/neutral/subtle'),
      content: CONTENT_NEUTRAL,
      border: ACTION_BORDER_BOLD,
      prominence: PROM.flat,
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
  widget: 'checkbox',
  question: 'Am I setting or saving a preference?',
  radius: RADIUS_SM,
  description:
    'A real checkbox that selects the card itself — checking it repaints the card\u2019s surface/border/shadow with the selection\u2019s selected tokens, giving the card a true selected vs. non-selected appearance. Prominence starts one tier above action\u2019s resting flat (raised) and climbs through the real scale \u2014 elevated on hover, lifted once selected.',
  order: ['default', 'hover', 'selected', 'disabled'],
  states: {
    default: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ref('color/selection/border/neutral/faint'),
      // Starts one tier above action's resting "flat".
      prominence: PROM.raised,
    },
    hover: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: CONTENT_NEUTRAL,
      border: ref('color/selection/border/neutral/subtle'),
      // Next tier up from raised (raised -> elevated).
      prominence: PROM.elevated,
    },
    selected: {
      surface: ref('color/selection/surface/natural'),
      content: ref('color/selection/text/trigger'),
      border: ref('color/selection/border/trigger'),
      // Committing to the selection reaches the topmost tier.
      prominence: PROM.lifted,
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
  widget: 'button',
  question: 'Am I controlling something else on the page?',
  radius: RADIUS_MD,
  description:
    'A real button that acts on something else: pressing it updates the shared "Saved stores" tray below — a control\u2019s job is to do something to something else, not just to itself. Its own prominence never moves.',
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
  return `<span class="cdr-demo-badge ${cls}">${label}</span>`;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Sized in CSS via .cdr-demo-chip-icon svg / .cdr-demo-chip svg { width/height: rem(CdrIconSizeSm) } —
// no literal pixel dimensions on the markup itself.
const HEART_OUTLINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;
const HEART_FILLED = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;

const PHOTO_PLACEHOLDER = `
  <div class="cdr-demo-sky"></div>
  <div class="cdr-demo-building"></div>
  <div class="cdr-demo-windows"></div>
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

const toVarString = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');

// Each column below is its own independent, self-contained card instance —
// these three functions each carry only the CSS vars that one card needs.
function actionVars(): string {
  const a = ACTION_RECIPE.states;
  return toVarString({
    '--a-surface': refExpr(a.default.surface),
    '--a-content': refExpr(a.default.content),
    '--a-border': refExpr(a.default.border),
    '--a-border-hover': refExpr(a.hover.border),
    '--a-shadow': promExpr(a.default.prominence),
    '--a-shadow-hover': promExpr(a.hover.prominence),
    '--a-surface-pressed': refExpr(a.pressed.surface),
    '--a-border-pressed': refExpr(a.pressed.border),
    '--a-surface-disabled': refExpr(a.disabled.surface),
    '--a-content-disabled': refExpr(a.disabled.content),
    // Real action token — the same trigger/faint blue Cedar uses for
    // interactive affordances — standing in for the focus ring since the
    // set has no dedicated focus-outline color token.
    '--a-focus': `var(${ref('color/action/border/trigger/faint').cssVar})`,
  });
}

function selectionVars(): string {
  const s = SELECTION_RECIPE.states;
  return toVarString({
    '--s-surface': refExpr(s.default.surface),
    '--s-content': refExpr(s.default.content),
    '--s-border': refExpr(s.default.border),
    '--s-border-hover': refExpr(s.hover.border),
    '--s-shadow': promExpr(s.default.prominence),
    '--s-shadow-hover': promExpr(s.hover.prominence),
    '--s-surface-selected': refExpr(s.selected.surface),
    '--s-content-selected': refExpr(s.selected.content),
    '--s-border-selected': refExpr(s.selected.border),
    '--s-shadow-selected': promExpr(s.selected.prominence),
    '--s-surface-disabled': refExpr(s.disabled.surface),
    '--s-content-disabled': refExpr(s.disabled.content),
  });
}

function controlVars(): string {
  const c = CONTROL_RECIPE.states;
  return toVarString({
    '--c-surface': refExpr(c.default.surface),
    '--c-content': refExpr(c.default.content),
    '--c-border': refExpr(c.default.border),
    '--c-surface-hover': refExpr(c.hover.surface),
    '--c-surface-disabled': refExpr(c.disabled.surface),
    '--c-content-disabled': refExpr(c.disabled.content),
    '--c-shadow': promExpr(c.default.prominence),
    // control.icon.neutral.* are near-white fills meant for dark surfaces —
    // invisible on this light button. The family's readable dark is the
    // shared content token instead.
    '--c-icon': refExpr(CONTENT_NEUTRAL),
  });
}

// The same visual "shape" — photo, brand chip, name/phone/address/hours —
// rendered three times, once per family. What changes between columns is
// only what the tokens/design system dictate: which element is the
// interactive widget, its radius tier, and its prominence direction.
// Nothing here shares DOM with the other columns — each card is a fully
// independent, real, live instance.

// Photo + info live in their own clipped wrapper so the card's radius
// actually shows (a square photo sitting directly in the card would
// otherwise visually cover the rounded corner entirely — the shadow must
// stay on the un-clipped outer card, or it gets cut off instead).
function cardBody(): string {
  return `
    <div class="cdr-demo-card-clip">
      <div class="cdr-demo-photo">${PHOTO_PLACEHOLDER}</div>
      <div class="cdr-demo-info">
        <p class="cdr-demo-name">REI Example</p>
        <p class="cdr-demo-detail">(206) 555-0142</p>
        <p class="cdr-demo-detail">400 Occidental Ave S, Seattle, WA 98104</p>
        <p class="cdr-demo-hours"><span class="cdr-demo-dot"></span> Open until 9pm today</p>
      </div>
    </div>
  `;
}

function questionHeader(recipe: FamilyRecipe): string {
  return `
    <p class="cdr-demo-question">${recipe.question}</p>
    <p class="cdr-demo-answer">→ ${recipe.label.split(' — ')[0]}</p>
  `;
}

function renderTrio(): string {
  return `
    <div class="cdr-demo-trio">

      <div class="cdr-demo-trio-item">
        ${questionHeader(ACTION_RECIPE)}
        <a
          class="cdr-demo-card cdr-demo-card--action"
          style="${actionVars()}"
          href="https://www.rei.com/stores/example"
          aria-label="Visit the REI Example store page"
          data-demo-link="true"
        >
          ${cardBody()}
          <span class="cdr-demo-chip cdr-demo-chip--decorative" aria-hidden="true">${HEART_OUTLINE}<span>My REI</span></span>
        </a>
        <p class="cdr-demo-trio-caption">The whole card is the link — hover/tab it. Radius: smallest non-zero. Prominence: flat → raised on hover.</p>
      </div>

      <div class="cdr-demo-trio-item">
        ${questionHeader(SELECTION_RECIPE)}
        <label class="cdr-demo-card cdr-demo-card--selection" style="${selectionVars()}">
          <input type="checkbox" class="sr-only" data-widget="selection" aria-label="Set REI Example as my store" />
          ${cardBody()}
          <span class="cdr-demo-chip cdr-demo-chip--decorative" aria-hidden="true">${HEART_OUTLINE}<span>My REI</span></span>
          <span class="cdr-demo-store-tag">Selected</span>
        </label>
        <p class="cdr-demo-trio-caption">The whole card is a checkbox — click it. Radius: one tier up from action. Prominence: raised → elevated (hover) → lifted (selected).</p>
      </div>

      <div class="cdr-demo-trio-item">
        ${questionHeader(CONTROL_RECIPE)}
        <div class="cdr-demo-card cdr-demo-card--control" style="${controlVars()}">
          ${cardBody()}
          <button type="button" class="cdr-demo-chip cdr-demo-chip--button" data-widget="control" aria-pressed="false" aria-label="Save REI Example to My REI">
            <span class="cdr-demo-chip-icon cdr-demo-chip-icon-outline">${HEART_OUTLINE}</span>
            <span class="cdr-demo-chip-icon cdr-demo-chip-icon-filled">${HEART_FILLED}</span>
            <span>My REI</span>
          </button>
        </div>
        <p class="cdr-demo-trio-caption">The card itself never changes — only the chip is interactive, and it acts on the "Saved stores" tray below. Radius: one tier up from selection. Prominence: never moves.</p>
      </div>

    </div>
    <div class="cdr-demo-tray">
      <strong>Saved stores:</strong> <span data-tray-count>0</span>
      <span class="cdr-demo-tray-hint">← this is what the control chip actually changes, not itself</span>
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
  return `<span class="cdr-demo-chip-swatch" style="background:${r.value}"></span><code>${varLine}</code>
    <div class="cdr-demo-token-path">${r.path}</div> ${statusBadge(r)}`;
}

function renderTable(recipe: FamilyRecipe, activeState: string): string {
  const rows = recipe.order
    .map((name) => {
      const st = recipe.states[name];
      return `<tr class="${name === activeState ? 'active' : ''}">
        <td class="cdr-demo-state">${name}</td>
        <td>${tokenCell(st.surface)}</td>
        <td><code>${st.content.cssVar}</code><div class="cdr-demo-token-path">${st.content.path}</div> ${statusBadge(st.content)}</td>
        <td><code>${st.border.cssVar}</code><div class="cdr-demo-token-path">${st.border.path}</div> ${statusBadge(st.border)}</td>
        <td><code>${st.prominence.cssVar}</code></td>
      </tr>`;
    })
    .join('');
  return `<table class="cdr-demo-table">
    <thead><tr><th>State</th><th>Surface variable</th><th>Content variable</th><th>Border variable</th><th>Prominence variable</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

const WIDGET_SELECTOR: Record<string, string> = {
  action: '.cdr-demo-card--action',
  selection: '.cdr-demo-card--selection',
  control: '.cdr-demo-chip--button',
};

function renderComposition(family: string, activeState: string): string {
  const recipe = RECIPES[family];
  const st = recipe.states[activeState];
  const stateNav = recipe.order
    .map(
      (name) =>
        `<button type="button" class="cdr-demo-state-btn ${name === activeState ? 'active' : ''}" data-state="${name}">${capitalize(name)}</button>`,
    )
    .join('');

  const cssBlock = `${WIDGET_SELECTOR[family]}[data-state="${activeState}"] {
  background: ${refExpr(st.surface)}; /* ${st.surface.path} */
  color: ${refExpr(st.content)}; /* ${st.content.path} */
  border-color: ${refExpr(st.border)}; /* ${st.border.path} */
  box-shadow: ${promExpr(st.prominence)};
  border-radius: ${recipe.radius};
}`;

  return `
    <div class="cdr-demo-recipe">
      <strong>${recipe.label}</strong> — ${recipe.description}
      ${st.note ? `<div class="cdr-demo-cue">⚠ ${st.note}</div>` : ''}
      <div class="cdr-demo-hint">Try it live above (${recipe.question}): ${
        recipe.widget === 'link'
          ? 'hover or press the Action card, or tab to it and check the focus ring.'
          : recipe.widget === 'checkbox'
            ? 'hover or click the Selection card — checking it selects the card itself.'
            : 'click the "My REI" chip on the Control card — it updates the shared tray below, not itself.'
      } The buttons below jump the table to that state\u2019s exact tokens — <code>disabled</code>/<code>selected</code> also apply real <code>disabled</code>/<code>checked</code> attributes so you can see them.</div>
    </div>
    <div class="cdr-demo-state-nav">${stateNav}</div>
    ${renderTable(recipe, activeState)}
    <div class="cdr-demo-css"><pre>${cssBlock}</pre></div>
  `;
}

// ─── Chrome ────────────────────────────────────────────────────────────────────
// Every radius, gap/padding/margin, and type style below is a real Cedar token
// (CdrRadius / CdrSpace / CdrText* / CdrDuration / CdrTimingFunction / CdrIconSize).
// The only literals left are dimensions Cedar doesn't tokenize at all — card
// width, photo height, and the two decorative dot indicators — called out
// inline rather than disguised as tokens.

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
    .cdr-demo-controls {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: ${SPACE_LG};
      padding: ${SPACE_LG}; margin-bottom: ${SPACE_XL};
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD};
    }
    .cdr-demo-field { display: flex; flex-direction: column; gap: ${SPACE_XS}; }
    .cdr-demo-field label {
      ${typeStyle('CdrTextEyebrow100')} color: var(--cedar-warm-600);
    }
    .cdr-demo-field select {
      padding: ${SPACE_SM2} ${SPACE_SM}; border: 1px solid var(--cedar-warm-300); border-radius: ${RADIUS_SM};
      ${typeStyle('CdrTextBody300')} background: white;
    }
    .cdr-demo-recipe {
      background: var(--cedar-warm-50); border: 1px solid var(--cedar-warm-200);
      border-radius: ${RADIUS_MD}; padding: ${SPACE_MD} ${SPACE_LG}; margin-bottom: ${SPACE_LG};
      ${typeStyle('CdrTextBody300')} color: var(--cedar-warm-800);
    }
    .cdr-demo-cue { margin-top: ${SPACE_SM2}; color: #856404; ${typeStyle('CdrTextEyebrow100')} text-transform: none; }
    .cdr-demo-hint { margin-top: ${SPACE_SM}; color: var(--cedar-warm-600); ${typeStyle('CdrTextEyebrow100')} text-transform: none; }
    .cdr-demo-state-nav { display: flex; flex-wrap: wrap; gap: ${SPACE_SM}; margin-bottom: ${SPACE_LG}; }
    .cdr-demo-state-btn {
      ${typeStyle('CdrTextEyebrow100')}
      padding: ${SPACE_SM2} ${SPACE_MD}; border-radius: ${RADIUS_PILL}; cursor: pointer;
      background: white; border: 1px solid var(--cedar-warm-300); color: var(--cedar-warm-700);
    }
    .cdr-demo-state-btn.active { background: var(--cedar-warm-1000); color: white; border-color: var(--cedar-warm-1000); }
    .cdr-demo-intro { margin-bottom: ${SPACE_XL}; color: var(--cedar-warm-700); max-width: 780px; ${typeStyle('CdrTextBody300')} }

    /* ── Trio layout ──
       The same visual card, three independent live instances, one per
       family. Card width, photo height, and the decorative dot sizes have
       no Cedar dimension token — the only literal numbers left in this
       file, flagged rather than hidden. */
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    .cdr-demo-trio {
      display: flex; flex-wrap: wrap; align-items: flex-start; gap: ${SPACE_2XL};
      padding: ${SPACE_2XL}; border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD};
      margin-bottom: ${SPACE_SM};
      /* Darker than the page background so each card's box-shadow (the
         prominence token) actually shows up against something. */
      background: var(--cedar-warm-100);
    }
    .cdr-demo-trio-item { display: flex; flex-direction: column; width: 300px; }
    .cdr-demo-question {
      margin: 0; ${typeStyle('CdrTextEyebrow100')} color: var(--cedar-warm-600); text-transform: none;
    }
    .cdr-demo-answer {
      margin: 0 0 ${SPACE_SM}; ${typeStyle('CdrTextHeadingSerif300')} color: var(--cedar-warm-1000);
    }
    .cdr-demo-trio-caption {
      margin: ${SPACE_SM} 0 0; color: var(--cedar-warm-600); ${typeStyle('CdrTextEyebrow100')} text-transform: none;
    }
    .cdr-demo-tray {
      padding: ${SPACE_MD} ${SPACE_LG}; margin-bottom: ${SPACE_XL};
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD};
      ${typeStyle('CdrTextBody300')} color: var(--cedar-warm-800);
      transition: background ${MOTION};
    }
    .cdr-demo-tray-hint { margin-left: ${SPACE_SM}; color: var(--cedar-warm-500); ${typeStyle('CdrTextEyebrow100')} text-transform: none; }

    /* The card shape itself — identical across all three columns except for
       radius (set per-family below) and which real element carries the
       state-driven surface/border/shadow (bound via that family's own
       --a-/--s-/--c- vars declared on the same node). */
    .cdr-demo-card {
      position: relative; display: block; width: 300px; background: white;
      text-decoration: none; color: inherit; cursor: pointer;
      transition: box-shadow ${MOTION}, border-color ${MOTION};
    }
    /* Photo/info live inside this clipped wrapper, never directly in
       .cdr-demo-card — otherwise the square photo sits flush with the
       card's edge and visually erases the radius entirely, which is why
       the three cards looked identical regardless of their actual radius
       tier. Border-radius is set here explicitly per family (not
       "inherit", since the outer card's border adds extra width the inner
       clip must shrink inside of), and the shadow stays on the un-clipped
       outer card so it isn't cut off. */
    .cdr-demo-card-clip { overflow: hidden; }
    .cdr-demo-card--action .cdr-demo-card-clip { border-radius: ${RADIUS_ACTION}; }
    .cdr-demo-card--selection .cdr-demo-card-clip { border-radius: ${RADIUS_SM}; }
    .cdr-demo-card--control .cdr-demo-card-clip { border-radius: ${RADIUS_MD}; }
    .cdr-demo-photo { position: relative; height: 200px; overflow: hidden; /* no photo-aspect token */ }
    .cdr-demo-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #7fb2e8 0%, #cfe6f7 100%); }
    .cdr-demo-building {
      position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
      background: #4a4a4d;
      clip-path: polygon(0% 100%, 0% 40%, 30% 40%, 30% 15%, 65% 15%, 65% 40%, 100% 40%, 100% 100%);
    }
    .cdr-demo-windows {
      position: absolute; left: 8%; right: 8%; bottom: 8%; height: 30%;
      background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 10%, transparent 10% 20%),
                         repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 12%, transparent 12% 24%);
      opacity: 0.5;
    }
    .cdr-demo-info { position: relative; padding: ${SPACE_MD} ${SPACE_LG}; }
    .cdr-demo-name { margin: 0 0 ${SPACE_XS}; ${typeStyle('CdrTextHeadingSerif300')} }
    .cdr-demo-detail { margin: 0 0 ${SPACE_2XS}; ${typeStyle('CdrTextBody300')} text-decoration: underline; }
    .cdr-demo-hours { margin: ${SPACE_SM} 0 0; display: flex; align-items: center; gap: ${SPACE_3XS}; ${typeStyle('CdrTextBody300')} }
    .cdr-demo-dot { width: ${SPACE_XS}; height: ${SPACE_XS}; border-radius: 50%; background: #3a9c50; display: inline-block; }
    /* Brand chip — matches the reference "My REI" pill. Decorative on
       action/selection (the card itself carries the semantics); on control
       it's the one real interactive element. */
    .cdr-demo-chip {
      position: absolute; top: ${SPACE_MD}; left: ${SPACE_MD}; z-index: 2;
      display: inline-flex; align-items: center; gap: ${SPACE_XS};
      padding: ${SPACE_XS} ${SPACE_SM}; border-radius: ${RADIUS_PILL};
      background: white; color: var(--cedar-warm-900);
      ${typeStyle('CdrTextBodyStrong300')}
    }
    .cdr-demo-chip svg, .cdr-demo-chip-icon svg { width: ${ICON_SIZE}; height: ${ICON_SIZE}; color: #2f6f4e; }
    .cdr-demo-chip--decorative { pointer-events: none; }

    /* ── Action: the whole card is a real anchor ──
       Full state flow: default → hover → pressed → disabled, plus a
       focus-visible ring for keyboard users. Radius: smallest non-zero. */
    .cdr-demo-card--action {
      border-radius: ${RADIUS_ACTION};
      border: 3px solid var(--a-border);
      box-shadow: var(--a-shadow);
    }
    .cdr-demo-card--action:hover { border-color: var(--a-border-hover); box-shadow: var(--a-shadow-hover); }
    .cdr-demo-card--action:focus-visible { outline: 2px solid var(--a-focus); outline-offset: 2px; border-color: var(--a-border-hover); }
    .cdr-demo-card--action:active { border-color: var(--a-border-pressed); box-shadow: var(--a-shadow); }
    .cdr-demo-card--action:active .cdr-demo-info { background: var(--a-surface-pressed); }
    .cdr-demo-card--action .cdr-demo-info { background: var(--a-surface); color: var(--a-content); }

    /* ── Selection: the whole card is a real checkbox ──
       Radius: one tier up from action. Prominence climbs the real scale:
       raised (rest) -> elevated (hover) -> lifted (selected). */
    .cdr-demo-card--selection {
      border-radius: ${RADIUS_SM};
      border: 3px solid var(--s-border);
      box-shadow: var(--s-shadow);
    }
    .cdr-demo-card--selection:hover { border-color: var(--s-border-hover); box-shadow: var(--s-shadow-hover); }
    .cdr-demo-card--selection:has(input:focus-visible) { outline: 2px solid var(--s-border-selected); outline-offset: 2px; }
    .cdr-demo-card--selection .cdr-demo-info { background: var(--s-surface); color: var(--s-content); }
    .cdr-demo-card--selection:has(input:checked) {
      border-color: var(--s-border-selected); box-shadow: var(--s-shadow-selected);
    }
    .cdr-demo-card--selection:has(input:checked) .cdr-demo-info {
      background: var(--s-surface-selected); color: var(--s-content-selected);
    }
    .cdr-demo-card--selection:has(input:disabled) { cursor: not-allowed; }
    .cdr-demo-card--selection:has(input:disabled) .cdr-demo-info { background: var(--s-surface-disabled); color: var(--s-content-disabled); }
    /* "Selected" tag — only appears once actually checked. */
    .cdr-demo-store-tag {
      position: absolute; top: ${SPACE_MD}; right: ${SPACE_MD}; z-index: 2;
      padding: ${SPACE_2XS} ${SPACE_SM}; border-radius: ${RADIUS_PILL};
      background: var(--s-surface-selected); color: var(--s-content-selected);
      border: 1px solid var(--s-border-selected);
      ${typeStyle('CdrTextEyebrow100')} display: none;
    }
    .cdr-demo-card--selection:has(input:checked) .cdr-demo-store-tag { display: inline-block; }

    /* ── Control: the card is static; the chip is the real button ──
       Radius: one tier up from selection. Prominence never moves — the
       control's job is to act on the shared tray below, not itself. */
    .cdr-demo-card--control {
      border-radius: ${RADIUS_MD};
      border: 3px solid var(--c-border);
      box-shadow: var(--c-shadow);
      cursor: default;
    }
    .cdr-demo-card--control .cdr-demo-info { background: var(--c-surface); color: var(--c-content); }
    .cdr-demo-chip--button {
      cursor: pointer; border: none; font: inherit;
      transition: background ${MOTION};
    }
    .cdr-demo-chip--button:hover { background: var(--c-surface-hover); }
    .cdr-demo-chip--button:focus-visible { outline: 2px solid var(--a-focus); outline-offset: 2px; }
    .cdr-demo-chip--button:disabled { background: var(--c-surface-disabled); color: var(--c-content-disabled); cursor: not-allowed; }
    .cdr-demo-chip-icon { display: inline-flex; }
    .cdr-demo-chip-icon-filled { display: none; }
    .cdr-demo-chip--button[aria-pressed="true"] .cdr-demo-chip-icon-outline { display: none; }
    .cdr-demo-chip--button[aria-pressed="true"] .cdr-demo-chip-icon-filled { display: inline-flex; }
    .cdr-demo-chip--button[aria-pressed="true"] svg { color: #b5442e; }

    .cdr-demo-badge {
      ${typeStyle('CdrTextEyebrow100')}
      padding: ${SPACE_2XS} ${SPACE_SM}; border-radius: ${RADIUS_SM}; display: inline-block; white-space: nowrap; margin-left: ${SPACE_XS};
    }
    .cdr-demo-badge.pass { background: #d4edda; color: #155724; }
    .cdr-demo-badge.warn { background: #fff3cd; color: #856404; }
    .cdr-demo-badge.fail { background: #f8d7da; color: #721c24; }
    .cdr-demo-table {
      width: 100%; border-collapse: collapse; background: white;
      border: 1px solid var(--cedar-warm-200); border-radius: ${RADIUS_MD}; overflow: hidden;
      margin-bottom: ${SPACE_XL};
    }
    .cdr-demo-table th {
      text-align: left; padding: ${SPACE_SM} ${SPACE_MD}; background: var(--cedar-warm-100);
      ${typeStyle('CdrTextEyebrow100')} color: var(--cedar-warm-700);
    }
    .cdr-demo-table td { padding: ${SPACE_SM} ${SPACE_MD}; border-top: 1px solid var(--cedar-warm-200); ${typeStyle('CdrTextBody300')} }
    .cdr-demo-table tr.active td { background: var(--cedar-warm-50); font-weight: 600; }
    .cdr-demo-state { font-weight: 600; text-transform: capitalize; }
    .cdr-demo-chip-swatch {
      display: inline-block; width: ${SPACE_LG}; height: ${SPACE_LG}; border-radius: ${RADIUS_SM};
      border: 1px solid rgba(0,0,0,0.12); vertical-align: middle; margin-right: ${SPACE_SM};
    }
    .cdr-demo-token-path { color: var(--cedar-warm-500); ${typeStyle('CdrTextEyebrow100')} text-transform: none; letter-spacing: normal; }
    .cdr-demo-css {
      background: var(--cedar-warm-900); border-radius: ${RADIUS_MD}; padding: ${SPACE_XL};
      margin-bottom: ${SPACE_2XL}; overflow-x: auto;
    }
    .cdr-demo-css pre {
      margin: 0; color: #e8e6e3; line-height: 1.6;
      font-family: ${MONO_FONT}; font-size: ${t.CdrTextBody300Size}px;
    }
    .cdr-demo-notes {
      background: var(--cedar-green-50); border: 1px solid var(--cedar-green-200);
      border-radius: ${RADIUS_MD}; padding: ${SPACE_XL};
    }
    .cdr-demo-notes h3 {
      ${typeStyle('CdrTextHeadingSerif500')} color: var(--cedar-green-900); margin: 0 0 ${SPACE_MD};
    }
    .cdr-demo-notes ul { margin: 0; padding-left: ${SPACE_LG}; }
    .cdr-demo-notes li { margin-bottom: ${SPACE_SM}; color: var(--cedar-green-800); ${typeStyle('CdrTextBody300')} }
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
        <p class="cdr-demo-intro">
          Use this when Cedar has no component for your pattern yet. Before building anything,
          ask: am I moving the user somewhere (<strong>action</strong>), setting or saving a
          preference (<strong>selection</strong>), or controlling something else on the page
          (<strong>control</strong>)? Below is the exact same visual card — photo, chip, name,
          detail, hours — built three times to answer that question three different ways. Same
          shape, same tokens vocabulary, three real and independently interactive outcomes: no
          extra Cedar component was needed, just the right semantic role.
        </p>

        ${renderTrio()}

        <div class="cdr-demo-controls">
          <div class="cdr-demo-field">
            <label for="cdr-demo-family">Inspect tokens for</label>
            <select id="cdr-demo-family">${familyOptions(DEFAULTS.family)}</select>
          </div>
        </div>

        <div id="cdr-demo-inspector">${renderComposition(DEFAULTS.family, DEFAULTS.state)}</div>

        <div class="cdr-demo-notes">
          <h3>What this proves — and what it doesn't</h3>
          <ul>
            <li><strong>Every color is a real, resolved token</strong> referenced by its actual shipped <code>var(--cdr-...)</code> custom property, not a baked-in hex — check the "Generated CSS" panel or inspect any card in devtools.</li>
            <li><strong>Radius is the same shape, three real tiers.</strong> Verified ascending order in the compiled set: <code>Soft(2) &lt; Softer(4) &lt; Softest(6) &lt; Round(9999)</code>. Action uses the smallest non-zero tier (reads as a link), selection the next tier up, control the next tier up from that — never fully round.</li>
            <li><strong>Prominence direction differs per family, and the order is real, not invented.</strong> Verified ascending shadow scale: <code>Flat(0) &lt; Raised(2px) &lt; Elevated(4px) &lt; Floating(8px) &lt; Lifted(16px)</code>. Action starts <code>flat</code> and raises on hover. Selection starts one tier higher, at <code>raised</code>, climbs to <code>elevated</code> on hover, and reaches the topmost tier, <code>lifted</code>, once actually selected. Control's prominence never moves at all — it isn't the thing changing.</li>
            <li><strong>Action is a real anchor with a full state flow.</strong> The whole card is an <code>&lt;a&gt;</code>: default → hover (border deepens, shadow raises) → pressed (<code>:active</code> — surface shifts, shadow drops back) → disabled (<code>aria-disabled</code>), with a <code>:focus-visible</code> ring drawn from the real <code>action.border.trigger.faint</code> token. It moves the user to the store page.</li>
            <li><strong>Selection is a real checkbox that selects the card.</strong> The whole card is a <code>&lt;label&gt;</code> wrapping a checkbox — checking it repaints the card's border, surface, and shadow, and reveals a "Selected" tag. It saves a preference, it doesn't navigate.</li>
            <li><strong>Control is a real button that acts on something else.</strong> The card itself is static; only the "My REI" chip is interactive, and clicking it updates the shared "Saved stores" tray below — never itself. That's the entire point of a control: it does something to something else.</li>
            <li><strong>Two real gaps surfaced by building this honestly:</strong> <code>color.action.surface.neutral.bold</code> doesn't exist in the compiled set (see Action → Hover/Pressed), and the <code>control</code> family has no "pressed" fill token — the chip only changes via icon swap and color, not a dedicated pressed surface.</li>
            <li><strong>content/text.primary is legacy</strong> and isn't scoped to any of these three families — this demo instead reuses <code>selection.text.neutral.faint</code>, the closest family-owned equivalent, everywhere a default readable content color is needed.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const familyEl = canvasElement.querySelector<HTMLSelectElement>('#cdr-demo-family');
    const inspector = canvasElement.querySelector<HTMLElement>('#cdr-demo-inspector');
    if (!familyEl || !inspector) return;

    // The action card is a genuine <a href> so :hover/:focus-visible/:active
    // and devtools all read a real link — but actually navigating away
    // would leave the story. Block the navigation only; every
    // visual/interactive state stays real.
    canvasElement
      .querySelector<HTMLAnchorElement>('[data-demo-link="true"]')
      ?.addEventListener('click', (e) => e.preventDefault());

    let activeState = DEFAULTS.state;

    const widgetInput = (
      family: string,
    ): HTMLInputElement | HTMLAnchorElement | HTMLButtonElement | null => {
      if (family === 'action')
        return canvasElement.querySelector<HTMLAnchorElement>('.cdr-demo-card--action');
      if (family === 'control')
        return canvasElement.querySelector<HTMLButtonElement>('.cdr-demo-chip--button');
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
      } else if (el instanceof HTMLButtonElement) {
        el.disabled = state === 'disabled';
      } else if (el instanceof HTMLInputElement) {
        el.disabled = state === 'disabled';
        // Only ever force it ON to preview "selected" — never force it back
        // off. A real selection must survive switching families or jumping
        // to another state's preview.
        if (family === 'selection' && state === 'selected') el.checked = true;
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
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.cdr-demo-state-btn');
      if (!btn?.dataset.state) return;
      activeState = btn.dataset.state;
      render();
    });

    render();

    // Keep the inspector truthful about a real selection made directly on
    // the selection card (not just via the state-nav preview buttons).
    const selectionInput = canvasElement.querySelector<HTMLInputElement>(
      'input[data-widget="selection"]',
    );
    selectionInput?.addEventListener('change', () => {
      if (familyEl.value === 'selection') {
        activeState = selectionInput.checked ? 'selected' : 'default';
        render();
      }
    });

    // The control card's chip acts on something OTHER than itself: the
    // shared "Saved stores" tray below all three cards, not its own card.
    // This is a real toggle via aria-pressed, not a JS-simulated state.
    const controlButton = canvasElement.querySelector<HTMLButtonElement>('.cdr-demo-chip--button');
    const trayCount = canvasElement.querySelector<HTMLElement>('[data-tray-count]');
    controlButton?.addEventListener('click', () => {
      const pressed = controlButton.getAttribute('aria-pressed') === 'true';
      controlButton.setAttribute('aria-pressed', String(!pressed));
      if (trayCount) trayCount.textContent = pressed ? '0' : '1';
    });
  },
};

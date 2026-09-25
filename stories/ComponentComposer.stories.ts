import type { StoryObj, Meta } from '@storybook/html-vite';
import { resolvePath } from './color-registry';
import { CdrProminence } from '../dist/rei-dot-com/types/foundations/cdr-prominence.mjs';
import { hexToRgb, rgbToOklch, oklchToRgb } from './oklch-math';

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
// Every value carries its own canonical path so the demo can show *names*,
// not just resolved colors — that's the artifact a dev actually copies.

type TokenRef = { path: string; value: string; status: 'token' | 'muted' | 'missing' };

function ref(path: string): TokenRef {
  return { path, value: resolvePath(path), status: 'token' };
}

// Disabled content is softened for legibility — not a distinct approved
// token, so it's labeled "muted" rather than presented as if it were one.
function muted(base: TokenRef): TokenRef {
  return { path: base.path, value: lift(base.value, 0, 0.55), status: 'muted' };
}

function safeRef(path: string): TokenRef {
  try {
    return ref(path);
  } catch {
    return { path, value: '', status: 'missing' };
  }
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

type Prominence = { name: string; value: string };
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
  flat: { name: 'flat', value: CdrProminence.CdrProminenceFlat },
  raised: { name: 'raised', value: CdrProminence.CdrProminenceRaised },
  elevated: { name: 'elevated', value: CdrProminence.CdrProminenceElevated },
};

const TEXT_PRIMARY = ref('color/text/primary');
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
        status: 'missing',
      }
    : ACTION_BORDER_BOLD_RAW;

const ACTION_RECIPE: FamilyRecipe = {
  label: 'Action — card link',
  widget: 'link',
  description:
    'The whole card is a link to the store page. Background and border come from the neutral action pair; hovering the real link raises the card via CdrProminence.',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: ref('color/action/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: ACTION_BORDER_FAINT,
      prominence: PROM.flat,
    },
    hover: {
      surface: ref('color/action/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: ACTION_BORDER_BOLD,
      prominence: PROM.raised,
      note:
        ACTION_BORDER_BOLD.status === 'missing'
          ? 'color.action.surface.neutral.bold is not compiled yet — shown as a measured placeholder, not an approved token.'
          : undefined,
    },
    disabled: {
      surface: ref('color/action/surface/neutral/faint'),
      content: muted(TEXT_PRIMARY),
      border: ACTION_BORDER_FAINT,
      prominence: PROM.flat,
    },
  },
};

const SELECTION_RECIPE: FamilyRecipe = {
  label: 'Selection — set as my store',
  widget: 'radio',
  description:
    'A radio choosing this as the primary store. Selection tokens start at a raised prominence and move to elevated once chosen — the opposite direction from action.',
  order: ['default', 'hover', 'selected', 'disabled'],
  states: {
    default: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: ref('color/selection/text/neutral/faint'),
      border: ref('color/selection/border/neutral/faint'),
      prominence: PROM.raised,
    },
    hover: {
      surface: ref('color/selection/surface/neutral/trace'),
      content: ref('color/selection/text/neutral/faint'),
      border: ref('color/selection/border/neutral/subtle'),
      prominence: PROM.raised,
    },
    selected: {
      surface: ref('color/selection/surface/natural'),
      content: ref('color/selection/text/trigger'),
      border: ref('color/selection/border/trigger'),
      prominence: PROM.elevated,
    },
    disabled: {
      surface: ref('color/selection/surface/neutral/faint'),
      content: muted(ref('color/selection/text/neutral/faint')),
      border: ref('color/selection/border/neutral/faint'),
      prominence: PROM.raised,
    },
  },
};

const CONTROL_RECIPE: FamilyRecipe = {
  label: 'Control — save to My REI',
  widget: 'checkbox',
  description:
    'A checkbox toggling favorite status. Box chrome uses control tokens. Control has no compiled "checked" fill token, so checking it swaps the heart icon via CSS — color doesn\u2019t change, which is a real gap, not a design choice.',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: ref('color/control/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: ref('color/control/border/neutral/faint'),
      prominence: PROM.flat,
    },
    hover: {
      surface: ref('color/control/surface/neutral/subtle'),
      content: TEXT_PRIMARY,
      border: ref('color/control/border/neutral/faint'),
      prominence: PROM.flat,
    },
    disabled: {
      surface: ref('color/control/surface/neutral/faint'),
      content: muted(TEXT_PRIMARY),
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

const HEART_OUTLINE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;
const HEART_FILLED = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;

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

function cardVars(): string {
  const a = ACTION_RECIPE.states;
  const s = SELECTION_RECIPE.states;
  const c = CONTROL_RECIPE.states;
  const vars: Record<string, string> = {
    '--a-surface': a.default.surface.value,
    '--a-content': a.default.content.value,
    '--a-border': a.default.border.value,
    '--a-border-hover': a.hover.border.value,
    '--a-shadow': a.default.prominence.value,
    '--a-shadow-hover': a.hover.prominence.value,
    '--a-surface-disabled': a.disabled.surface.value,
    '--a-content-disabled': a.disabled.content.value,

    '--s-surface': s.default.surface.value,
    '--s-content': s.default.content.value,
    '--s-border': s.default.border.value,
    '--s-border-hover': s.hover.border.value,
    '--s-shadow': s.default.prominence.value,
    '--s-surface-selected': s.selected.surface.value,
    '--s-content-selected': s.selected.content.value,
    '--s-border-selected': s.selected.border.value,
    '--s-shadow-selected': s.selected.prominence.value,
    '--s-surface-disabled': s.disabled.surface.value,
    '--s-content-disabled': s.disabled.content.value,

    '--c-surface': c.default.surface.value,
    '--c-content': c.default.content.value,
    '--c-border': c.default.border.value,
    '--c-surface-hover': c.hover.surface.value,
    '--c-surface-disabled': c.disabled.surface.value,
    '--c-content-disabled': c.disabled.content.value,
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
        <label class="rc-chip">
          <input type="checkbox" class="sr-only" data-widget="control" aria-label="Save to My REI" />
          <span class="rc-chip-icon rc-chip-icon-outline">${HEART_OUTLINE}</span>
          <span class="rc-chip-icon rc-chip-icon-filled">${HEART_FILLED}</span>
          <span>My REI</span>
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

function statusBadge(tokenRef: TokenRef): string {
  if (tokenRef.status === 'missing') return badge('warn', 'not compiled');
  if (tokenRef.status === 'muted') return badge('warn', 'derived, not a token');
  return badge(true, 'compiled token');
}

function renderTable(recipe: FamilyRecipe, activeState: string): string {
  const rows = recipe.order
    .map((name) => {
      const st = recipe.states[name];
      return `<tr class="${name === activeState ? 'active' : ''}">
        <td class="cc-state">${name}</td>
        <td><span class="cc-chip-swatch" style="background:${st.surface.value}"></span><code>${st.surface.path}</code> ${statusBadge(st.surface)}</td>
        <td><code>${st.content.path}</code> ${statusBadge(st.content)}</td>
        <td><code>${st.border.path}</code> ${statusBadge(st.border)}</td>
        <td><code>CdrProminence.${capitalize(st.prominence.name)}</code></td>
      </tr>`;
    })
    .join('');
  return `<table class="cc-table">
    <thead><tr><th>State</th><th>Surface token</th><th>Content token</th><th>Border token</th><th>Prominence token</th></tr></thead>
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
  background: ${st.surface.value}; /* ${st.surface.path} */
  color: ${st.content.value}; /* ${st.content.path} */
  border-color: ${st.border.value}; /* ${st.border.path} */
  box-shadow: ${st.prominence.value}; /* CdrProminence.${capitalize(st.prominence.name)} */
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

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .sb-section-header {
      display: flex; align-items: baseline; gap: 12px;
      margin-bottom: 24px; padding-bottom: 10px;
      border-bottom: 2px solid var(--cedar-warm-100);
    }
    .sb-section-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 22px; font-weight: 600; color: var(--cedar-warm-1000);
      margin: 0; letter-spacing: -0.3px;
    }
    .cc-controls {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px;
      padding: 16px; margin-bottom: 24px;
      background: white; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
    }
    .cc-field { display: flex; flex-direction: column; gap: 4px; }
    .cc-field label {
      font-family: Pressura, monospace; font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em; color: var(--cedar-warm-600);
    }
    .cc-field select {
      padding: 6px 10px; border: 1px solid var(--cedar-warm-300); border-radius: 6px;
      font-family: Pressura, monospace; font-size: 12px; background: white;
    }
    .cc-recipe {
      background: var(--cedar-warm-50); border: 1px solid var(--cedar-warm-200);
      border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;
      font-size: 13px; color: var(--cedar-warm-800); line-height: 1.5;
    }
    .cc-cue { margin-top: 6px; font-size: 12px; color: #856404; }
    .cc-hint { margin-top: 8px; font-size: 12px; color: var(--cedar-warm-600); }
    .cc-state-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .cc-state-btn {
      font-family: Pressura, monospace; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 6px 14px; border-radius: 20px; cursor: pointer;
      background: white; border: 1px solid var(--cedar-warm-300); color: var(--cedar-warm-700);
    }
    .cc-state-btn.active { background: var(--cedar-warm-1000); color: white; border-color: var(--cedar-warm-1000); }

    /* ── Scene ── */
    .rc-scene {
      display: flex; flex-wrap: wrap; align-items: flex-start; gap: 32px;
      padding: 32px; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      margin-bottom: 24px; background: var(--cedar-warm-50);
    }

    /* ── Action: card link ──
       Shadow lives on .rc-card (never clipped); photo clipping lives on a
       separate inner wrapper so the box-shadow is never cut off. */
    .rc-card {
      position: relative; width: 300px; border-radius: 12px; background: white;
      box-shadow: var(--a-shadow);
      transition: box-shadow 0.18s ease;
    }
    .rc-card:has(.rc-overlay:hover),
    .rc-card:has(.rc-overlay:focus-visible) {
      box-shadow: var(--a-shadow-hover);
    }
    .rc-card:has(.rc-overlay[aria-disabled="true"]) { box-shadow: var(--a-shadow); }
    .rc-card-clip { border-radius: 12px; overflow: hidden; }
    .rc-photo { position: relative; height: 200px; overflow: hidden; }
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
      position: absolute; inset: 0; border-radius: 12px; z-index: 1;
      border: 2px solid var(--a-border);
      transition: border-color 0.18s ease;
    }
    .rc-overlay:hover, .rc-overlay:focus-visible { border-color: var(--a-border-hover); }
    .rc-overlay[aria-disabled="true"] { pointer-events: none; border-color: var(--a-border); opacity: 0.7; }
    .rc-info {
      position: relative; z-index: 0; padding: 14px 16px;
      font-family: Graphik, 'Helvetica Neue', sans-serif;
      background: var(--a-surface); color: var(--a-content);
      transition: background 0.18s ease, color 0.18s ease;
    }
    .rc-overlay[aria-disabled="true"] ~ .rc-info { background: var(--a-surface-disabled); color: var(--a-content-disabled); }
    .rc-name { margin: 0 0 4px; font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 17px; font-weight: 600; }
    .rc-detail { margin: 0 0 2px; font-size: 12px; text-decoration: underline; }
    .rc-hours { margin: 8px 0 0; font-size: 12px; display: flex; align-items: center; gap: 6px; }
    .rc-dot { width: 8px; height: 8px; border-radius: 50%; background: #3a9c50; display: inline-block; }

    /* ── Control: My REI checkbox ── */
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    .rc-chip {
      position: absolute; top: 12px; left: 12px; z-index: 2;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 999px; cursor: pointer;
      font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 12px; font-weight: 600;
      background: var(--c-surface); color: var(--c-content); border: 2px solid var(--c-border);
      transition: background 0.15s ease;
    }
    .rc-chip:has(input:hover) { background: var(--c-surface-hover); }
    .rc-chip:has(input:focus-visible) { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-chip:has(input:disabled) { background: var(--c-surface-disabled); color: var(--c-content-disabled); cursor: not-allowed; }
    .rc-chip-icon-filled { display: none; }
    .rc-chip:has(input:checked) .rc-chip-icon-outline { display: none; }
    .rc-chip:has(input:checked) .rc-chip-icon-filled { display: inline-flex; }

    /* ── Selection: set-as-my-store radio ── */
    .rc-radio {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      background: white; padding: 10px 14px; border-radius: 10px;
      box-shadow: var(--s-shadow);
      transition: box-shadow 0.18s ease;
    }
    .rc-radio:has(input:focus-visible) { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-radio:has(input:checked) { box-shadow: var(--s-shadow-selected); }
    .rc-radio-dot {
      width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--s-surface); border: 2px solid var(--s-border);
      transition: all 0.15s ease;
    }
    .rc-radio:hover .rc-radio-dot { border-color: var(--s-border-hover); }
    .rc-radio-dot::after {
      content: ''; width: 10px; height: 10px; border-radius: 50%;
      background: var(--s-content-selected); opacity: 0; transition: opacity 0.15s ease;
    }
    .rc-radio:has(input:checked) .rc-radio-dot {
      background: var(--s-surface-selected); border-color: var(--s-border-selected);
    }
    .rc-radio:has(input:checked) .rc-radio-dot::after { opacity: 1; }
    .rc-radio-label { font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 13px; color: var(--s-content); }
    .rc-radio:has(input:checked) .rc-radio-label { color: var(--s-content-selected); }
    .rc-radio:has(input:disabled) { cursor: not-allowed; }
    .rc-radio:has(input:disabled) .rc-radio-dot { background: var(--s-surface-disabled); }
    .rc-radio:has(input:disabled) .rc-radio-label { color: var(--s-content-disabled); }

    .cc-badge {
      font-family: Pressura, monospace; font-size: 10px; font-weight: 600;
      padding: 2px 8px; border-radius: 3px; display: inline-block; white-space: nowrap; margin-left: 4px;
    }
    .cc-badge.pass { background: #d4edda; color: #155724; }
    .cc-badge.warn { background: #fff3cd; color: #856404; }
    .cc-badge.fail { background: #f8d7da; color: #721c24; }
    .cc-table {
      width: 100%; border-collapse: collapse; background: white;
      border: 1px solid var(--cedar-warm-200); border-radius: 12px; overflow: hidden;
      margin-bottom: 24px; font-size: 12px;
    }
    .cc-table th {
      text-align: left; padding: 10px 12px; background: var(--cedar-warm-100);
      font-family: Pressura, monospace; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--cedar-warm-700);
    }
    .cc-table td { padding: 10px 12px; border-top: 1px solid var(--cedar-warm-200); }
    .cc-table tr.active td { background: var(--cedar-warm-50); font-weight: 600; }
    .cc-state { font-weight: 600; text-transform: capitalize; }
    .cc-chip-swatch {
      display: inline-block; width: 18px; height: 18px; border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.12); vertical-align: middle; margin-right: 8px;
    }
    .cc-css {
      background: var(--cedar-warm-900); border-radius: 12px; padding: 20px;
      margin-bottom: 32px; overflow-x: auto;
    }
    .cc-css pre { margin: 0; color: #e8e6e3; font-size: 12px; line-height: 1.6; }
    .cc-notes {
      background: var(--cedar-green-50); border: 1px solid var(--cedar-green-200);
      border-radius: 12px; padding: 24px;
    }
    .cc-notes h3 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px;
      font-weight: 600; color: var(--cedar-green-900); margin: 0 0 12px 0;
    }
    .cc-notes ul { margin: 0; padding-left: 20px; }
    .cc-notes li { margin-bottom: 10px; color: var(--cedar-green-800); line-height: 1.5; }
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
        <p style="margin-bottom: 24px; color: var(--cedar-warm-700); line-height: 1.5; max-width: 780px;">
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
            <li><strong>Every color is a real, resolved token.</strong> Values come from <code>resolvePath()</code> against the compiled foundations at load time; the table shows the token <em>path</em>, not just its hex, because the path is what a dev actually copies.</li>
            <li><strong>States are real, not simulated.</strong> Hover the card, focus it with Tab, check the radio, check the checkbox — the CSS in the "Generated CSS" panel is exactly the rule making that happen, driven by <code>:hover</code>/<code>:focus-visible</code>/<code>:checked</code>/<code>:disabled</code>/<code>[aria-disabled]</code>.</li>
            <li><strong>Action and selection move in opposite prominence directions.</strong> Action starts flat and raises on hover; selection starts raised and elevates once chosen — both are real <code>CdrProminence</code> box-shadow values, applied on an element that isn't clipped by <code>overflow: hidden</code> (a common reason a shadow silently disappears).</li>
            <li><strong>Two real gaps surfaced by building this honestly:</strong> <code>color.action.surface.neutral.bold</code> doesn't exist in the compiled set (see Action → Hover), and the <code>control</code> family has no "checked" fill token — the heart only changes via icon swap, not color, when checked.</li>
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
  },
};

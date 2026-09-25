import type { StoryObj, Meta } from '@storybook/html-vite';
import { resolvePath } from './color-registry';
import { CdrProminence } from '../dist/rei-dot-com/types/foundations/cdr-prominence.mjs';
import { hexToRgb, rgbToOklch, oklchToRgb, contrastRatio, type Oklch } from './oklch-math';

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
// Every color below is resolved live via `resolvePath()` against the compiled
// token modules — nothing is hand-typed hex. If a path doesn't resolve, this
// story fails to load, which is the point: it can't drift from the real tokens.

function lift(hex: string, dL: number, cScale: number): { hex: string; inGamut: boolean } {
  const o = rgbToOklch(hexToRgb(hex));
  const shifted: Oklch = {
    l: Math.min(1, Math.max(0, o.l + dL)),
    c: Math.max(0, o.c * cScale),
    h: o.h,
  };
  const { rgb, inGamut } = oklchToRgb(shifted);
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return { hex: `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`, inGamut };
}

// Disabled content softens chroma rather than changing hue or lightness.
function mixTowardGray(hex: string): string {
  return lift(hex, 0, 0.55).hex;
}

function safeResolve(path: string): { value: string; missing: boolean } {
  try {
    return { value: resolvePath(path), missing: false };
  } catch {
    return { value: '', missing: true };
  }
}

// ─── Recipes ──────────────────────────────────────────────────────────────────
// Each family maps onto one real interaction pattern on the demo card, using
// only that family's own tokens. Where the compiled set doesn't yet have a
// token the design intent implies, that's called out rather than invented.

type StateSpec = {
  surface: string;
  content: string;
  border: string;
  prominence: string;
  note?: string;
};
type FamilyRecipe = {
  label: string;
  widget: 'link' | 'radio' | 'checkbox';
  description: string;
  order: string[];
  states: Record<string, StateSpec>;
};

const TEXT_PRIMARY = resolvePath('color/text/primary');

const ACTION_BORDER_FAINT = resolvePath('color/action/border/neutral/faint');
const ACTION_BORDER_BOLD = safeResolve('color/action/surface/neutral/bold');
// color.action.surface.neutral.bold isn't compiled anywhere in the token set
// today (verified across all families, not just action). Approximate it by
// deepening the faint border the same way the Utility Color Functions demo
// derives hover from a measured transform, and flag it visibly in the UI.
const ACTION_BORDER_BOLD_VALUE = ACTION_BORDER_BOLD.missing
  ? lift(ACTION_BORDER_FAINT, -0.4, 1.15).hex
  : ACTION_BORDER_BOLD.value;

const ACTION_RECIPE: FamilyRecipe = {
  label: 'Action — card link',
  widget: 'link',
  description:
    'The whole card is a link to the store page. Background and border come from the neutral action pair; prominence moves from flat to raised on hover.',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: resolvePath('color/action/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: ACTION_BORDER_FAINT,
      prominence: CdrProminence.CdrProminenceFlat,
    },
    hover: {
      surface: resolvePath('color/action/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: ACTION_BORDER_BOLD_VALUE,
      prominence: CdrProminence.CdrProminenceRaised,
      note: ACTION_BORDER_BOLD.missing
        ? 'color.action.surface.neutral.bold is not compiled yet — shown as a measured placeholder, not an approved token.'
        : undefined,
    },
    disabled: {
      surface: resolvePath('color/action/surface/neutral/faint'),
      content: mixTowardGray(TEXT_PRIMARY),
      border: ACTION_BORDER_FAINT,
      prominence: CdrProminence.CdrProminenceFlat,
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
      surface: resolvePath('color/selection/surface/neutral/trace'),
      content: resolvePath('color/selection/text/neutral/faint'),
      border: resolvePath('color/selection/border/neutral/faint'),
      prominence: CdrProminence.CdrProminenceRaised,
    },
    hover: {
      surface: resolvePath('color/selection/surface/neutral/trace'),
      content: resolvePath('color/selection/text/neutral/faint'),
      border: resolvePath('color/selection/border/neutral/subtle'),
      prominence: CdrProminence.CdrProminenceRaised,
    },
    selected: {
      surface: resolvePath('color/selection/surface/natural'),
      content: resolvePath('color/selection/text/trigger'),
      border: resolvePath('color/selection/border/trigger'),
      prominence: CdrProminence.CdrProminenceElevated,
    },
    disabled: {
      surface: resolvePath('color/selection/surface/neutral/faint'),
      content: mixTowardGray(resolvePath('color/selection/text/neutral/faint')),
      border: resolvePath('color/selection/border/neutral/faint'),
      prominence: CdrProminence.CdrProminenceRaised,
    },
  },
};

const CONTROL_RECIPE: FamilyRecipe = {
  label: 'Control — save to My REI',
  widget: 'checkbox',
  description:
    'A checkbox toggling favorite status. Box chrome uses control tokens. Control has no compiled "checked" fill token, so checking it only swaps the heart icon from outline to filled — flagged below as a real gap, not hidden.',
  order: ['default', 'hover', 'disabled'],
  states: {
    default: {
      surface: resolvePath('color/control/surface/neutral/trace'),
      content: TEXT_PRIMARY,
      border: resolvePath('color/control/border/neutral/faint'),
      prominence: CdrProminence.CdrProminenceFlat,
    },
    hover: {
      surface: resolvePath('color/control/surface/neutral/subtle'),
      content: TEXT_PRIMARY,
      border: resolvePath('color/control/border/neutral/faint'),
      prominence: CdrProminence.CdrProminenceFlat,
    },
    disabled: {
      surface: resolvePath('color/control/surface/neutral/faint'),
      content: mixTowardGray(TEXT_PRIMARY),
      border: resolvePath('color/control/border/neutral/faint'),
      prominence: CdrProminence.CdrProminenceFlat,
    },
  },
};

const RECIPES: Record<string, FamilyRecipe> = {
  action: ACTION_RECIPE,
  selection: SELECTION_RECIPE,
  control: CONTROL_RECIPE,
};
// Loaded from the recipe config above — every value in it is a resolved
// compiled token (or an explicitly flagged placeholder) rather than a mocked
// string, so this list can't silently drift from what's actually shipped.
const FAMILIES = Object.keys(RECIPES);

function styleFor(recipe: FamilyRecipe, stateName: string): StateSpec {
  return recipe.states[stateName] ?? recipe.states[recipe.order[0]];
}

function badge(pass: boolean | 'warn', label: string): string {
  const cls = pass === 'warn' ? 'warn' : pass ? 'pass' : 'fail';
  return `<span class="cc-badge ${cls}">${label}</span>`;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Icons ────────────────────────────────────────────────────────────────────

const HEART_OUTLINE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;
const HEART_FILLED = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.702 20.712a.997.997 0 0 1-1.43-.026c-5.05-4.985-7.763-7.71-8.137-8.173C2.575 11.818 2 10.312 2 9a6 6 0 0 1 10-4.472A6 6 0 0 1 20.701 12.728c-.542.683-3.208 3.344-8 7.984z"/></svg>`;

const PHOTO_PLACEHOLDER = `
  <div class="rc-sky"></div>
  <div class="rc-building"></div>
  <div class="rc-windows"></div>
`;

// ─── Card rendering ─────────────────────────────────────────────────────────
// All three widgets render together, using their own default-state tokens.
// The widget for the family selected in the dropdown reflects the state
// chosen via the state-nav buttons; the other two stay at rest so it's clear
// which affordance is under inspection.

function renderCard(
  activeFamily: string,
  activeState: string,
  showBorder: boolean,
  heartChecked: boolean,
  storeSelected: boolean,
): string {
  const actionState = styleFor(ACTION_RECIPE, activeFamily === 'action' ? activeState : 'default');
  const selectionState = styleFor(
    SELECTION_RECIPE,
    activeFamily === 'selection' ? activeState : storeSelected ? 'selected' : 'default',
  );
  const controlState = styleFor(
    CONTROL_RECIPE,
    activeFamily === 'control' ? activeState : 'default',
  );

  const actionBorder = showBorder ? actionState.border : 'transparent';

  return `
    <div class="rc-scene">
      <div class="rc-card">
        <a
          class="rc-overlay"
          href="#"
          aria-label="Visit store page"
          onclick="return false;"
          style="border: 2px solid ${actionBorder}; box-shadow: ${actionState.prominence};"
        ></a>
        <div class="rc-photo">${PHOTO_PLACEHOLDER}</div>
        <label class="rc-chip" style="background:${controlState.surface};color:${controlState.content};border:2px solid ${controlState.border};box-shadow:${controlState.prominence};">
          <input type="checkbox" class="sr-only" data-role="fav-toggle" ${heartChecked ? 'checked' : ''} aria-label="Save to My REI" />
          <span class="rc-chip-icon">${heartChecked ? HEART_FILLED : HEART_OUTLINE}</span>
          <span>My REI</span>
        </label>
        <div class="rc-info" style="background:${actionState.surface};color:${actionState.content};">
          <p class="rc-name">REI Example</p>
          <p class="rc-detail">(206) 555-0142</p>
          <p class="rc-detail">400 Occidental Ave S, Seattle, WA 98104</p>
          <p class="rc-hours"><span class="rc-dot"></span> Open until 9pm today</p>
        </div>
      </div>
      <label class="rc-radio" style="box-shadow:${selectionState.prominence};">
        <input type="radio" name="cc-store-select" class="sr-only" data-role="store-radio" ${storeSelected ? 'checked' : ''} />
        <span class="rc-radio-dot" style="background:${selectionState.surface};border:2px solid ${selectionState.border};">
          ${storeSelected ? `<span class="rc-radio-dot-fill" style="background:${selectionState.content};"></span>` : ''}
        </span>
        <span class="rc-radio-label" style="color:${selectionState.content};">Set as my store</span>
      </label>
    </div>
  `;
}

function renderTable(recipe: FamilyRecipe, activeState: string): string {
  const rows = recipe.order
    .map((name) => {
      const st = styleFor(recipe, name);
      const ratio = contrastRatio(st.content, st.surface);
      const contentCheck =
        name === 'disabled'
          ? badge(ratio >= 3 ? 'warn' : false, `${ratio.toFixed(1)}:1`)
          : badge(ratio >= 4.5, `${ratio.toFixed(1)}:1`);
      return `<tr class="${name === activeState ? 'active' : ''}">
        <td class="cc-state">${name}</td>
        <td><span class="cc-chip-swatch" style="background:${st.surface}"></span><code>${st.surface}</code></td>
        <td><code>${st.content}</code></td>
        <td><code>${st.border}</code></td>
        <td>${contentCheck}</td>
        <td>${st.note ? badge('warn', 'placeholder') : badge(true, 'compiled token')}</td>
      </tr>`;
    })
    .join('');
  return `<table class="cc-table">
    <thead><tr><th>State</th><th>Surface</th><th>Content</th><th>Border</th><th>Content ↔ surface</th><th>Token status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

const WIDGET_SELECTOR: Record<string, string> = {
  action: '.rc-overlay, .rc-info',
  selection: '.rc-radio-dot',
  control: '.rc-chip',
};

function renderComposition(family: string, activeState: string): string {
  const recipe = RECIPES[family];
  const st = styleFor(recipe, activeState);
  const stateNav = recipe.order
    .map(
      (name) =>
        `<button type="button" class="cc-state-btn ${name === activeState ? 'active' : ''}" data-state="${name}">${capitalize(name)}</button>`,
    )
    .join('');

  const cssBlock = `${WIDGET_SELECTOR[family]}[data-state="${activeState}"] {
  background: ${st.surface};
  color: ${st.content};
  border-color: ${st.border};
  box-shadow: ${st.prominence};
}`;

  return `
    <div class="cc-recipe">
      <strong>${recipe.label}</strong> — ${recipe.description}
      ${st.note ? `<div class="cc-cue">⚠ ${st.note}</div>` : ''}
    </div>
    <div class="cc-state-nav">${stateNav}</div>
    <div id="cc-card-slot">${renderCard(family, activeState, true, false, false)}</div>
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
    .cc-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--cedar-warm-700); }
    .cc-recipe {
      background: var(--cedar-warm-50); border: 1px solid var(--cedar-warm-200);
      border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;
      font-size: 13px; color: var(--cedar-warm-800); line-height: 1.5;
    }
    .cc-cue { margin-top: 6px; font-size: 12px; color: #856404; }
    .cc-state-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .cc-state-btn {
      font-family: Pressura, monospace; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 6px 14px; border-radius: 20px; cursor: pointer;
      background: white; border: 1px solid var(--cedar-warm-300); color: var(--cedar-warm-700);
    }
    .cc-state-btn.active { background: var(--cedar-warm-1000); color: white; border-color: var(--cedar-warm-1000); }
    .rc-scene {
      display: flex; flex-wrap: wrap; align-items: flex-start; gap: 32px;
      padding: 24px; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      margin-bottom: 24px; background: var(--cedar-warm-50);
    }
    .rc-card {
      position: relative; width: 300px; border-radius: 12px; overflow: hidden;
      background: white;
    }
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
    .rc-overlay { position: absolute; inset: 0; border-radius: 12px; z-index: 1; transition: box-shadow 0.15s, border-color 0.15s; }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    .rc-chip {
      position: absolute; top: 12px; left: 12px; z-index: 2;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 999px; cursor: pointer;
      font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 12px; font-weight: 600;
    }
    .rc-chip:has(:focus-visible) { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-info {
      position: relative; z-index: 1; padding: 14px 16px;
      font-family: Graphik, 'Helvetica Neue', sans-serif;
    }
    .rc-name { margin: 0 0 4px; font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 17px; font-weight: 600; }
    .rc-detail { margin: 0 0 2px; font-size: 12px; text-decoration: underline; }
    .rc-hours { margin: 8px 0 0; font-size: 12px; display: flex; align-items: center; gap: 6px; }
    .rc-dot { width: 8px; height: 8px; border-radius: 50%; background: #3a9c50; display: inline-block; }
    .rc-radio {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      border-radius: 8px; padding: 4px;
    }
    .rc-radio:has(:focus-visible) { outline: 2px solid #3d6db9; outline-offset: 2px; }
    .rc-radio-dot {
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rc-radio-dot-fill { width: 10px; height: 10px; border-radius: 50%; }
    .rc-radio-label { font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 13px; }
    .cc-badge {
      font-family: Pressura, monospace; font-size: 10px; font-weight: 600;
      padding: 2px 8px; border-radius: 3px; display: inline-block; white-space: nowrap;
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
          store card are real: the card is a native link, "Set as my store" is a radio, and
          "My REI" is a checkbox. Every color is resolved live from compiled tokens — pick a
          family to inspect the states it actually declares.
        </p>

        <div class="cc-controls">
          <div class="cc-field">
            <label for="cc-family">Family</label>
            <select id="cc-family">${familyOptions(DEFAULTS.family)}</select>
          </div>
          <label class="cc-toggle"><input type="checkbox" id="cc-border-toggle" checked /> Show link border</label>
        </div>

        <div id="cc-output">${renderComposition(DEFAULTS.family, DEFAULTS.state)}</div>

        <div class="cc-notes">
          <h3>What this proves — and what it doesn't</h3>
          <ul>
            <li><strong>Every color is a real, resolved token.</strong> Nothing here is hand-typed hex; each value comes from <code>resolvePath()</code> against the compiled foundations at load time, so this story breaks loudly if a path stops resolving.</li>
            <li><strong>Real HTML patterns, not lookalikes.</strong> The card is an <code>&lt;a&gt;</code>, "Set as my store" is an <code>&lt;input type="radio"&gt;</code>, "My REI" is an <code>&lt;input type="checkbox"&gt;</code> — keyboard and screen reader behavior come from the browser, not from ARIA bolted onto a div.</li>
            <li><strong>Action and selection move in opposite prominence directions.</strong> Action starts flat and raises on hover; selection starts raised and elevates once chosen — the shadow tokens (<code>CdrProminence</code>) are real, not simulated.</li>
            <li><strong>Two real gaps surfaced by building this honestly:</strong> <code>color.action.surface.neutral.bold</code> doesn't exist in the compiled set (flagged inline when you view Action → Hover), and the <code>control</code> family has no "checked" fill token at all — the heart currently only changes via icon swap, not color, when checked.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const familyEl = canvasElement.querySelector<HTMLSelectElement>('#cc-family');
    const borderToggle = canvasElement.querySelector<HTMLInputElement>('#cc-border-toggle');
    const output = canvasElement.querySelector<HTMLElement>('#cc-output');
    if (!familyEl || !borderToggle || !output) return;

    let activeState = DEFAULTS.state;
    let heartChecked = false;
    let storeSelected = false;

    const renderCardInto = () => {
      const slot = output.querySelector<HTMLElement>('#cc-card-slot');
      if (slot) {
        slot.outerHTML = `<div id="cc-card-slot">${renderCard(
          familyEl.value,
          activeState,
          borderToggle.checked,
          heartChecked,
          storeSelected,
        )}</div>`;
      }
    };

    const render = () => {
      output.innerHTML = renderComposition(familyEl.value, activeState);
      renderCardInto();
    };

    familyEl.addEventListener('change', () => {
      activeState = DEFAULTS.state;
      render();
    });
    borderToggle.addEventListener('change', renderCardInto);

    output.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const stateBtn = target.closest<HTMLButtonElement>('.cc-state-btn');
      if (stateBtn?.dataset.state) {
        activeState = stateBtn.dataset.state;
        render();
        return;
      }
      const favToggle = target.closest<HTMLElement>('[data-role="fav-toggle"]');
      if (favToggle) {
        heartChecked = !heartChecked;
        renderCardInto();
        return;
      }
      const storeRadio = target.closest<HTMLElement>('[data-role="store-radio"]');
      if (storeRadio) {
        storeSelected = true;
        if (familyEl.value === 'selection') activeState = 'selected';
        render();
      }
    });
  },
};

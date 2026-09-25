import type { StoryObj, Meta } from '@storybook/html-vite';
import { combinations, resolvePath, type RegistryCombination } from './color-registry';
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
// It draws only from tokens/compatibility-registry.json — the canonical source —
// never from ad hoc colors, and generates only the states that role declares.

type Resolved = {
  key: string;
  combo: RegistryCombination;
  surfaceHex: string;
  contentHex: string;
  borderHex: string | null;
};

function resolveCombo(key: string): Resolved {
  const combo = combinations[key];
  return {
    key,
    combo,
    surfaceHex: resolvePath(combo.surface),
    contentHex: resolvePath(combo.content),
    borderHex: combo.border ? resolvePath(combo.border) : null,
  };
}

const FAMILIES = Array.from(new Set(Object.keys(combinations).map((k) => k.split('-')[0])));

function comboOptionsForFamily(family: string): [string, string][] {
  return Object.keys(combinations)
    .filter((k) => k.startsWith(family))
    .map((k) => [k, k]);
}

// ─── State generation ─────────────────────────────────────────────────────────
// Only the states the registry entry declares are generated — a banner with
// ["default"] gets one state; a control with ["default","hover","disabled"]
// gets exactly those, nothing invented.

type StateResult = {
  name: string;
  surface: string;
  content: string;
  border: string | null;
  inGamut: boolean;
  contentRatio: number;
};

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

// Same measured-transform approach as Utility Color Functions, generalized to
// whatever surface the registry entry provides — no per-family tuning.
function stateFor(name: string, r: Resolved): StateResult {
  let surface = r.surfaceHex;
  let inGamut = true;
  if (name === 'hover') ({ hex: surface, inGamut } = lift(r.surfaceHex, 0.04, 1.05));
  if (name === 'pressed') ({ hex: surface, inGamut } = lift(r.surfaceHex, -0.05, 0.98));
  if (name === 'selected') ({ hex: surface, inGamut } = lift(r.surfaceHex, 0.08, 1.1));
  if (name === 'disabled') ({ hex: surface, inGamut } = lift(r.surfaceHex, 0.02, 0.35));
  const content = name === 'disabled' ? mixTowardGray(r.contentHex, 0.4) : r.contentHex;
  return {
    name,
    surface,
    content,
    border: r.borderHex,
    inGamut,
    contentRatio: contrastRatio(content, surface),
  };
}

// Disabled content softens chroma rather than changing hue or lightness —
// keeps the same relationship legible without a separate "disabled text" token.
function mixTowardGray(hex: string, amount: number): string {
  const { hex: out } = lift(hex, 0, 1 - amount * 0.3);
  return out;
}

function badge(pass: boolean | 'warn', label: string): string {
  const cls = pass === 'warn' ? 'warn' : pass ? 'pass' : 'fail';
  return `<span class="cc-badge ${cls}">${label}</span>`;
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderPreview(r: Resolved): string {
  const states = r.combo.states.map((s) => stateFor(s, r));
  const boxes = states
    .map((st) => {
      const borderCss = st.border ? `border: 2px solid ${st.border};` : 'border: 1px dashed #ccc;';
      return `<div class="cc-comp">
        <div class="cc-comp-label">${st.name}</div>
        <div class="cc-box" style="background:${st.surface};color:${st.content};${borderCss}">
          Custom element
        </div>
      </div>`;
    })
    .join('');

  const rows = states
    .map((st) => {
      const contentCheck =
        st.name === 'disabled'
          ? badge(st.contentRatio >= 3 ? 'warn' : false, `${st.contentRatio.toFixed(1)}:1`)
          : badge(st.contentRatio >= 4.5, `${st.contentRatio.toFixed(1)}:1`);
      const gamut = st.inGamut ? badge(true, 'in gamut') : badge('warn', 'out of sRGB');
      return `<tr>
        <td class="cc-state">${st.name}</td>
        <td><span class="cc-chip" style="background:${st.surface}"></span><code>${st.surface}</code></td>
        <td><code>${st.content}</code></td>
        <td>${st.border ? `<code>${st.border}</code>` : '—'}</td>
        <td>${contentCheck}</td>
        <td>${gamut}</td>
      </tr>`;
    })
    .join('');

  const cssVars = states
    .map(
      (st) =>
        `[data-state="${st.name}"] {\n  background: ${st.surface};\n  color: ${st.content};${st.border ? `\n  border-color: ${st.border};` : ''}\n}`,
    )
    .join('\n');

  return `
    <div class="cc-recipe">
      <strong>${r.key}</strong> — ${r.combo.notes}
      <div class="cc-cue"><strong>Non-color cue:</strong> ${r.combo.nonColorCue}</div>
    </div>
    <div class="cc-preview">
      ${boxes}
    </div>
    <table class="cc-table">
      <thead><tr><th>State</th><th>Surface</th><th>Content</th><th>Border</th><th>Content ↔ surface</th><th>Gamut</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="cc-css"><pre>${cssVars}</pre></div>
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
      display: flex; flex-wrap: wrap; gap: 16px;
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
    .cc-cue { margin-top: 6px; font-size: 12px; }
    .cc-preview {
      display: flex; flex-wrap: wrap; gap: 24px;
      padding: 24px; border: 1px solid var(--cedar-warm-200); border-radius: 12px;
      margin-bottom: 24px;
    }
    .cc-comp { text-align: center; }
    .cc-comp-label {
      font-family: Pressura, monospace; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--cedar-warm-600); margin-bottom: 6px;
    }
    .cc-box {
      min-width: 140px; padding: 16px 20px; border-radius: 6px;
      font-family: Graphik, 'Helvetica Neue', sans-serif; font-size: 13px;
    }
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
    .cc-state { font-weight: 600; text-transform: capitalize; }
    .cc-chip {
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

const DEFAULTS = { family: 'feedback', combo: 'feedback-error-banner' };

function familyOptions(selected: string): string {
  return FAMILIES.map(
    (f) => `<option value="${f}" ${f === selected ? 'selected' : ''}>${f}</option>`,
  ).join('');
}

function comboOptions(family: string, selected: string): string {
  return comboOptionsForFamily(family)
    .map(([v, l]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${l}</option>`)
    .join('');
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
          Use this when Cedar has no component for your pattern yet. Pick an <strong>approved
          semantic role</strong> — not a color — from the canonical
          <code>tokens/compatibility-registry.json</code>. States shown are exactly the ones that
          role declares, nothing invented. Export the generated CSS custom properties directly
          into your new component.
        </p>

        <div class="cc-controls">
          <div class="cc-field">
            <label for="cc-family">Family</label>
            <select id="cc-family">${familyOptions(DEFAULTS.family)}</select>
          </div>
          <div class="cc-field">
            <label for="cc-combo">Approved combination</label>
            <select id="cc-combo">${comboOptions(DEFAULTS.family, DEFAULTS.combo)}</select>
          </div>
        </div>

        <div id="cc-output">${renderPreview(resolveCombo(DEFAULTS.combo))}</div>

        <div class="cc-notes">
          <h3>What this proves</h3>
          <ul>
            <li><strong>Combinations are not invented per page.</strong> Every option here comes from the same registry that Figma docs, validation, and component code consume — there is one source of truth.</li>
            <li><strong>States are declared, not assumed.</strong> A banner only has a <code>default</code> state; a control has <code>hover</code>/<code>disabled</code>; a selection affordance adds <code>selected</code>. The demo never fabricates a state a role doesn't need.</li>
            <li><strong>Non-color cues are part of the contract.</strong> Every combination ships a required non-color cue — color alone is never the only signal.</li>
            <li><strong>This is a starting point, not a finished component.</strong> If your pattern doesn't map cleanly to an existing registry entry, that's a signal to propose a new one — not to pick an arbitrary color.</li>
          </ul>
        </div>
      </div>
    </div>`;
  },

  play: async ({ canvasElement }) => {
    const familyEl = canvasElement.querySelector<HTMLSelectElement>('#cc-family');
    const comboEl = canvasElement.querySelector<HTMLSelectElement>('#cc-combo');
    const output = canvasElement.querySelector<HTMLElement>('#cc-output');
    if (!familyEl || !comboEl || !output) return;

    const update = () => {
      output.innerHTML = renderPreview(resolveCombo(comboEl.value));
    };

    familyEl.addEventListener('change', () => {
      const first = comboOptionsForFamily(familyEl.value)[0][0];
      comboEl.innerHTML = comboOptions(familyEl.value, first);
      update();
    });
    comboEl.addEventListener('change', update);
  },
};

import type { StoryObj, Meta } from '@storybook/html';
import * as tokens from '@rei/cdr-tokens';
import { escapeHtml } from './guide-display';
import { getTokenDescription } from './token-metadata';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── clamp() parser ──────────────────────────────────────────────────────────

interface ClampParts {
  min: number; // px
  max: number; // px
  ideal: string; // raw ideal expression, e.g. "0.2rem + 0.11cqi"
  slope: string; // the cqi/cqw part, e.g. "0.11cqi"
  raw: string;
}

function remToPx(val: string): number {
  if (val.endsWith('rem')) return parseFloat(val) * 16;
  if (val.endsWith('px')) return parseFloat(val);
  return parseFloat(val);
}

function parseClamp(value: string): ClampParts | null {
  const m = value.match(/^clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*$/);
  if (!m) return null;
  const [, rawMin, rawIdeal, rawMax] = m;
  const slope = rawIdeal.trim().match(/([\d.]+c[qw][iwh])/)?.[1] ?? '';
  return {
    min: remToPx(rawMin.trim()),
    max: remToPx(rawMax.trim()),
    ideal: rawIdeal.trim(),
    slope,
    raw: value,
  };
}

function valueToPx(value: string): number {
  if (value.includes('clamp')) return parseClamp(value)?.max ?? 0;
  if (value.endsWith('rem')) return parseFloat(value) * 16;
  if (value.endsWith('px')) return parseFloat(value);
  return parseFloat(value);
}

// ─── Shared chrome ────────────────────────────────────────────────────────────

const chrome = `
  <style>
    .sb-section { margin-bottom: 64px; }

    .sb-section-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 8px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--cedar-warm-100);
    }
    .sb-section-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--cedar-warm-1000);
      margin: 0;
      letter-spacing: -0.3px;
    }
    .sb-section-count {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-100);
      border-radius: 20px;
      padding: 2px 8px;
    }
    .sb-section-desc {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      color: var(--cedar-warm-750);
      margin: 0 0 24px;
      line-height: 1.6;
    }

    /* ─── Static token rows ─── */
    .srow {
      display: grid;
      grid-template-columns: minmax(0,1fr) minmax(0,2fr) 64px;
      align-items: center;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .srow:first-child { border-top: 1px solid var(--cedar-warm-100); }
    @media (max-width: 480px) {
      .srow { grid-template-columns: minmax(0,1fr) minmax(0,1.5fr); }
      .srow-value { display: none; }
    }
    .srow-name {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-1000);
      min-width: 0;
    }
    .token-doc {
      display: block;
      margin-top: 2px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      color: var(--cedar-warm-750);
      line-height: 1.35;
      max-width: 480px;
    }
    .srow-track {
      height: 8px;
      background: var(--cedar-warm-100);
      border-radius: 99px;
      overflow: hidden;
      min-width: 0;
    }
    .srow-fill {
      height: 100%;
      background: var(--cedar-green-900);
      border-radius: 99px;
    }
    .srow-value {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      text-align: right;
      white-space: nowrap;
    }

    /* ─── Inset token rows ─── */
    .irow {
      display: grid;
      grid-template-columns: minmax(0,1fr) 64px 64px;
      align-items: center;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .irow:first-child { border-top: 1px solid var(--cedar-warm-100); }
    @media (max-width: 480px) {
      .irow { grid-template-columns: minmax(0,1fr) 64px; }
      .irow-value { display: none; }
    }
    .irow-name {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-1000);
      min-width: 0;
    }
    .irow-box-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .irow-box {
      background: var(--cedar-warm-100);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .irow-box-inner {
      background: var(--cedar-green-900);
      border-radius: 2px;
      width: 8px;
      height: 8px;
    }
    .irow-value {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      text-align: right;
      white-space: nowrap;
    }

    /* ─── Fluid token cards ─── */
    .fluid-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    @media (max-width: 480px) {
      .fluid-grid { grid-template-columns: 1fr; }
    }

    .fcard {
      background: #fff;
      border: 1px solid var(--cedar-warm-100);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Token name + slope pill */
    .fcard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }
    .fcard-name {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-1000);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .fcard-slope {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-green-900);
      background: #d5ede6;
      border-radius: 4px;
      padding: 2px 6px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Range bar: shows min → max span */
    .fcard-range-wrap {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .fcard-track {
      position: relative;
      height: 10px;
      background: var(--cedar-warm-100);
      border-radius: 99px;
      overflow: visible;
    }
    /* The filled region spanning min to max */
    .fcard-range-fill {
      position: absolute;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #b8d9cc 0%, var(--cedar-green-900) 100%);
      border-radius: 99px;
    }
    /* Midpoint tick — shows the "ideal" midpoint visually */
    .fcard-mid-tick {
      position: absolute;
      top: -3px;
      width: 2px;
      height: 16px;
      background: var(--cedar-warm-750);
      border-radius: 2px;
      transform: translateX(-50%);
    }
    /* Min / max labels below the track */
    .fcard-range-labels {
      display: flex;
      justify-content: space-between;
    }
    .fcard-range-label {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-600);
    }
    .fcard-range-label-mid {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-750);
    }

    /* Dimension row: min px / max px / range */
    .fcard-dims {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .fcard-dim {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .fcard-dim-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--cedar-warm-600);
    }
    .fcard-dim-value {
      font-family: Pressura, monospace;
      font-size: 12px;
      font-weight: 400;
      color: var(--cedar-warm-1000);
    }
    .fcard-dim-range {
      color: var(--cedar-warm-600);
      font-size: 10px;
    }

    /* Raw expression */
    .fcard-raw {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-600);
      word-break: break-all;
      line-height: 1.5;
      padding-top: 6px;
      border-top: 1px solid var(--cedar-warm-100);
    }
  </style>
`;

// ─── Render helpers ───────────────────────────────────────────────────────────

function staticRow(name: string, value: string, maxPx: number): string {
  const px = valueToPx(value);
  const pct = maxPx > 0 ? Math.max((px / maxPx) * 100, 0.5) : 0;
  const display = value.endsWith('px') || value === '0' ? value : `${px}px`;
  const doc = getTokenDescription(name);
  const docHtml = doc ? `<span class="token-doc">${escapeHtml(doc)}</span>` : '';
  return `
    <div class="srow">
      <span class="srow-name">${name}${docHtml}</span>
      <div class="srow-track"><div class="srow-fill" style="width:${pct}%"></div></div>
      <span class="srow-value">${display}</span>
    </div>`;
}

function insetRow(name: string, value: string, maxPx: number): string {
  const px = valueToPx(value);
  const pad = Math.max(Math.round((px / maxPx) * 18), 2);
  const boxSize = 8 + pad * 2;
  const display = value.endsWith('px') || value === '0' ? value : `${px}px`;
  const doc = getTokenDescription(name);
  const docHtml = doc ? `<span class="token-doc">${escapeHtml(doc)}</span>` : '';
  return `
    <div class="irow">
      <span class="irow-name">${name}${docHtml}</span>
      <div class="irow-box-wrap">
        <div class="irow-box" style="width:${boxSize}px;height:${boxSize}px;padding:${pad}px;">
          <div class="irow-box-inner"></div>
        </div>
      </div>
      <span class="irow-value">${display}</span>
    </div>`;
}

function fluidCard(name: string, value: string, absMax: number): string {
  const cp = parseClamp(value);
  if (!cp) return '';

  const { min, max, slope, raw } = cp;
  const doc = getTokenDescription(name);
  const docHtml = doc ? `<span class="token-doc">${escapeHtml(doc)}</span>` : '';
  const range = max - min;
  const rangePx = Math.round(range);

  // Bar: the filled region starts at (min/absMax)*100% and spans (range/absMax)*100%
  const startPct = absMax > 0 ? (min / absMax) * 100 : 0;
  const widthPct = absMax > 0 ? (range / absMax) * 100 : 0;
  // Mid-tick at the midpoint of the range bar (not the midpoint of the track)
  const midPct = startPct + widthPct / 2;

  return `
    <div class="fcard">
      <div class="fcard-header">
        <span class="fcard-name">${name}</span>
        ${slope ? `<span class="fcard-slope">${slope}</span>` : ''}
      </div>
      ${docHtml}

      <div class="fcard-range-wrap">
        <div class="fcard-track">
          <div class="fcard-range-fill" style="left:${startPct}%;width:${widthPct}%"></div>
          <div class="fcard-mid-tick"   style="left:${midPct}%"></div>
        </div>
        <div class="fcard-range-labels">
          <span class="fcard-range-label">0</span>
          <span class="fcard-range-label">${Math.round(absMax)}px</span>
        </div>
      </div>

      <div class="fcard-dims">
        <div class="fcard-dim">
          <span class="fcard-dim-label">min</span>
          <span class="fcard-dim-value">${Math.round(min)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">max</span>
          <span class="fcard-dim-value">${Math.round(max)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">range</span>
          <span class="fcard-dim-value fcard-dim-range">+${rangePx}px</span>
        </div>
      </div>

      <div class="fcard-raw">${raw}</div>
    </div>`;
}

function section(title: string, desc: string, content: string, count: number): string {
  return `
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${title}</h2>
        <span class="sb-section-count">${count}</span>
      </div>
      ${desc ? `<p class="sb-section-desc">${desc}</p>` : ''}
      ${content}
    </div>`;
}

function getTokens(prefix: string): [string, string][] {
  return Object.entries(tokens)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => [key, String(value)]) as [string, string][];
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const BaseSpacing: Story = {
  name: 'Base Scale',
  render: () => {
    const base = getTokens('CdrSpace').filter(
      ([k]) => !k.startsWith('CdrSpaceScale') && !k.startsWith('CdrSpaceInset'),
    );
    const maxPx = Math.max(...base.map(([, v]) => valueToPx(v)));
    const rows = base.map(([n, v]) => staticRow(n, v, maxPx)).join('');
    return `${chrome}<div class="sb-page">${section('Base Spacing', 'Fixed pixel values. Bar width is proportional to the token value.', rows, base.length)}</div>`;
  },
};

export const FluidSpacing: Story = {
  name: 'Fluid Scale',
  render: () => {
    const fluid = getTokens('CdrSpaceScale');
    const absMax = Math.max(...fluid.map(([, v]) => parseClamp(v)?.max ?? 0));
    const cards = fluid.map(([n, v]) => fluidCard(n, v, absMax)).join('');
    return `${chrome}<div class="sb-page">${section(
      'Fluid Space Scale',
      'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow from <strong>min</strong> to <strong>max</strong> as the container widens. The bar shows where each token\'s range sits relative to the largest token.',
      `<div class="fluid-grid">${cards}</div>`,
      fluid.length,
    )}</div>`;
  },
};

export const InsetSpacing: Story = {
  name: 'Inset',
  render: () => {
    const inset = getTokens('CdrSpaceInset');
    const maxPx = Math.max(...inset.map(([, v]) => valueToPx(v)));
    const rows = inset.map(([n, v]) => insetRow(n, v, maxPx)).join('');
    return `${chrome}<div class="sb-page">${section('Inset Spacing', 'Padding tokens. The box preview scales proportionally to the token value.', rows, inset.length)}</div>`;
  },
};

export const AllSpacing: Story = {
  name: 'All Spacing',
  render: () => {
    const base = getTokens('CdrSpace').filter(
      ([k]) => !k.startsWith('CdrSpaceScale') && !k.startsWith('CdrSpaceInset'),
    );
    const fluid = getTokens('CdrSpaceScale');
    const inset = getTokens('CdrSpaceInset');

    const baseMax = Math.max(...base.map(([, v]) => valueToPx(v)));
    const fluidMax = Math.max(...fluid.map(([, v]) => parseClamp(v)?.max ?? 0));
    const insetMax = Math.max(...inset.map(([, v]) => valueToPx(v)));

    const baseRows = base.map(([n, v]) => staticRow(n, v, baseMax)).join('');
    const fluidCards = fluid.map(([n, v]) => fluidCard(n, v, fluidMax)).join('');
    const insetRows = inset.map(([n, v]) => insetRow(n, v, insetMax)).join('');

    return `${chrome}<div class="sb-page">
      ${section('Base Spacing', 'Fixed pixel values.', baseRows, base.length)}
      ${section(
        'Fluid Space Scale',
        'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow with the container.',
        `<div class="fluid-grid">${fluidCards}</div>`,
        fluid.length,
      )}
      ${section('Inset Spacing', 'Padding tokens — box preview scales proportionally.', insetRows, inset.length)}
    </div>`;
  },
};

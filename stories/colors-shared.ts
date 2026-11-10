import * as tokens from '../dist/rei-dot-com/js/cdr-tokens.mjs';
// Primitives (color.option.*) are intentionally not part of the consumer contract
// (ADR 0001: "palettes are not first-class consumer-selectable token APIs") and are
// not exported to dist. This Storybook is an internal maintainer tool, so reading
// the authored source directly for the Palette reference page is appropriate here —
// never do this in a consumer-facing surface.
import canonicalTokens from '../canonical/tokens.json';
import { getMeta } from './token-metadata';

export type TokenEntry = [string, string];
export type SemanticKind = 'fill' | 'text' | 'icon' | 'border';

// ─── Color math (WCAG contrast) ────────────────────────────────────────────────

function relLuminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  // Never fabricate a ratio: unparseable input yields NaN, rendered as "n/a" —
  // a confidently wrong pass is the worst failure mode for a precision tool.
  if (!m) return NaN;
  const chan = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const r = chan(parseInt(m[1].slice(0, 2), 16) / 255);
  const g = chan(parseInt(m[1].slice(2, 4), 16) / 255);
  const b = chan(parseInt(m[1].slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relLuminance(hexA);
  const l2 = relLuminance(hexB);
  if (Number.isNaN(l1) || Number.isNaN(l2)) return NaN;
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** True when a hex/rgba value carries alpha — checkerboard underlay is shown
 *  only for these; on opaque fills it is pure visual noise. */
export function isAlpha(val: string): boolean {
  return /^#[0-9a-f]{8}$/i.test(val.trim()) || /^rgba\(/i.test(val.trim());
}

/** Click-to-copy chip (Carbon convention: every token row is a lookup target).
 *  Uses an inline handler — the only scripting that survives html-story
 *  innerHTML insertion. */
export function copyChip(cls: string, text: string, copyValue: string): string {
  return `<button class="${cls} copy-chip" data-copy="${copyValue}" title="Click to copy ${copyValue}"
    onclick="if(navigator.clipboard){navigator.clipboard.writeText(this.dataset.copy)}">${text}</button>`;
}

// Real shipped surfaces, not invented hex values — "paper" is the default
// background; "Brand" is the fallback ground a token must actually work on
// if it fails against paper (per review: icons fall back to Brand; text
// should only ever be shown on a surface it is actually accessible against).
export const GROUND_PAPER = (tokens as Record<string, string>).CdrColorBackgroundPrimary;
export const GROUND_BRAND = (tokens as Record<string, string>).CdrColorSurfaceBrand;
const GROUNDS: [string, string][] = [
  // Labels mirror the token role names so readers can map ground → token.
  ['Primary', GROUND_PAPER],
  ['Brand', GROUND_BRAND],
];

function ratioCaption(label: string, ratio: number, pass: boolean): string {
  const txt = Number.isNaN(ratio)
    ? `${label} — n/a`
    : `${label} ${ratio.toFixed(1)}:1 ${pass ? '✓' : '✗'}`;
  return `<div class="preview-caption${pass ? '' : ' fail'}">${txt}</div>`;
}

/** Text preview: show only the ground(s) this token actually passes AA (4.5:1) on.
 *  If it passes neither, show both anyway, flagged — a real finding, not hidden.
 *  The ratio is printed as a visible caption, not a tooltip. */
export function textPreviewHtml(val: string): string {
  const scored = GROUNDS.map(([label, bg]) => ({
    label,
    bg,
    ratio: contrastRatio(val, bg),
    pass: contrastRatio(val, bg) >= 4.5,
  }));
  const passing = scored.filter((s) => s.pass);
  const show = passing.length ? passing : scored;
  return `<div class="dual-preview">${show
    .map(
      (s) => `
      <div class="preview-unit">
        <div class="dual-preview-chip" style="background:${s.bg};color:${val};">
          Aa
        </div>
        ${ratioCaption(s.label, s.ratio, s.pass)}
      </div>`,
    )
    .join('')}</div>`;
}

/** Icon preview: default ground is Primary; if the icon fails non-text contrast
 *  (3:1) there, swap to Brand instead of showing a failing preview. The ground
 *  + measured ratio render as a real caption — never blend-mode text, which
 *  cannot be measured or verified. */
export function iconPreviewHtml(val: string): string {
  const onPrimary = contrastRatio(val, GROUND_PAPER);
  const useGround = onPrimary >= 3 ? GROUNDS[0] : GROUNDS[1];
  const ratio = contrastRatio(val, useGround[1]);
  return `
    <div class="preview-unit">
      <div class="icon-preview-chip" style="background:${useGround[1]};">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="${val}" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm.75-10.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z"/>
        </svg>
      </div>
      ${ratioCaption(useGround[0], ratio, Number.isNaN(ratio) ? false : ratio >= 3)}
    </div>`;
}

// ─── Shared chrome ────────────────────────────────────────────────────────────

export const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    /* ── Page frame ── */
    .sb-page {
      padding: 28px 32px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
    }

    /* ── Section chrome ── */
    .sb-section { margin-bottom: 64px; }
    .sb-section-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 24px;
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
    .sb-section-intro {
      font-size: 13px;
      color: var(--cedar-warm-750);
      margin: 0 0 20px;
      line-height: 1.6;
      max-width: 72ch;
    }

    /* ── Internal-only notice (ADR 0001: not a stable consumer contract) ── */
    .internal-notice {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: #fdf0d0;
      border: 1px solid #e8c468;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 28px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
    }
    .internal-notice-badge {
      flex-shrink: 0;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: #5a3a00;
      color: #fdf0d0;
      border-radius: 4px;
      padding: 3px 7px;
      margin-top: 1px;
    }
    .internal-notice-body { font-size: 12.5px; line-height: 1.6; color: #5a3a00; }
    .internal-notice-body code { font-family: Pressura, monospace; font-size: 11.5px; }
    .internal-notice-body a { color: #5a3a00; }

    /* ── Primitive ramps (Palette) ── */
    .ramp-group { margin-bottom: 24px; }
    .ramp-group-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: var(--cedar-warm-900);
      margin: 0 0 8px;
    }
    .ramp-strip { display: flex; gap: 2px; }
    .ramp-step { flex: 1; min-width: 40px; }
    .ramp-step-swatch { height: 56px; border: 1px solid rgba(0,0,0,0.06); }
    .ramp-step-swatch:first-child { border-radius: 6px 0 0 6px; }
    .ramp-step-swatch:last-child { border-radius: 0 6px 6px 0; }
    .ramp-step-label {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-750);
      text-align: center;
      margin-top: 3px;
    }
    .ramp-hex {
      font-family: Pressura, monospace;
      font-size: 9.5px;
      color: var(--cedar-warm-600);
      text-align: center;
    }

    /* ── Fill preview for surface-type tokens in table rows ── */
    .fill-preview {
      width: 64px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.07);
      position: relative;
      overflow: hidden;
    }

    /* ── Intent cards ── */
    .intent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 8px;
    }
    .intent-card {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.08);
    }
    /* Primary/Secondary/Brand are content-container treatments, not controls —
       the preview is a panel mock (heading + body rule), never a button/pill. */
    .intent-panel {
      padding: 18px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 96px;
    }
    .intent-panel-heading {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 13px;
      font-weight: 700;
    }
    .intent-panel-rule {
      width: 70%;
      height: 2px;
      border-radius: 1px;
      opacity: 0.55;
    }
    .intent-panel-body {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11px;
      line-height: 1.5;
      opacity: 0.85;
    }
    /* Link has no surface slot — it's inline text states, not a container. */
    .intent-link-preview {
      padding: 18px 16px;
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .intent-link-state {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-decoration: underline;
    }
    .intent-link-state-label {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      text-decoration: none;
      margin-left: 6px;
    }
    .intent-info {
      background: #fff;
      padding: 10px 12px 12px;
      border-top: 1px solid rgba(0,0,0,0.06);
    }
    .intent-name {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: var(--cedar-warm-900);
      margin-bottom: 3px;
    }
    .intent-summary {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10.5px;
      color: var(--cedar-warm-900);
      line-height: 1.45;
      margin-bottom: 2px;
    }
    .intent-usage {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10.5px;
      font-style: italic;
      color: var(--cedar-warm-600);
      line-height: 1.5;
    }
    .dd-list { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
    .dd-row {
      display: flex;
      gap: 6px;
      align-items: baseline;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10.5px;
      line-height: 1.45;
      color: var(--cedar-warm-750);
    }
    .dd-tag {
      flex-shrink: 0;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 3px;
      padding: 1px 5px;
      color: #fff;
    }
    .dd-tag.do { background: #2e6b34; }
    .dd-tag.dont { background: #8a2c22; }
    .family-guide {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      color: var(--cedar-warm-750);
      line-height: 1.55;
      max-width: 78ch;
      margin: -6px 0 14px;
    }
    .family-guide .dd-list { margin-top: 4px; }

    /* ── Contract tier badge + consumption footer ──
       Every Tokens page declares which contract tier it is (ADR 0001) and how
       to consume it — echoes the contract, doesn't re-document the API. */
    .tier-badge {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-radius: 4px;
      padding: 3px 8px;
    }
    .tier-badge.stable { background: #e2efdf; color: #2e6b34; }
    .tier-badge.intent { background: #e3ecfa; color: #2b4d8f; }
    .tier-badge.internal { background: #fdf0d0; color: #5a3a00; }
    .ships-footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px dashed var(--cedar-warm-200, #ddd);
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      line-height: 1.8;
    }
    .ships-footer b { font-family: Graphik, sans-serif; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--cedar-warm-600); }
    .ships-footer a { color: #2b4d8f; }
    .intent-not-shipped {
      border: 1px dashed var(--cedar-warm-300, #ccc);
      border-radius: 10px;
      padding: 12px 14px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11.5px;
      color: var(--cedar-warm-600);
      line-height: 1.6;
    }
    .intent-not-shipped b { color: var(--cedar-warm-900); }

    /* ── Component group tables ── */
    .comp-section { margin-bottom: 48px; }
    .comp-section-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--cedar-warm-750);
      margin: 0 0 10px;
    }
    .comp-table {
      width: 100%;
      border-collapse: collapse;
    }
    .comp-table thead tr {
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .comp-table th {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--cedar-warm-600);
      padding: 4px 8px 8px;
      text-align: left;
    }
    .comp-table th:first-child { padding-left: 0; }
    .comp-table tbody tr {
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .comp-table tbody tr:last-child { border-bottom: none; }
    .comp-table td {
      padding: 7px 8px;
      vertical-align: top;
    }
    /* Swatch, preview and value live in their own fixed columns with identical
       top edges, so all three hold one y-axis regardless of text wrapping. */
    .comp-table td.swatch-col {
      width: 44px;
      padding-left: 0;
    }
    .comp-table td.preview-col { width: 180px; }
    .comp-table td.value-col { width: 110px; }
    .comp-table td:first-child { padding-left: 0; }
    .comp-swatch-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .comp-swatch {
      width: 32px;
      height: 32px;
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0.07);
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .comp-swatch-checker {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0;
      opacity: 0.25;
    }
    .comp-swatch-fill {
      position: absolute;
      inset: 0;
    }
    .comp-token-name {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-1000);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .comp-value {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Click-to-copy affordance — every lookup label is a button. The button
       only resets chrome; typography stays with the companion class
       (.comp-token-name / .token-cssvar / .comp-value). */
    button.copy-chip {
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: copy;
      text-align: left;
      display: block;
      max-width: 100%;
    }
    .copy-chip:hover { text-decoration: underline dotted; }
    .copy-chip:active { opacity: 0.6; }

    /* Deprecation badge (from attributes.deprecated in dist web.json). */
    .dep-badge {
      display: inline-block;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #8a2c22;
      background: #fbe3de;
      border-radius: 3px;
      padding: 1px 5px;
      margin-left: 6px;
      vertical-align: 1px;
    }

    /* Filter input for the all-tokens table. */
    .token-filter {
      width: 100%;
      max-width: 320px;
      font-family: Pressura, monospace;
      font-size: 12px;
      color: var(--cedar-warm-1000);
      background: #fff;
      border: 1px solid var(--cedar-warm-300, #ccc);
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 16px;
    }
    .token-filter:focus { outline: 2px solid var(--cedar-warm-600); outline-offset: 1px; }

    /* Slots × intents matrix: sticky slot column + horizontal scroll. */
    .matrix-scroll { overflow-x: auto; }
    .matrix-scroll .comp-table th:first-child,
    .matrix-scroll .comp-table td:first-child {
      position: sticky;
      left: 0;
      background: #fff;
      min-width: 110px;
    }
    .matrix-scroll .comp-table td { min-width: 150px; }

    /* ── Accessible-ground previews (text + icon) ── */
    .dual-preview { display: flex; gap: 10px; }
    .preview-unit { display: flex; flex-direction: column; gap: 3px; }
    .dual-preview-chip {
      width: 56px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Graphik, sans-serif;
      font-size: 13px;
      font-weight: 600;
    }
    .icon-preview-chip {
      width: 56px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* Measured ground + ratio printed as real text — tooltips hide it from
       keyboard/touch users and mix-blend-mode made it unverifiable. */
    .preview-caption {
      font-family: Pressura, monospace;
      font-size: 9.5px;
      color: var(--cedar-warm-600);
      white-space: nowrap;
    }
    .preview-caption.fail { color: #8a2c22; font-weight: 600; }

    /* ── Usage guide + do/don't ── */
    .usage-guide {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12.5px;
      color: var(--cedar-warm-900);
      line-height: 1.7;
      max-width: 78ch;
    }
    .usage-guide code {
      font-family: Pressura, monospace;
      font-size: 11.5px;
      background: var(--cedar-warm-100, #f2efe9);
      padding: 1px 5px;
      border-radius: 3px;
    }
    .usage-guide ul {
      padding-left: 18px;
      margin: 8px 0;
    }
    .usage-guide li { margin-bottom: 10px; }
    .usage-guide pre {
      background: var(--cedar-warm-1000, #29241d);
      color: #f5f2ec;
      font-family: Pressura, monospace;
      font-size: 11.5px;
      line-height: 1.6;
      padding: 12px 14px;
      border-radius: 6px;
      overflow-x: auto;
      max-width: 78ch;
    }
    .dodont-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      max-width: 1100px;
    }
    .dodont-card {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.08);
      background: #fff;
    }
    .dodont-header {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 12px;
      color: #fff;
    }
    .dodont-header.do { background: #2e6b34; }
    .dodont-header.dont { background: #8a2c22; }
    .dodont-body {
      padding: 12px 14px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11.5px;
      line-height: 1.55;
      color: var(--cedar-warm-900);
    }
    .dodont-body code { font-family: Pressura, monospace; font-size: 10.5px; }
    .dodont-demo {
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      min-height: 72px;
      gap: 8px;
    }

    /* ── Token metadata ── */
    .token-cssvar {
      display: block;
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-750);
      margin-top: 2px;
      opacity: 0.85;
    }
    .token-desc {
      display: block;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10.5px;
      color: var(--cedar-warm-750);
      line-height: 1.45;
      margin-top: 3px;
    }
    .token-desc b { font-weight: 600; color: var(--cedar-warm-900); }

    /* ── Mobile tweaks ── */
    @media (max-width: 480px) {
      .comp-table .comp-value { display: none; }
      .comp-table th:last-child { display: none; }
    }
  </style>
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function swatchCell(value: string): string {
  return `
    <div class="comp-swatch">
      ${isAlpha(value) ? '<div class="comp-swatch-checker"></div>' : ''}
      <div class="comp-swatch-fill" style="background:${value};"></div>
    </div>`;
}

/** Render the token name + CSS var + role description for a table row.
 *  Name, var and value are click-to-copy; a badge marks deprecated tokens. */
export function compNameCell(key: string): string {
  const { cssvar, description, deprecated } = getMeta(key);
  return `<div>
    ${copyChip('comp-token-name', key, key)}${deprecated ? '<span class="dep-badge">deprecated</span>' : ''}
    ${cssvar ? copyChip('token-cssvar', cssvar, cssvar) : ''}
    ${description ? `<span class="token-desc"><b>Role:</b> ${description}</span>` : ''}
  </div>`;
}

export function allTokens(): TokenEntry[] {
  return Object.entries(tokens)
    .filter(([key]) => key.startsWith('CdrColor'))
    .map(([key, value]) => [key, String(value)]);
}

export function sectionHeader(title: string, count?: number, tier?: string): string {
  const badge = tier
    ? `<span class="tier-badge ${tier === 'Stable contract' ? 'stable' : tier === 'Intent contract' ? 'intent' : 'internal'}">${tier}</span>`
    : '';
  return `
    <div class="sb-section-header">
      <h2 class="sb-section-title">${title}</h2>
      ${badge}
      ${count !== undefined ? `<span class="sb-section-count">${count}</span>` : ''}
    </div>`;
}

/** "Ships as" footer — one line naming the consumption paths for a token
 *  family across the three public entrypoints (ADR 0001), linking to the
 *  consumption guides. */
export function shipsAs(familySlug: string, pascal: string): string {
  return `
    <div class="ships-footer">
      <b>Ships as</b>&nbsp;
      <code>--cdr-color-${familySlug}-*</code> ·
      <code>CdrColor${pascal}*</code> ·
      <code>$cdr-color-${familySlug}-*</code> —
      see <a href="index.html?path=/story/guides-using-tokens--choosing-a-contract" target="_top">Using tokens</a>
    </div>`;
}

/** ADR 0001: palette outputs are value-layer internals, not a stable consumer
 *  contract. This banner is intentionally stronger-toned than anything that
 *  would ship on the public site — this Storybook is a maintainer-facing
 *  tool, not where consumers land (see docs/tickets/token-docs-ia-redesign.md
 *  for the consumer-facing surface, which should use a neutral tone instead). */
export function internalContractNotice(): string {
  return `
    <div class="internal-notice">
      <span class="internal-notice-badge">Not a contract</span>
      <div class="internal-notice-body">
        This is the deduplicated raw palette (the ref layer), not a token API. ADR 0001
        (<code>docs/adr/0001-modular-output-architecture.md</code>): "Do not encourage direct
        palette token imports in component/application code" — palette usage is expected
        through Surface component APIs and context containers, never by referencing a
        palette value directly. Shown here, read from <code>canonical/tokens.json</code>
        source (not <code>dist/</code> — primitives are intentionally not exported to
        consumers), for internal reference only.
      </div>
    </div>`;
}

/** Preview cell for a semantic table row, chosen by token kind. */
export function previewCell(val: string, kind: SemanticKind): string {
  if (kind === 'text') return textPreviewHtml(val);
  if (kind === 'icon') return iconPreviewHtml(val);
  if (kind === 'border')
    return `<div style="width:64px;height:30px;border-radius:4px;border:2px solid ${val};"></div>`;
  return `<div class="fill-preview">${isAlpha(val) ? '<div class="comp-swatch-checker"></div>' : ''}<div class="comp-swatch-fill" style="background:${val};"></div></div>`;
}

/** A semantic token table — shared by the Overview groups and element pages.
 *  Columns: swatch | token (name + css var + usage) | preview | value. */
export function semanticTable(
  items: [string, string, string][],
  kind: SemanticKind,
  rowClass = '',
): string {
  const rows = items
    .map(
      ([, key, val]) => `
      <tr class="${rowClass}">
        <td class="swatch-col">${swatchCell(val)}</td>
        <td>${compNameCell(key)}</td>
        <td class="preview-col">${previewCell(val, kind)}</td>
        <td class="comp-value value-col">${copyChip('comp-value', val, val)}</td>
      </tr>`,
    )
    .join('');
  return `
    <table class="comp-table">
      <thead><tr><th></th><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ─── Primitive ramps (sourced from canonical/tokens.json `color.option`, not dist) ──

interface RampLeaf {
  $value?: string;
  $extensions?: { cedar?: { colorFamily?: string } };
}

function collectRamps(node: unknown, out: { family: string; steps: [string, string][] }[]): void {
  if (!node || typeof node !== 'object') return;
  const entries = Object.entries(node as Record<string, RampLeaf>);
  const leafEntries = entries.filter(
    ([, v]) => v && typeof v === 'object' && typeof v.$value === 'string',
  );
  if (leafEntries.length > 0 && leafEntries.length === entries.length) {
    const family = leafEntries[0][1].$extensions?.cedar?.colorFamily ?? 'other';
    const steps: [string, string][] = leafEntries
      .map(([step, v]) => [step, v.$value as string] as [string, string])
      .sort((a, b) => Number(a[0]) - Number(b[0]));
    out.push({ family, steps });
    return;
  }
  for (const value of Object.values(node as Record<string, unknown>)) {
    collectRamps(value, out);
  }
}

export function primitiveRamps(): { family: string; steps: [string, string][] }[] {
  const ramps: { family: string; steps: [string, string][] }[] = [];
  collectRamps((canonicalTokens as { color?: { option?: unknown } }).color?.option, ramps);
  return ramps.sort((a, b) => a.family.localeCompare(b.family));
}

export function humanizeFamily(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Semantic family shaping ─────────────────────────────────────────────────

/** Typed foundation module (e.g. CdrColorSurface) → [label, tokenName, value] rows. */
export function familyTokens(source: Record<string, string>): [string, string, string][] {
  return Object.entries(source)
    .filter(([, v]) => typeof v === 'string')
    .map(([key, value]) => [
      key
        .replace(/^CdrColor/, '')
        .replace(/([A-Z])/g, ' $1')
        .trim(),
      key,
      value,
    ]);
}

/** Flat CdrColor* bundle keys with a prefix → [label, tokenName, value] rows. */
export function flatFamily(prefix: string): [string, string, string][] {
  return allTokens()
    .filter(([k]) => k.startsWith(prefix))
    .map(([key, value]) => [
      key
        .replace(/^CdrColor/, '')
        .replace(new RegExp(`^${prefix.replace(/^CdrColor/, '')}`), '')
        .replace(/([A-Z])/g, ' $1')
        .trim() || key,
      key,
      value,
    ]);
}

export function getSubcategory(key: string): string {
  const m = key.replace(/^CdrColor/, '').match(/^([A-Z][a-z]+)([A-Z][a-z]+)/);
  return m ? m[2] : 'Other';
}

// Per-family education: what the family solves for + one do/don't rule.
// Docs-layer guidance — same role as the per-intent guidance on Intents.
export const familyGuides: Record<string, { solves: string; do: string; dont: string }> = {
  Surface: {
    solves: 'Background roles for regions and containers — the layer everything else sits on.',
    do: 'Choose a surface by the emphasis the region needs in the hierarchy.',
    dont: 'Put surface fills on text or icons — they have their own families.',
  },
  Action: {
    solves: 'Colors for things users act on — triggers, links and interactive affordances.',
    do: 'Reserve Action tokens for elements that respond to input.',
    dont: 'Use them decoratively — an action color promises interactivity.',
  },
  Control: {
    solves:
      'Form-control visuals — checkbox, radio, switch and input surfaces, borders and icons across states.',
    do: 'Prefer Cedar form components, which map these tokens internally.',
    dont: 'Hand-apply them to bespoke controls — you lose the state logic they encode.',
  },
  Feedback: {
    solves:
      'Status communication — banners, toasts and inline messages for error, warning, success and info.',
    do: 'Match the token to the severity of the message.',
    dont: 'Use feedback colors decoratively — they carry a learned meaning.',
  },
  Graphic: {
    solves:
      'Graphic (non-icon) roles — accents, brand marks, membership, rating and sale visuals. Typed import: CdrColorGraphik (legacy filename; the tokens themselves are --cdr-color-graphic-*).',
    do: 'Use for decorative and brand graphics with a defined role.',
    dont: 'Substitute them for text or icon families — separate contract, separate guarantees.',
  },
  Selection: {
    solves: 'Persistent selected-state treatment — list items, tabs, checkboxes, tree rows.',
    do: 'Use for the mark that stays on once chosen.',
    dont: 'Use for hover or focus — selection is persistent state, not transient.',
  },
  Text: {
    solves: 'Type color roles — the only tokens text should ever take.',
    do: 'Check the preview: each row shows the ground(s) the token passes AA on.',
    dont: 'Pick a text color without its ground — the same token can fail on the wrong surface.',
  },
  Border: {
    solves: 'Stroke and divider roles for edges, rules and outlined regions.',
    do: 'Use border tokens for structure — dividers, outlines, focus-adjacent edges.',
    dont: 'Use borders as background fills — fill roles live in Surface.',
  },
  Icon: {
    solves: 'Icon color roles — glyphs and pictograms, checked at 3:1 non-text contrast.',
    do: 'Read the ground label on each preview — failing icons fall back to Brand.',
    dont: 'Apply icon tokens to text or surfaces — the contrast target differs.',
  },
};

export function familyGuideHtml(title: string): string {
  const g = familyGuides[title];
  if (!g) return '';
  return `
    <div class="family-guide">
      ${g.solves}
      <div class="dd-list">
        <span class="dd-row"><span class="dd-tag do">Do</span>${g.do}</span>
        <span class="dd-row"><span class="dd-tag dont">Don't</span>${g.dont}</span>
      </div>
    </div>`;
}

/** Element page: family guide + subcategory-grouped token table. */
export function elementSection(
  title: string,
  items: [string, string, string][],
  kind: SemanticKind = 'fill',
): string {
  const groups: Record<string, [string, string, string][]> = {};
  items.forEach((item) => {
    const sub = getSubcategory(item[1]);
    if (!groups[sub]) groups[sub] = [];
    groups[sub].push(item);
  });

  const subsections = Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([sub, group]) => `
      <div class="comp-section" style="margin-bottom: 24px;">
        <p class="comp-section-label">${sub} <span style="font-weight:400;opacity:0.6;">(${group.length})</span></p>
        ${semanticTable(group, kind)}
      </div>
    `,
    )
    .join('');

  return `
    <div class="sb-section">
      ${sectionHeader(title, items.length, 'Stable contract')}
      ${familyGuideHtml(title)}
      ${subsections}
      ${shipsAs(title.toLowerCase(), title)}
    </div>`;
}

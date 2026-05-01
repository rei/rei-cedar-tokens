import type { StoryObj, Meta } from '@storybook/html';
import * as tokens from '@rei/cdr-tokens';
import { getTokenDescription } from './token-metadata';

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── Types ────────────────────────────────────────────────────────────────────

type TokenEntry = [string, string];

// ─── Shared chrome ────────────────────────────────────────────────────────────

const chrome = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }

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

    /* ── Palette strip ── */
    .palette-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .palette-chip {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.08);
      cursor: default;
      position: relative;
      flex-shrink: 0;
    }
    .palette-chip-inner {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }

    /* ── Semantic section: big swatches with label ── */
    .semantic-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
    }
    .semantic-card {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.07);
    }
    .semantic-swatch {
      height: 80px;
      position: relative;
    }
    .semantic-swatch-checker {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(45deg, #bbb 25%, transparent 25%),
        linear-gradient(-45deg, #bbb 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #bbb 75%),
        linear-gradient(-45deg, transparent 75%, #bbb 75%);
      background-size: 10px 10px;
      background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
      opacity: 0.25;
    }
    .semantic-swatch-fill {
      position: absolute;
      inset: 0;
    }
    .semantic-info {
      background: #fff;
      padding: 8px 10px 10px;
    }
    .semantic-name {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .semantic-token {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-600);
      line-height: 1.4;
      word-break: break-all;
    }
    .semantic-value {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-600);
      opacity: 0.75;
      margin-top: 1px;
    }
    .semantic-doc {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      color: var(--cedar-warm-750);
      line-height: 1.4;
      margin-top: 6px;
    }

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
      vertical-align: middle;
    }
    .comp-table td:first-child { padding-left: 0; }
    .comp-swatch-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .comp-swatch {
      width: 28px;
      height: 28px;
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
    .comp-token-doc {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      color: var(--cedar-warm-750);
      line-height: 1.4;
      margin-top: 2px;
      display: block;
      max-width: 520px;
      white-space: normal;
    }
    .comp-value {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .role-badge {
      display: inline-block;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 4px;
      padding: 2px 6px;
      white-space: nowrap;
    }
    .role-bg   { color: #2a5c3e; background: #d5ede6; }
    .role-text { color: #1b437e; background: #ddeafb; }
    .role-border { color: #5a3a00; background: #fdf0d0; }
    .role-icon { color: #6b2121; background: #fce4e4; }

    /* ── Mobile tweaks ── */
    @media (max-width: 480px) {
      .comp-table .comp-value { display: none; }
      .comp-table th:last-child { display: none; }
    }
  </style>
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function swatchCell(value: string): string {
  return `
    <div class="comp-swatch">
      <div class="comp-swatch-checker"></div>
      <div class="comp-swatch-fill" style="background:${value};"></div>
    </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function tokenCell(key: string): string {
  const doc = getTokenDescription(key);
  const docHtml = doc ? `<span class="comp-token-doc">${escapeHtml(doc)}</span>` : '';
  return `<span class="comp-token-name">${key}</span>${docHtml}`;
}

function semanticCard(label: string, tokenName: string, value: string): string {
  const doc = getTokenDescription(tokenName);
  return `
    <div class="semantic-card">
      <div class="semantic-swatch">
        <div class="semantic-swatch-checker"></div>
        <div class="semantic-swatch-fill" style="background:${value};"></div>
      </div>
      <div class="semantic-info">
        <div class="semantic-name">${label}</div>
        <div class="semantic-token">${tokenName}</div>
        <div class="semantic-value">${value}</div>
        ${doc ? `<div class="semantic-doc">${escapeHtml(doc)}</div>` : ''}
      </div>
    </div>`;
}

function roleBadge(role: string): string {
  const cls =
    role === 'Background'
      ? 'role-bg'
      : role === 'Text'
        ? 'role-text'
        : role === 'Border'
          ? 'role-border'
          : 'role-icon';
  const short =
    role === 'Background' ? 'bg' : role === 'Text' ? 'text' : role === 'Border' ? 'border' : 'icon';
  return `<span class="role-badge ${cls}">${short}</span>`;
}

function allTokens(): TokenEntry[] {
  return Object.entries(tokens)
    .filter(([key]) => key.startsWith('CdrColor'))
    .map(([key, value]) => [key, String(value)]);
}

function getRole(key: string): string {
  const m = key.match(/^CdrColor(Background|Text|Border|Icon)/);
  return m ? m[1] : 'Other';
}

function getComponent(key: string): string {
  const role = getRole(key);
  const rest = key.replace(`CdrColor${role}`, '');
  const m = rest.match(/^([A-Z][a-z]+(?:[A-Z][a-z]+)?)/);
  return m ? m[1] : 'Other';
}

function sectionHeader(title: string, count: number): string {
  return `
    <div class="sb-section-header">
      <h2 class="sb-section-title">${title}</h2>
      <span class="sb-section-count">${count}</span>
    </div>`;
}

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Full palette of unique color values */
export const Palette: Story = {
  name: 'Palette',
  render: () => {
    const entries = allTokens();
    const unique = [...new Set(entries.map(([, v]) => v))].sort();

    const chips = unique
      .map(
        (v) => `
        <div class="palette-chip" title="${v}">
          <div class="palette-chip-inner" style="background:${v};"></div>
        </div>`,
      )
      .join('');

    // Deduplicate for display: group by hue family manually
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Unique Colors', unique.length)}
        <p style="font-size:13px;color:var(--cedar-warm-750);margin:0 0 20px;line-height:1.6;">
          ${entries.length} total tokens resolve to ${unique.length} unique color values across the Cedar design system.
          Hover a chip to see the raw value.
        </p>
        <div class="palette-strip">${chips}</div>
      </div>
    </div>`;
  },
};

/** Semantic surface / text / border / icon tokens — the small set designers use most */
export const Semantic: Story = {
  name: 'Semantic',
  render: () => {
    const t = tokens as Record<string, string>;

    const surfaces: [string, string, string][] = [
      ['Primary surface', 'CdrColorBackgroundPrimary', t.CdrColorBackgroundPrimary],
      ['Secondary surface', 'CdrColorBackgroundSecondary', t.CdrColorBackgroundSecondary],
      ['Brand (Spruce)', 'CdrColorBackgroundBrandSpruce', t.CdrColorBackgroundBrandSpruce],
      ['Error surface', 'CdrColorBackgroundError', t.CdrColorBackgroundError],
      ['Warning surface', 'CdrColorBackgroundWarning', t.CdrColorBackgroundWarning],
      ['Success surface', 'CdrColorBackgroundSuccess', t.CdrColorBackgroundSuccess],
      ['Info surface', 'CdrColorBackgroundInfo', t.CdrColorBackgroundInfo],
      ['Sale surface', 'CdrColorBackgroundSale', t.CdrColorBackgroundSale],
      ['Transparent', 'CdrColorBackgroundTransparent', t.CdrColorBackgroundTransparent],
      ['Tooltip bg', 'CdrColorBackgroundTooltipDefault', t.CdrColorBackgroundTooltipDefault],
    ];

    const textTokens: [string, string, string][] = [
      ['Primary text', 'CdrColorTextPrimary', t.CdrColorTextPrimary],
      ['Secondary text', 'CdrColorTextSecondary', t.CdrColorTextSecondary],
      ['Emphasis text', 'CdrColorTextEmphasis', t.CdrColorTextEmphasis],
      ['Inverse text', 'CdrColorTextInverse', t.CdrColorTextInverse],
      ['Disabled text', 'CdrColorTextDisabled', t.CdrColorTextDisabled],
      ['Brand text', 'CdrColorTextBrand', t.CdrColorTextBrand],
      ['Error text', 'CdrColorTextError', t.CdrColorTextError],
      ['Warning text', 'CdrColorTextWarning', t.CdrColorTextWarning],
      ['Success text', 'CdrColorTextSuccess', t.CdrColorTextSuccess],
      ['Info text', 'CdrColorTextInfo', t.CdrColorTextInfo],
      ['Sale text', 'CdrColorTextSale', t.CdrColorTextSale],
    ];

    const borderTokens: [string, string, string][] = [
      ['Primary border', 'CdrColorBorderPrimary', t.CdrColorBorderPrimary],
      ['Secondary border', 'CdrColorBorderSecondary', t.CdrColorBorderSecondary],
      ['Error border', 'CdrColorBorderError', t.CdrColorBorderError],
      ['Warning border', 'CdrColorBorderWarning', t.CdrColorBorderWarning],
      ['Success border', 'CdrColorBorderSuccess', t.CdrColorBorderSuccess],
      ['Info border', 'CdrColorBorderInfo', t.CdrColorBorderInfo],
      ['Transparent', 'CdrColorBorderTransparent', t.CdrColorBorderTransparent],
    ];

    const iconTokens: [string, string, string][] = [
      ['Default icon', 'CdrColorIconDefault', t.CdrColorIconDefault],
      ['Emphasis icon', 'CdrColorIconEmphasis', t.CdrColorIconEmphasis],
      ['Disabled icon', 'CdrColorIconDisabled', t.CdrColorIconDisabled],
      ['Link icon', 'CdrColorIconLink', t.CdrColorIconLink],
      ['Error icon', 'CdrColorIconMessageError', t.CdrColorIconMessageError],
      ['Warning icon', 'CdrColorIconMessageWarning', t.CdrColorIconMessageWarning],
      ['Success icon', 'CdrColorIconMessageSuccess', t.CdrColorIconMessageSuccess],
      ['Info icon', 'CdrColorIconMessageInfo', t.CdrColorIconMessageInfo],
    ];

    const grid = (items: [string, string, string][]) =>
      `<div class="semantic-grid">${items.map(([l, k, v]) => semanticCard(l, k, v)).join('')}</div>`;

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Background', surfaces.length)}
        ${grid(surfaces)}
      </div>
      <div class="sb-section">
        ${sectionHeader('Text', textTokens.length)}
        ${grid(textTokens)}
      </div>
      <div class="sb-section">
        ${sectionHeader('Border', borderTokens.length)}
        ${grid(borderTokens)}
      </div>
      <div class="sb-section">
        ${sectionHeader('Icon', iconTokens.length)}
        ${grid(iconTokens)}
      </div>
    </div>`;
  },
};

/** All tokens organized by component group, showing role (bg/text/border/icon) per row */
export const ByComponent: Story = {
  name: 'By Component',
  render: () => {
    const entries = allTokens();

    // Group by component
    const groups: Record<string, TokenEntry[]> = {};
    entries.forEach(([k, v]) => {
      const comp = getComponent(k);
      if (!groups[comp]) groups[comp] = [];
      groups[comp].push([k, v]);
    });

    const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

    const sections = sorted
      .map(([comp, rows]) => {
        const tableRows = rows
          .map(([key, val]) => {
            const role = getRole(key);
            return `
              <tr>
                <td>
                  <div class="comp-swatch-cell">
                    ${swatchCell(val)}
                    ${tokenCell(key)}
                  </div>
                </td>
                <td>${roleBadge(role)}</td>
                <td class="comp-value">${val}</td>
              </tr>`;
          })
          .join('');

        return `
          <div class="comp-section">
            <p class="comp-section-label">${comp} <span style="font-weight:400;opacity:0.6;">(${rows.length})</span></p>
            <table class="comp-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Role</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>`;
      })
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('All Color Tokens by Component', entries.length)}
        ${sections}
      </div>
    </div>`;
  },
};

/** Background tokens only, flat grid */
export const BackgroundColors: Story = {
  name: 'Background',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorBackground'));

    const tableRows = entries
      .map(
        ([key, val]) => `
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${swatchCell(val)}
              ${tokenCell(key)}
            </div>
          </td>
          <td class="comp-value">${val}</td>
        </tr>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Background Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Value</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  },
};

/** Text tokens only */
export const TextColors: Story = {
  name: 'Text',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorText'));

    const tableRows = entries
      .map(
        ([key, val]) => `
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${swatchCell(val)}
              ${tokenCell(key)}
            </div>
          </td>
          <td>
            <span style="color:${val};font-family:Graphik,sans-serif;font-size:13px;font-weight:600;
              text-shadow: 0 0 6px rgba(0,0,0,0.06);">
              Aa
            </span>
          </td>
          <td class="comp-value">${val}</td>
        </tr>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Text Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  },
};

/** Border tokens only */
export const BorderColors: Story = {
  name: 'Border',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorBorder'));

    const tableRows = entries
      .map(
        ([key, val]) => `
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${swatchCell(val)}
              ${tokenCell(key)}
            </div>
          </td>
          <td>
            <div style="width:48px;height:24px;border-radius:4px;border:2px solid ${val};"></div>
          </td>
          <td class="comp-value">${val}</td>
        </tr>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Border Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  },
};

/** Icon tokens only */
export const IconColors: Story = {
  name: 'Icon',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorIcon'));

    const tableRows = entries
      .map(
        ([key, val]) => `
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${swatchCell(val)}
              ${tokenCell(key)}
            </div>
          </td>
          <td>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="${val}" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm.75-10.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z"/>
            </svg>
          </td>
          <td class="comp-value">${val}</td>
        </tr>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Icon Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  },
};

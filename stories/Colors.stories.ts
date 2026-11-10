import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorControl } from '../dist/rei-dot-com/types/foundations/cdr-color-control.mjs';
import { CdrColorFeedback } from '../dist/rei-dot-com/types/foundations/cdr-color-feedback.mjs';
import { CdrColorGraphik } from '../dist/rei-dot-com/types/foundations/cdr-color-graphik.mjs';
import { CdrColorSelection } from '../dist/rei-dot-com/types/foundations/cdr-color-selection.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import {
  chrome,
  sectionHeader,
  elementSection,
  familyTokens,
  flatFamily,
  familyGuides,
  allTokens,
  swatchCell,
  compNameCell,
  previewCell,
  copyChip,
  type SemanticKind,
} from './colors-shared';

const meta: Meta = {
  title: 'Tokens/UI Semantics',
  parameters: {
    layout: 'fullscreen',
    // Reference pages are static — the addon panel only earns its place on
    // interactive stories (see Tokens/UI Intents → Playground).
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// Sidebar order = element-level navigation (Carbon-style): users look tokens up
// by the element they color — Surface, Text, Border, Icon — not by bundle order.
// Each token table lives on exactly one page; Overview is the landing/index and
// "All tokens" the exhaustive lookup table.

const FAMILIES: { name: string; story: string; items: [string, string, string][] }[] = [
  { name: 'Surface', story: 'tokens-ui-semantics--surface', items: familyTokens(CdrColorSurface) },
  { name: 'Text', story: 'tokens-ui-semantics--text', items: flatFamily('CdrColorText') },
  { name: 'Border', story: 'tokens-ui-semantics--border', items: flatFamily('CdrColorBorder') },
  { name: 'Icon', story: 'tokens-ui-semantics--icon', items: flatFamily('CdrColorIcon') },
  { name: 'Action', story: 'tokens-ui-semantics--action', items: familyTokens(CdrColorAction) },
  { name: 'Control', story: 'tokens-ui-semantics--control', items: familyTokens(CdrColorControl) },
  {
    name: 'Feedback',
    story: 'tokens-ui-semantics--feedback',
    items: familyTokens(CdrColorFeedback),
  },
  {
    name: 'Selection',
    story: 'tokens-ui-semantics--selection',
    items: familyTokens(CdrColorSelection),
  },
  { name: 'Graphic', story: 'tokens-ui-semantics--graphic', items: familyTokens(CdrColorGraphik) },
];

/** Landing: what semantic tokens are + index into the element pages. */
export const Overview: Story = {
  name: 'Overview',
  render: () => {
    const indexCards = FAMILIES.map(({ name, story, items }) => {
      // A representative swatch strip previews the family's contents —
      // index cards must show color, not just label it.
      const strip = items
        .slice(0, 6)
        .map(([, , v]) => `<span style="flex:1;height:18px;background:${v};"></span>`)
        .join('');
      return `
        <a href="index.html?path=/story/${story}" target="_top" style="text-decoration:none;">
          <div class="dodont-card" style="height:100%;">
            <div style="display:flex;gap:2px;padding:0 0 2px;">${strip}</div>
            <div class="dodont-body">
              <b style="font-size:13px;color:var(--cedar-warm-1000);">${name} →</b>
              <p style="margin:6px 0 0;color:var(--cedar-warm-750);">${familyGuides[name]?.solves ?? ''}</p>
            </div>
          </div>
        </a>`;
    }).join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('UI Semantics')}
        <p class="sb-section-intro">
          Semantic tokens are <b>single values</b> bound to a role — the stable, typed
          contract (ADR 0001 §Foundations) that components and pages consume. Pick the
          element you are coloring below or in the sidebar; each token carries its CSS
          var and role note. For a coordinated multi-slot set, use
          <a href="index.html?path=/story/tokens-ui-intents--reference" target="_top"><b>UI Intents</b></a> instead of
          composing these by hand. Need one exhaustive list? See
          <a href="index.html?path=/story/tokens-ui-semantics--all-tokens" target="_top"><b>All tokens</b></a>.
        </p>
        <div class="dodont-grid">${indexCards}</div>
      </div>
    </div>`;
  },
};

/** Preview kind is derived from the token prefix — the element the color is for. */
function kindOf(key: string): SemanticKind {
  return key.startsWith('CdrColorText')
    ? 'text'
    : key.startsWith('CdrColorIcon')
      ? 'icon'
      : key.startsWith('CdrColorBorder')
        ? 'border'
        : 'fill';
}

/**
 * All tokens — the exhaustive, filterable lookup table (Carbon's central
 * pattern). Client-side filter over name / CSS var / role text via an inline
 * handler, the only scripting that survives html-story rendering.
 */
export const AllTokens: Story = {
  name: 'All tokens',
  render: () => {
    const items = allTokens();
    const rows = items
      .map(
        ([key, val]) => `
        <tr class="alltokens-row">
          <td class="swatch-col">${swatchCell(val)}</td>
          <td>${compNameCell(key)}</td>
          <td class="preview-col">${previewCell(val, kindOf(key))}</td>
          <td class="comp-value value-col">${copyChip('comp-value', val, val)}</td>
        </tr>`,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('All color tokens', items.length, 'Stable contract')}
        <input class="token-filter" type="search" placeholder="Filter by name, var, role or hex…"
          oninput="var q=this.value.toLowerCase();var n=0;this.closest('.sb-page').querySelectorAll('.alltokens-row').forEach(function(r){var hit=r.textContent.toLowerCase().indexOf(q)>-1;r.style.display=hit?'':'none';if(hit)n++});document.getElementById('atc').textContent=n+' shown';" />
        <span id="atc" style="font-family:Pressura,monospace;font-size:11px;color:var(--cedar-warm-600);margin-left:10px;">${items.length} shown</span>
        <table class="comp-table">
          <thead><tr><th></th><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="ships-footer">
          <b>Ships as</b>&nbsp;
          <code>--cdr-color-*</code> ·
          <code>CdrColor*</code> ·
          <code>$cdr-color-*</code> —
          see <a href="index.html?path=/story/guides-using-tokens--choosing-a-contract" target="_top">Using tokens</a>
        </div>
      </div>
    </div>`;
  },
};

const familyPage = (
  name: string,
  items: [string, string, string][],
  kind: SemanticKind = 'fill',
): Story => ({
  name,
  render: () => `${chrome}<div class="sb-page">${elementSection(name, items, kind)}</div>`,
});

export const Surface = familyPage('Surface', FAMILIES[0].items);
export const Text = familyPage('Text', FAMILIES[1].items, 'text');
export const Border = familyPage('Border', FAMILIES[2].items, 'border');
export const Icon = familyPage('Icon', FAMILIES[3].items, 'icon');
export const Action = familyPage('Action', FAMILIES[4].items);
export const Control = familyPage('Control', FAMILIES[5].items);
export const Feedback = familyPage('Feedback', FAMILIES[6].items);
export const Selection = familyPage('Selection', FAMILIES[7].items);
export const Graphic = familyPage('Graphic', FAMILIES[8].items);

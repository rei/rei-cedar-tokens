import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrIntents, CdrIntentOrder } from '../dist/rei-dot-com/types/intents/cdr-intents.mjs';
import intentsManifest from '../metadata/intents.json';
import { chrome, sectionHeader } from './colors-shared';

const meta: Meta = {
  title: 'Tokens/UI Intents',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

type ManifestIntent = {
  summary?: string;
  usage?: string;
  slots?: Record<string, string>;
  states?: Record<string, Record<string, string>>;
};
const manifestIntents = (intentsManifest as { intents: Record<string, ManifestIntent> }).intents;

/** Flatten an intent's slots to "slot[.state]" → hex. */
function flattenSlots(name: string): Map<string, string> {
  const slots = CdrIntents[name] as Record<string, string | Record<string, string>>;
  const flat = new Map<string, string>();
  for (const [slot, value] of Object.entries(slots)) {
    if (typeof value === 'string') flat.set(slot, value);
    else for (const [state, v] of Object.entries(value)) flat.set(`${slot}.${state}`, v);
  }
  return flat;
}

/** Resolve a flattened slot key to the manifest's semantic token ref, e.g.
 *  "surface" → color.surface.brand, "text.rest" → states.rest.text. */
function slotTokenRef(name: string, slotKey: string): string | null {
  const m = manifestIntents[name];
  if (!m) return null;
  const raw =
    m.slots?.[slotKey] ??
    (() => {
      const [slot, state] = slotKey.split('.');
      return state ? m.states?.[state]?.[slot] : undefined;
    })();
  return raw ? raw.replace(/^\{|\}$/g, '') : null;
}

/**
 * Playground — one composite surface, `intent` exposed as a control.
 * The control IS the API surface: pick one name, get the whole coordinated set.
 * The only token story with controls enabled.
 */
export const Playground: Story = {
  name: 'Playground',
  parameters: { controls: { disable: false } },
  render: () => {
    // In-story switcher — the addon panel's open/closed state is global manager
    // UI, so a Controls-dependent demo can be switched off by accident. The
    // select is the demo; it never depends on panel state.
    const intentsJson = JSON.stringify(CdrIntents).replace(/</g, '\\u003c');
    const options = CdrIntentOrder.map(
      (n) => `<option value="${n}"${n === 'Brand' ? ' selected' : ''}>${n}</option>`,
    ).join('');

    return `${chrome}<div class="sb-page">
      <p class="sb-section-intro">
        Pick an intent — the preview and slot legend update together. This is the
        consumer API: one name, one coordinated set.
      </p>
      <label style="font-family:Graphik,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--cedar-warm-600);">
        Intent
        <select id="ip-select" data-intents='${intentsJson}'
          style="display:block;margin-top:6px;font-family:Pressura,monospace;font-size:13px;padding:6px 10px;border:1px solid var(--cedar-warm-300,#ccc);border-radius:6px;background:#fff;"
          onchange="
            var I=JSON.parse(this.dataset.intents), s=I[this.value];
            var p=document.getElementById('ip-preview'), lg=document.getElementById('ip-legend'), nm=document.getElementById('ip-name');
            nm.textContent=this.value;
            var flat=[];
            Object.keys(s).forEach(function(k){var v=s[k];
              if(typeof v==='string'){flat.push([k,v]);}else{Object.keys(v).forEach(function(st){flat.push([k+'.'+st,v[st]]);});}});
            lg.innerHTML=flat.map(function(e){return '<div style=&quot;display:flex;align-items:center;gap:8px;font-family:Pressura,monospace;font-size:10px;color:var(--cedar-warm-750);&quot;><span style=&quot;width:20px;height:20px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);background:'+e[1]+';&quot;></span><span>'+e[0]+'</span><span style=&quot;opacity:0.6;&quot;>'+e[1]+'</span></div>';}).join('');
            if(typeof s.surface==='string'){
              p.style.background=s.surface; p.style.color=s.text;
              p.style.border='2px solid '+(s.border||s.text);
              p.innerHTML='<div style=&quot;display:flex;align-items:center;gap:8px;font-family:Graphik,sans-serif;font-size:16px;font-weight:700;&quot;><svg width=&quot;20&quot; height=&quot;20&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;'+s.icon+'&quot;><path d=&quot;M10 2a8 8 0 100 16A8 8 0 0010 2zm.75 4.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z&quot;/></svg>'+this.value+' region</div><p style=&quot;font-family:Graphik,sans-serif;font-size:13px;line-height:1.6;margin:10px 0 0;&quot;>Every value — surface, text, icon, border — comes from <code style=&quot;font-family:Pressura,monospace;&quot;>CdrIntents.'+this.value+'</code>.</p>';
            } else {
              p.style.background='#fff'; p.style.color='#333';
              p.style.border='1px solid rgba(0,0,0,0.08)';
              p.innerHTML=this.value+' is not a container — it styles elements by state: '+Object.keys(s.text||{}).map(function(st){return '<a href=&quot;#&quot; style=&quot;color:'+s.text[st]+';font-weight:600;&quot;>'+st+'</a>';}).join(', ')+'.';
            }
          ">
          ${options}
        </select>
      </label>
      <div id="ip-preview" style="margin-top:16px;background:${CdrIntents.Brand.surface};color:${CdrIntents.Brand.text};border:2px solid ${CdrIntents.Brand.border};border-radius:10px;padding:28px 24px;max-width:520px;">
        <div style="display:flex;align-items:center;gap:8px;font-family:Graphik,sans-serif;font-size:16px;font-weight:700;">
          <svg id="ip-icon" width="20" height="20" viewBox="0 0 20 20" fill="${CdrIntents.Brand.icon}"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm.75 4.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z"/></svg>
          <span id="ip-name">Brand</span> region
        </div>
        <p style="font-family:Graphik,sans-serif;font-size:13px;line-height:1.6;margin:10px 0 0;">
          Every value — surface, text, icon, border — comes from
          <code style="font-family:Pressura,monospace;">CdrIntents.&lt;name&gt;</code>.
        </p>
      </div>
      <div id="ip-legend" style="display:flex;gap:16px;flex-wrap:wrap;margin-top:16px;">
        ${[...flattenSlots('Brand')]
          .map(
            ([slot, hex]) =>
              `<div style="display:flex;align-items:center;gap:8px;font-family:Pressura,monospace;font-size:10px;color:var(--cedar-warm-750);"><span style="width:20px;height:20px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);background:${hex};"></span><span>${slot}</span><span style="opacity:0.6;">${hex}</span></div>`,
          )
          .join('')}
      </div>
    </div>`;
  },
};

/** Reference — every shipped intent with summary, usage conditions and do/don't
 *  guidance, plus designer/developer education. */
export const Reference: Story = {
  name: 'Reference',
  render: () => {
    const containerIntents = CdrIntentOrder.filter((name) => {
      const slots = (CdrIntents as Record<string, Record<string, unknown>>)[name];
      return typeof slots.surface === 'string';
    });
    const linkIntents = CdrIntentOrder.filter((name) => !containerIntents.includes(name));

    // Per-intent guidance — docs-layer education, authored here rather than in
    // the manifest (which carries summary/usage per ADR 0007, not design advice).
    const intentGuidance: Record<string, { do: string; dont: string }> = {
      Primary: {
        do: 'Default reading surface for most content regions.',
        dont: 'Nesting Primary inside Primary to fake hierarchy — drop to Secondary instead.',
      },
      Secondary: {
        do: 'Receded supporting content beneath a Primary region.',
        dont: 'Using it as a "disabled" look — it is an emphasis tier, not a state.',
      },
      Brand: {
        do: 'Intentional brand moments — hero bands, promo regions, membership context.',
        dont: 'Wrapping long-form reading in Brand — it is a moment, not a page background.',
      },
      Link: {
        do: 'Inline text links and text-state styling only.',
        dont: 'Treating it as a container — there is deliberately no Link surface slot.',
      },
    };

    const ddList = (name: string): string => {
      const g = intentGuidance[name];
      if (!g) return '';
      return `<div class="dd-list">
        <span class="dd-row"><span class="dd-tag do">Do</span>${g.do}</span>
        <span class="dd-row"><span class="dd-tag dont">Don't</span>${g.dont}</span>
      </div>`;
    };

    const intentInfo = (name: string, manifest: ManifestIntent) => `
      <div class="intent-info">
        <div class="intent-name">${name}</div>
        ${manifest.summary ? `<div class="intent-summary">${manifest.summary}</div>` : ''}
        ${manifest.usage ? `<div class="intent-usage">${manifest.usage}</div>` : ''}
        ${ddList(name)}
      </div>`;

    // Primary/Secondary/Brand: content-container treatment — a panel mock
    // (heading + rule + body), never a button/pill. These are surfaces, not controls.
    const panelCards = containerIntents
      .map((name) => {
        const slots = (CdrIntents as Record<string, Record<string, string>>)[name];
        const manifest = manifestIntents[name] ?? {};
        return `
          <div class="intent-card">
            <div class="intent-panel" style="background:${slots.surface};color:${slots.text};">
              <span class="intent-panel-heading">${name} panel</span>
              <span class="intent-panel-rule" style="background:${slots.border ?? slots.text};"></span>
              <span class="intent-panel-body">Content container using this intent's surface, text and border slots together.</span>
            </div>
            ${intentInfo(name, manifest)}
          </div>`;
      })
      .join('');

    // Link: no surface slot — it's inline text states, not a container.
    const linkCards = linkIntents
      .map((name) => {
        const slots = (CdrIntents as Record<string, Record<string, unknown>>)[name];
        const manifest = manifestIntents[name] ?? {};
        const textStates = (slots.text ?? {}) as Record<string, string>;
        const states = Object.entries(textStates)
          .map(
            ([state, color]) =>
              `<span class="intent-link-state" style="color:${color};">Link text<span class="intent-link-state-label">${state}</span></span>`,
          )
          .join('');
        return `
          <div class="intent-card">
            <div class="intent-link-preview">${states}</div>
            ${intentInfo(name, manifest)}
          </div>`;
      })
      .join('');

    // Slots × intents matrix — the "pre-mixined bundle" made legible: each row
    // is an element slot, each column a shipped intent, each cell the semantic
    // token the intent resolves for that slot. "—" is a deliberate gap.
    const flatByIntent = new Map(CdrIntentOrder.map((n) => [n, flattenSlots(n)]));
    const rowOrder = ['surface', 'text', 'textEmphasis', 'icon', 'border'];
    const extraKeys = [...new Set([...flatByIntent.values()].flatMap((m) => [...m.keys()]))]
      .filter((k) => !rowOrder.includes(k))
      .sort();
    const matrixRows = [...rowOrder, ...extraKeys].filter((k) =>
      [...flatByIntent.values()].some((m) => m.has(k)),
    );

    const matrixCell = (intent: string, slot: string): string => {
      const hex = flatByIntent.get(intent)?.get(slot);
      if (!hex) return `<td style="text-align:center;color:var(--cedar-warm-400,#bbb);">—</td>`;
      const ref = slotTokenRef(intent, slot);
      return `<td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="comp-swatch" style="width:24px;height:24px;"><span class="comp-swatch-fill" style="background:${hex};"></span></span>
          <div>
            <span class="comp-token-name" style="font-size:10px;">${hex}</span>
            ${ref ? `<span class="token-cssvar">${ref}</span>` : ''}
          </div>
        </div>
      </td>`;
    };

    const matrix = `
      <div class="sb-section">
        ${sectionHeader('Slots × intents')}
        <p class="sb-section-intro">
          Every shipped intent read as a recipe over semantic tokens — this is what
          "pre-mixed" means: the element pages hold the single-value tokens, each
          column here is the composed set.
        </p>
        <div class="matrix-scroll">
        <table class="comp-table">
          <thead>
            <tr><th>Slot</th>${CdrIntentOrder.map((n) => `<th>${n}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${matrixRows
              .map(
                (slot) => `
              <tr>
                <td><span class="comp-token-name">${slot}</span></td>
                ${CdrIntentOrder.map((n) => matrixCell(n, slot)).join('')}
              </tr>`,
              )
              .join('')}
          </tbody>
        </table>
        </div>
      </div>`;

    const allManifestNames = Object.keys(manifestIntents);
    const notYetShipped = allManifestNames.filter((n) => !CdrIntentOrder.includes(n));

    const b = CdrIntents.Brand;
    const p = CdrIntents.Primary;
    const link = CdrIntents.Link as { text: Record<string, string> };

    const usageGuide = `
      <div class="sb-section">
        ${sectionHeader('What is an intent?')}
        <div class="usage-guide">
          <p>
            An intent is a <b>named, pre-approved decision</b>. Instead of making
            four separate choices — which surface, which text, which icon, which
            border, each drawn from a different token family — you choose one
            intent and get a coordinated set the design team has already vetted
            for contrast, hierarchy and brand fit. The name describes the
            <i>role</i> (Primary emphasis, Secondary support, Brand moment, Link),
            not the colors.
          </p>
          <p>
            Intents are <b>static container treatments</b>: they describe a region —
            a hero band, a promo card, a section — not a control. Interactive elements
            inside an intent surface keep their own component tokens.
          </p>
        </div>
      </div>

      <div class="sb-section">
        ${sectionHeader('For designers')}
        <div class="usage-guide">
          <ul>
            <li>
              <b>Choose the intent first, not the color.</b> Start from the content's
              role: <b>Primary</b> is the default reading surface, <b>Secondary</b>
              recedes for supporting content beneath Primary, <b>Brand</b> is for
              intentional brand moments, <b>Link</b> is inline text-state color only —
              it has no surface and is never a container.
            </li>
            <li>
              <b>Apply intents to containers, not elements.</b> An intent styles a
              region and everything inside it inherits the coordinated text/icon
              treatment. Do not apply intent slots to individual buttons or inputs —
              controls carry their own tokens.
            </li>
            <li>
              <b>Never mix slots across intents.</b> <code>Brand.surface</code> only
              pairs with <code>Brand.text</code>/<code>Brand.icon</code>. If a
              combination isn't in the set, it hasn't been checked — see the
              do/don't demos below for a real failure.
            </li>
            <li>
              <b>One intent per region.</b> Nesting Brand inside Secondary inside
              Primary is how hierarchies read correctly; same-intent nesting or
              adjacent competing intents flattens it.
            </li>
            <li>
              Intents originate here and are pushed to Figma (ADR 0007) — in a mockup,
              apply the intent as a layer/variable group, not individual fills.
            </li>
          </ul>
        </div>
      </div>

      <div class="sb-section">
        ${sectionHeader('For developers')}
        <div class="usage-guide">
          <p>
            <b>In Cedar components</b>, prefer the surface API rather than referencing
            intent vars directly — <code>CdrSurface</code> applies the same coordinated
            values:
          </p>
          <pre>&lt;CdrSurface background="brand"&gt;
  &lt;!-- content inherits the brand text/icon treatment --&gt;
&lt;/CdrSurface&gt;</pre>
          <p>
            <b>For bespoke containers</b> outside a Cedar component, apply the whole
            slot set together — either the intent CSS vars
            (<code>@rei/cdr-tokens/css</code> intents output):
          </p>
          <pre>.promo-band {
  background: var(--cdr-color-brand-surface);
  color: var(--cdr-color-brand-text);
  border: 1px solid var(--cdr-color-brand-border);
}
.promo-band svg { fill: var(--cdr-color-brand-icon); }</pre>
          <p>…or the typed export (<code>@rei/cdr-tokens/types</code>):</p>
          <pre>import { CdrIntents } from '@rei/cdr-tokens/types';
// CdrIntents.Brand → { surface, text, icon, border }
// CdrIntents.Link  → { text: { rest, active, visited }, border: { hover, active } }</pre>
          <p>
            If a slot you need isn't in the intent (e.g. Secondary has no
            <code>textEmphasis</code>), that is a deliberate gap in the composition,
            not an invitation to borrow it from another intent.
          </p>
        </div>
      </div>

      <div class="sb-section">
        <p class="comp-section-label">Do / Don't</p>
        <div class="dodont-grid">
          <div class="dodont-card">
            <div class="dodont-header do">Do — apply the whole intent</div>
            <div class="dodont-demo" style="background:${b.surface};">
              <span style="color:${b.text};font-family:Graphik,sans-serif;font-size:13px;">
                Brand container
              </span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="${b.icon}"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z"/></svg>
            </div>
            <div class="dodont-body">
              Surface, text, icon and border from the <b>same</b> intent, applied to the
              container — <code>CdrSurface background="brand"</code> or the
              <code>--cdr-color-brand-*</code> set together.
            </div>
          </div>
          <div class="dodont-card">
            <div class="dodont-header dont">Don't — mix slots across intents</div>
            <div class="dodont-demo" style="background:${b.surface};">
              <span style="color:${p.text};font-family:Graphik,sans-serif;font-size:13px;">
                Brand surface + primary text
              </span>
            </div>
            <div class="dodont-body">
              <code>Brand.surface</code> with <code>Primary.text</code> mixes compositions
              the designers never paired — here it also fails contrast. Slots are only
              valid as a set.
            </div>
          </div>
          <div class="dodont-card">
            <div class="dodont-header do">Do — controls keep their own tokens</div>
            <div class="dodont-demo" style="background:${b.surface};">
              <span style="background:#fff;color:${link.text.rest};font-family:Graphik,sans-serif;font-size:11px;padding:6px 12px;border-radius:4px;font-weight:600;">
                CdrButton
              </span>
            </div>
            <div class="dodont-body">
              Interactive elements render with their own component tokens on top of the
              intent surface — the intent sets the region, not the controls inside it.
            </div>
          </div>
          <div class="dodont-card">
            <div class="dodont-header dont">Don't — restyle controls with intent slots</div>
            <div class="dodont-demo" style="background:#fff;">
              <span style="background:${b.surface};color:${b.text};font-family:Graphik,sans-serif;font-size:11px;padding:6px 12px;border-radius:4px;font-weight:600;">
                button
              </span>
            </div>
            <div class="dodont-body">
              An intent is not a button theme. <code>Brand.surface</code> as a control
              background bypasses state, focus and contrast guarantees built into the
              component tokens.
            </div>
          </div>
        </div>
      </div>`;

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('UI Intents', CdrIntentOrder.length, 'Intent contract')}
        <p class="sb-section-intro">
          Curated, coordinated multi-slot compositions — pick one intent and get a
          designer-approved combination, instead of wiring each color independently.
          Source: <code>dist/*/intents/cdr-intents.mjs</code> (shipped) +
          <code>metadata/intents.json</code> (usage text, ADR 0007).
        </p>
        <div class="intent-grid">${panelCards}${linkCards}</div>
      </div>
      ${matrix}
      ${usageGuide}
      <div class="sb-section">
        <div class="ships-footer">
          <b>Ships as</b>&nbsp;
          <code>--cdr-color-{intent}-{slot}</code> (<code>@rei/cdr-tokens/css</code> intents) ·
          <code>CdrIntents</code> (<code>@rei/cdr-tokens/types</code>) ·
          <code>@use</code> partials under <code>scss/intents/</code> —
          see <a href="index.html?path=/story/guides-using-tokens--choosing-a-contract" target="_top">Using tokens</a>
        </div>
      </div>
      ${
        notYetShipped.length
          ? `<div class="sb-section">
              <p class="comp-section-label">Defined, not yet shipped (${notYetShipped.length})</p>
              <div class="intent-not-shipped">
                <b>${notYetShipped.join(', ')}</b> ${notYetShipped.length === 1 ? 'is' : 'are'} authored in
                <code>metadata/intents.json</code> but not yet realized in <code>dist/</code> output —
                the manifest is a draft until <code>TOKEN_INTENT_ROADMAP.md</code> Phase 2 lands.
                Shown here as a gap, not silently omitted.
              </div>
            </div>`
          : ''
      }
    </div>`;
  },
};

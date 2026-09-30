import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,n as r,r as i,t as a}from"./token-metadata-VEx4GjYE.js";var o;function s(){return(s=e((()=>{o={CdrColorActionBorderBrand:`#800080`,CdrColorActionBorderNeutralFaint:`#d7d4ce`,CdrColorActionBorderSale:`#d93f00`,CdrColorActionBorderTriggerFaint:`#5889d6`,CdrColorActionIconNeutralFaint:`#f7f7f5`,CdrColorActionIconNeutralSubtle:`#d7d4ce`,CdrColorActionIconNeutralTrace:`#ffffff`,CdrColorActionIconSale:`#d93f00`,CdrColorActionSurfaceBrandFaint:`#bfddca`,CdrColorActionSurfaceNeutralFaint:`#f7f7f5`,CdrColorActionSurfaceNeutralSubtle:`#f1f0ed`,CdrColorActionSurfaceNeutralTrace:`#fcfcfb`,CdrColorActionSurfaceSaleFaint:`#ffe9df`,CdrColorActionTextBrand:`#800080`,CdrColorActionTextNeutralFaint:`#f7f7f5`,CdrColorActionTextNeutralSubtle:`#cecac3`,CdrColorActionTextNeutralTrace:`#ffffff`,CdrColorActionTextSale:`#d93f00`,CdrColorActionTextTriggerFaint:`#5889d6`}})))()}var c;function l(){return(l=e((()=>{c={CdrColorControlBorderNeutralFaint:`#cecac3`,CdrColorControlIconNeutralFaint:`#fcfcfb`,CdrColorControlIconNeutralSubtle:`#f7f7f5`,CdrColorControlIconNeutralTrace:`#ffffff`,CdrColorControlSurfaceNaturalFaint:`#f4f0e626`,CdrColorControlSurfaceNeutralFaint:`#fcfcfb`,CdrColorControlSurfaceNeutralSubtle:`#f7f7f5`,CdrColorControlSurfaceNeutralTrace:`#ffffff`,CdrColorControlTextNeutralFaint:`#cecac3`,CdrColorControlTextNeutralSubtle:`#b4afa6`}})))()}var u;function d(){return(d=e((()=>{u={CdrColorFeedbackBorderErrorFaint:`#ffccc1`,CdrColorFeedbackBorderInfoFaint:`#c8e5e6`,CdrColorFeedbackBorderNatural:`#756e5c`,CdrColorFeedbackBorderNautralFaint:`#e6ddc9`,CdrColorFeedbackBorderNeutralTrace:`#ffffff`,CdrColorFeedbackBorderSuccessFaint:`#c8e8c9`,CdrColorFeedbackBorderWarningFaint:`#f2dd9f`,CdrColorFeedbackIconError:`#c33122`,CdrColorFeedbackIconNeutral:`#ffffff`,CdrColorFeedbackSurfaceErrorFaint:`#fff1ed`,CdrColorFeedbackSurfaceErrorTrace:`#fff8f6`,CdrColorFeedbackSurfaceInfoFaint:`#f1f8f9`,CdrColorFeedbackSurfaceNaturalFaint:`#f8f7f2`,CdrColorFeedbackSurfaceNeutralTrace:`#ffffff`,CdrColorFeedbackSurfaceSuccessFaint:`#eefbee`,CdrColorFeedbackSurfaceWarningFaint:`#fef7e1`,CdrColorFeedbackTextError:`#c33122`,CdrColorFeedbackTextInfo:`#257d81`,CdrColorFeedbackTextNatural:`#756e5c`,CdrColorFeedbackTextNeutralFaint:`#746e63`,CdrColorFeedbackTextSuccess:`#3d8044`,CdrColorFeedbackTextWarning:`#8a6a00`}})))()}var f;function p(){return(p=e((()=>{f={CdrColorGraphicBorderAccentFaint:`#e5fd9c`,CdrColorGraphicBorderBrand:`#800080`,CdrColorGraphicBorderMembership:`#ffdb22`,CdrColorGraphicBorderNatural:`#f8f7f2`,CdrColorGraphicBorderNeutral:`#8e887d`,CdrColorGraphicBorderRating:`#ba7b00`,CdrColorGraphicBorderSale:`#d93f00`,CdrColorGraphicSurfaceAccentFaint:`#e5fd9c`,CdrColorGraphicSurfaceBrand:`#800080`,CdrColorGraphicSurfaceMembership:`#ffdb22`,CdrColorGraphicSurfaceNatural:`#f8f7f2`,CdrColorGraphicSurfaceNeutralFaint:`#f7f7f5`,CdrColorGraphicSurfaceRatingFaint:`#fcfcfb`,CdrColorGraphicSurfaceSale:`#d93f00`}})))()}var m;function h(){return(h=e((()=>{m={CdrColorSelectionBorderNeutralFaint:`#cecac3`,CdrColorSelectionBorderNeutralSubtle:`#979187`,CdrColorSelectionBorderTrigger:`#3d6db9`,CdrColorSelectionSurfaceNatural:`#f4f0e6`,CdrColorSelectionSurfaceNeutralFaint:`#f7f7f5`,CdrColorSelectionSurfaceNeutralSubtle:`#f1f0ed`,CdrColorSelectionSurfaceNeutralTrace:`#ffffff`,CdrColorSelectionTextNeutralFaint:`#746e63`,CdrColorSelectionTextTrigger:`#3d6db9`}})))()}var g;function _(){return(_=e((()=>{g={CdrColorSurfaceBrandSubtle:`#7a7105`,CdrColorSurfaceMembership:`#ffdb22`,CdrColorSurfaceNatural:`#f8f7f2`,CdrColorSurfaceNeutralSubtle:`#f7f7f5`,CdrColorSurfaceNeutralTrace:`#ffffff`,CdrColorSurfaceSale:`#d93f00`}})))()}function v(e){return`
    <div class="comp-swatch">
      <div class="comp-swatch-checker"></div>
      <div class="comp-swatch-fill" style="background:${e};"></div>
    </div>`}function y(e,t,n){let i=a(t),o=r(t);return`
    <div class="semantic-card">
      <div class="semantic-swatch">
        <div class="semantic-swatch-checker"></div>
        <div class="semantic-swatch-fill" style="background:${n};"></div>
      </div>
      <div class="semantic-info">
        <div class="semantic-name">${e}</div>
        <div class="semantic-token">${t}</div>
        <div class="semantic-value">${n}</div>
        ${i?`<span class="token-cssvar">${i}</span>`:``}
        ${o?`<span class="token-desc">${o}</span>`:``}
      </div>
    </div>`}function b(e){return`<span class="role-badge ${e===`Background`?`role-bg`:e===`Text`?`role-text`:e===`Border`?`role-border`:`role-icon`}">${e===`Background`?`bg`:e===`Text`?`text`:e===`Border`?`border`:`icon`}</span>`}function x(e){let t=a(e);return`<div>
    <span class="comp-token-name">${e}</span>
    ${t?`<span class="token-cssvar">${t}</span>`:``}
  </div>`}function S(){return Object.entries(n).filter(([e])=>e.startsWith(`CdrColor`)).map(([e,t])=>[e,String(t)])}function C(e){let t=e.match(/^CdrColor(Background|Text|Border|Icon)/);return t?t[1]:`Other`}function w(e){let t=C(e),n=e.replace(`CdrColor${t}`,``).match(/^([A-Z][a-z]+(?:[A-Z][a-z]+)?)/);return n?n[1]:`Other`}function T(e,t){return`
    <div class="sb-section-header">
      <h2 class="sb-section-title">${e}</h2>
      <span class="sb-section-count">${t}</span>
    </div>`}var E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{t(),s(),l(),d(),p(),h(),_(),i(),E={title:`Tokens/Colors`,parameters:{layout:`fullscreen`,controls:{disable:!0}}},D=`
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

    /* ── Token metadata ── */
    .token-cssvar {
      display: block;
      font-family: Pressura, monospace;
      font-size: 8px;
      color: var(--cedar-warm-500);
      margin-top: 2px;
      opacity: 0.85;
    }
    .token-desc {
      display: block;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 9px;
      font-style: italic;
      color: var(--cedar-warm-600);
      line-height: 1.4;
      margin-top: 2px;
    }

    /* ── Mobile tweaks ── */
    @media (max-width: 480px) {
      .comp-table .comp-value { display: none; }
      .comp-table th:last-child { display: none; }
    }
  </style>
`,O={name:`Palette`,render:()=>{let e=S(),t=[...new Set(e.map(([,e])=>e))].sort(),n=t.map(e=>`
        <div class="palette-chip" title="${e}">
          <div class="palette-chip-inner" style="background:${e};"></div>
        </div>`).join(``);return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`Unique Colors`,t.length)}
        <p style="font-size:13px;color:var(--cedar-warm-750);margin:0 0 20px;line-height:1.6;">
          ${e.length} total tokens resolve to ${t.length} unique color values across the Cedar design system.
          Hover a chip to see the raw value.
        </p>
        <div class="palette-strip">${n}</div>
      </div>
    </div>`}},k={name:`Semantic`,render:()=>{let e=n,t=e=>Object.entries(e).filter(([,e])=>typeof e==`string`).map(([e,t])=>[e.replace(/^CdrColor/,``).replace(/([A-Z])/g,` $1`).trim(),e,t]),r=t(g),i=t(o),a=t(c),s=t(u),l=t(f),d=t(m),p=[[`Primary text`,`CdrColorTextPrimary`,e.CdrColorTextPrimary],[`Secondary text`,`CdrColorTextSecondary`,e.CdrColorTextSecondary],[`Emphasis text`,`CdrColorTextEmphasis`,e.CdrColorTextEmphasis],[`Inverse text`,`CdrColorTextInverse`,e.CdrColorTextInverse],[`Disabled text`,`CdrColorTextDisabled`,e.CdrColorTextDisabled],[`Brand text`,`CdrColorTextBrand`,e.CdrColorTextBrand],[`Error text`,`CdrColorTextError`,e.CdrColorTextError],[`Warning text`,`CdrColorTextWarning`,e.CdrColorTextWarning],[`Success text`,`CdrColorTextSuccess`,e.CdrColorTextSuccess],[`Info text`,`CdrColorTextInfo`,e.CdrColorTextInfo],[`Sale text`,`CdrColorTextSale`,e.CdrColorTextSale]],h=[[`Primary border`,`CdrColorBorderPrimary`,e.CdrColorBorderPrimary],[`Secondary border`,`CdrColorBorderSecondary`,e.CdrColorBorderSecondary],[`Error border`,`CdrColorBorderError`,e.CdrColorBorderError],[`Warning border`,`CdrColorBorderWarning`,e.CdrColorBorderWarning],[`Success border`,`CdrColorBorderSuccess`,e.CdrColorBorderSuccess],[`Info border`,`CdrColorBorderInfo`,e.CdrColorBorderInfo],[`Transparent`,`CdrColorBorderTransparent`,e.CdrColorBorderTransparent]],_=[[`Default icon`,`CdrColorIconDefault`,e.CdrColorIconDefault],[`Emphasis icon`,`CdrColorIconEmphasis`,e.CdrColorIconEmphasis],[`Disabled icon`,`CdrColorIconDisabled`,e.CdrColorIconDisabled],[`Link icon`,`CdrColorIconLink`,e.CdrColorIconLink],[`Error icon`,`CdrColorIconMessageError`,e.CdrColorIconMessageError],[`Warning icon`,`CdrColorIconMessageWarning`,e.CdrColorIconMessageWarning],[`Success icon`,`CdrColorIconMessageSuccess`,e.CdrColorIconMessageSuccess],[`Info icon`,`CdrColorIconMessageInfo`,e.CdrColorIconMessageInfo]],v=e=>`<div class="semantic-grid">${e.map(([e,t,n])=>y(e,t,n)).join(``)}</div>`;return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`Surface`,r.length)}
        ${v(r)}
      </div>
      <div class="sb-section">
        ${T(`Text`,p.length)}
        ${v(p)}
      </div>
      <div class="sb-section">
        ${T(`Border`,h.length)}
        ${v(h)}
      </div>
      <div class="sb-section">
        ${T(`Icon`,_.length)}
        ${v(_)}
      </div>
      <div class="sb-section">
        ${T(`Action`,i.length)}
        ${v(i)}
      </div>
      <div class="sb-section">
        ${T(`Control`,a.length)}
        ${v(a)}
      </div>
      <div class="sb-section">
        ${T(`Feedback`,s.length)}
        ${v(s)}
      </div>
      <div class="sb-section">
        ${T(`Graphik`,l.length)}
        ${v(l)}
      </div>
      <div class="sb-section">
        ${T(`Selection`,d.length)}
        ${v(d)}
      </div>
    </div>`}},A={name:`By Component`,render:()=>{let e=S(),t={};e.forEach(([e,n])=>{let r=w(e);t[r]||(t[r]=[]),t[r].push([e,n])});let n=Object.entries(t).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>{let n=t.map(([e,t])=>{let n=C(e);return`
              <tr>
                <td>
                  <div class="comp-swatch-cell">
                    ${v(t)}
                    ${x(e)}
                  </div>
                </td>
                <td>${b(n)}</td>
                <td class="comp-value">${t}</td>
              </tr>`}).join(``);return`
          <div class="comp-section">
            <p class="comp-section-label">${e} <span style="font-weight:400;opacity:0.6;">(${t.length})</span></p>
            <table class="comp-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Role</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>${n}</tbody>
            </table>
          </div>`}).join(``);return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`All Color Tokens by Component`,e.length)}
        ${n}
      </div>
    </div>`}},j={name:`Text`,render:()=>{let e=S().filter(([e])=>e.startsWith(`CdrColorText`)),t=e.map(([e,t])=>`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${v(t)}
              ${x(e)}
            </div>
          </td>
          <td>
            <span style="color:${t};font-family:Graphik,sans-serif;font-size:13px;font-weight:600;
              text-shadow: 0 0 6px rgba(0,0,0,0.06);">
              Aa
            </span>
          </td>
          <td class="comp-value">${t}</td>
        </tr>`).join(``);return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`Text Colors`,e.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${t}</tbody>
        </table>
      </div>
    </div>`}},M={name:`Border`,render:()=>{let e=S().filter(([e])=>e.startsWith(`CdrColorBorder`)),t=e.map(([e,t])=>`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${v(t)}
              ${x(e)}
            </div>
          </td>
          <td>
            <div style="width:48px;height:24px;border-radius:4px;border:2px solid ${t};"></div>
          </td>
          <td class="comp-value">${t}</td>
        </tr>`).join(``);return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`Border Colors`,e.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${t}</tbody>
        </table>
      </div>
    </div>`}},N={name:`Icon`,render:()=>{let e=S().filter(([e])=>e.startsWith(`CdrColorIcon`)),t=e.map(([e,t])=>`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              ${v(t)}
              ${x(e)}
            </div>
          </td>
          <td>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="${t}" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm.75-10.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z"/>
            </svg>
          </td>
          <td class="comp-value">${t}</td>
        </tr>`).join(``);return`${D}<div class="sb-page">
      <div class="sb-section">
        ${T(`Icon Colors`,e.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>${t}</tbody>
        </table>
      </div>
    </div>`}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Palette',
  render: () => {
    const entries = allTokens();
    const unique = [...new Set(entries.map(([, v]) => v))].sort();
    const chips = unique.map(v => \`
        <div class="palette-chip" title="\${v}">
          <div class="palette-chip-inner" style="background:\${v};"></div>
        </div>\`).join('');

    // Deduplicate for display: group by hue family manually
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('Unique Colors', unique.length)}
        <p style="font-size:13px;color:var(--cedar-warm-750);margin:0 0 20px;line-height:1.6;">
          \${entries.length} total tokens resolve to \${unique.length} unique color values across the Cedar design system.
          Hover a chip to see the raw value.
        </p>
        <div class="palette-strip">\${chips}</div>
      </div>
    </div>\`;
  }
}`,...O.parameters?.docs?.source},description:{story:`Full palette of unique color values`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Semantic',
  render: () => {
    const t = tokens as Record<string, string>;
    const familyTokens = (source: Record<string, string>): [string, string, string][] => Object.entries(source).filter(([, v]) => typeof v === 'string').map(([key, value]) => [key.replace(/^CdrColor/, '').replace(/([A-Z])/g, ' $1').trim(), key, value]);
    const surfaceTokens: [string, string, string][] = familyTokens(CdrColorSurface);
    const actionTokens: [string, string, string][] = familyTokens(CdrColorAction);
    const controlTokens: [string, string, string][] = familyTokens(CdrColorControl);
    const feedbackTokens: [string, string, string][] = familyTokens(CdrColorFeedback);
    const graphikTokens: [string, string, string][] = familyTokens(CdrColorGraphik);
    const selectionTokens: [string, string, string][] = familyTokens(CdrColorSelection);
    const textTokens: [string, string, string][] = [['Primary text', 'CdrColorTextPrimary', t.CdrColorTextPrimary], ['Secondary text', 'CdrColorTextSecondary', t.CdrColorTextSecondary], ['Emphasis text', 'CdrColorTextEmphasis', t.CdrColorTextEmphasis], ['Inverse text', 'CdrColorTextInverse', t.CdrColorTextInverse], ['Disabled text', 'CdrColorTextDisabled', t.CdrColorTextDisabled], ['Brand text', 'CdrColorTextBrand', t.CdrColorTextBrand], ['Error text', 'CdrColorTextError', t.CdrColorTextError], ['Warning text', 'CdrColorTextWarning', t.CdrColorTextWarning], ['Success text', 'CdrColorTextSuccess', t.CdrColorTextSuccess], ['Info text', 'CdrColorTextInfo', t.CdrColorTextInfo], ['Sale text', 'CdrColorTextSale', t.CdrColorTextSale]];
    const borderTokens: [string, string, string][] = [['Primary border', 'CdrColorBorderPrimary', t.CdrColorBorderPrimary], ['Secondary border', 'CdrColorBorderSecondary', t.CdrColorBorderSecondary], ['Error border', 'CdrColorBorderError', t.CdrColorBorderError], ['Warning border', 'CdrColorBorderWarning', t.CdrColorBorderWarning], ['Success border', 'CdrColorBorderSuccess', t.CdrColorBorderSuccess], ['Info border', 'CdrColorBorderInfo', t.CdrColorBorderInfo], ['Transparent', 'CdrColorBorderTransparent', t.CdrColorBorderTransparent]];
    const iconTokens: [string, string, string][] = [['Default icon', 'CdrColorIconDefault', t.CdrColorIconDefault], ['Emphasis icon', 'CdrColorIconEmphasis', t.CdrColorIconEmphasis], ['Disabled icon', 'CdrColorIconDisabled', t.CdrColorIconDisabled], ['Link icon', 'CdrColorIconLink', t.CdrColorIconLink], ['Error icon', 'CdrColorIconMessageError', t.CdrColorIconMessageError], ['Warning icon', 'CdrColorIconMessageWarning', t.CdrColorIconMessageWarning], ['Success icon', 'CdrColorIconMessageSuccess', t.CdrColorIconMessageSuccess], ['Info icon', 'CdrColorIconMessageInfo', t.CdrColorIconMessageInfo]];
    const grid = (items: [string, string, string][]) => \`<div class="semantic-grid">\${items.map(([l, k, v]) => semanticCard(l, k, v)).join('')}</div>\`;
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('Surface', surfaceTokens.length)}
        \${grid(surfaceTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Text', textTokens.length)}
        \${grid(textTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Border', borderTokens.length)}
        \${grid(borderTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Icon', iconTokens.length)}
        \${grid(iconTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Action', actionTokens.length)}
        \${grid(actionTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Control', controlTokens.length)}
        \${grid(controlTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Feedback', feedbackTokens.length)}
        \${grid(feedbackTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Graphik', graphikTokens.length)}
        \${grid(graphikTokens)}
      </div>
      <div class="sb-section">
        \${sectionHeader('Selection', selectionTokens.length)}
        \${grid(selectionTokens)}
      </div>
    </div>\`;
  }
}`,...k.parameters?.docs?.source},description:{story:`Semantic color tokens — the small set designers use most`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
    const sections = sorted.map(([comp, rows]) => {
      const tableRows = rows.map(([key, val]) => {
        const role = getRole(key);
        return \`
              <tr>
                <td>
                  <div class="comp-swatch-cell">
                    \${swatchCell(val)}
                    \${compNameCell(key)}
                  </div>
                </td>
                <td>\${roleBadge(role)}</td>
                <td class="comp-value">\${val}</td>
              </tr>\`;
      }).join('');
      return \`
          <div class="comp-section">
            <p class="comp-section-label">\${comp} <span style="font-weight:400;opacity:0.6;">(\${rows.length})</span></p>
            <table class="comp-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Role</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>\${tableRows}</tbody>
            </table>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('All Color Tokens by Component', entries.length)}
        \${sections}
      </div>
    </div>\`;
  }
}`,...A.parameters?.docs?.source},description:{story:`All tokens organized by component group, showing role (bg/text/border/icon) per row`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'Text',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorText'));
    const tableRows = entries.map(([key, val]) => \`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              \${swatchCell(val)}
              \${compNameCell(key)}
            </div>
          </td>
          <td>
            <span style="color:\${val};font-family:Graphik,sans-serif;font-size:13px;font-weight:600;
              text-shadow: 0 0 6px rgba(0,0,0,0.06);">
              Aa
            </span>
          </td>
          <td class="comp-value">\${val}</td>
        </tr>\`).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('Text Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>\${tableRows}</tbody>
        </table>
      </div>
    </div>\`;
  }
}`,...j.parameters?.docs?.source},description:{story:`Text tokens only`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Border',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorBorder'));
    const tableRows = entries.map(([key, val]) => \`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              \${swatchCell(val)}
              \${compNameCell(key)}
            </div>
          </td>
          <td>
            <div style="width:48px;height:24px;border-radius:4px;border:2px solid \${val};"></div>
          </td>
          <td class="comp-value">\${val}</td>
        </tr>\`).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('Border Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>\${tableRows}</tbody>
        </table>
      </div>
    </div>\`;
  }
}`,...M.parameters?.docs?.source},description:{story:`Border tokens only`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Icon',
  render: () => {
    const entries = allTokens().filter(([k]) => k.startsWith('CdrColorIcon'));
    const tableRows = entries.map(([key, val]) => \`
        <tr>
          <td>
            <div class="comp-swatch-cell">
              \${swatchCell(val)}
              \${compNameCell(key)}
            </div>
          </td>
          <td>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="\${val}" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm.75-10.25h-1.5v4.5l3.75 2.25.75-1.23-3-1.77v-3.75z"/>
            </svg>
          </td>
          <td class="comp-value">\${val}</td>
        </tr>\`).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        \${sectionHeader('Icon Colors', entries.length)}
        <table class="comp-table">
          <thead><tr><th>Token</th><th>Preview</th><th>Value</th></tr></thead>
          <tbody>\${tableRows}</tbody>
        </table>
      </div>
    </div>\`;
  }
}`,...N.parameters?.docs?.source},description:{story:`Icon tokens only`,...N.parameters?.docs?.description}}},P=[`Palette`,`Semantic`,`ByComponent`,`TextColors`,`BorderColors`,`IconColors`]})))()}F();export{M as BorderColors,A as ByComponent,N as IconColors,O as Palette,k as Semantic,j as TextColors,P as __namedExportsOrder,E as default};
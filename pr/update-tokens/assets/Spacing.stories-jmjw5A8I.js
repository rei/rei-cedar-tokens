import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r,t as i}from"./token-metadata-VEx4GjYE.js";function a(e){return e.endsWith(`rem`)?parseFloat(e)*16:(e.endsWith(`px`),parseFloat(e))}function o(e){let t=e.match(/^clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*$/);if(!t)return null;let[,n,r,i]=t,o=r.trim().match(/([\d.]+c[qw][iwh])/)?.[1]??``;return{min:a(n.trim()),max:a(i.trim()),ideal:r.trim(),slope:o,raw:e}}function s(e){return e.includes(`clamp`)?o(e)?.max??0:e.endsWith(`rem`)?parseFloat(e)*16:(e.endsWith(`px`),parseFloat(e))}function c(e,t,n){let r=s(t),a=n>0?Math.max(r/n*100,.5):0,o=t.endsWith(`px`)||t===`0`?t:`${r}px`,c=i(e);return`
    <div class="srow">
      <span class="srow-name">${e}${c?`<span class="token-cssvar">${c}</span>`:``}</span>
      <div class="srow-track"><div class="srow-fill" style="width:${a}%"></div></div>
      <span class="srow-value">${o}</span>
    </div>`}function l(e,t,n){let r=s(t),a=Math.max(Math.round(r/n*18),2),o=8+a*2,c=t.endsWith(`px`)||t===`0`?t:`${r}px`,l=i(e);return`
    <div class="irow">
      <span class="irow-name">${e}${l?`<span class="token-cssvar">${l}</span>`:``}</span>
      <div class="irow-box-wrap">
        <div class="irow-box" style="width:${o}px;height:${o}px;padding:${a}px;">
          <div class="irow-box-inner"></div>
        </div>
      </div>
      <span class="irow-value">${c}</span>
    </div>`}function u(e,t,n){let r=o(t);if(!r)return``;let{min:a,max:s,slope:c,raw:l}=r,u=s-a,d=Math.round(u),f=n>0?a/n*100:0,p=n>0?u/n*100:0,m=f+p/2,h=i(e);return`
    <div class="fcard">
      <div class="fcard-header">
        <span class="fcard-name">${e}</span>
        ${c?`<span class="fcard-slope">${c}</span>`:``}
      </div>
      ${h?`<span class="token-cssvar" style="margin-top:-6px;">${h}</span>`:``}

      <div class="fcard-range-wrap">
        <div class="fcard-track">
          <div class="fcard-range-fill" style="left:${f}%;width:${p}%"></div>
          <div class="fcard-mid-tick"   style="left:${m}%"></div>
        </div>
        <div class="fcard-range-labels">
          <span class="fcard-range-label">0</span>
          <span class="fcard-range-label">${Math.round(n)}px</span>
        </div>
      </div>

      <div class="fcard-dims">
        <div class="fcard-dim">
          <span class="fcard-dim-label">min</span>
          <span class="fcard-dim-value">${Math.round(a)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">max</span>
          <span class="fcard-dim-value">${Math.round(s)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">range</span>
          <span class="fcard-dim-value fcard-dim-range">+${d}px</span>
        </div>
      </div>

      <div class="fcard-raw">${l}</div>
    </div>`}function d(e,t,n,r){return`
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${e}</h2>
        <span class="sb-section-count">${r}</span>
      </div>
      ${t?`<p class="sb-section-desc">${t}</p>`:``}
      ${n}
    </div>`}function f(e){return Object.entries(n).filter(([t])=>t.startsWith(e)).map(([e,t])=>[e,String(t)])}var p,m,h,g,_,v,y;function b(){return(b=e((()=>{t(),r(),p={title:`Tokens/Spacing`,parameters:{layout:`fullscreen`,controls:{disable:!0}}},m=`
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
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
    .token-cssvar {
      display: block;
      font-family: Pressura, monospace;
      font-size: 8px;
      color: var(--cedar-warm-500);
      margin-top: 2px;
      opacity: 0.85;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
`,h={name:`Base Scale`,render:()=>{let e=f(`CdrSpace`).filter(([e])=>!e.startsWith(`CdrSpaceScale`)&&!e.startsWith(`CdrSpaceInset`)),t=Math.max(...e.map(([,e])=>s(e))),n=e.map(([e,n])=>c(e,n,t)).join(``);return`${m}<div class="sb-page">${d(`Base Spacing`,`Fixed pixel values. Bar width is proportional to the token value.`,n,e.length)}</div>`}},g={name:`Fluid Scale`,render:()=>{let e=f(`CdrSpaceScale`),t=Math.max(...e.map(([,e])=>o(e)?.max??0)),n=e.map(([e,n])=>u(e,n,t)).join(``);return`${m}<div class="sb-page">${d(`Fluid Space Scale`,`Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow from <strong>min</strong> to <strong>max</strong> as the container widens. The bar shows where each token's range sits relative to the largest token.`,`<div class="fluid-grid">${n}</div>`,e.length)}</div>`}},_={name:`Inset`,render:()=>{let e=f(`CdrSpaceInset`),t=Math.max(...e.map(([,e])=>s(e))),n=e.map(([e,n])=>l(e,n,t)).join(``);return`${m}<div class="sb-page">${d(`Inset Spacing`,`Padding tokens. The box preview scales proportionally to the token value.`,n,e.length)}</div>`}},v={name:`All Spacing`,render:()=>{let e=f(`CdrSpace`).filter(([e])=>!e.startsWith(`CdrSpaceScale`)&&!e.startsWith(`CdrSpaceInset`)),t=f(`CdrSpaceScale`),n=f(`CdrSpaceInset`),r=Math.max(...e.map(([,e])=>s(e))),i=Math.max(...t.map(([,e])=>o(e)?.max??0)),a=Math.max(...n.map(([,e])=>s(e))),p=e.map(([e,t])=>c(e,t,r)).join(``),h=t.map(([e,t])=>u(e,t,i)).join(``),g=n.map(([e,t])=>l(e,t,a)).join(``);return`${m}<div class="sb-page">
      ${d(`Base Spacing`,`Fixed pixel values.`,p,e.length)}
      ${d(`Fluid Space Scale`,`Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow with the container.`,`<div class="fluid-grid">${h}</div>`,t.length)}
      ${d(`Inset Spacing`,`Padding tokens — box preview scales proportionally.`,g,n.length)}
    </div>`}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Base Scale',
  render: () => {
    const base = getTokens('CdrSpace').filter(([k]) => !k.startsWith('CdrSpaceScale') && !k.startsWith('CdrSpaceInset'));
    const maxPx = Math.max(...base.map(([, v]) => valueToPx(v)));
    const rows = base.map(([n, v]) => staticRow(n, v, maxPx)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Base Spacing', 'Fixed pixel values. Bar width is proportional to the token value.', rows, base.length)}</div>\`;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Fluid Scale',
  render: () => {
    const fluid = getTokens('CdrSpaceScale');
    const absMax = Math.max(...fluid.map(([, v]) => parseClamp(v)?.max ?? 0));
    const cards = fluid.map(([n, v]) => fluidCard(n, v, absMax)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Fluid Space Scale', 'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow from <strong>min</strong> to <strong>max</strong> as the container widens. The bar shows where each token\\'s range sits relative to the largest token.', \`<div class="fluid-grid">\${cards}</div>\`, fluid.length)}</div>\`;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Inset',
  render: () => {
    const inset = getTokens('CdrSpaceInset');
    const maxPx = Math.max(...inset.map(([, v]) => valueToPx(v)));
    const rows = inset.map(([n, v]) => insetRow(n, v, maxPx)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Inset Spacing', 'Padding tokens. The box preview scales proportionally to the token value.', rows, inset.length)}</div>\`;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'All Spacing',
  render: () => {
    const base = getTokens('CdrSpace').filter(([k]) => !k.startsWith('CdrSpaceScale') && !k.startsWith('CdrSpaceInset'));
    const fluid = getTokens('CdrSpaceScale');
    const inset = getTokens('CdrSpaceInset');
    const baseMax = Math.max(...base.map(([, v]) => valueToPx(v)));
    const fluidMax = Math.max(...fluid.map(([, v]) => parseClamp(v)?.max ?? 0));
    const insetMax = Math.max(...inset.map(([, v]) => valueToPx(v)));
    const baseRows = base.map(([n, v]) => staticRow(n, v, baseMax)).join('');
    const fluidCards = fluid.map(([n, v]) => fluidCard(n, v, fluidMax)).join('');
    const insetRows = inset.map(([n, v]) => insetRow(n, v, insetMax)).join('');
    return \`\${chrome}<div class="sb-page">
      \${section('Base Spacing', 'Fixed pixel values.', baseRows, base.length)}
      \${section('Fluid Space Scale', 'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow with the container.', \`<div class="fluid-grid">\${fluidCards}</div>\`, fluid.length)}
      \${section('Inset Spacing', 'Padding tokens — box preview scales proportionally.', insetRows, inset.length)}
    </div>\`;
  }
}`,...v.parameters?.docs?.source}}},y=[`BaseSpacing`,`FluidSpacing`,`InsetSpacing`,`AllSpacing`]})))()}b();export{v as AllSpacing,h as BaseSpacing,g as FluidSpacing,_ as InsetSpacing,y as __namedExportsOrder,p as default};
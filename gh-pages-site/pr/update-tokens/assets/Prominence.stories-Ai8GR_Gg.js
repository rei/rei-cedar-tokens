import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,r,t as i}from"./token-metadata-VEx4GjYE.js";var a,o,s,c,l;function u(){return(u=e((()=>{t(),r(),a={title:`Tokens/Prominence (Shadow)`,parameters:{layout:`fullscreen`,controls:{disable:!0}}},o=`
  <style>
    .sb-section { margin-bottom: 56px; }
    .sb-section-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 32px;
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

    /* ─── Shadow showcase ─── */
    .shadow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 32px;
    }
    .shadow-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .shadow-stage {
      /* Generous padding so shadow is never clipped */
      padding: 24px;
      background: #f0ede6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shadow-box {
      width: 80px;
      height: 80px;
      background: #fff;
      border-radius: 6px;
    }
    .shadow-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .shadow-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-1000);
    }
    .shadow-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      word-break: break-all;
    }
    .shadow-value {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
      word-break: break-all;
      line-height: 1.5;
    }

    /* ─── Full prominence listing ─── */
    .prominence-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: start;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
      min-width: 0;
    }
    .prominence-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .prominence-swatch {
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .prominence-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .prominence-name {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-1000);
      word-break: break-word;
      overflow-wrap: anywhere;
    }
    .prominence-val {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      word-break: break-all;
      line-height: 1.5;
    }
    .token-cssvar {
      display: block;
      font-family: Pressura, monospace;
      font-size: 8px;
      color: var(--cedar-warm-500);
      margin-top: 2px;
      opacity: 0.85;
    }
    .prominence-row-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    @media (max-width: 480px) {
      .prominence-row { grid-template-columns: 1fr; }
    }
  </style>
`,s={name:`Showcase`,render:()=>{let e=n,t=[[`CdrProminenceFlat`,`flat`],[`CdrProminenceRaised`,`raised`],[`CdrProminenceElevated`,`elevated`],[`CdrProminenceFloating`,`floating`],[`CdrProminenceLifted`,`lifted`]],r=t.map(([t,n])=>{let r=e[t]??`none`,a=i(t);return`
          <div class="shadow-card">
            <div class="shadow-stage">
              <div class="shadow-box" style="box-shadow: ${r};"></div>
            </div>
            <div class="shadow-info">
              <span class="shadow-label">${n}</span>
              <span class="shadow-token">${t}</span>
              ${a?`<span class="token-cssvar">${a}</span>`:``}
              <span class="shadow-value">${r}</span>
            </div>
          </div>`}).join(``);return`${o}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Prominence (Box Shadow)</h2>
          <span class="sb-section-count">${t.length}</span>
        </div>
        <div class="shadow-grid">${r}</div>
      </div>
    </div>`}},c={name:`All Prominence Tokens`,render:()=>{let e=Object.entries(n).filter(([e])=>e.startsWith(`CdrProminence`)).map(([e,t])=>[e,String(t)]),t=e.map(([e,t])=>`
          <div class="prominence-row">
            <span class="prominence-name">${e}${i(e)?`<span class="token-cssvar">${i(e)}</span>`:``}</span>
            <div class="prominence-row-inner">
              <div class="prominence-swatch" style="box-shadow: ${t};"></div>
              <span class="prominence-val">${t}</span>
            </div>
          </div>`).join(``);return`${o}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">All Prominence Tokens</h2>
          <span class="sb-section-count">${e.length}</span>
        </div>
        <div>${t}</div>
      </div>
    </div>`}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Showcase',
  render: () => {
    const t = tokens as Record<string, string>;
    const shadows: [string, string][] = [['CdrProminenceFlat', 'flat'], ['CdrProminenceRaised', 'raised'], ['CdrProminenceElevated', 'elevated'], ['CdrProminenceFloating', 'floating'], ['CdrProminenceLifted', 'lifted']];
    const cards = shadows.map(([key, label]) => {
      const val = t[key] ?? 'none';
      const cssvar = getCssVar(key);
      return \`
          <div class="shadow-card">
            <div class="shadow-stage">
              <div class="shadow-box" style="box-shadow: \${val};"></div>
            </div>
            <div class="shadow-info">
              <span class="shadow-label">\${label}</span>
              <span class="shadow-token">\${key}</span>
              \${cssvar ? \`<span class="token-cssvar">\${cssvar}</span>\` : ''}
              <span class="shadow-value">\${val}</span>
            </div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Prominence (Box Shadow)</h2>
          <span class="sb-section-count">\${shadows.length}</span>
        </div>
        <div class="shadow-grid">\${cards}</div>
      </div>
    </div>\`;
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'All Prominence Tokens',
  render: () => {
    const allProminence = Object.entries(tokens).filter(([key]) => key.startsWith('CdrProminence')).map(([key, value]) => [key, String(value)]) as [string, string][];
    const rows = allProminence.map(([key, val]) => {
      return \`
          <div class="prominence-row">
            <span class="prominence-name">\${key}\${getCssVar(key) ? \`<span class="token-cssvar">\${getCssVar(key)}</span>\` : ''}</span>
            <div class="prominence-row-inner">
              <div class="prominence-swatch" style="box-shadow: \${val};"></div>
              <span class="prominence-val">\${val}</span>
            </div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">All Prominence Tokens</h2>
          <span class="sb-section-count">\${allProminence.length}</span>
        </div>
        <div>\${rows}</div>
      </div>
    </div>\`;
  }
}`,...c.parameters?.docs?.source}}},l=[`Prominence`,`AllProminence`]})))()}u();export{c as AllProminence,s as Prominence,l as __namedExportsOrder,a as default};
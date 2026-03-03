import { t as M } from "./cdr-tokens-IdpEO1Fb.js";
const z = {
  title: "Tokens/Spacing",
  parameters: { layout: "fullscreen", controls: { disable: !0 } },
};
function S(a) {
  return a.endsWith("rem")
    ? parseFloat(a) * 16
    : (a.endsWith("px"), parseFloat(a));
}
function w(a) {
  const e = a.match(/^clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*$/);
  if (!e) return null;
  const [, r, s, n] = e,
    t = s.trim().match(/([\d.]+c[qw][iwh])/)?.[1] ?? "";
  return {
    min: S(r.trim()),
    max: S(n.trim()),
    ideal: s.trim(),
    slope: t,
    raw: a,
  };
}
function p(a) {
  return a.includes("clamp")
    ? (w(a)?.max ?? 0)
    : a.endsWith("rem")
      ? parseFloat(a) * 16
      : (a.endsWith("px"), parseFloat(a));
}
const h = `
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
`;
function y(a, e, r) {
  const s = p(e),
    n = r > 0 ? Math.max((s / r) * 100, 0.5) : 0,
    t = e.endsWith("px") || e === "0" ? e : `${s}px`;
  return `
    <div class="srow">
      <span class="srow-name">${a}</span>
      <div class="srow-track"><div class="srow-fill" style="width:${n}%"></div></div>
      <span class="srow-value">${t}</span>
    </div>`;
}
function k(a, e, r) {
  const s = p(e),
    n = Math.max(Math.round((s / r) * 18), 2),
    t = 8 + n * 2,
    c = e.endsWith("px") || e === "0" ? e : `${s}px`;
  return `
    <div class="irow">
      <span class="irow-name">${a}</span>
      <div class="irow-box-wrap">
        <div class="irow-box" style="width:${t}px;height:${t}px;padding:${n}px;">
          <div class="irow-box-inner"></div>
        </div>
      </div>
      <span class="irow-value">${c}</span>
    </div>`;
}
function $(a, e, r) {
  const s = w(e);
  if (!s) return "";
  const { min: n, max: t, slope: c, raw: v } = s,
    m = t - n,
    i = Math.round(m),
    o = r > 0 ? (n / r) * 100 : 0,
    b = r > 0 ? (m / r) * 100 : 0,
    P = o + b / 2;
  return `
    <div class="fcard">
      <div class="fcard-header">
        <span class="fcard-name">${a}</span>
        ${c ? `<span class="fcard-slope">${c}</span>` : ""}
      </div>

      <div class="fcard-range-wrap">
        <div class="fcard-track">
          <div class="fcard-range-fill" style="left:${o}%;width:${b}%"></div>
          <div class="fcard-mid-tick"   style="left:${P}%"></div>
        </div>
        <div class="fcard-range-labels">
          <span class="fcard-range-label">0</span>
          <span class="fcard-range-label">${Math.round(r)}px</span>
        </div>
      </div>

      <div class="fcard-dims">
        <div class="fcard-dim">
          <span class="fcard-dim-label">min</span>
          <span class="fcard-dim-value">${Math.round(n)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">max</span>
          <span class="fcard-dim-value">${Math.round(t)}px</span>
        </div>
        <div class="fcard-dim">
          <span class="fcard-dim-label">range</span>
          <span class="fcard-dim-value fcard-dim-range">+${i}px</span>
        </div>
      </div>

      <div class="fcard-raw">${v}</div>
    </div>`;
}
function d(a, e, r, s) {
  return `
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${a}</h2>
        <span class="sb-section-count">${s}</span>
      </div>
      ${e ? `<p class="sb-section-desc">${e}</p>` : ""}
      ${r}
    </div>`;
}
function l(a) {
  return Object.entries(M)
    .filter(([e]) => e.startsWith(a))
    .map(([e, r]) => [e, String(r)]);
}
const f = {
    name: "Base Scale",
    render: () => {
      const a = l("CdrSpace").filter(
          ([s]) =>
            !s.startsWith("CdrSpaceScale") && !s.startsWith("CdrSpaceInset"),
        ),
        e = Math.max(...a.map(([, s]) => p(s))),
        r = a.map(([s, n]) => y(s, n, e)).join("");
      return `${h}<div class="sb-page">${d("Base Spacing", "Fixed pixel values. Bar width is proportional to the token value.", r, a.length)}</div>`;
    },
  },
  x = {
    name: "Fluid Scale",
    render: () => {
      const a = l("CdrSpaceScale"),
        e = Math.max(...a.map(([, s]) => w(s)?.max ?? 0)),
        r = a.map(([s, n]) => $(s, n, e)).join("");
      return `${h}<div class="sb-page">${d("Fluid Space Scale", `Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow from <strong>min</strong> to <strong>max</strong> as the container widens. The bar shows where each token's range sits relative to the largest token.`, `<div class="fluid-grid">${r}</div>`, a.length)}</div>`;
    },
  },
  g = {
    name: "Inset",
    render: () => {
      const a = l("CdrSpaceInset"),
        e = Math.max(...a.map(([, s]) => p(s))),
        r = a.map(([s, n]) => k(s, n, e)).join("");
      return `${h}<div class="sb-page">${d("Inset Spacing", "Padding tokens. The box preview scales proportionally to the token value.", r, a.length)}</div>`;
    },
  },
  u = {
    name: "All Spacing",
    render: () => {
      const a = l("CdrSpace").filter(
          ([i]) =>
            !i.startsWith("CdrSpaceScale") && !i.startsWith("CdrSpaceInset"),
        ),
        e = l("CdrSpaceScale"),
        r = l("CdrSpaceInset"),
        s = Math.max(...a.map(([, i]) => p(i))),
        n = Math.max(...e.map(([, i]) => w(i)?.max ?? 0)),
        t = Math.max(...r.map(([, i]) => p(i))),
        c = a.map(([i, o]) => y(i, o, s)).join(""),
        v = e.map(([i, o]) => $(i, o, n)).join(""),
        m = r.map(([i, o]) => k(i, o, t)).join("");
      return `${h}<div class="sb-page">
      ${d("Base Spacing", "Fixed pixel values.", c, a.length)}
      ${d("Fluid Space Scale", 'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow with the container.', `<div class="fluid-grid">${v}</div>`, e.length)}
      ${d("Inset Spacing", "Padding tokens — box preview scales proportionally.", m, r.length)}
    </div>`;
    },
  };
f.parameters = {
  ...f.parameters,
  docs: {
    ...f.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Base Scale',
  render: () => {
    const base = getTokens('CdrSpace').filter(([k]) => !k.startsWith('CdrSpaceScale') && !k.startsWith('CdrSpaceInset'));
    const maxPx = Math.max(...base.map(([, v]) => valueToPx(v)));
    const rows = base.map(([n, v]) => staticRow(n, v, maxPx)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Base Spacing', 'Fixed pixel values. Bar width is proportional to the token value.', rows, base.length)}</div>\`;
  }
}`,
      ...f.parameters?.docs?.source,
    },
  },
};
x.parameters = {
  ...x.parameters,
  docs: {
    ...x.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Fluid Scale',
  render: () => {
    const fluid = getTokens('CdrSpaceScale');
    const absMax = Math.max(...fluid.map(([, v]) => parseClamp(v)?.max ?? 0));
    const cards = fluid.map(([n, v]) => fluidCard(n, v, absMax)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Fluid Space Scale', 'Values use <code style="font-family:Pressura,monospace;font-size:11px;">clamp(min, ideal, max)</code> — they grow from <strong>min</strong> to <strong>max</strong> as the container widens. The bar shows where each token\\'s range sits relative to the largest token.', \`<div class="fluid-grid">\${cards}</div>\`, fluid.length)}</div>\`;
  }
}`,
      ...x.parameters?.docs?.source,
    },
  },
};
g.parameters = {
  ...g.parameters,
  docs: {
    ...g.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Inset',
  render: () => {
    const inset = getTokens('CdrSpaceInset');
    const maxPx = Math.max(...inset.map(([, v]) => valueToPx(v)));
    const rows = inset.map(([n, v]) => insetRow(n, v, maxPx)).join('');
    return \`\${chrome}<div class="sb-page">\${section('Inset Spacing', 'Padding tokens. The box preview scales proportionally to the token value.', rows, inset.length)}</div>\`;
  }
}`,
      ...g.parameters?.docs?.source,
    },
  },
};
u.parameters = {
  ...u.parameters,
  docs: {
    ...u.parameters?.docs,
    source: {
      originalSource: `{
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
}`,
      ...u.parameters?.docs?.source,
    },
  },
};
const T = ["BaseSpacing", "FluidSpacing", "InsetSpacing", "AllSpacing"];
export {
  u as AllSpacing,
  f as BaseSpacing,
  x as FluidSpacing,
  g as InsetSpacing,
  T as __namedExportsOrder,
  z as default,
};

import { t as v } from "./cdr-tokens-IdpEO1Fb.js";
const b = {
    title: "Tokens/Motion",
    parameters: { layout: "fullscreen", controls: { disable: !0 } },
  },
  g = `
  <style>
    .sb-section { margin-bottom: 56px; }
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
      font-weight: 400;
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-100);
      border-radius: 20px;
      padding: 2px 8px;
    }

    /* ─── Duration rows ─── */
    .dur-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) 64px;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
      min-width: 0;
    }
    .dur-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .dur-name {
      font-family: Pressura, monospace;
      font-size: 12px;
      color: var(--cedar-warm-1000);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* The bar track is constrained by the 1fr column — no overflow possible */
    .dur-bar-track {
      width: 100%;
      height: 8px;
      background: var(--cedar-warm-100);
      border-radius: 99px;
      overflow: hidden;
      min-width: 0;
    }
    .dur-bar-fill {
      height: 100%;
      background: var(--cedar-green-900);
      border-radius: 99px;
      transition: width 0.3s ease;
    }
    .dur-value {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-750);
      text-align: right;
      white-space: nowrap;
    }
    @media (max-width: 400px) {
      .dur-row { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
      .dur-value { display: none; }
    }

    /* ─── Timing function cards ─── */
    .timing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .timing-card {
      background: var(--cedar-bg-secondary);
      border: 1px solid var(--cedar-warm-100);
      border-radius: 8px;
      padding: 20px 20px 16px;
      overflow: hidden;
    }
    /* Animation track — fixed, no overflow */
    .timing-track {
      position: relative;
      height: 32px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .timing-dot {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: var(--cedar-green-900);
      border-radius: 50%;
      /* Animation applied via JS below */
    }
    .timing-name {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--cedar-warm-1000);
      margin-bottom: 4px;
    }
    .timing-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      margin-bottom: 2px;
    }
    .timing-value {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-750);
      word-break: break-all;
    }
  </style>
  <style>
    @keyframes cedar-slide {
      0%   { left: 0; }
      100% { left: calc(100% - 20px); }
    }
  </style>
`;
function u(a, i, n) {
  return `
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${a}</h2>
        <span class="sb-section-count">${n}</span>
      </div>
      ${i}
    </div>`;
}
const c = {
    name: "Duration",
    render: () => {
      const a = v,
        i = [
          ["CdrDuration1X", "1x"],
          ["CdrDuration2X", "2x"],
          ["CdrDuration3X", "3x"],
          ["CdrDuration4X", "4x"],
          ["CdrDuration5X", "5x"],
          ["CdrDuration6X", "6x"],
        ],
        n = Math.max(...i.map(([s]) => parseInt(a[s] ?? "0") || 0)),
        r = i
          .map(([s, o]) => {
            const t = a[s] ?? "0",
              d = parseInt(t) || 0,
              e = n > 0 ? Math.max((d / n) * 100, 1) : 0;
            return `
          <div class="dur-row">
            <span class="dur-name">duration-${o}</span>
            <div class="dur-bar-track">
              <div class="dur-bar-fill" style="width: ${e}%;"></div>
            </div>
            <span class="dur-value">${t}ms</span>
          </div>`;
          })
          .join("");
      return `${g}<div class="sb-page">${u("Duration", r, i.length)}</div>`;
    },
  },
  l = {
    name: "Timing Functions",
    render: () => {
      const a = v,
        i = [
          ["CdrTimingFunctionEaseOut", "ease-out"],
          ["CdrTimingFunctionEase", "ease"],
          ["CdrTimingFunctionLinear", "linear"],
        ],
        n = i
          .map(([r, s]) => {
            const o = a[r] ?? "ease";
            return `
          <div class="timing-card">
            <div class="timing-track">
              <div class="timing-dot" style="animation: cedar-slide 2s ${o} infinite alternate;"></div>
            </div>
            <div class="timing-name">timing-function-${s}</div>
            <div class="timing-token">${r}</div>
            <div class="timing-value">${o}</div>
          </div>`;
          })
          .join("");
      return `${g}<div class="sb-page">${u("Timing Functions", `<div class="timing-grid">${n}</div>`, i.length)}</div>`;
    },
  },
  m = {
    name: "All Motion",
    render: () => {
      const a = v,
        i = [
          ["CdrDuration1X", "1x"],
          ["CdrDuration2X", "2x"],
          ["CdrDuration3X", "3x"],
          ["CdrDuration4X", "4x"],
          ["CdrDuration5X", "5x"],
          ["CdrDuration6X", "6x"],
        ],
        n = [
          ["CdrTimingFunctionEaseOut", "ease-out"],
          ["CdrTimingFunctionEase", "ease"],
          ["CdrTimingFunctionLinear", "linear"],
        ],
        r = Math.max(...i.map(([t]) => parseInt(a[t] ?? "0") || 0)),
        s = i
          .map(([t, d]) => {
            const e = a[t] ?? "0",
              p = parseInt(e) || 0,
              x = r > 0 ? Math.max((p / r) * 100, 1) : 0;
            return `
          <div class="dur-row">
            <span class="dur-name">duration-${d}</span>
            <div class="dur-bar-track">
              <div class="dur-bar-fill" style="width: ${x}%;"></div>
            </div>
            <span class="dur-value">${e}ms</span>
          </div>`;
          })
          .join(""),
        o = n
          .map(([t, d]) => {
            const e = a[t] ?? "ease";
            return `
          <div class="timing-card">
            <div class="timing-track">
              <div class="timing-dot" style="animation: cedar-slide 2s ${e} infinite alternate;"></div>
            </div>
            <div class="timing-name">timing-function-${d}</div>
            <div class="timing-token">${t}</div>
            <div class="timing-value">${e}</div>
          </div>`;
          })
          .join("");
      return `${g}<div class="sb-page">
      ${u("Duration", s, i.length)}
      ${u("Timing Functions", `<div class="timing-grid">${o}</div>`, n.length)}
    </div>`;
    },
  };
c.parameters = {
  ...c.parameters,
  docs: {
    ...c.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Duration',
  render: () => {
    const t = tokens as Record<string, string>;
    const durations: [string, string][] = [['CdrDuration1X', '1x'], ['CdrDuration2X', '2x'], ['CdrDuration3X', '3x'], ['CdrDuration4X', '4x'], ['CdrDuration5X', '5x'], ['CdrDuration6X', '6x']];
    const maxMs = Math.max(...durations.map(([k]) => parseInt(t[k] ?? '0') || 0));
    const rows = durations.map(([key, label]) => {
      const val = t[key] ?? '0';
      const ms = parseInt(val) || 0;
      const pct = maxMs > 0 ? Math.max(ms / maxMs * 100, 1) : 0;
      return \`
          <div class="dur-row">
            <span class="dur-name">duration-\${label}</span>
            <div class="dur-bar-track">
              <div class="dur-bar-fill" style="width: \${pct}%;"></div>
            </div>
            <span class="dur-value">\${val}ms</span>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">\${section('Duration', rows, durations.length)}</div>\`;
  }
}`,
      ...c.parameters?.docs?.source,
    },
  },
};
l.parameters = {
  ...l.parameters,
  docs: {
    ...l.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Timing Functions',
  render: () => {
    const t = tokens as Record<string, string>;
    const timings: [string, string][] = [['CdrTimingFunctionEaseOut', 'ease-out'], ['CdrTimingFunctionEase', 'ease'], ['CdrTimingFunctionLinear', 'linear']];
    const cards = timings.map(([key, label]) => {
      const val = t[key] ?? 'ease';
      return \`
          <div class="timing-card">
            <div class="timing-track">
              <div class="timing-dot" style="animation: cedar-slide 2s \${val} infinite alternate;"></div>
            </div>
            <div class="timing-name">timing-function-\${label}</div>
            <div class="timing-token">\${key}</div>
            <div class="timing-value">\${val}</div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">\${section('Timing Functions', \`<div class="timing-grid">\${cards}</div>\`, timings.length)}</div>\`;
  }
}`,
      ...l.parameters?.docs?.source,
    },
  },
};
m.parameters = {
  ...m.parameters,
  docs: {
    ...m.parameters?.docs,
    source: {
      originalSource: `{
  name: 'All Motion',
  render: () => {
    const t = tokens as Record<string, string>;
    const durations: [string, string][] = [['CdrDuration1X', '1x'], ['CdrDuration2X', '2x'], ['CdrDuration3X', '3x'], ['CdrDuration4X', '4x'], ['CdrDuration5X', '5x'], ['CdrDuration6X', '6x']];
    const timings: [string, string][] = [['CdrTimingFunctionEaseOut', 'ease-out'], ['CdrTimingFunctionEase', 'ease'], ['CdrTimingFunctionLinear', 'linear']];
    const maxMs = Math.max(...durations.map(([k]) => parseInt(t[k] ?? '0') || 0));
    const durationRows = durations.map(([key, label]) => {
      const val = t[key] ?? '0';
      const ms = parseInt(val) || 0;
      const pct = maxMs > 0 ? Math.max(ms / maxMs * 100, 1) : 0;
      return \`
          <div class="dur-row">
            <span class="dur-name">duration-\${label}</span>
            <div class="dur-bar-track">
              <div class="dur-bar-fill" style="width: \${pct}%;"></div>
            </div>
            <span class="dur-value">\${val}ms</span>
          </div>\`;
    }).join('');
    const timingCards = timings.map(([key, label]) => {
      const val = t[key] ?? 'ease';
      return \`
          <div class="timing-card">
            <div class="timing-track">
              <div class="timing-dot" style="animation: cedar-slide 2s \${val} infinite alternate;"></div>
            </div>
            <div class="timing-name">timing-function-\${label}</div>
            <div class="timing-token">\${key}</div>
            <div class="timing-value">\${val}</div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      \${section('Duration', durationRows, durations.length)}
      \${section('Timing Functions', \`<div class="timing-grid">\${timingCards}</div>\`, timings.length)}
    </div>\`;
  }
}`,
      ...m.parameters?.docs?.source,
    },
  },
};
const h = ["Duration", "TimingFunctions", "AllMotion"];
export {
  m as AllMotion,
  c as Duration,
  l as TimingFunctions,
  h as __namedExportsOrder,
  b as default,
};

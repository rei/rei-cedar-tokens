import { t as m } from "./cdr-tokens-IdpEO1Fb.js";
const g = {
    title: "Tokens/Breakpoints",
    parameters: { layout: "fullscreen", controls: { disable: !0 } },
  },
  v = `
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
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-100);
      border-radius: 20px;
      padding: 2px 8px;
    }

    /* ─── Breakpoint rows ─── */
    .bp-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .bp-row {
      display: grid;
      grid-template-columns: 72px 1fr minmax(0, 90px);
      align-items: center;
      gap: 16px;
      min-width: 0;
    }
    .bp-label-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .bp-abbrev {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-1000);
      line-height: 1;
    }
    .bp-name {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 10px;
      color: var(--cedar-warm-600);
    }
    .bp-bar-track {
      height: 10px;
      background: var(--cedar-warm-100);
      border-radius: 99px;
      overflow: hidden;
    }
    .bp-bar-fill {
      height: 100%;
      border-radius: 99px;
      background: var(--cedar-green-900);
    }
    .bp-value-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: right;
      min-width: 0;
    }
    .bp-px {
      font-family: Pressura, monospace;
      font-size: 13px;
      color: var(--cedar-warm-1000);
    }
    .bp-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bp-range {
      font-family: Pressura, monospace;
      font-size: 9px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
    }

    /* ─── Visual device mockup ─── */
    .bp-devices {
      margin-top: 40px;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }
    .bp-device {
      border: 2px solid var(--cedar-warm-250);
      border-radius: 4px;
      background: var(--cedar-bg-secondary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 6px;
      gap: 4px;
    }
    .bp-device-label {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
    }
  </style>
`,
  e = {
    name: "All Breakpoints",
    render: () => {
      const o = m,
        r = [
          ["CdrBreakpointXs", "xs", "Extra Small", "0–767px"],
          ["CdrBreakpointSm", "sm", "Small", "768–991px"],
          ["CdrBreakpointMd", "md", "Medium", "992–1231px"],
          ["CdrBreakpointLg", "lg", "Large", "1232px+"],
        ],
        l = 1232,
        c = r
          .map(([i, t, n, s]) => {
            const p = o[i] ?? "0",
              a = parseInt(p) || 0,
              b = a === 0 ? 4 : Math.max((a / l) * 100, 4);
            return `
          <div class="bp-row">
            <div class="bp-label-wrap">
              <span class="bp-abbrev">${t}</span>
              <span class="bp-name">${n}</span>
            </div>
            <div class="bp-bar-track">
              <div class="bp-bar-fill" style="width: ${b}%;"></div>
            </div>
            <div class="bp-value-wrap">
              <span class="bp-px">${a === 0 ? "0px" : a + "px"}</span>
              <span class="bp-token">${i}</span>
              <span class="bp-range">${s}</span>
            </div>
          </div>`;
          })
          .join(""),
        d = r
          .map(([i, t, , n], s) => {
            const p = [40, 60, 80, 100];
            return `
          <div class="bp-device" style="width: ${[28, 52, 80, 100][s]}px; height: ${p[s]}px;">
            <span class="bp-device-label">${t}</span>
          </div>`;
          })
          .join("");
      return `${v}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Breakpoints</h2>
          <span class="sb-section-count">${r.length}</span>
        </div>
        <div class="bp-list">${c}</div>
        <div class="bp-devices">${d}</div>
      </div>
    </div>`;
    },
  };
e.parameters = {
  ...e.parameters,
  docs: {
    ...e.parameters?.docs,
    source: {
      originalSource: `{
  name: 'All Breakpoints',
  render: () => {
    const t = tokens as Record<string, string>;
    const breakpoints: [string, string, string, string][] = [['CdrBreakpointXs', 'xs', 'Extra Small', '0–767px'], ['CdrBreakpointSm', 'sm', 'Small', '768–991px'], ['CdrBreakpointMd', 'md', 'Medium', '992–1231px'], ['CdrBreakpointLg', 'lg', 'Large', '1232px+']];

    // Use 1232 as the reference max (xs shows 0 but we give it a 4% minimum)
    const maxPx = 1232;
    const rows = breakpoints.map(([key, abbrev, name, range]) => {
      const val = t[key] ?? '0';
      const px = parseInt(val) || 0;
      const pct = px === 0 ? 4 : Math.max(px / maxPx * 100, 4);
      return \`
          <div class="bp-row">
            <div class="bp-label-wrap">
              <span class="bp-abbrev">\${abbrev}</span>
              <span class="bp-name">\${name}</span>
            </div>
            <div class="bp-bar-track">
              <div class="bp-bar-fill" style="width: \${pct}%;"></div>
            </div>
            <div class="bp-value-wrap">
              <span class="bp-px">\${px === 0 ? '0px' : px + 'px'}</span>
              <span class="bp-token">\${key}</span>
              <span class="bp-range">\${range}</span>
            </div>
          </div>\`;
    }).join('');

    // Device mockups: heights proportional to breakpoint representation
    const devices = breakpoints.map(([key, abbrev,, range], i) => {
      const val = t[key] ?? '0';
      const px = parseInt(val) || 0;
      // Heights: xs=40, sm=60, md=80, lg=100 (just illustrative)
      const heights = [40, 60, 80, 100];
      const widths = [28, 52, 80, 100];
      return \`
          <div class="bp-device" style="width: \${widths[i]}px; height: \${heights[i]}px;">
            <span class="bp-device-label">\${abbrev}</span>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Breakpoints</h2>
          <span class="sb-section-count">\${breakpoints.length}</span>
        </div>
        <div class="bp-list">\${rows}</div>
        <div class="bp-devices">\${devices}</div>
      </div>
    </div>\`;
  }
}`,
      ...e.parameters?.docs?.source,
    },
  },
};
const f = ["Breakpoints"];
export { e as Breakpoints, f as __namedExportsOrder, g as default };

import { t as n } from "./cdr-tokens-IdpEO1Fb.js";
const p = {
    title: "Tokens/Border Radius",
    parameters: { layout: "fullscreen", controls: { disable: !0 } },
  },
  c = `
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

    /* ─── Radius showcase ─── */
    .radius-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 24px;
    }
    .radius-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .radius-box-wrap {
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--cedar-bg-secondary);
      border-radius: 4px;
    }
    .radius-box {
      width: 80%;
      height: 80%;
      background: var(--cedar-green-900);
    }
    .radius-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--cedar-warm-1000);
    }
    .radius-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
    }
    .radius-value {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-750);
    }
  </style>
`,
  s = {
    name: "All Radius",
    render: () => {
      const d = n,
        a = [
          ["CdrRadiusSharp", "sharp"],
          ["CdrRadiusSoft", "soft"],
          ["CdrRadiusSofter", "softer"],
          ["CdrRadiusSoftest", "softest"],
          ["CdrRadiusRound", "round"],
        ],
        t = a
          .map(([r, o]) => {
            const i = d[r] ?? "0",
              e = i === "9999" ? "9999px" : `${i}px`;
            return `
          <div class="radius-card">
            <div class="radius-box-wrap">
              <div class="radius-box" style="border-radius: ${e};"></div>
            </div>
            <span class="radius-label">${o}</span>
            <span class="radius-token">${r}</span>
            <span class="radius-value">${e}</span>
          </div>`;
          })
          .join("");
      return `${c}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Border Radius</h2>
          <span class="sb-section-count">${a.length}</span>
        </div>
        <div class="radius-grid">${t}</div>
      </div>
    </div>`;
    },
  };
s.parameters = {
  ...s.parameters,
  docs: {
    ...s.parameters?.docs,
    source: {
      originalSource: `{
  name: 'All Radius',
  render: () => {
    const t = tokens as Record<string, string>;
    const radii: [string, string][] = [['CdrRadiusSharp', 'sharp'], ['CdrRadiusSoft', 'soft'], ['CdrRadiusSofter', 'softer'], ['CdrRadiusSoftest', 'softest'], ['CdrRadiusRound', 'round']];
    const cards = radii.map(([key, label]) => {
      const val = t[key] ?? '0';
      const px = val === '9999' ? '9999px' : \`\${val}px\`;
      return \`
          <div class="radius-card">
            <div class="radius-box-wrap">
              <div class="radius-box" style="border-radius: \${px};"></div>
            </div>
            <span class="radius-label">\${label}</span>
            <span class="radius-token">\${key}</span>
            <span class="radius-value">\${px}</span>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Border Radius</h2>
          <span class="sb-section-count">\${radii.length}</span>
        </div>
        <div class="radius-grid">\${cards}</div>
      </div>
    </div>\`;
  }
}`,
      ...s.parameters?.docs?.source,
    },
  },
};
const u = ["BorderRadius"];
export { s as BorderRadius, u as __namedExportsOrder, p as default };

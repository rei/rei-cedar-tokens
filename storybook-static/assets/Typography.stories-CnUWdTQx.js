import { t as v } from "./cdr-tokens-IdpEO1Fb.js";
const F = {
    title: "Tokens/Typography",
    parameters: { layout: "fullscreen", controls: { disable: !0 } },
  },
  d = `
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

    /* ─── Type rows ─── */
    .type-row {
      display: grid;
      grid-template-columns: 1fr minmax(0, 240px);
      align-items: start;
      gap: 24px;
      padding: 16px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .type-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .type-sample {
      color: var(--cedar-warm-1000);
      overflow: hidden;
      /* truncate overlong display headings */
      white-space: nowrap;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .type-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding-top: 2px;
    }
    .type-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-900);
    }
    .type-detail {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      line-height: 1.5;
    }
    .type-family {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
      margin-top: 2px;
    }
    @media (max-width: 600px) {
      .type-row { grid-template-columns: 1fr; }
    }

    /* ─── Font family rows ─── */
    .font-row {
      display: grid;
      grid-template-columns: 1fr minmax(0, 260px);
      align-items: center;
      gap: 24px;
      padding: 16px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .font-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .font-sample {
      font-size: 28px;
      color: var(--cedar-warm-1000);
      line-height: 1.2;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .font-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .font-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-900);
    }
    .font-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
    }
    .font-value {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
      word-break: break-all;
    }
    @media (max-width: 600px) {
      .font-row { grid-template-columns: 1fr; }
    }
  </style>
`;
function $(a) {
  const t = v,
    l = t[`${a}FontFamily`] ?? "",
    i = t[`${a}FontSize`],
    s = t[`${a}FontWeight`],
    o = t[`${a}LineHeight`],
    p = t[`${a}LetterSpacing`],
    g = t[`${a}FontStyle`] ?? "normal",
    y = t[`${a}TextTransform`] ?? "",
    n = [];
  return (
    l && n.push(`font-family: ${l};`),
    i && n.push(`font-size: ${i}px;`),
    s && n.push(`font-weight: ${s};`),
    o && n.push(`line-height: ${o}px;`),
    p && n.push(`letter-spacing: ${p}px;`),
    g && n.push(`font-style: ${g};`),
    y && n.push(`text-transform: ${y};`),
    n.join(" ")
  );
}
function e(a, t, l) {
  const i = v,
    s = i[`${t}FontSize`] ?? "?",
    o = i[`${t}FontWeight`] ?? "?",
    p = i[`${t}LineHeight`] ?? "?",
    g = i[`${t}LetterSpacing`],
    y = i[`${t}FontFamily`] ?? "",
    n = i[`${t}TextTransform`] ?? "",
    H = l ?? "The quick brown fox jumps over the lazy dog";
  return `
    <div class="type-row">
      <div class="type-sample" style="${$(t)}">${H}</div>
      <div class="type-meta">
        <span class="type-label">${a}</span>
        <span class="type-detail">${s}px / ${p}px line-height · weight ${o}</span>
        ${g ? `<span class="type-detail">letter-spacing ${g}px</span>` : ""}
        ${n ? `<span class="type-detail">transform: ${n}</span>` : ""}
        ${y ? `<span class="type-family">${y.split(",")[0].trim()}</span>` : ""}
      </div>
    </div>`;
}
function r(a, t) {
  return `
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${a}</h2>
        <span class="sb-section-count">${t.length}</span>
      </div>
      <div>${t.join("")}</div>
    </div>`;
}
const c = {
    name: "Body",
    render: () =>
      `${d}<div class="sb-page">${r("Body Text", [e("text-default", "CdrTextDefault"), e("text-body / 300", "CdrTextBody300"), e("text-body / 400", "CdrTextBody400"), e("text-body / 500", "CdrTextBody500"), e("text-body-strong / 300", "CdrTextBodyStrong300"), e("text-body-strong / 400", "CdrTextBodyStrong400"), e("text-body-strong / 500", "CdrTextBodyStrong500")])}</div>`,
  },
  x = {
    name: "Headings — Sans",
    render: () =>
      `${d}<div class="sb-page">${r("Heading Sans", [e("text-heading-sans / 200", "CdrTextHeadingSans200", "Heading Sans 200"), e("text-heading-sans / 300", "CdrTextHeadingSans300", "Heading Sans 300"), e("text-heading-sans / 400", "CdrTextHeadingSans400", "Heading Sans 400"), e("text-heading-sans / 500", "CdrTextHeadingSans500", "Heading Sans 500"), e("text-heading-sans / 600", "CdrTextHeadingSans600", "Heading Sans 600")])}</div>`,
  },
  S = {
    name: "Headings — Serif",
    render: () =>
      `${d}<div class="sb-page">${r("Heading Serif", [e("text-heading-serif / 200", "CdrTextHeadingSerif200", "Heading Serif 200"), e("text-heading-serif / 300", "CdrTextHeadingSerif300", "Heading Serif 300"), e("text-heading-serif / 400", "CdrTextHeadingSerif400", "Heading Serif 400"), e("text-heading-serif / 500", "CdrTextHeadingSerif500", "Heading Serif 500"), e("text-heading-serif / 600", "CdrTextHeadingSerif600", "Heading Serif 600"), e("text-heading-serif / 700", "CdrTextHeadingSerif700", "Heading Serif 700"), e("text-heading-serif / 800", "CdrTextHeadingSerif800", "Heading Serif 800"), e("text-heading-serif / 900", "CdrTextHeadingSerif900", "Heading Serif 900"), e("text-heading-serif / 1000", "CdrTextHeadingSerif1000", "Heading Serif 1000"), e("text-heading-serif / 1100", "CdrTextHeadingSerif1100", "Heading Serif 1100"), e("text-heading-serif / 1200", "CdrTextHeadingSerif1200", "Heading Serif 1200")])}</div>`,
  },
  f = {
    name: "Headings — Serif Strong",
    render: () =>
      `${d}<div class="sb-page">${r("Heading Serif Strong", [e("text-heading-serif-strong / 600", "CdrTextHeadingSerifStrong600", "Heading Serif Strong 600"), e("text-heading-serif-strong / 700", "CdrTextHeadingSerifStrong700", "Heading Serif Strong 700"), e("text-heading-serif-strong / 800", "CdrTextHeadingSerifStrong800", "Heading Serif Strong 800"), e("text-heading-serif-strong / 900", "CdrTextHeadingSerifStrong900", "Heading Serif Strong 900"), e("text-heading-serif-strong / 1000", "CdrTextHeadingSerifStrong1000", "Heading Serif Strong 1000"), e("text-heading-serif-strong / 1100", "CdrTextHeadingSerifStrong1100", "Heading Serif Strong 1100"), e("text-heading-serif-strong / 1200", "CdrTextHeadingSerifStrong1200", "Heading Serif Strong 1200")])}</div>`,
  },
  m = {
    name: "Headings — Display",
    render: () =>
      `${d}<div class="sb-page">${r("Heading Display", [e("text-heading-display / 800", "CdrTextHeadingDisplay800", "Display 800"), e("text-heading-display / 900", "CdrTextHeadingDisplay900", "Display 900"), e("text-heading-display / 1000", "CdrTextHeadingDisplay1000", "Display 1000"), e("text-heading-display / 1100", "CdrTextHeadingDisplay1100", "Display 1100"), e("text-heading-display / 1200", "CdrTextHeadingDisplay1200", "Display 1200"), e("text-heading-display / 1300", "CdrTextHeadingDisplay1300", "Display 1300"), e("text-heading-display / 1400", "CdrTextHeadingDisplay1400", "Display 1400"), e("text-heading-display / 1500", "CdrTextHeadingDisplay1500", "Display 1500"), e("text-heading-display / 1600", "CdrTextHeadingDisplay1600", "Display 1600")])}</div>`,
  },
  u = {
    name: "Subheadings",
    render: () =>
      `${d}<div class="sb-page">${r("Subheading Sans", [e("text-subheading-sans / 300", "CdrTextSubheadingSans300", "Subheading 300"), e("text-subheading-sans / 400", "CdrTextSubheadingSans400", "Subheading 400"), e("text-subheading-sans / 500", "CdrTextSubheadingSans500", "Subheading 500"), e("text-subheading-sans / 600", "CdrTextSubheadingSans600", "Subheading 600")])}</div>`,
  },
  T = {
    name: "Utility — Sans",
    render: () => `${d}<div class="sb-page">
      ${r("Utility Sans", [e("text-utility-sans / 100", "CdrTextUtilitySans100"), e("text-utility-sans / 200", "CdrTextUtilitySans200"), e("text-utility-sans / 300", "CdrTextUtilitySans300"), e("text-utility-sans / 400", "CdrTextUtilitySans400"), e("text-utility-sans / 500", "CdrTextUtilitySans500"), e("text-utility-sans / 600", "CdrTextUtilitySans600"), e("text-utility-sans / 700", "CdrTextUtilitySans700"), e("text-utility-sans / 800", "CdrTextUtilitySans800")])}
      ${r("Utility Sans Strong", [e("text-utility-sans-strong / 100", "CdrTextUtilitySansStrong100"), e("text-utility-sans-strong / 200", "CdrTextUtilitySansStrong200"), e("text-utility-sans-strong / 300", "CdrTextUtilitySansStrong300"), e("text-utility-sans-strong / 400", "CdrTextUtilitySansStrong400"), e("text-utility-sans-strong / 500", "CdrTextUtilitySansStrong500"), e("text-utility-sans-strong / 600", "CdrTextUtilitySansStrong600"), e("text-utility-sans-strong / 700", "CdrTextUtilitySansStrong700"), e("text-utility-sans-strong / 800", "CdrTextUtilitySansStrong800")])}
    </div>`,
  },
  h = {
    name: "Utility — Serif",
    render: () => `${d}<div class="sb-page">
      ${r("Utility Serif", [e("text-utility-serif / 200", "CdrTextUtilitySerif200"), e("text-utility-serif / 300", "CdrTextUtilitySerif300"), e("text-utility-serif / 400", "CdrTextUtilitySerif400"), e("text-utility-serif / 500", "CdrTextUtilitySerif500"), e("text-utility-serif / 600", "CdrTextUtilitySerif600"), e("text-utility-serif / 700", "CdrTextUtilitySerif700"), e("text-utility-serif / 800", "CdrTextUtilitySerif800")])}
      ${r("Utility Serif Strong", [e("text-utility-serif-strong / 200", "CdrTextUtilitySerifStrong200"), e("text-utility-serif-strong / 300", "CdrTextUtilitySerifStrong300"), e("text-utility-serif-strong / 400", "CdrTextUtilitySerifStrong400"), e("text-utility-serif-strong / 500", "CdrTextUtilitySerifStrong500"), e("text-utility-serif-strong / 600", "CdrTextUtilitySerifStrong600"), e("text-utility-serif-strong / 700", "CdrTextUtilitySerifStrong700"), e("text-utility-serif-strong / 800", "CdrTextUtilitySerifStrong800")])}
    </div>`,
  },
  C = {
    name: "Eyebrow",
    render: () =>
      `${d}<div class="sb-page">${r("Eyebrow", [e("text-eyebrow / 100", "CdrTextEyebrow100", "Eyebrow Label")])}</div>`,
  },
  w = {
    name: "Font Families",
    render: () => {
      const a = v,
        t = [
          ["CdrFontFamilySerifBrandFont", "Serif Brand Font"],
          ["CdrFontFamilySerif", "Serif"],
          ["CdrFontFamilySansBrandFont", "Sans Brand Font"],
          ["CdrFontFamilySans", "Sans"],
          ["CdrFontFamilyMonoBrandFont", "Mono Brand Font"],
        ],
        l = t
          .map(([i, s]) => {
            const o = a[i] ?? "";
            return `
          <div class="font-row">
            <div class="font-sample" style="font-family: ${o}">Aa Bb Cc 123 — The Trail Awaits</div>
            <div class="font-meta">
              <span class="font-label">${s}</span>
              <span class="font-token">${i}</span>
              <span class="font-value">${o}</span>
            </div>
          </div>`;
          })
          .join("");
      return `${d}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Font Families</h2>
          <span class="sb-section-count">${t.length}</span>
        </div>
        <div>${l}</div>
      </div>
    </div>`;
    },
  },
  b = {
    name: "Fluid Type Scale",
    render: () => {
      const a = v,
        t = Object.keys(a).filter((i) => i.startsWith("CdrTypeScale"));
      t.map((i) => {
        const s = i.replace("CdrTypeScale", "type-scale-");
        return e(s, i.replace("CdrTypeScale", "CdrTextTypeScale"));
      }).join("");
      const l = t
        .map((i) => {
          const s = a[i] ?? "",
            o = i.replace("CdrTypeScale", "scale-");
          return `
          <div class="type-row">
            <div class="type-sample" style="font-size: ${s}; font-family: Stuart, Georgia, serif; line-height: 1.2;">${o}</div>
            <div class="type-meta">
              <span class="type-label">${i}</span>
              <span class="type-detail">${s}</span>
            </div>
          </div>`;
        })
        .join("");
      return `${d}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Fluid Type Scale</h2>
          <span class="sb-section-count">${t.length}</span>
        </div>
        <div>${l}</div>
      </div>
    </div>`;
    },
  };
c.parameters = {
  ...c.parameters,
  docs: {
    ...c.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Body',
  render: () => \`\${chrome}<div class="sb-page">\${section('Body Text', [typeRow('text-default', 'CdrTextDefault'), typeRow('text-body / 300', 'CdrTextBody300'), typeRow('text-body / 400', 'CdrTextBody400'), typeRow('text-body / 500', 'CdrTextBody500'), typeRow('text-body-strong / 300', 'CdrTextBodyStrong300'), typeRow('text-body-strong / 400', 'CdrTextBodyStrong400'), typeRow('text-body-strong / 500', 'CdrTextBodyStrong500')])}</div>\`
}`,
      ...c.parameters?.docs?.source,
    },
  },
};
x.parameters = {
  ...x.parameters,
  docs: {
    ...x.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Headings — Sans',
  render: () => \`\${chrome}<div class="sb-page">\${section('Heading Sans', [typeRow('text-heading-sans / 200', 'CdrTextHeadingSans200', 'Heading Sans 200'), typeRow('text-heading-sans / 300', 'CdrTextHeadingSans300', 'Heading Sans 300'), typeRow('text-heading-sans / 400', 'CdrTextHeadingSans400', 'Heading Sans 400'), typeRow('text-heading-sans / 500', 'CdrTextHeadingSans500', 'Heading Sans 500'), typeRow('text-heading-sans / 600', 'CdrTextHeadingSans600', 'Heading Sans 600')])}</div>\`
}`,
      ...x.parameters?.docs?.source,
    },
  },
};
S.parameters = {
  ...S.parameters,
  docs: {
    ...S.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Headings — Serif',
  render: () => \`\${chrome}<div class="sb-page">\${section('Heading Serif', [typeRow('text-heading-serif / 200', 'CdrTextHeadingSerif200', 'Heading Serif 200'), typeRow('text-heading-serif / 300', 'CdrTextHeadingSerif300', 'Heading Serif 300'), typeRow('text-heading-serif / 400', 'CdrTextHeadingSerif400', 'Heading Serif 400'), typeRow('text-heading-serif / 500', 'CdrTextHeadingSerif500', 'Heading Serif 500'), typeRow('text-heading-serif / 600', 'CdrTextHeadingSerif600', 'Heading Serif 600'), typeRow('text-heading-serif / 700', 'CdrTextHeadingSerif700', 'Heading Serif 700'), typeRow('text-heading-serif / 800', 'CdrTextHeadingSerif800', 'Heading Serif 800'), typeRow('text-heading-serif / 900', 'CdrTextHeadingSerif900', 'Heading Serif 900'), typeRow('text-heading-serif / 1000', 'CdrTextHeadingSerif1000', 'Heading Serif 1000'), typeRow('text-heading-serif / 1100', 'CdrTextHeadingSerif1100', 'Heading Serif 1100'), typeRow('text-heading-serif / 1200', 'CdrTextHeadingSerif1200', 'Heading Serif 1200')])}</div>\`
}`,
      ...S.parameters?.docs?.source,
    },
  },
};
f.parameters = {
  ...f.parameters,
  docs: {
    ...f.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Headings — Serif Strong',
  render: () => \`\${chrome}<div class="sb-page">\${section('Heading Serif Strong', [typeRow('text-heading-serif-strong / 600', 'CdrTextHeadingSerifStrong600', 'Heading Serif Strong 600'), typeRow('text-heading-serif-strong / 700', 'CdrTextHeadingSerifStrong700', 'Heading Serif Strong 700'), typeRow('text-heading-serif-strong / 800', 'CdrTextHeadingSerifStrong800', 'Heading Serif Strong 800'), typeRow('text-heading-serif-strong / 900', 'CdrTextHeadingSerifStrong900', 'Heading Serif Strong 900'), typeRow('text-heading-serif-strong / 1000', 'CdrTextHeadingSerifStrong1000', 'Heading Serif Strong 1000'), typeRow('text-heading-serif-strong / 1100', 'CdrTextHeadingSerifStrong1100', 'Heading Serif Strong 1100'), typeRow('text-heading-serif-strong / 1200', 'CdrTextHeadingSerifStrong1200', 'Heading Serif Strong 1200')])}</div>\`
}`,
      ...f.parameters?.docs?.source,
    },
  },
};
m.parameters = {
  ...m.parameters,
  docs: {
    ...m.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Headings — Display',
  render: () => \`\${chrome}<div class="sb-page">\${section('Heading Display', [typeRow('text-heading-display / 800', 'CdrTextHeadingDisplay800', 'Display 800'), typeRow('text-heading-display / 900', 'CdrTextHeadingDisplay900', 'Display 900'), typeRow('text-heading-display / 1000', 'CdrTextHeadingDisplay1000', 'Display 1000'), typeRow('text-heading-display / 1100', 'CdrTextHeadingDisplay1100', 'Display 1100'), typeRow('text-heading-display / 1200', 'CdrTextHeadingDisplay1200', 'Display 1200'), typeRow('text-heading-display / 1300', 'CdrTextHeadingDisplay1300', 'Display 1300'), typeRow('text-heading-display / 1400', 'CdrTextHeadingDisplay1400', 'Display 1400'), typeRow('text-heading-display / 1500', 'CdrTextHeadingDisplay1500', 'Display 1500'), typeRow('text-heading-display / 1600', 'CdrTextHeadingDisplay1600', 'Display 1600')])}</div>\`
}`,
      ...m.parameters?.docs?.source,
    },
  },
};
u.parameters = {
  ...u.parameters,
  docs: {
    ...u.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Subheadings',
  render: () => \`\${chrome}<div class="sb-page">\${section('Subheading Sans', [typeRow('text-subheading-sans / 300', 'CdrTextSubheadingSans300', 'Subheading 300'), typeRow('text-subheading-sans / 400', 'CdrTextSubheadingSans400', 'Subheading 400'), typeRow('text-subheading-sans / 500', 'CdrTextSubheadingSans500', 'Subheading 500'), typeRow('text-subheading-sans / 600', 'CdrTextSubheadingSans600', 'Subheading 600')])}</div>\`
}`,
      ...u.parameters?.docs?.source,
    },
  },
};
T.parameters = {
  ...T.parameters,
  docs: {
    ...T.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Utility — Sans',
  render: () => \`\${chrome}<div class="sb-page">
      \${section('Utility Sans', [typeRow('text-utility-sans / 100', 'CdrTextUtilitySans100'), typeRow('text-utility-sans / 200', 'CdrTextUtilitySans200'), typeRow('text-utility-sans / 300', 'CdrTextUtilitySans300'), typeRow('text-utility-sans / 400', 'CdrTextUtilitySans400'), typeRow('text-utility-sans / 500', 'CdrTextUtilitySans500'), typeRow('text-utility-sans / 600', 'CdrTextUtilitySans600'), typeRow('text-utility-sans / 700', 'CdrTextUtilitySans700'), typeRow('text-utility-sans / 800', 'CdrTextUtilitySans800')])}
      \${section('Utility Sans Strong', [typeRow('text-utility-sans-strong / 100', 'CdrTextUtilitySansStrong100'), typeRow('text-utility-sans-strong / 200', 'CdrTextUtilitySansStrong200'), typeRow('text-utility-sans-strong / 300', 'CdrTextUtilitySansStrong300'), typeRow('text-utility-sans-strong / 400', 'CdrTextUtilitySansStrong400'), typeRow('text-utility-sans-strong / 500', 'CdrTextUtilitySansStrong500'), typeRow('text-utility-sans-strong / 600', 'CdrTextUtilitySansStrong600'), typeRow('text-utility-sans-strong / 700', 'CdrTextUtilitySansStrong700'), typeRow('text-utility-sans-strong / 800', 'CdrTextUtilitySansStrong800')])}
    </div>\`
}`,
      ...T.parameters?.docs?.source,
    },
  },
};
h.parameters = {
  ...h.parameters,
  docs: {
    ...h.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Utility — Serif',
  render: () => \`\${chrome}<div class="sb-page">
      \${section('Utility Serif', [typeRow('text-utility-serif / 200', 'CdrTextUtilitySerif200'), typeRow('text-utility-serif / 300', 'CdrTextUtilitySerif300'), typeRow('text-utility-serif / 400', 'CdrTextUtilitySerif400'), typeRow('text-utility-serif / 500', 'CdrTextUtilitySerif500'), typeRow('text-utility-serif / 600', 'CdrTextUtilitySerif600'), typeRow('text-utility-serif / 700', 'CdrTextUtilitySerif700'), typeRow('text-utility-serif / 800', 'CdrTextUtilitySerif800')])}
      \${section('Utility Serif Strong', [typeRow('text-utility-serif-strong / 200', 'CdrTextUtilitySerifStrong200'), typeRow('text-utility-serif-strong / 300', 'CdrTextUtilitySerifStrong300'), typeRow('text-utility-serif-strong / 400', 'CdrTextUtilitySerifStrong400'), typeRow('text-utility-serif-strong / 500', 'CdrTextUtilitySerifStrong500'), typeRow('text-utility-serif-strong / 600', 'CdrTextUtilitySerifStrong600'), typeRow('text-utility-serif-strong / 700', 'CdrTextUtilitySerifStrong700'), typeRow('text-utility-serif-strong / 800', 'CdrTextUtilitySerifStrong800')])}
    </div>\`
}`,
      ...h.parameters?.docs?.source,
    },
  },
};
C.parameters = {
  ...C.parameters,
  docs: {
    ...C.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Eyebrow',
  render: () => \`\${chrome}<div class="sb-page">\${section('Eyebrow', [typeRow('text-eyebrow / 100', 'CdrTextEyebrow100', 'Eyebrow Label')])}</div>\`
}`,
      ...C.parameters?.docs?.source,
    },
  },
};
w.parameters = {
  ...w.parameters,
  docs: {
    ...w.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Font Families',
  render: () => {
    const t = tokens as Record<string, string>;
    const families: [string, string][] = [['CdrFontFamilySerifBrandFont', 'Serif Brand Font'], ['CdrFontFamilySerif', 'Serif'], ['CdrFontFamilySansBrandFont', 'Sans Brand Font'], ['CdrFontFamilySans', 'Sans'], ['CdrFontFamilyMonoBrandFont', 'Mono Brand Font']];
    const rows = families.map(([key, label]) => {
      const val = t[key] ?? '';
      return \`
          <div class="font-row">
            <div class="font-sample" style="font-family: \${val}">Aa Bb Cc 123 — The Trail Awaits</div>
            <div class="font-meta">
              <span class="font-label">\${label}</span>
              <span class="font-token">\${key}</span>
              <span class="font-value">\${val}</span>
            </div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Font Families</h2>
          <span class="sb-section-count">\${families.length}</span>
        </div>
        <div>\${rows}</div>
      </div>
    </div>\`;
  }
}`,
      ...w.parameters?.docs?.source,
    },
  },
};
b.parameters = {
  ...b.parameters,
  docs: {
    ...b.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Fluid Type Scale',
  render: () => {
    const t = tokens as Record<string, string>;
    const scaleKeys = Object.keys(t).filter(k => k.startsWith('CdrTypeScale'));
    const rows = scaleKeys.map(key => {
      const val = t[key] ?? '';
      const label = key.replace('CdrTypeScale', 'type-scale-');
      return typeRow(label, key.replace('CdrTypeScale', 'CdrTextTypeScale'));
    }).join('');
    // Fluid type scale tokens are raw clamp values, render as sample text at that size
    const scaleRows = scaleKeys.map(key => {
      const val = t[key] ?? '';
      const label = key.replace('CdrTypeScale', 'scale-');
      return \`
          <div class="type-row">
            <div class="type-sample" style="font-size: \${val}; font-family: Stuart, Georgia, serif; line-height: 1.2;">\${label}</div>
            <div class="type-meta">
              <span class="type-label">\${key}</span>
              <span class="type-detail">\${val}</span>
            </div>
          </div>\`;
    }).join('');
    return \`\${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Fluid Type Scale</h2>
          <span class="sb-section-count">\${scaleKeys.length}</span>
        </div>
        <div>\${scaleRows}</div>
      </div>
    </div>\`;
  }
}`,
      ...b.parameters?.docs?.source,
    },
  },
};
const D = [
  "BodyText",
  "HeadingsSans",
  "HeadingsSerif",
  "HeadingsSerifStrong",
  "HeadingsDisplay",
  "SubheadingsSans",
  "UtilitySans",
  "UtilitySerif",
  "EyebrowText",
  "FontFamilies",
  "FluidTypeScale",
];
export {
  c as BodyText,
  C as EyebrowText,
  b as FluidTypeScale,
  w as FontFamilies,
  m as HeadingsDisplay,
  x as HeadingsSans,
  S as HeadingsSerif,
  f as HeadingsSerifStrong,
  u as SubheadingsSans,
  T as UtilitySans,
  h as UtilitySerif,
  D as __namedExportsOrder,
  F as default,
};

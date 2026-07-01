import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Guides/Consumer Contract',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

interface CodeSample {
  title: string;
  language: string;
  code: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface DocsSection {
  id: string;
  heading: string;
  prose: string[];
  codeSamples?: CodeSample[];
  table?: TableData;
  relatedLinks?: string[];
}

interface DocsPageConfig {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  sections: DocsSection[];
}

const pageChrome = `
  <style>
    :root {
      --docs-text-primary: var(--cedar-color-text-primary, #4b4a48);
      --docs-text-secondary: var(--cedar-color-text-secondary, #736e65);
      --docs-bg-page: var(--cedar-color-background-primary, #fafbf9);
      --docs-bg-surface: var(--cedar-color-background-secondary, #f7f5f3);
      --docs-border: rgba(75, 74, 72, 0.16);
      --docs-space-1x: var(--cedar-space-one-x, 8px);
      --docs-space-2x: var(--cedar-space-two-x, 16px);
      --docs-space-3x: var(--cedar-space-three-x, 24px);
      --docs-space-4x: var(--cedar-space-four-x, 32px);
      --docs-heading-lg: var(--cedar-text-heading-sans-700-font-size, 32px);
      --docs-heading-md: var(--cedar-text-heading-sans-400-font-size, 22px);
      --docs-body-size: var(--cedar-text-body-400-font-size, 15px);
    }

    *, *::before, *::after { box-sizing: border-box; }

    .docs-page {
      background: var(--docs-bg-page);
      color: var(--docs-text-primary);
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--docs-space-4x) var(--docs-space-3x) 80px;
    }

    .docs-page-header {
      margin-bottom: var(--docs-space-4x);
    }

    .docs-page-title-row {
      display: flex;
      align-items: center;
      gap: var(--docs-space-2x);
      flex-wrap: wrap;
      margin-bottom: var(--docs-space-2x);
    }

    .docs-page-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: var(--docs-heading-lg);
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--docs-text-primary);
    }

    .docs-badge {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--docs-border);
      background: var(--docs-bg-surface);
      color: var(--docs-text-secondary);
      border-radius: 999px;
      padding: 3px 10px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .docs-page-description {
      margin: 0;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: var(--docs-body-size);
      line-height: 1.7;
      color: var(--docs-text-secondary);
      max-width: 70ch;
    }

    .docs-layout {
      display: block;
    }

    .docs-nav {
      display: none;
    }

    .docs-content {
      min-width: 0;
    }

    .docs-section {
      padding-top: var(--docs-space-3x);
      margin-top: var(--docs-space-3x);
      border-top: 1px solid var(--docs-border);
      scroll-margin-top: 16px;
    }

    .docs-section:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }

    .docs-section-heading {
      margin: 0 0 var(--docs-space-2x);
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: var(--docs-heading-md);
      line-height: 1.2;
      color: var(--docs-text-primary);
    }

    .docs-prose {
      margin: 0 0 var(--docs-space-2x);
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: var(--docs-body-size);
      line-height: 1.75;
      color: var(--docs-text-primary);
      max-width: 70ch;
    }

    .docs-related-list {
      margin: 0;
      padding-left: 20px;
      max-width: 70ch;
    }

    .docs-related-list li {
      margin-bottom: 8px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: var(--docs-body-size);
      line-height: 1.6;
      color: var(--docs-text-primary);
    }

    .docs-code-block {
      position: relative;
      margin: 0 0 var(--docs-space-2x);
      background: var(--docs-bg-surface);
      border: 1px solid var(--docs-border);
      border-radius: 10px;
      overflow: hidden;
    }

    .docs-code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--docs-space-1x);
      border-bottom: 1px solid var(--docs-border);
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.65);
    }

    .docs-code-title {
      margin: 0;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: var(--docs-text-secondary);
    }

    .docs-code-meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .docs-code-language {
      font-family: Pressura, monospace;
      font-size: 11px;
      text-transform: lowercase;
      color: var(--docs-text-secondary);
      border: 1px solid var(--docs-border);
      border-radius: 999px;
      padding: 2px 7px;
      background: var(--docs-bg-page);
    }

    .docs-copy-btn {
      border: 1px solid var(--docs-border);
      background: var(--docs-bg-page);
      color: var(--docs-text-secondary);
      border-radius: 7px;
      padding: 4px 8px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 11px;
      line-height: 1;
      cursor: pointer;
    }

    .docs-copy-btn:hover {
      color: var(--docs-text-primary);
    }

    .docs-code {
      margin: 0;
      width: 100%;
      overflow: auto;
      padding: 12px;
      font-family: Pressura, monospace;
      font-size: 12px;
      line-height: 1.7;
      color: #f6f7f4;
      background: #202421;
    }

    .tok-comment { color: #8ba08f; }
    .tok-keyword { color: #85b6ff; }
    .tok-string { color: #d9bf8c; }
    .tok-number { color: #8fd4c1; }
    .tok-operator { color: #b9c4bd; }
    .tok-command { color: #f0c06c; }

    .docs-table-wrap {
      overflow-x: auto;
      margin-bottom: var(--docs-space-2x);
      max-width: 100%;
    }

    .docs-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid var(--docs-border);
      border-radius: 10px;
      overflow: hidden;
      min-width: 420px;
    }

    .docs-table th {
      background: var(--docs-bg-surface);
      color: var(--docs-text-secondary);
      text-align: left;
      padding: 10px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 600;
    }

    .docs-table td {
      padding: 10px;
      border-top: 1px solid var(--docs-border);
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: var(--docs-text-primary);
      vertical-align: top;
    }

    .docs-table tr:nth-child(even) td {
      background: var(--docs-bg-surface);
    }

  </style>
`;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderCodeBlocks(rootId: string, sectionId: string, codeSamples?: CodeSample[]): string {
  if (!codeSamples || codeSamples.length === 0) {
    return '';
  }

  return codeSamples
    .map((sample, idx) => {
      const targetId = `${rootId}-${sectionId}-code-${idx}`;
      return `
        <figure class="docs-code-block">
          <div class="docs-code-header">
            <figcaption class="docs-code-title">${escapeHtml(sample.title)}</figcaption>
            <div class="docs-code-meta">
              <span class="docs-code-language">${escapeHtml(sample.language)}</span>
              <button class="docs-copy-btn" type="button" data-copy-target="${targetId}">Copy</button>
            </div>
          </div>
          <pre class="docs-code" id="${targetId}"><code>${highlightCode(sample.code, sample.language)}</code></pre>
        </figure>
      `;
    })
    .join('');
}

function highlightCode(code: string, language: string): string {
  const escaped = escapeHtml(code);
  const placeholders: string[] = [];

  const stash = (value: string, className: string): string => {
    const idx = placeholders.length;
    placeholders.push(`<span class="${className}">${value}</span>`);
    return `__TOK_${idx}__`;
  };

  let highlighted = escaped;

  const commentPattern = language === 'sh' ? /(^\s*#.*$)/gm : /(\/\/.*$)/gm;
  highlighted = highlighted.replace(commentPattern, (m) => stash(m, 'tok-comment'));

  if (language === 'ts' || language === 'js' || language === 'scss') {
    highlighted = highlighted.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, (m) =>
      stash(m, 'tok-string'),
    );
  }

  if (language === 'sh') {
    highlighted = highlighted.replace(
      /\b(cat|jq|grep|awk|sed|node|npm|pnpm|echo)\b/g,
      '<span class="tok-command">$1</span>',
    );
  } else if (language === 'scss') {
    highlighted = highlighted.replace(
      /(@use|@include|@import|@mixin|@media)\b/g,
      '<span class="tok-keyword">$1</span>',
    );
  } else {
    highlighted = highlighted.replace(
      /\b(import|from|export|const|let|var|return|interface|type|as|new|if|else|for|while|await|async)\b/g,
      '<span class="tok-keyword">$1</span>',
    );
  }

  highlighted = highlighted.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="tok-number">$&</span>');
  highlighted = highlighted.replace(
    /(=>|\|\||&&|===|==|!=|<=|>=)/g,
    '<span class="tok-operator">$1</span>',
  );

  highlighted = highlighted.replace(/__TOK_(\d+)__/g, (_, idx) => placeholders[Number(idx)] ?? '');
  return highlighted;
}

function renderTable(table?: TableData): string {
  if (!table) {
    return '';
  }

  const head = table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  const rows = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  return `
    <div class="docs-table-wrap">
      <table class="docs-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderRelatedLinks(links?: string[]): string {
  if (!links || links.length === 0) {
    return '';
  }

  return `
    <ul class="docs-related-list">
      ${links.map((link) => `<li>${escapeHtml(link)}</li>`).join('')}
    </ul>
  `;
}

function renderDocsPage(config: DocsPageConfig): string {
  const rootId = `docs-page-${config.slug}`;

  const navItems = config.sections
    .map(
      (section) =>
        `<li><a class="docs-nav-link" href="#${section.id}" data-nav-target="${section.id}">${escapeHtml(section.heading)}</a></li>`,
    )
    .join('');

  const sectionsHtml = config.sections
    .map((section) => {
      const prose = section.prose
        .map((line) => `<p class="docs-prose">${escapeHtml(line)}</p>`)
        .join('');
      return `
        <section class="docs-section" id="${section.id}">
          <h2 class="docs-section-heading">${escapeHtml(section.heading)}</h2>
          ${prose}
          ${renderCodeBlocks(rootId, section.id, section.codeSamples)}
          ${renderTable(section.table)}
          ${renderRelatedLinks(section.relatedLinks)}
        </section>
      `;
    })
    .join('');

  const badge = config.badge ? `<span class="docs-badge">${escapeHtml(config.badge)}</span>` : '';

  const script = `
    <script>
      (() => {
        const root = document.getElementById('${rootId}');
        if (!root) return;

        const links = Array.from(root.querySelectorAll('.docs-nav-link'));
        const sections = links
          .map((link) => {
            const id = link.getAttribute('data-nav-target');
            if (!id) return null;
            const section = root.querySelector('#' + id);
            if (!section) return null;
            return { link, section };
          })
          .filter(Boolean);

        const activate = (id) => {
          links.forEach((link) => {
            const target = link.getAttribute('data-nav-target');
            link.classList.toggle('is-active', target === id);
          });
        };

        if (sections.length > 0) {
          activate(sections[0].link.getAttribute('data-nav-target'));
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  activate(entry.target.id);
                }
              });
            },
            {
              rootMargin: '-30% 0px -60% 0px',
              threshold: [0, 1],
            },
          );

          sections.forEach((item) => observer.observe(item.section));
        }

        const copyButtons = root.querySelectorAll('.docs-copy-btn');
        copyButtons.forEach((button) => {
          button.addEventListener('click', async () => {
            const targetId = button.getAttribute('data-copy-target');
            if (!targetId) return;
            const pre = root.querySelector('#' + targetId);
            if (!pre) return;
            const text = pre.textContent || '';
            try {
              await navigator.clipboard.writeText(text);
              const prev = button.textContent;
              button.textContent = 'Copied';
              setTimeout(() => {
                button.textContent = prev || 'Copy';
              }, 1000);
            } catch {
              const prev = button.textContent;
              button.textContent = 'Failed';
              setTimeout(() => {
                button.textContent = prev || 'Copy';
              }, 1000);
            }
          });
        });
      })();
    </script>
  `;

  return `${pageChrome}
    <div class="docs-page" id="${rootId}">
      <header class="docs-page-header">
        <div class="docs-page-title-row">
          <h1 class="docs-page-title">${escapeHtml(config.title)}</h1>
          ${badge}
        </div>
        <p class="docs-page-description">${escapeHtml(config.description)}</p>
      </header>
      <div class="docs-layout">
        <nav class="docs-nav" aria-label="In-page navigation">
          <h2 class="docs-nav-title">On This Page</h2>
          <ul class="docs-nav-list">${navItems}</ul>
        </nav>
        <main class="docs-content">${sectionsHtml}</main>
      </div>
    </div>
    ${script}`;
}

export const Overview: Story = {
  render: () =>
    renderDocsPage({
      slug: 'overview',
      title: 'Consumer Contract',
      description:
        'Cedar publishes design tokens in five output formats. Each format has a defined contract describing what it is, when to use it, and how to import it. This page is your starting point for choosing the right integration path.',
      sections: [
        {
          id: 'what-is-a-contract',
          heading: 'What is a Consumer Contract?',
          prose: [
            "A consumer contract defines the stable surface that your application should couple to. It is separate from Cedar's internal build details — the underlying Style Dictionary pipeline, file structure, and transform logic can evolve without breaking your integration, as long as you stay on the documented contract.",
            'Think of it like depending on an API interface rather than its implementation.',
          ],
        },
        {
          id: 'available-contracts',
          heading: 'Available Contracts',
          prose: [],
          table: {
            headers: ['Contract', 'Package path', 'Best for'],
            rows: [
              [
                'type',
                '@rei/cdr-tokens  /  @rei/cdr-tokens/types/*',
                'TypeScript compile-time safety, IntelliSense',
              ],
              ['css', '@rei/cdr-tokens/css', 'Plain CSS imports, no Sass toolchain'],
              ['scss', '@rei/cdr-tokens/scss', 'Sass workflows, Cedar mixins and utilities'],
              [
                'js',
                '@rei/cdr-tokens  /  @rei/cdr-tokens/tokens',
                'JS/TS app theming, framework mapping',
              ],
              ['json', '@rei/cdr-tokens/json', 'Tooling, pipelines, non-JS environments'],
            ],
          },
        },
        {
          id: 'how-to-choose',
          heading: 'How to Choose',
          prose: [
            'Start here: If you are writing JavaScript or TypeScript application code, use the js contract via the root @rei/cdr-tokens entrypoint. It is the recommended default for long-lived app-level token mappings.',
            'Rule of thumb: pick the narrowest contract that meets your need. Avoid importing from dist/ paths directly unless a specific foundation module is required — use the published package export keys instead.',
          ],
          codeSamples: [
            {
              title: 'Decision tree',
              language: 'sh',
              code: `Are you writing JS/TS app code?
  └─ Yes → js contract (@rei/cdr-tokens)
       └─ Also want compile-time types? → add the type contract

Are you writing stylesheets?
  ├─ Plain CSS → css contract (@rei/cdr-tokens/css)
  └─ Sass/SCSS → scss contract (@rei/cdr-tokens/scss)

Are you building tooling, running transforms, or consuming outside JS?
  └─ json contract (@rei/cdr-tokens/json)`,
            },
          ],
        },
        {
          id: 'installation',
          heading: 'Installation',
          prose: [],
          codeSamples: [
            {
              title: 'Install the package',
              language: 'sh',
              code: `npm install @rei/cdr-tokens`,
            },
          ],
        },
        {
          id: 'quick-examples',
          heading: 'Quick Examples',
          prose: [],
          codeSamples: [
            {
              title: 'App theme mapping — js + semantic root',
              language: 'ts',
              code: `import { CdrColorText, CdrSpace, CdrTextSize } from '@rei/cdr-tokens';

export const appTheme = {
  color: {
    textPrimary: CdrColorText.CdrColorTextPrimary,
  },
  space: {
    stackMd: CdrSpace.CdrSpaceTwoX,
  },
  type: {
    headingMd: CdrTextSize.CdrTextHeadingSans400Size,
  },
};`,
            },
            {
              title: 'Stylesheet integration — css',
              language: 'ts',
              code: `// CSS — no build toolchain required
import '@rei/cdr-tokens/css';`,
            },
            {
              title: 'Stylesheet integration — scss',
              language: 'scss',
              code: `// SCSS — Sass workflow with Cedar utilities
@use '@rei/cdr-tokens/scss';
@use '@rei/cdr-tokens/scss/breakpoint-mixins' as bp;`,
            },
            {
              title: 'Pipeline ingestion — json',
              language: 'ts',
              code: `import webTokens from '@rei/cdr-tokens/json';`,
            },
          ],
        },
        {
          id: 'contract-pages',
          heading: 'Contract Pages',
          prose: [],
          relatedLinks: [
            'type — TypeScript type definitions',
            'css — Prebuilt CSS bundles',
            'scss — Sass outputs and utility mixins',
            'js — JavaScript value contracts (recommended default)',
            'json — Raw token artifacts',
          ],
        },
      ],
    }),
};

export const UsageExamples: Story = {
  render: () =>
    renderDocsPage({
      slug: 'usage-examples',
      title: 'Consumer Contract: Usage Examples',
      description: 'Common implementation patterns across app, styles, and pipeline integrations.',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'Cross-contract examples that show typical Cedar integration paths in real consumer codebases.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'Examples reduce interpretation gaps and align teams on how token contracts should be consumed.',
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use these examples when wiring a theme layer, stylesheet entrypoint, or tooling pipeline.',
            'Do not copy every pattern into one integration path. Pick the one that matches your contract type.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: ['Start from the closest example and adapt naming to your app-level contract.'],
          codeSamples: [
            {
              title: 'App theme mapping (js + semantic)',
              language: 'ts',
              code: `import { CdrColorText, CdrSpace, CdrTextSize } from '@rei/cdr-tokens';

export const appTheme = {
  color: {
    textPrimary: CdrColorText.CdrColorTextPrimary,
  },
  space: {
    stackMd: CdrSpace.CdrSpaceTwoX,
  },
  type: {
    headingMd: CdrTextSize.CdrTextHeadingSans400Size,
  },
};`,
            },
            {
              title: 'Map typography into an app contract',
              language: 'ts',
              code: `import { CdrTextSize, CdrTextWeight, CdrTextLineHeight } from '@rei/cdr-tokens';

export const textStyles = {
  body: {
    fontSize: CdrTextSize.CdrTextBody300Size,
    fontWeight: CdrTextWeight.CdrTextBody300Weight,
    lineHeight: CdrTextLineHeight.CdrTextBody300LineHeight,
  },
  heading: {
    fontSize: CdrTextSize.CdrTextHeadingSans400Size,
    fontWeight: CdrTextWeight.CdrTextHeadingSans400Weight,
    lineHeight: CdrTextLineHeight.CdrTextHeadingSans400LineHeight,
  },
};`,
            },
            {
              title: 'Stylesheet integration — css (bundler import)',
              language: 'ts',
              code: `import '@rei/cdr-tokens/css';`,
            },
            {
              title: 'Stylesheet integration — scss',
              language: 'scss',
              code: `@use '@rei/cdr-tokens/scss';
@use '@rei/cdr-tokens/scss/breakpoint-mixins' as bp;`,
            },
            {
              title: 'Pipeline ingestion (json)',
              language: 'ts',
              code: `import globalTokens from '@rei/cdr-tokens/json/global.json';
import webTokens from '@rei/cdr-tokens/json';

console.log({ globalTokens, webTokens });`,
            },
          ],
        },
      ],
    }),
};

export const Type: Story = {
  name: 'type',
  render: () =>
    renderDocsPage({
      slug: 'type',
      title: 'Contract: type',
      description:
        'TypeScript type definitions for Cedar token modules — with inline values, CSS variable names, and usage descriptions for IDE hover.',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'The type contract exposes generated .d.ts definitions for Cedar token modules. These definitions describe the shape of semantic token objects and attach metadata directly to each property so your IDE can show it inline.',
            'Every property in a Cedar .d.ts file carries three layers of JSDoc: a @value annotation with the resolved token value (e.g. #1f513f), a @cssvar annotation with the corresponding CSS custom property name (e.g. --cdr-color-text-brand), and a description that explains what the token is for.',
            'The .d.ts files exist alongside the runtime .mjs modules. The .mjs files contain values; the .d.ts files describe those values to TypeScript and surface the metadata in editors.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'The primary goal is developer experience at the point of use. A consumer writing CdrColorText. in VS Code should be able to choose the right token without consulting an external reference page.',
            'Cedar achieves this by embedding @value, @cssvar, and description text directly in the generated .d.ts files. Any editor with TypeScript Language Server support (VS Code, WebStorm, Neovim+LSP) renders these as hover tooltips and inline autocomplete documentation. No extension or plugin is required.',
            'Cedar owns the output shape and publishes types alongside values so consumers do not need custom interfaces or any-casts.',
          ],
        },
        {
          id: 'ide-hover-experience',
          heading: 'IDE hover experience',
          prose: [
            'When you hover a token property in VS Code, the tooltip shows the resolved value, the CSS custom property name, and the usage description — all generated by the Cedar build. The example below shows the format as it exists in the generated .d.ts.',
          ],
          codeSamples: [
            {
              title: 'Generated .d.ts (what your IDE reads)',
              language: 'ts',
              code: `export interface CdrColorTextTokens {
  /**
   * Text set in our primary brand color
   * @value #1f513f
   * @cssvar --cdr-color-text-brand
   */
  readonly CdrColorTextBrand: string;

  /**
   * The default, primary text color
   * @value #4b4a48
   * @cssvar --cdr-color-text-primary
   */
  readonly CdrColorTextPrimary: string;
}`,
            },
            {
              title: 'Hover tooltip in VS Code (what you see)',
              language: 'ts',
              code: `import { CdrColorText } from '@rei/cdr-tokens';

// Hover CdrColorTextPrimary — VS Code shows:
//
//   (property) CdrColorTextPrimary: string
//
//   The default, primary text color
//   @value — #4b4a48
//   @cssvar — --cdr-color-text-primary
//
const color = CdrColorText.CdrColorTextPrimary;`,
            },
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use in TypeScript codebases that map Cedar tokens into app theme contracts.',
            'Use @rei/cdr-tokens as the default semantic surface for app-level themes and grouped token discovery. This is the path that benefits most from IDE hover — CdrColorText, CdrSpace, CdrType etc. each give you an object-level entry point with all members documented.',
            'Use @rei/cdr-tokens/tokens when you need the complete flat output for scripts, audits, or one-off token lookups.',
            'Use @rei/cdr-tokens/types/* when you want a narrow domain import boundary with explicit foundation typing.',
            'Use the .mjs runtime modules when you need token values, and the paired .d.ts paths when you need explicit type annotations for interfaces.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: [
            'Pick the entrypoint based on integration intent: semantic default, full flat surface, or focused domain module.',
          ],
          codeSamples: [
            {
              title: 'Semantic root (default)',
              language: 'ts',
              code: `import { CdrColorText, CdrSpace, CdrTextSize } from '@rei/cdr-tokens';

const appTheme = {
  textPrimary: CdrColorText.CdrColorTextPrimary,
  spacingMd: CdrSpace.CdrSpaceTwoX,
  headingMd: CdrTextSize.CdrTextHeadingSans400Size,
};`,
            },
            {
              title: 'Semantic root with explicit type annotation',
              language: 'ts',
              code: `import type { CdrColorTextTokens } from '@rei/cdr-tokens/types/color-text';
import { CdrColorText } from '@rei/cdr-tokens';

const text: CdrColorTextTokens = CdrColorText;`,
            },
            {
              title: 'Full flat surface via /tokens',
              language: 'ts',
              code: `import * as tokens from '@rei/cdr-tokens/tokens';

const primary = tokens.CdrColorTextPrimary;
const buttonRest = tokens.CdrColorBackgroundButtonPrimaryRest;`,
            },
            {
              title: 'Focused domain module via /types/*',
              language: 'ts',
              code: `import { CdrColorText } from '@rei/cdr-tokens/types/color-text';

const textPrimary = CdrColorText.CdrColorTextPrimary;`,
            },
            {
              title: 'Semantic + flat together',
              language: 'ts',
              code: `import type { CdrColorTextTokens } from '@rei/cdr-tokens/types/color-text';
import * as flatTokens from '@rei/cdr-tokens/tokens';
import { CdrColorText } from '@rei/cdr-tokens';

export interface ThemeContract {
  color: CdrColorTextTokens;
}

export const theme: ThemeContract = {
  color: CdrColorText,
};

export const diagnostics = {
  primaryText: flatTokens.CdrColorTextPrimary,
};`,
            },
          ],
        },
        {
          id: 'available-files-exports',
          heading: 'Available files / exports',
          prose: [
            'Type definitions are co-located with generated foundation modules. Each .d.ts file annotates every property with @value (resolved token value), @cssvar (CSS custom property name), and a description. These annotations are read by TypeScript Language Server and appear in IDE hover tooltips automatically.',
            'The ./types/* export maps @rei/cdr-tokens/types/<name> to dist/.../foundations/cdr-<name>.mjs — the cdr- prefix is added automatically. Use types/color-text, not types/cdr-color-text, in your import path.',
          ],
          table: {
            headers: ['Import path / file', 'Kind', 'Use for'],
            rows: [
              [
                '@rei/cdr-tokens -> dist/rei-dot-com/types/index.d.ts',
                'Published semantic type entrypoint',
                'Semantic default app contract and grouped IDE discovery',
              ],
              [
                '@rei/cdr-tokens/tokens -> dist/rei-dot-com/js/cdr-tokens.d.ts',
                'Published flat type entrypoint',
                'Full flat token surface for scripts/audits/one-off lookups',
              ],
              [
                '@rei/cdr-tokens/types/color-text',
                'Clean alias (type + runtime module)',
                'Narrow domain import boundary with explicit typing',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-color-text.mjs',
                'Runtime module',
                'Actual token values',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-color-text.d.ts',
                'Type definition',
                'TypeScript annotations',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-space.mjs',
                'Runtime module',
                'Actual token values',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-space.d.ts',
                'Type definition',
                'TypeScript annotations',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-type.mjs',
                'Runtime module',
                'Actual token values',
              ],
              [
                'dist/rei-dot-com/types/foundations/cdr-type.d.ts',
                'Type definition',
                'TypeScript annotations',
              ],
            ],
          },
        },
        {
          id: 'runtime-key-arrays',
          heading: 'Runtime key arrays',
          prose: [
            'Every foundation module exports a Keys array — a runtime const tuple of kebab-case semantic keys. These map directly to CSS custom property names (--cdr-{group}-{key}) and are the recommended building block for framework integration layers.',
            'Key arrays are exported from @rei/cdr-tokens/types alongside grouped objects and interfaces. They are runtime values, not type-only exports.',
          ],
          codeSamples: [
            {
              title: 'Import key arrays',
              language: 'ts',
              code: `import { CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';

// CdrSpaceScaleKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", ...]
// CdrColorBackgroundKeys = ["primary", "secondary", "sale", ...]`,
            },
            {
              title: 'Tailwind config integration',
              language: 'ts',
              code: `import {
  CdrBreakpoint,
  CdrSpaceKeys,
  CdrSpaceScaleKeys,
  CdrRadiusKeys,
  CdrColorBackgroundKeys,
  CdrColorTextKeys,
  CdrColorBorderKeys,
} from '@rei/cdr-tokens/types';

const keysToVars = (keys: readonly string[], prefix: string) =>
  Object.fromEntries(keys.map((key) => [key, \`var(--\${prefix}-\${key})\`]));

export default {
  theme: {
    screens: {
      xs: \`\${CdrBreakpoint.CdrBreakpointXs}px\`,
      sm: \`\${CdrBreakpoint.CdrBreakpointSm}px\`,
      md: \`\${CdrBreakpoint.CdrBreakpointMd}px\`,
      lg: \`\${CdrBreakpoint.CdrBreakpointLg}px\`,
    },
    extend: {
      spacing: keysToVars(CdrSpaceKeys, 'cdr-space'),
      borderRadius: keysToVars(CdrRadiusKeys, 'cdr-radius'),
      colors: {
        background: keysToVars(CdrColorBackgroundKeys, 'cdr-color-background'),
        text: keysToVars(CdrColorTextKeys, 'cdr-color-text'),
        border: keysToVars(CdrColorBorderKeys, 'cdr-color-border'),
      },
    },
  },
};`,
            },
          ],
        },
        {
          id: 'related-contracts',
          heading: 'Related contracts',
          prose: ['Use the js contract for runtime values that these types describe.'],
          relatedLinks: ['js: runtime values via semantic and root entrypoint'],
        },
      ],
    }),
};

const colorTextTokens: Array<{
  name: string;
  value: string;
  cssvar: string;
  description: string;
}> = [
  {
    name: 'CdrColorTextPrimary',
    value: '#4b4a48',
    cssvar: '--cdr-color-text-primary',
    description: 'The default, primary text color',
  },
  {
    name: 'CdrColorTextSecondary',
    value: '#736e65',
    cssvar: '--cdr-color-text-secondary',
    description: 'The secondary text color',
  },
  {
    name: 'CdrColorTextEmphasis',
    value: '#2e2e2b',
    cssvar: '--cdr-color-text-emphasis',
    description: 'The emphasis text color',
  },
  {
    name: 'CdrColorTextBrand',
    value: '#1f513f',
    cssvar: '--cdr-color-text-brand',
    description: 'Text set in our primary brand color',
  },
  {
    name: 'CdrColorTextSale',
    value: '#c7370f',
    cssvar: '--cdr-color-text-sale',
    description: 'The color of sale text',
  },
  {
    name: 'CdrColorTextSuccess',
    value: '#2e6b34',
    cssvar: '--cdr-color-text-success',
    description: 'Color of success messages',
  },
  {
    name: 'CdrColorTextWarning',
    value: '#854714',
    cssvar: '--cdr-color-text-warning',
    description: 'Color of warning messages',
  },
  {
    name: 'CdrColorTextError',
    value: '#811823',
    cssvar: '--cdr-color-text-error',
    description: 'Color of error messages',
  },
  {
    name: 'CdrColorTextInfo',
    value: '#1b437e',
    cssvar: '--cdr-color-text-info',
    description: 'Color of informational messages',
  },
  {
    name: 'CdrColorTextInverse',
    value: '#fafbf9',
    cssvar: '--cdr-color-text-inverse',
    description: 'Text color on dark background',
  },
  {
    name: 'CdrColorTextDisabled',
    value: '#d5cfc3',
    cssvar: '--cdr-color-text-disabled',
    description: 'The color of text when it is disabled',
  },
];

export const TypePlayground: Story = {
  name: 'type: ide playground',
  render: () => {
    const tokensJson = JSON.stringify(colorTextTokens);

    return `${pageChrome}
      <style>
        .pg-page {
          background: var(--docs-bg-page);
          color: var(--docs-text-primary);
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--docs-space-4x) var(--docs-space-3x) 80px;
        }

        .pg-header { margin-bottom: var(--docs-space-3x); }

        .pg-title {
          font-family: Stuart, 'Stuart fallback', Georgia, serif;
          font-size: var(--docs-heading-lg);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 var(--docs-space-1x);
          color: var(--docs-text-primary);
        }

        .pg-desc {
          margin: 0;
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: var(--docs-body-size);
          line-height: 1.7;
          color: var(--docs-text-secondary);
          max-width: 68ch;
        }

        .pg-desc code {
          font-family: Pressura, monospace;
          font-size: 12px;
          background: rgba(0,0,0,0.07);
          border-radius: 3px;
          padding: 1px 4px;
        }

        /* ── Card shell ────────────────────────────── */
        .pg-card {
          border: 1px solid var(--docs-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .pg-card-label {
          padding: 9px 14px;
          border-bottom: 1px solid var(--docs-border);
          background: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--docs-text-secondary);
        }

        .pg-card-badge {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          background: var(--docs-bg-page);
          border: 1px solid var(--docs-border);
          border-radius: 999px;
          padding: 2px 8px;
          color: var(--docs-text-secondary);
        }

        /* ── Editor code lines (full-width dark bar) ── */
        .pg-editor-area {
          background: #1e1e1e;
          padding: 14px 16px 12px;
          border-bottom: 1px solid #111;
        }

        .pg-editor-header {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }

        .pg-dot { width: 10px; height: 10px; border-radius: 50%; }
        .pg-dot-r { background: #ff5f57; }
        .pg-dot-y { background: #ffbd2e; }
        .pg-dot-g { background: #28c840; }

        .pg-lines { display: table; width: 100%; }
        .pg-line  { display: table-row; }

        .pg-lineno {
          display: table-cell;
          width: 28px;
          color: #555;
          user-select: none;
          text-align: right;
          padding-right: 16px;
          font-family: Pressura, 'SF Mono', monospace;
          font-size: 12.5px;
          line-height: 1.65;
        }

        .pg-linecode {
          display: table-cell;
          white-space: pre;
          font-family: Pressura, 'SF Mono', monospace;
          font-size: 12.5px;
          line-height: 1.65;
          color: #d4d4d4;
        }

        .e-keyword { color: #569cd6; }
        .e-type    { color: #4ec9b0; }
        .e-string  { color: #ce9178; }
        .e-var     { color: #9cdcfe; }
        .e-op      { color: #d4d4d4; }
        .e-member  { color: #dcdcaa; }

        .e-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #aeafad;
          vertical-align: text-bottom;
          animation: pgblink 1.1s step-end infinite;
        }
        @keyframes pgblink { 50% { opacity: 0; } }

        /* ── Suggestion widget: list + docs side by side ── */
        .pg-suggestion-row {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 240px;
          background: #1e1e1e;
          border-bottom: 1px solid var(--docs-border);
        }

        @media (max-width: 700px) {
          .pg-suggestion-row { grid-template-columns: 1fr; }
        }

        /* list column */
        .pg-autocomplete {
          background: #252526;
          border-right: 1px solid #333;
          overflow-y: auto;
          max-height: 260px;
        }

        .pg-ac-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          cursor: pointer;
          font-family: Pressura, 'SF Mono', monospace;
          font-size: 12px;
          color: #d4d4d4;
          border-left: 2px solid transparent;
        }

        .pg-ac-item.is-highlighted { background: #2a2d2e; }

        .pg-ac-item.is-active {
          background: #094771;
          border-left-color: #007fd4;
        }

        .pg-ac-swatch {
          width: 10px; height: 10px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .pg-ac-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pg-ac-kind { font-size: 10px; color: #888; flex-shrink: 0; }

        /* docs / detail column */
        .pg-detail-pane {
          background: #1e1e1e;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .pg-detail-sig {
          font-family: Pressura, 'SF Mono', monospace;
          font-size: 12px;
          line-height: 1.5;
          color: #d4d4d4;
          padding-bottom: 10px;
          border-bottom: 1px solid #333;
          word-break: break-word;
        }

        .pg-detail-body {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: 12.5px;
          color: #d4d4d4;
        }

        .pg-detail-empty { color: #555; font-style: italic; }

        .pg-tooltip-desc { color: #ccc; margin-bottom: 2px; }

        .pg-tooltip-tag-row {
          font-family: Pressura, 'SF Mono', monospace;
          font-size: 12px;
          color: #d4d4d4;
          line-height: 1.5;
        }

        .pg-tooltip-tag  { color: #888; }
        .pg-tooltip-cssvar { color: #b5cea8; }

        .pg-approx-note {
          margin-top: auto;
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: 11px;
          color: #555;
          line-height: 1.5;
          border-top: 1px solid #2a2a2a;
          padding-top: 10px;
        }

        .pg-approx-note code {
          font-family: Pressura, monospace;
          font-size: 10.5px;
          color: #777;
        }

        /* ── Preview strip ─────────────────────────── */
        .pg-preview {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          background: var(--docs-bg-surface);
        }

        .pg-preview-swatch {
          width: 48px; height: 48px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .pg-preview-right {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .pg-preview-sample-text {
          font-family: Stuart, 'Stuart fallback', Georgia, serif;
          font-size: 26px;
          line-height: 1;
        }

        .pg-preview-token-name {
          font-family: Pressura, monospace;
          font-size: 12px;
          color: var(--docs-text-secondary);
        }

        .pg-preview-cssvar {
          font-family: Pressura, monospace;
          font-size: 11px;
          color: var(--docs-text-secondary);
          opacity: 0.7;
        }

        /* ── Two-stage explainer ───────────────────── */
        .pg-two-stage {
          margin-top: var(--docs-space-2x);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .pg-two-stage { grid-template-columns: 1fr; }
        }

        .pg-stage {
          border: 1px solid var(--docs-border);
          border-radius: 10px;
          padding: 14px 16px;
          background: var(--docs-bg-surface);
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: 13px;
          line-height: 1.65;
          color: var(--docs-text-primary);
        }

        .pg-stage-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 12.5px;
          margin-bottom: 6px;
          color: var(--docs-text-primary);
        }

        .pg-stage-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: var(--docs-text-primary);
          color: var(--docs-bg-page);
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .pg-stage code {
          font-family: Pressura, monospace;
          font-size: 11.5px;
          background: rgba(0,0,0,0.07);
          border-radius: 3px;
          padding: 1px 4px;
        }

        /* ── Setup callout ─────────────────────────── */
        .pg-setup {
          margin-top: var(--docs-space-2x);
          border: 1px solid var(--docs-border);
          border-radius: 10px;
          padding: 14px 16px;
          background: var(--docs-bg-surface);
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .pg-setup-icon { font-size: 15px; flex-shrink: 0; line-height: 1.5; }

        .pg-setup-body {
          font-family: Graphik, 'Graphik fallback', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: var(--docs-text-primary);
        }

        .pg-setup-body strong { display: block; font-weight: 600; margin-bottom: 2px; }

        .pg-setup-body code {
          font-family: Pressura, monospace;
          font-size: 12px;
          background: rgba(0,0,0,0.07);
          border-radius: 3px;
          padding: 1px 4px;
        }
      </style>

      <div class="pg-page">
        <header class="pg-header">
          <h1 class="pg-title">Token Type Playground</h1>
          <p class="pg-desc">In VS Code, typing <code>CdrColorText.</code> opens a suggestion list with all token options. Hovering or arrowing through the list shows the full JSDoc in the detail panel alongside it — description, value, CSS variable — before you commit to a selection. After selecting, hovering over the token name shows the same info again as a tooltip.</p>
        </header>

        <div class="pg-card" id="pg-root" data-tokens='${tokensJson}'>
          <div class="pg-card-label">
            <span>CdrColorText — suggestion widget</span>
            <span class="pg-card-badge">hover or click a suggestion</span>
          </div>

          <!-- Code editor: static lines with animated cursor -->
          <div class="pg-editor-area">
            <div class="pg-editor-header">
              <div class="pg-dot pg-dot-r"></div>
              <div class="pg-dot pg-dot-y"></div>
              <div class="pg-dot pg-dot-g"></div>
            </div>
            <div class="pg-lines">
              <div class="pg-line">
                <span class="pg-lineno">1</span>
                <span class="pg-linecode"><span class="e-keyword">import</span> <span class="e-op">{</span> <span class="e-type">CdrColorText</span> <span class="e-op">}</span> <span class="e-keyword">from</span> <span class="e-string">'@rei/cdr-tokens'</span><span class="e-op">;</span></span>
              </div>
              <div class="pg-line">
                <span class="pg-lineno">2</span>
                <span class="pg-linecode">&nbsp;</span>
              </div>
              <div class="pg-line">
                <span class="pg-lineno">3</span>
                <span class="pg-linecode"><span class="e-keyword">const</span> <span class="e-var">color</span> <span class="e-op">=</span> <span class="e-type">CdrColorText</span><span class="e-op">.</span><span id="pg-cursor-token" class="e-member"></span><span class="e-cursor"></span></span>
              </div>
            </div>
          </div>

          <!-- Suggestion widget: [suggestion list] | [detail / docs pane] -->
          <div class="pg-suggestion-row">
            <div id="pg-autocomplete" class="pg-autocomplete" role="listbox" aria-label="CdrColorText token suggestions"></div>

            <div class="pg-detail-pane">
              <div class="pg-detail-sig">
                <span class="e-op">(property) readonly </span><span class="e-type">CdrColorTextTokens</span><span class="e-op">.</span><span id="pg-tooltip-name" class="e-type">\u2014</span><span class="e-op">: string</span>
              </div>
              <div class="pg-detail-body" id="pg-tooltip-body">
                <span class="pg-detail-empty">Hover over a suggestion to see its docs</span>
              </div>
              <div class="pg-approx-note">Approximate \u2014 this is VS Code\u2019s <em>Suggestion Details</em> panel, which opens beside the list as you browse. <code>@value</code> and <code>@cssvar</code> are non-standard JSDoc tags; TypeScript Language Server renders them as plain lines in the block.</div>
            </div>
          </div>

          <!-- Preview strip: shows the committed/clicked token -->
          <div class="pg-preview" id="pg-preview">
            <div class="pg-preview-swatch" id="pg-swatch" style="background:#ddd; border: 1px solid #ccc;"></div>
            <div class="pg-preview-right">
              <div class="pg-preview-sample-text" id="pg-sample-text" style="color:#bbb;">The quick brown fox</div>
              <div class="pg-preview-token-name" id="pg-preview-name">\u2014</div>
              <div class="pg-preview-cssvar" id="pg-preview-cssvar">\u2014</div>
            </div>
          </div>
        </div>

        <!-- Two-stage explainer -->
        <div class="pg-two-stage">
          <div class="pg-stage">
            <div class="pg-stage-heading"><span class="pg-stage-num">1</span> While browsing suggestions</div>
            Type <code>CdrColorText.</code> and VS Code opens the full list. Arrow keys or hovering highlights an option. The detail panel alongside the list shows the JSDoc for whichever item is highlighted \u2014 before you\u2019ve committed to anything.
          </div>
          <div class="pg-stage">
            <div class="pg-stage-heading"><span class="pg-stage-num">2</span> After committing a selection</div>
            Press Tab or Enter. The suggestion list closes and the token is inserted. Hover over the token name and VS Code shows the same JSDoc as a floating tooltip. No list open required \u2014 works any time your cursor is near the name.
          </div>
        </div>

        <div class="pg-setup">
          <span class="pg-setup-icon">&#9432;</span>
          <div class="pg-setup-body">
            <strong>No setup required</strong>
            Install <code>@rei/cdr-tokens</code> \u2014 the types are bundled with the package. TypeScript Language Server is built into VS Code by default. No extension, plugin, or <code>tsconfig</code> change needed.
          </div>
        </div>
      </div>

      <script>
        (() => {
          const root = document.getElementById('pg-root');
          if (!root) return;

          const tokens = JSON.parse(root.dataset.tokens || '[]');

          const acContainer  = document.getElementById('pg-autocomplete');
          const cursorToken  = document.getElementById('pg-cursor-token');
          const tooltipName  = document.getElementById('pg-tooltip-name');
          const tooltipBody  = document.getElementById('pg-tooltip-body');
          const swatch       = document.getElementById('pg-swatch');
          const sampleText   = document.getElementById('pg-sample-text');
          const previewName  = document.getElementById('pg-preview-name');
          const previewCssvar = document.getElementById('pg-preview-cssvar');

          // Show detail pane content for the highlighted/hovered item
          function highlight(token) {
            tooltipName.textContent = token.name;
            tooltipBody.innerHTML =
              '<span class="pg-tooltip-desc">' + token.description + '</span>' +
              '<div class="pg-tooltip-tag-row"><span class="pg-tooltip-tag">@value</span> ' + token.value + '</div>' +
              '<div class="pg-tooltip-tag-row"><span class="pg-tooltip-tag">@cssvar</span> <span class="pg-tooltip-cssvar">' + token.cssvar + '</span></div>';

            acContainer.querySelectorAll('.pg-ac-item').forEach((item) => {
              item.classList.toggle('is-highlighted', item.dataset.name === token.name);
            });
          }

          // Commit a selection — updates the editor cursor line and preview strip
          function commit(token) {
            highlight(token);
            cursorToken.textContent = token.name;

            const isLight = token.value === '#fafbf9' || token.value === '#d5cfc3';
            swatch.style.background = token.value;
            swatch.style.border = isLight ? '1px solid #aaa' : '1px solid transparent';
            sampleText.style.color = token.value;
            previewName.textContent = 'CdrColorText.' + token.name;
            previewCssvar.textContent = token.cssvar;

            acContainer.querySelectorAll('.pg-ac-item').forEach((item) => {
              item.classList.toggle('is-active', item.dataset.name === token.name);
            });
          }

          tokens.forEach((token) => {
            const item = document.createElement('div');
            item.className = 'pg-ac-item';
            item.dataset.name = token.name;
            item.setAttribute('role', 'option');

            const shortName = token.name.replace('CdrColorText', '');
            const isLight = token.value === '#fafbf9' || token.value === '#d5cfc3';

            item.innerHTML =
              '<div class="pg-ac-swatch" style="background:' + token.value + '; border: 1px solid ' + (isLight ? '#999' : 'rgba(255,255,255,0.15)') + ';"></div>' +
              '<span class="pg-ac-name"><span style="opacity:0.5">CdrColorText</span>.' + shortName + '</span>' +
              '<span class="pg-ac-kind">string</span>';

            // Hover → show detail pane (like VS Code suggestion details on hover/arrow)
            item.addEventListener('mouseover', () => highlight(token));
            // Click → commit selection (like pressing Tab/Enter in VS Code)
            item.addEventListener('click', () => commit(token));

            acContainer.appendChild(item);
          });

          // Pre-select first token on load
          if (tokens.length > 0) commit(tokens[0]);
        })();
      </script>
    `;
  },
};

export const Css: Story = {
  name: 'css',
  render: () =>
    renderDocsPage({
      slug: 'css',
      title: 'Contract: css',
      description: 'Prebuilt CSS bundles and foundation-level CSS modules.',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'The css contract is a set of generated CSS files under dist/rei-dot-com/css. It includes full bundles and foundation modules with Cedar custom properties.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'It enables direct stylesheet consumption without Sass preprocessing or JS token mapping.',
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use in plain CSS workflows or bundler CSS import setups.',
            'Do not use as your primary path if your project already compiles Sass and needs utility mixins. Use scss instead.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: ['Import either the full bundle or a specific foundation module.'],
          codeSamples: [
            {
              title: 'Full CSS bundle',
              language: 'ts',
              code: `import '@rei/cdr-tokens/css';`,
            },
            {
              title: 'Foundation module',
              language: 'ts',
              code: `import '@rei/cdr-tokens/css/color-text';`,
            },
          ],
        },
        {
          id: 'available-files-exports',
          heading: 'Available files / exports',
          prose: [
            'Foundation files are subsets of the full bundle.',
            'The ./css/* export maps @rei/cdr-tokens/css/<name> to dist/.../foundations/cdr-<name>.css — the cdr- prefix is added automatically. Use color-text, not cdr-color-text, in your import path.',
          ],
          table: {
            headers: ['File', 'Contents'],
            rows: [
              ['css/cdr-tokens.css', 'All Cedar tokens'],
              ['css/foundations/cdr-color-text.css', 'Text color token variables'],
              ['css/foundations/cdr-color-background.css', 'Background token variables'],
              ['css/foundations/cdr-space.css', 'Spacing token variables'],
            ],
          },
        },
        {
          id: 'related-contracts',
          heading: 'Related contracts',
          prose: ['Use scss when you need utility mixins.'],
          relatedLinks: [
            'scss: Sass-native integration with Cedar mixins',
            'js: runtime token mapping in application code',
          ],
        },
      ],
    }),
};

export const Scss: Story = {
  name: 'scss',
  render: () =>
    renderDocsPage({
      slug: 'scss',
      title: 'Contract: scss',
      description: 'Sass token outputs and Cedar utility mixins.',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'The scss contract publishes Sass token files under dist/rei-dot-com/scss, including utilities for breakpoints and typography mixins.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'Sass consumers need native mixin and map support that cannot be delivered through plain CSS bundles.',
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use when your app compiles Sass and relies on Cedar utility mixins.',
            'Do not use if your environment does not compile Sass. Use css instead.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: ['Import the token bundle and utility partials needed by your stylesheets.'],
          codeSamples: [
            {
              title: 'Token bundle + utilities',
              language: 'scss',
              code: `@use '@rei/cdr-tokens/scss';
@use '@rei/cdr-tokens/scss/type-mixins' as typeMixins;
@use '@rei/cdr-tokens/scss/breakpoint-mixins' as breakpoints;`,
            },
            {
              title: 'Using breakpoint mixin',
              language: 'scss',
              code: `@use '@rei/cdr-tokens/scss/breakpoint-mixins' as bp;

.my-component {
  padding: 8px;

  @include bp.cdr-md-mq {
    padding: 16px;
  }
}`,
            },
          ],
        },
        {
          id: 'available-files-exports',
          heading: 'Available files / exports',
          prose: [
            'Utility partials are shipped alongside the core token Sass bundle.',
            'The ./scss/* export maps @rei/cdr-tokens/scss/<name> to dist/.../utilities/cdr-<name>.scss — the cdr- prefix is added automatically. Use breakpoint-mixins, not cdr-breakpoint-mixins, in your @use path.',
          ],
          table: {
            headers: ['File', 'Contents'],
            rows: [
              ['scss/cdr-tokens.scss', 'All Cedar tokens as Sass values'],
              ['scss/utilities/cdr-breakpoint-mixins.scss', 'Breakpoint mixins'],
              ['scss/utilities/cdr-type-mixins.scss', 'Typography mixins'],
            ],
          },
        },
        {
          id: 'related-contracts',
          heading: 'Related contracts',
          prose: ['Use css when Sass is unavailable; use js for runtime mapping workflows.'],
          relatedLinks: [
            'css: stylesheet-only token consumption',
            'js: app theming and runtime config',
          ],
        },
      ],
    }),
};

export const Js: Story = {
  name: 'js',
  render: () =>
    renderDocsPage({
      slug: 'js',
      title: 'Contract: js',
      description: 'JavaScript value contracts for app theming and token-driven UI configuration.',
      badge: 'Recommended default',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'The js contract exposes Cedar token values through two entrypoints: semantic grouped exports at root and the full flat output at /tokens.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'JavaScript integrations need runtime token values for theming, component configuration, and adapter layers.',
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use semantic for long-lived app mappings and semantic stability.',
            'Do not default to flat exports for durable app contracts unless you need one-off lookups.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: [
            'Prefer semantic for theme contracts and use /tokens exports for utility scripts.',
          ],
          codeSamples: [
            {
              title: 'Semantic grouped objects (semantic)',
              language: 'ts',
              code: `import { CdrColorText, CdrSpace, CdrTextSize } from '@rei/cdr-tokens';

CdrColorText.CdrColorTextPrimary;
CdrSpace.CdrSpaceOneX;
CdrTextSize.CdrTextHeadingSans400Size;`,
            },
            {
              title: 'Typography app contract',
              language: 'ts',
              code: `import { CdrTextSize, CdrTextWeight, CdrTextLineHeight } from '@rei/cdr-tokens';

export const textStyles = {
  body: {
    fontSize: CdrTextSize.CdrTextBody300Size,
    fontWeight: CdrTextWeight.CdrTextBody300Weight,
    lineHeight: CdrTextLineHeight.CdrTextBody300LineHeight,
  },
  heading: {
    fontSize: CdrTextSize.CdrTextHeadingSans400Size,
    fontWeight: CdrTextWeight.CdrTextHeadingSans400Weight,
    lineHeight: CdrTextLineHeight.CdrTextHeadingSans400LineHeight,
  },
};`,
            },
            {
              title: 'Root flat exports',
              language: 'ts',
              code: `import * as tokens from '@rei/cdr-tokens/tokens';

tokens.CdrColorTextPrimary;
tokens.CdrSpaceOneX;`,
            },
          ],
        },
        {
          id: 'available-files-exports',
          heading: 'Available files / exports',
          prose: ['Choose entrypoint based on stability and shape requirements.'],
          table: {
            headers: ['Entrypoint', 'Shape', 'Best for'],
            rows: [
              ['@rei/cdr-tokens', 'Grouped semantic objects', 'Long-lived app contract mappings'],
              ['@rei/cdr-tokens/tokens', 'Flat named exports', 'One-off value lookups and scripts'],
            ],
          },
        },
        {
          id: 'related-contracts',
          heading: 'Related contracts',
          prose: [
            'Types are bundled with js entrypoints; no separate type import needed for most consumers.',
          ],
          relatedLinks: [
            'type: explicit token type annotations',
            'css: stylesheet-only token usage',
            'json: pipeline and non-JS workflows',
          ],
        },
      ],
    }),
};

export const Json: Story = {
  name: 'json',
  render: () =>
    renderDocsPage({
      slug: 'json',
      title: 'Contract: json',
      description: 'Raw token artifacts for tooling, transforms, and non-JS environments.',
      sections: [
        {
          id: 'what-it-is',
          heading: 'What it is',
          prose: [
            'The json contract publishes raw token artifacts under dist/rei-dot-com/json as machine-readable files generated by the Style Dictionary pipeline.',
          ],
        },
        {
          id: 'why-cedar-provides-it',
          heading: 'Why Cedar provides it',
          prose: [
            'Tooling and non-JS consumers require raw artifacts without module-system coupling.',
          ],
        },
        {
          id: 'when-to-use-it',
          heading: 'When to use it',
          prose: [
            'Use for CI audits, transforms, external tooling, and environments without JS module import support.',
            'Do not use as primary integration in JS applications when js contract provides better ergonomics and types.',
          ],
        },
        {
          id: 'how-to-use-it',
          heading: 'How to use it',
          prose: ['Import json artifacts in scripts or read files directly in CI pipelines.'],
          codeSamples: [
            {
              title: 'Importing JSON artifacts',
              language: 'ts',
              code: `import globalTokens from '@rei/cdr-tokens/json/global.json';
import webTokens from '@rei/cdr-tokens/json';

console.log(globalTokens, webTokens);`,
            },
            {
              title: 'Direct file read in shell pipeline',
              language: 'sh',
              code: `cat node_modules/@rei/cdr-tokens/dist/rei-dot-com/json/web.json | jq '.color.text'`,
            },
          ],
        },
        {
          id: 'available-files-exports',
          heading: 'Available files / exports',
          prose: ['JSON files are organized by platform/theme output.'],
          table: {
            headers: ['File', 'Contents'],
            rows: [
              ['json/global.json', 'Global tokens for rei-dot-com output'],
              ['json/web.json', 'Web-specific values for rei-dot-com theme'],
            ],
          },
        },
        {
          id: 'related-contracts',
          heading: 'Related contracts',
          prose: ['Use js for runtime app integrations and type for explicit contract typing.'],
          relatedLinks: [
            'js: preferred integration path for JS apps',
            'type: TypeScript surface for js contract',
          ],
        },
      ],
    }),
};

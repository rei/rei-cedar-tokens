import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Documentation/Overview',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

// ─── Shared chrome ────────────────────────────────────────────────────────────

const chrome = `
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
    .sb-section-subtitle {
      font-family: Pressura, monospace;
      font-size: 14px;
      color: var(--cedar-warm-600);
      margin-left: auto;
    }

    /* ── Navigation cards ── */
    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }
    .nav-card {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }
    .nav-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      border-color: var(--cedar-blue-400);
    }
    .nav-card:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--cedar-blue-600);
    }
    .nav-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    .nav-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 8px 0;
    }
    .nav-description {
      font-size: 14px;
      color: var(--cedar-warm-700);
      line-height: 1.4;
      margin: 0;
    }

    /* ── Category headers ── */
    .category-header {
      background: var(--cedar-blue-50);
      border: 1px solid var(--cedar-blue-200);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .category-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-blue-900);
      margin: 0 0 8px 0;
    }
    .category-description {
      color: var(--cedar-blue-800);
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
    }

    /* ── Feature highlights ── */
    .feature-highlights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .feature-card {
      background: var(--cedar-warm-50);
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .feature-icon {
      font-size: 40px;
      margin-bottom: 12px;
    }
    .feature-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 8px 0;
    }
    .feature-description {
      font-size: 13px;
      color: var(--cedar-warm-700);
      line-height: 1.4;
      margin: 0;
    }
  </style>
`;

function sectionHeader(title: string, subtitle: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span class="sb-section-subtitle">${subtitle}</span>
  </div>`;
}

// ─── Documentation Overview Story ─────────────────────────────────────────────

export const DocumentationOverview: Story = {
  name: 'Overview',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Cedar Tokens Documentation', 'v14.0.0 Semantic Architecture')}

        <div class="category-header">
          <h3 class="category-title">🚀 New Semantic Token System</h3>
          <p class="category-description">
            The new semantic token system organizes colors by <strong>Family > Intent</strong>
            rather than component types, providing better clarity, consistency, and platform-aware capabilities.
          </p>
        </div>

        <div class="feature-highlights">
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Semantic Intent</h3>
            <p class="feature-description">Organized by purpose (surface, action, feedback) rather than component</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌈</div>
            <h3 class="feature-title">OKLCH Color Space</h3>
            <p class="feature-description">Perceptually uniform colors with wide gamut support</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Platform Aware</h3>
            <p class="feature-description">iOS, Android, and Web specific values and extensions</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">♿</div>
            <h3 class="feature-title">Accessibility First</h3>
            <p class="feature-description">Contrast metadata and combination guidance built-in</p>
          </div>
        </div>

        <h3 style="font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px; margin: 32px 0 16px 0;">
          📚 Documentation Sections
        </h3>

        <div class="nav-grid">
          <a href="#tokens/colors" class="nav-card">
            <div class="nav-icon">🎨</div>
            <h4 class="nav-title">Colors</h4>
            <p class="nav-description">
              Semantic color tokens organized by Family > Intent structure
            </p>
          </a>

          <a href="#documentation/accessibility-combinations" class="nav-card">
            <div class="nav-icon">♿</div>
            <h4 class="nav-title">Accessibility Combinations</h4>
            <p class="nav-description">
              Text → Surface color combinations with contrast ratios
            </p>
          </a>

          <a href="#documentation/token-migration" class="nav-card">
            <div class="nav-icon">🔄</div>
            <h4 class="nav-title">Token Migration</h4>
            <p class="nav-description">
              Legacy → Semantic token migration guide and timeline
            </p>
          </a>

          <a href="#documentation/semantic-imports" class="nav-card">
            <div class="nav-icon">📦</div>
            <h4 class="nav-title">Semantic Imports</h4>
            <p class="nav-description">
              Code examples for consuming semantic tokens
            </p>
          </a>

          <a href="#documentation/release-notes" class="nav-card">
            <div class="nav-icon">📋</div>
            <h4 class="nav-title">Release Notes</h4>
            <p class="nav-description">
              v14.0.0 release notes and breaking changes
            </p>
          </a>

          <a href="#documentation/usage-context" class="nav-card">
            <div class="nav-icon">💡</div>
            <h4 class="nav-title">Usage Context</h4>
            <p class="nav-description">
              Figma metadata integration for usage guidance
            </p>
          </a>

          <a href="#documentation/figma-integration" class="nav-card">
            <div class="nav-icon">🔧</div>
            <h4 class="nav-title">Figma Integration</h4>
            <p class="nav-description">
              Figma → Code pipeline and workflow guide
            </p>
          </a>
        </div>

        <h3 style="font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px; margin: 32px 0 16px 0;">
          🌈 OKLCH Educational Demos
        </h3>

        <div class="nav-grid">
          <a href="#oklch/color-space-explorer" class="nav-card">
            <div class="nav-icon">🔍</div>
            <h4 class="nav-title">Color Space Explorer</h4>
            <p class="nav-description">
              Interactive comparison of OKLCH vs HSL color spaces
            </p>
          </a>

          <a href="#oklch/custom-component-composer" class="nav-card">
            <div class="nav-icon">🧩</div>
            <h4 class="nav-title">Custom Component Composer</h4>
            <p class="nav-description">
              Build UI Cedar doesn't have a component for yet, from approved semantic roles
            </p>
          </a>

          <a href="#oklch/color-blindness-simulator" class="nav-card">
            <div class="nav-icon">👁️</div>
            <h4 class="nav-title">Color Blindness Simulator</h4>
            <p class="nav-description">
              Vision type simulation for accessibility testing
            </p>
          </a>
        </div>

        <div class="category-header" style="margin-top: 48px;">
          <h3 class="category-title">🎯 Key Benefits</h3>
          <p class="category-description">
            The new semantic token system provides clearer organization, better accessibility,
            platform-aware capabilities, and a more intuitive API for designers and developers.
          </p>
        </div>

        <div class="feature-highlights">
          <div class="feature-card">
            <div class="feature-icon">🧠</div>
            <h3 class="feature-title">Better Mental Model</h3>
            <p class="feature-description">Semantic intent makes token selection more intuitive</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Easier Discovery</h3>
            <p class="feature-description">Related tokens are grouped together logically</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">Future Ready</h3>
            <p class="feature-description">Platform-aware and accessible by design</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3 class="feature-title">Better Documentation</h3>
            <p class="feature-description">Usage context and guidance built-in</p>
          </div>
        </div>
      </div>
    </div>`;
  },
};

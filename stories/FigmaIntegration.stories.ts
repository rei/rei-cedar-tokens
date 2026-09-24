import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Documentation/Figma Integration',
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

    /* ── Pipeline steps ── */
    .pipeline-step {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      position: relative;
    }
    .pipeline-step:before {
      content: attr(data-step);
      position: absolute;
      top: -12px;
      left: 24px;
      background: var(--cedar-blue-600);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-weight: 600;
      font-size: 12px;
    }
    .pipeline-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 12px 0;
    }
    .pipeline-description {
      color: var(--cedar-warm-700);
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .pipeline-code {
      background: var(--cedar-warm-50);
      border: 1px solid var(--cedar-warm-200);
      border-radius: 6px;
      padding: 12px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      line-height: 1.4;
      overflow-x: auto;
    }
    .pipeline-code pre {
      margin: 0;
    }

    /* ── Transformation note ── */
    .transformation-note {
      background: var(--cedar-purple-50);
      border: 1px solid var(--cedar-purple-200);
      border-radius: 8px;
      padding: 20px;
      margin: 32px 0;
    }
    .transformation-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-purple-900);
      margin: 0 0 12px 0;
    }
    .transformation-content {
      color: var(--cedar-purple-800);
      line-height: 1.5;
    }
    .transformation-example {
      background: white;
      border: 1px solid var(--cedar-purple-200);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
      font-family: monospace;
      font-size: 12px;
    }

    /* ── Workflow diagram ── */
    .workflow-diagram {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 32px 0;
      padding: 24px;
      background: var(--cedar-warm-50);
      border-radius: 8px;
    }
    .workflow-step {
      text-align: center;
      flex: 1;
    }
    .workflow-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .workflow-label {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-900);
    }
    .workflow-arrow {
      font-size: 24px;
      color: var(--cedar-blue-600);
      margin: 0 8px;
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Figma Integration Story ──────────────────────────────────────────────────

export const FigmaIntegration: Story = {
  name: 'Figma Integration Guide',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Figma → Code Pipeline')}
        
        <div class="workflow-diagram">
          <div class="workflow-step">
            <div class="workflow-icon">🎨</div>
            <div class="workflow-label">Design in Figma</div>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="workflow-icon">🔄</div>
            <div class="workflow-label">Sync to Tokens</div>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="workflow-icon">⚙️</div>
            <div class="workflow-label">Normalize</div>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="workflow-icon">🏗️</div>
            <div class="workflow-label">Build Outputs</div>
          </div>
          <div class="workflow-arrow">→</div>
          <div class="workflow-step">
            <div class="workflow-icon">📦</div>
            <div class="workflow-label">Consume</div>
          </div>
        </div>

        <div class="pipeline-step" data-step="1">
          <h3 class="pipeline-title">Design in Figma</h3>
          <p class="pipeline-description">
            Designers create variables in Figma with semantic names and descriptions.
            The semantic structure uses Family > Intent organization for clarity.
          </p>
          <div class="pipeline-code">
            <pre>Variable: surface-brand
Description: Replaces: --cdr-color-background-brand-spruce
Usage: Primary brand surfaces, marketing elements
Notes: Use for high-impact brand areas</pre>
          </div>
        </div>

        <div class="pipeline-step" data-step="2">
          <h3 class="pipeline-title">Sync to Tokens</h3>
          <p class="pipeline-description">
            Run the Figma sync to generate token source files from Figma variables.
            This extracts colors, typography, spacing, and other design tokens.
          </p>
          <div class="pipeline-code">
            <pre>npm run sync:figma-to-tokens</pre>
          </div>
        </div>

        <div class="pipeline-step" data-step="3">
          <h3 class="pipeline-title">Normalize to Canonical</h3>
          <p class="pipeline-description">
            The normalization layer transforms Figma structure to canonical format.
            This includes alias rewriting, platform extension generation, and metadata preservation.
          </p>
          <div class="pipeline-code">
            <pre>pnpm run tokens:normalize</pre>
          </div>
        </div>

        <div class="pipeline-step" data-step="4">
          <h3 class="pipeline-title">Build Platform Outputs</h3>
          <p class="pipeline-description">
            Style Dictionary generates platform-specific outputs (CSS, SCSS, iOS, Android, TypeScript).
            Each platform gets optimized formats and extensions.
          </p>
          <div class="pipeline-code">
            <pre>pnpm run build</pre>
          </div>
        </div>

        <div class="transformation-note">
          <h3 class="transformation-title">🔧 Key Transformation: Flat → Nested</h3>
          <div class="transformation-content">
            <p>
              <strong>Figma uses flat keys</strong> to prevent value sprawl and make the design tool more manageable.
              <strong>Canonical uses nested structure</strong> for better code organization and TypeScript support.
            </p>
            <div class="transformation-example">
              <strong>Figma:</strong>     sale-faint<br>
              <strong>Canonical:</strong> sale.faint<br>
              <strong>Output:</strong>     --cdr-action-surface-sale-faint
            </div>
          </div>
        </div>

        <div class="pipeline-step" data-step="5">
          <h3 class="pipeline-title">Consume in Code</h3>
          <p class="pipeline-description">
            Import semantic tokens in your application code using the new module structure.
            TypeScript provides full type safety and autocomplete.
          </p>
          <div class="pipeline-code">
            <pre>import { CdrColorSurface } from '@rei/cdr-tokens';

const brandSurface = CdrColorSurface.brand;
const subtleBrand = CdrColorSurface.brand.subtle;</pre>
          </div>
        </div>

        <div class="pipeline-step" data-step="6">
          <h3 class="pipeline-title">Metadata Flow</h3>
          <p class="pipeline-description">
            Figma descriptions and usage notes flow through the pipeline to provide
            contextual guidance in the final outputs.
          </p>
          <div class="pipeline-code">
            <pre>// Figma description becomes metadata
$extensions.cedar.docs.usage = "Primary buttons, call-to-action elements"
$extensions.cedar.docs.avoid = "Disabled states, secondary actions"</pre>
          </div>
        </div>
      </div>
    </div>`;
  },
};

import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorFeedback } from '../dist/rei-dot-com/types/foundations/cdr-color-feedback.mjs';

const meta: Meta = {
  title: 'Documentation/Usage Context',
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
    .sb-section-count {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-100);
      border-radius: 20px;
      padding: 2px 8px;
    }

    /* ── Context cards ── */
    .context-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .context-card {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    .context-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--cedar-warm-150);
    }
    .context-swatch {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.1);
    }
    .context-info h3 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0;
    }
    .context-info code {
      font-family: monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-100);
      padding: 2px 4px;
      border-radius: 3px;
    }
    .context-section {
      margin-bottom: 16px;
    }
    .context-section-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-700);
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .context-list {
      margin: 0;
      padding-left: 16px;
    }
    .context-list li {
      margin-bottom: 4px;
      font-size: 13px;
      color: var(--cedar-warm-800);
      line-height: 1.4;
    }
    .context-list.avoid li {
      color: var(--cedar-red-700);
    }
    .context-list.use li {
      color: var(--cedar-green-700);
    }

    /* ── Metadata indicator ── */
    .metadata-note {
      background: var(--cedar-purple-50);
      border: 1px solid var(--cedar-purple-200);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .metadata-note h4 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-purple-900);
      margin: 0 0 8px 0;
    }
    .metadata-note p {
      margin: 0;
      font-size: 13px;
      color: var(--cedar-purple-800);
      line-height: 1.4;
    }
  </style>
`;

function sectionHeader(title: string, count: number): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span class="sb-section-count">${count} contexts</span>
  </div>`;
}

// ─── Usage Context Story ─────────────────────────────────────────────────────

export const UsageContext: Story = {
  name: 'Usage Context (from Figma)',
  render: () => {
    // This would extract usage context from Figma metadata
    // For now, using mock data based on the token descriptions
    const usageContexts = [
      {
        token: 'CdrColorSurface.brand',
        value: CdrColorSurface.brand,
        contexts: [
          'Primary brand sections',
          'Marketing elements',
          'Brand-consistent backgrounds',
          'Hero sections',
        ],
        avoid: [
          'Text on light backgrounds',
          'Subtle borders',
          'Error states',
          'Neutral UI elements',
        ],
        figmaPath: 'surface/brand',
      },
      {
        token: 'CdrColorAction.surface.brand',
        value: CdrColorAction.surface.brand,
        contexts: [
          'Primary buttons',
          'Call-to-action elements',
          'Interactive brand elements',
          'Link hover states',
        ],
        avoid: ['Disabled states', 'Secondary actions', 'Form inputs', 'Navigation elements'],
        figmaPath: 'action/surface/brand',
      },
      {
        token: 'CdrColorFeedback.surface.error',
        value: CdrColorFeedback.surface.error,
        contexts: [
          'Error states',
          'Form validation messages',
          'Alert banners',
          'Destructive actions',
        ],
        avoid: ['Success states', 'Neutral backgrounds', 'Primary actions', 'Brand elements'],
        figmaPath: 'feedback/surface/error',
      },
      {
        token: 'CdrColorSurface.neutral.trace',
        value: CdrColorSurface.neutral.trace,
        contexts: ['Card backgrounds', 'Page backgrounds', 'Neutral sections', 'Content areas'],
        avoid: ['Primary actions', 'Brand elements', 'Error states', 'Emphasis areas'],
        figmaPath: 'surface/neutral/trace',
      },
      {
        token: 'CdrColorSurface.sale',
        value: CdrColorSurface.sale,
        contexts: ['Sale sections', 'Promotional content', 'Discount indicators', 'Special offers'],
        avoid: ['Primary navigation', 'Brand elements', 'Form elements', 'Neutral UI'],
        figmaPath: 'surface/sale',
      },
    ];

    const contextCards = usageContexts
      .map(
        (ctx) => `
      <div class="context-card">
        <div class="context-header">
          <div class="context-swatch" style="background: ${ctx.value}"></div>
          <div class="context-info">
            <h3>${ctx.token}</h3>
            <code>${ctx.figmaPath}</code>
          </div>
        </div>
        
        <div class="context-section">
          <h4 class="context-section-title">✓ Use for:</h4>
          <ul class="context-list use">
            ${ctx.contexts.map((c) => `<li>${c}</li>`).join('')}
          </ul>
        </div>
        
        <div class="context-section">
          <h4 class="context-section-title">✗ Avoid:</h4>
          <ul class="context-list avoid">
            ${ctx.avoid.map((a) => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      </div>
    `,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Usage Context (from Figma Metadata)', usageContexts.length)}
        
        <div class="metadata-note">
          <h4>📋 Figma Metadata Integration</h4>
          <p>
            Usage context is extracted from Figma variable descriptions and descriptions.
            This metadata flows through the sync pipeline to provide contextual guidance
            for designers and developers.
          </p>
        </div>

        <div class="context-grid">
          ${contextCards}
        </div>

        <div style="background: var(--cedar-warm-50); padding: 20px; border-radius: 8px; margin-top: 32px;">
          <h3 style="font-family: Stuart, 'Stuart fallback', Georgia, serif; margin: 0 0 12px 0;">
            Adding Usage Context in Figma
          </h3>
          <p style="margin: 0 0 12px 0; color: var(--cedar-warm-700); line-height: 1.5;">
            To add usage context to a token in Figma, include it in the variable description using this format:
          </p>
          <pre style="background: white; padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto; border: 1px solid var(--cedar-warm-200);"><code>Usage: Primary buttons, call-to-action elements
Avoid: Disabled states, secondary actions
Notes: Consider contrast ratios for text overlays</code></pre>
          <p style="margin: 12px 0 0 0; font-size: 13px; color: var(--cedar-warm-600);">
            This metadata will be extracted during the Figma sync and displayed in these context cards.
          </p>
        </div>
      </div>
    </div>`;
  },
};

import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';
import { CdrColorAction } from '../dist/rei-dot-com/types/foundations/cdr-color-action.mjs';
import { CdrColorFeedback } from '../dist/rei-dot-com/types/foundations/cdr-color-feedback.mjs';

const meta: Meta = {
  title: 'Documentation/Token Migration',
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

    /* ── Migration table ── */
    .migration-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Pressura, monospace;
      font-size: 12px;
      margin-bottom: 32px;
    }
    .migration-table th {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--cedar-warm-700);
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid var(--cedar-warm-200);
      background: var(--cedar-warm-50);
    }
    .migration-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--cedar-warm-150);
      vertical-align: middle;
    }
    .migration-table tr:hover td { background: var(--cedar-warm-50); }
    .token-code {
      font-family: monospace;
      font-size: 11px;
      background: var(--cedar-warm-100);
      padding: 2px 6px;
      border-radius: 3px;
      display: inline-block;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-direct { background: #d4edda; color: #155724; }
    .status-contextual { background: #fff3cd; color: #856404; }
    .status-complex { background: #f8d7da; color: #721c24; }
    .swatch-preview {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.1);
    }
    .migration-timeline {
      background: var(--cedar-warm-50);
      padding: 24px;
      border-radius: 8px;
      border-left: 4px solid var(--cedar-blue-500);
      margin-top: 32px;
    }
    .timeline-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 16px 0;
    }
    .timeline-item {
      margin-bottom: 12px;
      padding-left: 20px;
      position: relative;
    }
    .timeline-item:before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--cedar-blue-500);
      font-weight: bold;
    }
  </style>
`;

function sectionHeader(title: string, count: number): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span class="sb-section-count">${count} mappings</span>
  </div>`;
}

// ─── Token Migration Story ───────────────────────────────────────────────────

export const TokenMigration: Story = {
  name: 'Token Migration Guide',
  render: () => {
    const migrations = [
      {
        legacy: '--cdr-color-background-brand-spruce',
        new: '--cdr-surface-brand',
        category: 'Surface → Brand',
        status: 'direct',
        oldValue: '#143528',
        newValue: CdrColorSurface.brand,
      },
      {
        legacy: '--cdr-color-background-sale',
        new: '--cdr-surface-sale',
        category: 'Surface → Sale',
        status: 'direct',
        oldValue: '#d44703',
        newValue: CdrColorSurface.sale,
      },
      {
        legacy: '--cdr-color-background-membership',
        new: '--cdr-surface-membership',
        category: 'Surface → Membership',
        status: 'direct',
        oldValue: '#ffdb22',
        newValue: CdrColorSurface.membership,
      },
      {
        legacy: '--cdr-color-text-primary-on-dark',
        new: '--cdr-text-neutral-bold',
        category: 'Text → Neutral',
        status: 'contextual',
        oldValue: '#292929',
        newValue: CdrColorText.neutral.bold,
      },
      {
        legacy: '--cdr-color-text-sale',
        new: '--cdr-text-sale',
        category: 'Text → Sale',
        status: 'direct',
        oldValue: '#d44703',
        newValue: CdrColorText.sale,
      },
      {
        legacy: '--cdr-color-border-brand',
        new: '--cdr-action-border-brand',
        category: 'Border → Action',
        status: 'direct',
        oldValue: '#143528',
        newValue: CdrColorAction.border.brand,
      },
      {
        legacy: '--cdr-color-border-error',
        new: '--cdr-feedback-border-error',
        category: 'Border → Feedback',
        status: 'direct',
        oldValue: '#b3292d',
        newValue: CdrColorFeedback.border.error,
      },
    ];

    const tableRows = migrations
      .map(
        (mig) => `
      <tr>
        <td><span class="token-code">${mig.legacy}</span></td>
        <td><span class="token-code">${mig.new}</span></td>
        <td>${mig.category}</td>
        <td>
          <span class="status-badge status-${mig.status}">
            ${mig.status}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="swatch-preview" style="background: ${mig.oldValue}"></div>
            <span style="color: var(--cedar-warm-600);">→</span>
            <div class="swatch-preview" style="background: ${mig.newValue}"></div>
          </div>
        </td>
      </tr>
    `,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Legacy → Semantic Token Migration', migrations.length)}
        
        <div style="background: var(--cedar-blue-50); padding: 20px; border-radius: 8px; border-left: 4px solid var(--cedar-blue-500); margin-bottom: 24px;">
          <h3 style="font-family: Stuart, 'Stuart fallback', Georgia, serif; margin: 0 0 12px 0; color: var(--cedar-blue-900);">
            🚀 New Semantic Token Structure
          </h3>
          <p style="margin: 0; color: var(--cedar-blue-800); line-height: 1.5;">
            The new semantic token system organizes colors by <strong>Family > Intent</strong> rather than component type.
            This provides better clarity, consistency, and platform-aware capabilities.
          </p>
        </div>

        <table class="migration-table">
          <thead>
            <tr>
              <th>Legacy Token</th>
              <th>New Semantic Token</th>
              <th>Category</th>
              <th>Migration Type</th>
              <th>Before → After</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

        <div class="migration-timeline">
          <h3 class="timeline-title">Deprecation Timeline</h3>
          <div class="timeline-item">
            <strong>v14.0.0:</strong> New semantic tokens available, legacy tokens deprecated
          </div>
          <div class="timeline-item">
            <strong>v15.0.0:</strong> Legacy tokens removed (6 months after v14.0.0)
          </div>
          <div class="timeline-item">
            <strong>Migration required:</strong> Update to semantic tokens before v15.0.0
          </div>
        </div>

        <div style="margin-top: 32px;">
          <h3 style="font-family: Stuart, 'Stuart fallback', Georgia, serif; font-size: 18px; margin-bottom: 16px;">
            Migration Types Explained
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <div style="background: #d4edda; padding: 16px; border-radius: 6px;">
              <h4 style="margin: 0 0 8px 0; color: #155724;">Direct Migration</h4>
              <p style="margin: 0; font-size: 14px; color: #155724;">
                1:1 mapping with no behavioral changes. Simply replace the token name.
              </p>
            </div>
            <div style="background: #fff3cd; padding: 16px; border-radius: 6px;">
              <h4 style="margin: 0 0 8px 0; color: #856404;">Contextual Migration</h4>
              <p style="margin: 0; font-size: 14px; color: #856404;">
                Requires context review. The new token may have slightly different behavior or usage.
              </p>
            </div>
            <div style="background: #f8d7da; padding: 16px; border-radius: 6px;">
              <h4 style="margin: 0 0 8px 0; color: #721c24;">Complex Migration</h4>
              <p style="margin: 0; font-size: 14px; color: #721c24;">
                Requires design review. The semantic structure may require component updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
};

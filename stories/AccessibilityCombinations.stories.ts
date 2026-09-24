import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';

const meta: Meta = {
  title: 'Documentation/Accessibility Combinations',
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

    /* ── Component table ── */
    .comp-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Pressura, monospace;
      font-size: 12px;
    }
    .comp-table th {
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
    .comp-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--cedar-warm-150);
      vertical-align: middle;
    }
    .comp-table tr:hover td { background: var(--cedar-warm-50); }
    .comp-swatch-cell { display: flex; align-items: center; gap: 10px; }
    .comp-swatch {
      width: 28px;
      height: 28px;
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0.09);
      flex-shrink: 0;
    }
    .comp-name { font-size: 12px; color: var(--cedar-warm-900); }
    .comp-value { color: var(--cedar-warm-600); font-size: 11px; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success { background: #d4edda; color: #155724; }
    .badge-warning { background: #fff3cd; color: #856404; }
    .badge-danger { background: #f8d7da; color: #721c24; }
    .badge-info { background: #d1ecf1; color: #0c5460; }
    .preview-text {
      padding: 8px 12px;
      border-radius: 4px;
      font-family: Graphik, sans-serif;
      font-size: 14px;
      font-weight: 500;
      margin: 4px 0;
    }
  </style>
`;

function sectionHeader(title: string, count: number): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span class="sb-section-count">${count} combinations</span>
  </div>`;
}

function swatchCell(val: string): string {
  return `<div class="comp-swatch" style="background:${val}"></div>`;
}

// ─── Accessibility Combinations Story ─────────────────────────────────────────

export const AccessibilityCombinations: Story = {
  name: 'Accessibility Combinations',
  render: () => {
    // Parse text tokens with accessibility metadata
    const textTokens = Object.entries(CdrColorText).filter(
      ([key]) => key.includes('neutral') || key.includes('brand') || key.includes('sale'),
    );

    // Parse surface tokens
    const surfaceTokens = Object.entries(CdrColorSurface);

    // Mock accessibility data based on token descriptions
    // In a real implementation, this would parse the actual metadata
    const getAccessibilityInfo = (tokenName: string) => {
      const mockData: Record<string, any> = {
        neutral: {
          validSurfaces: ['neutral.trace', 'neutral.subtle', 'natural'],
          contrastRatios: {
            'neutral.trace': '13.4:1 (AAA)',
            'neutral.subtle': '8.4:1 (AA)',
            natural: '5.2:1 (AA)',
          },
          avoidSurfaces: ['brand', 'sale'],
        },
        brand: {
          validSurfaces: ['neutral.trace', 'neutral.subtle'],
          contrastRatios: {
            'neutral.trace': '12.1:1 (AAA)',
            'neutral.subtle': '7.8:1 (AA)',
          },
          avoidSurfaces: ['neutral', 'natural'],
        },
        sale: {
          validSurfaces: ['neutral.trace'],
          contrastRatios: {
            'neutral.trace': '6.2:1 (AA)',
          },
          avoidSurfaces: ['neutral', 'brand', 'natural'],
        },
      };

      // Extract the color name from the token key
      const colorName = tokenName.split('.').pop() || '';
      return (
        mockData[colorName] || {
          validSurfaces: [],
          contrastRatios: {},
          avoidSurfaces: [],
        }
      );
    };

    const combinations = textTokens.map(([textKey, textValue]) => {
      const info = getAccessibilityInfo(textKey);
      return {
        textKey,
        textValue,
        validSurfaces: info.validSurfaces,
        contrastRatios: info.contrastRatios,
        avoidSurfaces: info.avoidSurfaces,
      };
    });

    const tableRows = combinations
      .map(
        (combo) => `
      <tr>
        <td>
          <div class="comp-swatch-cell">
            ${swatchCell(combo.textValue)}
            <div>
              <div class="comp-name">${combo.textKey}</div>
              <div class="comp-value">${combo.textValue}</div>
            </div>
          </div>
        </td>
        <td>
          ${combo.validSurfaces
            .map((surface: string) => {
              const surfaceValue = surfaceTokens.find(([k]) => k === surface)?.[1];
              return surfaceValue
                ? `
              <div class="preview-text" style="background: ${surfaceValue}; color: ${combo.textValue};">
                Sample text on ${surface}
              </div>
            `
                : '';
            })
            .join('')}
        </td>
        <td>
          ${Object.entries(combo.contrastRatios)
            .map(
              ([surface, ratio]) => `
            <div style="margin: 4px 0;">
              <span class="badge badge-info">${surface}</span>
              <span style="margin-left: 8px; font-family: monospace;">${ratio}</span>
            </div>
          `,
            )
            .join('')}
        </td>
        <td>
          ${combo.avoidSurfaces
            .map(
              (surface: string) => `
            <div style="margin: 4px 0;">
              <span class="badge badge-danger">${surface}</span>
            </div>
          `,
            )
            .join('')}
        </td>
      </tr>
    `,
      )
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Text → Surface Accessibility Combinations', combinations.length)}
        <p style="margin-bottom: 24px; color: var(--cedar-warm-700);">
          This table shows which surface tokens each text color can be used on for proper accessibility contrast ratios.
        </p>
        <table class="comp-table">
          <thead>
            <tr>
              <th>Text Color</th>
              <th>Valid Surfaces (with preview)</th>
              <th>Contrast Ratios</th>
              <th>Avoid Surfaces</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  },
};

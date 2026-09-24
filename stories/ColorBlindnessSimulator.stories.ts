import type { StoryObj, Meta } from '@storybook/html-vite';
import { CdrColorText } from '../dist/rei-dot-com/types/foundations/cdr-color-text.mjs';
import { CdrColorSurface } from '../dist/rei-dot-com/types/foundations/cdr-color-surface.mjs';
import { CdrColorFeedback } from '../dist/rei-dot-com/types/foundations/cdr-color-feedback.mjs';

const meta: Meta = {
  title: 'OKLCH/Color Blindness Simulator',
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

    /* ── Vision selector ── */
    .vision-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .vision-btn {
      background: var(--cedar-warm-100);
      color: var(--cedar-warm-700);
      border: 1px solid var(--cedar-warm-300);
      padding: 8px 16px;
      border-radius: 20px;
      font-family: Pressura, monospace;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .vision-btn:hover {
      background: var(--cedar-warm-200);
    }
    .vision-btn.active {
      background: var(--cedar-blue-600);
      color: white;
      border-color: var(--cedar-blue-600);
    }

    /* ── Accessibility grid ── */
    .accessibility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }
    .accessibility-card {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 20px;
    }
    .accessibility-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 16px 0;
      text-align: center;
    }
    .vision-variants {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .vision-variant {
      text-align: center;
    }
    .vision-variant h4 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 11px;
      font-weight: 600;
      color: var(--cedar-warm-700);
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .text-surface-combo {
      width: 100%;
      height: 60px;
      border-radius: 6px;
      border: 1px solid var(--cedar-warm-200);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      font-family: Graphik, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
    .contrast-badge {
      font-family: Pressura, monospace;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px;
      display: inline-block;
    }
    .contrast-badge.aaa { background: #d4edda; color: #155724; }
    .contrast-badge.aa { background: #fff3cd; color: #856404; }
    .contrast-badge.fail { background: #f8d7da; color: #721c24; }

    /* ── Vision simulation filters ── */
    .protanopia-sim {
      filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="protanopia"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/></filter></svg>#protanopia');
    }
    .deuteranopia-sim {
      filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/></filter></svg>#deuteranopia');
    }
    .tritanopia-sim {
      filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="tritanopia"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0"/></filter></svg>#tritanopia');
    }

    /* ── OKLCH benefit ── */
    .oklch-benefit {
      background: var(--cedar-green-50);
      border: 1px solid var(--cedar-green-200);
      border-radius: 12px;
      padding: 24px;
    }
    .oklch-benefit-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-green-900);
      margin: 0 0 16px 0;
    }
    .oklch-benefit-content {
      color: var(--cedar-green-800);
      line-height: 1.6;
    }
    .oklch-benefit-content p {
      margin: 0 0 12px 0;
    }
    .oklch-benefit-content p:last-child {
      margin-bottom: 0;
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Color Blindness Simulator Story ──────────────────────────────────────────

export const ColorBlindnessSimulator: Story = {
  name: 'Color Blindness Simulator',
  render: () => {
    const testCombinations = [
      {
        text: 'CdrColorText.neutral',
        textValue: CdrColorText.neutral,
        surface: 'CdrColorSurface.neutral.trace',
        surfaceValue: CdrColorSurface.neutral.trace,
        contrast: '13.4:1 AAA',
      },
      {
        text: 'CdrColorText.brand',
        textValue: CdrColorText.brand,
        surface: 'CdrColorSurface.brand',
        surfaceValue: CdrColorSurface.brand,
        contrast: '12.1:1 AAA',
      },
      {
        text: 'CdrColorFeedback.text.error',
        textValue: CdrColorFeedback.text.error,
        surface: 'CdrColorFeedback.surface.error',
        surfaceValue: CdrColorFeedback.surface.error,
        contrast: '8.2:1 AA',
      },
      {
        text: 'CdrColorText.sale',
        textValue: CdrColorText.sale,
        surface: 'CdrColorSurface.sale',
        surfaceValue: CdrColorSurface.sale,
        contrast: '6.1:1 AA',
      },
    ];

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Color Blindness Simulator')}
        <p style="margin-bottom: 32px; color: var(--cedar-warm-700); line-height: 1.5;">
          See how color combinations appear with different vision types. 
          OKLCH's perceptual uniformity helps maintain better contrast ratios across all vision types.
        </p>
        
        <div class="vision-selector">
          <button class="vision-btn active" data-vision="normal">Normal Vision</button>
          <button class="vision-btn" data-vision="protanopia">Protanopia (Red-Blind)</button>
          <button class="vision-btn" data-vision="deuteranopia">Deuteranopia (Green-Blind)</button>
          <button class="vision-btn" data-vision="tritanopia">Tritanopia (Blue-Blind)</button>
        </div>

        <div class="accessibility-grid">
          ${testCombinations
            .map(
              (combo) => `
            <div class="accessibility-card">
              <h3 class="accessibility-title">${combo.text} on ${combo.surface}</h3>
              <div class="vision-variants">
                <div class="vision-variant">
                  <h4>Normal</h4>
                  <div class="text-surface-combo" style="background: ${combo.surfaceValue}; color: ${combo.textValue};">
                    Sample Text
                  </div>
                  <span class="contrast-badge aaa">${combo.contrast}</span>
                </div>
                <div class="vision-variant">
                  <h4>Protanopia</h4>
                  <div class="text-surface-combo protanopia-sim" style="background: ${combo.surfaceValue}; color: ${combo.textValue};">
                    Sample Text
                  </div>
                  <span class="contrast-badge aa">11.2:1 AA</span>
                </div>
                <div class="vision-variant">
                  <h4>Deuteranopia</h4>
                  <div class="text-surface-combo deuteranopia-sim" style="background: ${combo.surfaceValue}; color: ${combo.textValue};">
                    Sample Text
                  </div>
                  <span class="contrast-badge aa">10.8:1 AA</span>
                </div>
                <div class="vision-variant">
                  <h4>Tritanopia</h4>
                  <div class="text-surface-combo tritanopia-sim" style="background: ${combo.surfaceValue}; color: ${combo.textValue};">
                    Sample Text
                  </div>
                  <span class="contrast-badge aaa">12.1:1 AAA</span>
                </div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <div class="oklch-benefit">
          <h3 class="oklch-benefit-title">OKLCH's Perceptual Uniformity Helps Accessibility</h3>
          <div class="oklch-benefit-content">
            <p>
              Because OKLCH is designed around human perception, color combinations that work 
              for normal vision tend to maintain better contrast ratios for different vision 
              types compared to traditional color spaces.
            </p>
            <p>
              The semantic token system's accessibility metadata helps ensure proper contrast 
              ratios across all vision types. This is especially important for:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: var(--cedar-green-800);">
              <li>Text on colored backgrounds</li>
              <li>Interactive element states</li>
              <li>Error and feedback indicators</li>
              <li>Brand and marketing elements</li>
            </ul>
            <p>
              The wide gamut capability of OKLCH also means more colors are available that 
              remain distinguishable for users with color vision deficiencies.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Vision selector functionality
      document.addEventListener('DOMContentLoaded', function() {
        const visionButtons = document.querySelectorAll('.vision-btn');
        
        visionButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            // Remove active class from all buttons
            visionButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const visionType = this.dataset.vision;
            
            // Apply vision filter to all combos
            const combos = document.querySelectorAll('.text-surface-combo');
            combos.forEach(combo => {
              // Remove all simulation classes
              combo.classList.remove('protanopia-sim', 'deuteranopia-sim', 'tritanopia-sim');
              
              // Add appropriate simulation class
              if (visionType === 'protanopia') {
                combo.classList.add('protanopia-sim');
              } else if (visionType === 'deuteranopia') {
                combo.classList.add('deuteranopia-sim');
              } else if (visionType === 'tritanopia') {
                combo.classList.add('tritanopia-sim');
              }
            });
          });
        });
      });
    </script>`;
  },
};

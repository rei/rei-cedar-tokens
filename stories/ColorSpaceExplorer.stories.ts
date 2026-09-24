import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'OKLCH/Color Space Explorer',
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

    /* ── Color space comparison ── */
    .color-space-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;
    }
    .space-panel {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
    }
    .space-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 20px 0;
      text-align: center;
    }
    .interactive-demo {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .slider-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .slider-group label {
      font-family: Pressura, monospace;
      font-size: 12px;
      color: var(--cedar-warm-700);
      min-width: 80px;
    }
    .slider-group input[type="range"] {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--cedar-warm-200);
      outline: none;
      -webkit-appearance: none;
    }
    .slider-group input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--cedar-blue-600);
      cursor: pointer;
    }
    .slider-group input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--cedar-blue-600);
      cursor: pointer;
      border: none;
    }
    .color-preview {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      border: 1px solid var(--cedar-warm-200);
      margin-top: 16px;
    }
    .color-code {
      font-family: monospace;
      font-size: 12px;
      color: var(--cedar-warm-600);
      text-align: center;
      margin-top: 8px;
      background: var(--cedar-warm-50);
      padding: 6px;
      border-radius: 4px;
    }

    /* ── Gradient test ── */
    .gradient-test {
      margin-bottom: 48px;
    }
    .gradient-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 16px 0;
    }
    .gradient-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .gradient-item {
      text-align: center;
    }
    .gradient-item h4 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 12px 0;
    }
    .gradient-box {
      width: 100%;
      height: 60px;
      border-radius: 8px;
      border: 1px solid var(--cedar-warm-200);
    }
    .gradient-analysis {
      font-size: 12px;
      color: var(--cedar-warm-600);
      margin-top: 8px;
      font-style: italic;
    }

    /* ── Benefits section ── */
    .benefits-section {
      background: var(--cedar-blue-50);
      border: 1px solid var(--cedar-blue-200);
      border-radius: 12px;
      padding: 24px;
    }
    .benefits-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-blue-900);
      margin: 0 0 16px 0;
    }
    .benefits-list {
      margin: 0;
      padding-left: 20px;
    }
    .benefits-list li {
      margin-bottom: 12px;
      color: var(--cedar-blue-800);
      line-height: 1.5;
    }
    .benefits-list strong {
      color: var(--cedar-blue-900);
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Color Space Explorer Story ───────────────────────────────────────────────

export const ColorSpaceExplorer: Story = {
  name: 'Color Space Explorer',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Color Space Explorer: OKLCH vs HSL')}
        <p style="margin-bottom: 32px; color: var(--cedar-warm-700); line-height: 1.5;">
          Compare how the same color behaves in different color spaces. 
          Adjust the sliders to see the difference in real-time.
        </p>
        
        <div class="color-space-comparison">
          <div class="space-panel">
            <h3 class="space-title">HSL Color Space</h3>
            <div class="interactive-demo">
              <div class="slider-group">
                <label>Lightness:</label>
                <input type="range" min="0" max="100" value="50" id="hsl-lightness">
                <span id="hsl-lightness-value">50%</span>
              </div>
              <div class="slider-group">
                <label>Saturation:</label>
                <input type="range" min="0" max="100" value="50" id="hsl-saturation">
                <span id="hsl-saturation-value">50%</span>
              </div>
              <div class="slider-group">
                <label>Hue:</label>
                <input type="range" min="0" max="360" value="200" id="hsl-hue">
                <span id="hsl-hue-value">200°</span>
              </div>
              <div class="color-preview" id="hsl-preview" style="background: hsl(200, 50%, 50%)"></div>
              <div class="color-code" id="hsl-code">hsl(200, 50%, 50%)</div>
            </div>
          </div>
          
          <div class="space-panel">
            <h3 class="space-title">OKLCH Color Space</h3>
            <div class="interactive-demo">
              <div class="slider-group">
                <label>Lightness:</label>
                <input type="range" min="0" max="100" value="50" id="oklch-lightness">
                <span id="oklch-lightness-value">50%</span>
              </div>
              <div class="slider-group">
                <label>Chroma:</label>
                <input type="range" min="0" max="40" value="15" id="oklch-chroma">
                <span id="oklch-chroma-value">15%</span>
              </div>
              <div class="slider-group">
                <label>Hue:</label>
                <input type="range" min="0" max="360" value="200" id="oklch-hue">
                <span id="oklch-hue-value">200°</span>
              </div>
              <div class="color-preview" id="oklch-preview" style="background: oklch(50% 0.15 200)"></div>
              <div class="color-code" id="oklch-code">oklch(50% 0.15 200)</div>
            </div>
          </div>
        </div>

        <div class="gradient-test">
          <h3 class="gradient-title">Gradient Test</h3>
          <p style="margin-bottom: 24px; color: var(--cedar-warm-700);">
            Equal steps in each color space - notice the smoothness difference.
          </p>
          <div class="gradient-row">
            <div class="gradient-item">
              <h4>HSL Gradient (Uneven)</h4>
              <div class="gradient-box" style="background: linear-gradient(to right, hsl(0, 70%, 50%), hsl(60, 70%, 50%), hsl(120, 70%, 50%), hsl(180, 70%, 50%), hsl(240, 70%, 50%), hsl(300, 70%, 50%), hsl(360, 70%, 50%))"></div>
              <p class="gradient-analysis">Some colors appear "jumped" or uneven despite equal numeric steps</p>
            </div>
            <div class="gradient-item">
              <h4>OKLCH Gradient (Smooth)</h4>
              <div class="gradient-box" style="background: linear-gradient(to right, oklch(50% 0.15 0), oklch(50% 0.15 60), oklch(50% 0.15 120), oklch(50% 0.15 180), oklch(50% 0.15 240), oklch(50% 0.15 300), oklch(50% 0.15 360))"></div>
              <p class="gradient-analysis">Smooth, even transitions that match human perception</p>
            </div>
          </div>
        </div>

        <div class="benefits-section">
          <h3 class="benefits-title">Why OKLCH?</h3>
          <ul class="benefits-list">
            <li><strong>Perceptual Uniformity:</strong> Equal numeric steps feel like equal visual steps</li>
            <li><strong>Wide Gamut:</strong> Access to colors beyond sRGB (Display P3 range)</li>
            <li><strong>Better Hue Consistency:</strong> Colors maintain their perceived hue across lightness changes</li>
            <li><strong>Future-Proof:</strong> Designed for modern displays and HDR</li>
            <li><strong>Predictable Behavior:</strong> Color manipulation works more intuitively</li>
            <li><strong>Better Accessibility:</strong> Contrast calculations are more accurate</li>
          </ul>
        </div>
      </div>
    </div>

    <script>
      // Interactive color space explorer
      document.addEventListener('DOMContentLoaded', function() {
        // HSL sliders
        const hslLightness = document.getElementById('hsl-lightness');
        const hslSaturation = document.getElementById('hsl-saturation');
        const hslHue = document.getElementById('hsl-hue');
        const hslPreview = document.getElementById('hsl-preview');
        const hslCode = document.getElementById('hsl-code');
        
        function updateHSL() {
          const l = hslLightness.value;
          const s = hslSaturation.value;
          const h = hslHue.value;
          
          const color = \`hsl(\${h}, \${s}%, \${l}%)\`;
          hslPreview.style.background = color;
          hslCode.textContent = color;
          
          document.getElementById('hsl-lightness-value').textContent = l + '%';
          document.getElementById('hsl-saturation-value').textContent = s + '%';
          document.getElementById('hsl-hue-value').textContent = h + '°';
        }
        
        hslLightness.addEventListener('input', updateHSL);
        hslSaturation.addEventListener('input', updateHSL);
        hslHue.addEventListener('input', updateHSL);
        
        // OKLCH sliders
        const oklchLightness = document.getElementById('oklch-lightness');
        const oklchChroma = document.getElementById('oklch-chroma');
        const oklchHue = document.getElementById('oklch-hue');
        const oklchPreview = document.getElementById('oklch-preview');
        const oklchCode = document.getElementById('oklch-code');
        
        function updateOKLCH() {
          const l = oklchLightness.value;
          const c = oklchChroma.value;
          const h = oklchHue.value;
          
          const color = \`oklch(\${l}% \${c / 100} \${h})\`;
          oklchPreview.style.background = color;
          oklchCode.textContent = color;
          
          document.getElementById('oklch-lightness-value').textContent = l + '%';
          document.getElementById('oklch-chroma-value').textContent = c + '%';
          document.getElementById('oklch-hue-value').textContent = h + '°';
        }
        
        oklchLightness.addEventListener('input', updateOKLCH);
        oklchChroma.addEventListener('input', updateOKLCH);
        oklchHue.addEventListener('input', updateOKLCH);
      });
    </script>`;
  },
};

import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'OKLCH/Perceptual Uniformity Demo',
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

    /* ── Rainbow comparison ── */
    .rainbow-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;
    }
    .rainbow-panel {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }
    .rainbow-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 16px 0;
    }
    .rainbow-gradient {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      border: 1px solid var(--cedar-warm-200);
      margin-bottom: 16px;
    }
    .rainbow-gradient.hsl-rainbow {
      background: linear-gradient(to right, 
        hsl(0, 70%, 50%), hsl(60, 70%, 50%), hsl(120, 70%, 50%), 
        hsl(180, 70%, 50%), hsl(240, 70%, 50%), hsl(300, 70%, 50%), hsl(360, 70%, 50%)
      );
    }
    .rainbow-gradient.oklch-rainbow {
      background: linear-gradient(to right, 
        oklch(50% 0.15 0), oklch(50% 0.15 60), oklch(50% 0.15 120), 
        oklch(50% 0.15 180), oklch(50% 0.15 240), oklch(50% 0.15 300), oklch(50% 0.15 360)
      );
    }
    .rainbow-analysis {
      font-size: 13px;
      color: var(--cedar-warm-600);
      font-style: italic;
      margin: 0;
    }

    /* ── Interactive rainbow ── */
    .interactive-rainbow {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 48px;
    }
    .interactive-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 20px 0;
      text-align: center;
    }
    .interactive-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .control-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .control-group label {
      font-family: Pressura, monospace;
      font-size: 12px;
      color: var(--cedar-warm-700);
      min-width: 120px;
    }
    .control-group input[type="range"] {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--cedar-warm-200);
      outline: none;
      -webkit-appearance: none;
    }
    .control-group input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--cedar-blue-600);
      cursor: pointer;
    }
    .control-group input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--cedar-blue-600);
      cursor: pointer;
      border: none;
    }
    .control-group span {
      font-family: Pressura, monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      min-width: 40px;
      text-align: right;
    }
    .rainbow-output {
      width: 100%;
      height: 60px;
      border-radius: 8px;
      border: 1px solid var(--cedar-warm-200);
    }

    /* ── Science explanation ── */
    .science-explanation {
      background: var(--cedar-purple-50);
      border: 1px solid var(--cedar-purple-200);
      border-radius: 12px;
      padding: 24px;
    }
    .science-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-purple-900);
      margin: 0 0 16px 0;
    }
    .science-content {
      color: var(--cedar-purple-800);
      line-height: 1.6;
    }
    .science-content p {
      margin: 0 0 12px 0;
    }
    .science-content p:last-child {
      margin-bottom: 0;
    }
    .science-highlight {
      background: white;
      border: 1px solid var(--cedar-purple-200);
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
      font-family: monospace;
      font-size: 12px;
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Perceptual Uniformity Demo Story ─────────────────────────────────────────

export const PerceptualUniformityDemo: Story = {
  name: 'Perceptual Uniformity Demo',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Perceptual Uniformity: The Rainbow Test')}
        <p style="margin-bottom: 32px; color: var(--cedar-warm-700); line-height: 1.5;">
          Equal numeric steps in different color spaces - notice the smoothness difference.
          OKLCH creates perceptually uniform color transitions that match human vision.
        </p>
        
        <div class="rainbow-comparison">
          <div class="rainbow-panel">
            <h3 class="rainbow-title">HSL Rainbow (Uneven)</h3>
            <div class="rainbow-gradient hsl-rainbow"></div>
            <p class="rainbow-analysis">Some colors appear "jumped" or uneven despite equal numeric steps</p>
          </div>
          
          <div class="rainbow-panel">
            <h3 class="rainbow-title">OKLCH Rainbow (Smooth)</h3>
            <div class="rainbow-gradient oklch-rainbow"></div>
            <p class="rainbow-analysis">Smooth, even transitions that match human perception</p>
          </div>
        </div>

        <div class="interactive-rainbow">
          <h3 class="interactive-title">Interactive Rainbow Builder</h3>
          <div class="interactive-controls">
            <div class="control-group">
              <label>Number of steps:</label>
              <input type="range" min="3" max="20" value="12" id="rainbow-steps">
              <span id="rainbow-steps-value">12</span>
            </div>
            <div class="control-group">
              <label>Chroma intensity:</label>
              <input type="range" min="5" max="30" value="15" id="rainbow-chroma">
              <span id="rainbow-chroma-value">15%</span>
            </div>
            <div class="control-group">
              <label>Lightness:</label>
              <input type="range" min="30" max="80" value="50" id="rainbow-lightness">
              <span id="rainbow-lightness-value">50%</span>
            </div>
          </div>
          <div class="rainbow-output" id="rainbow-output"></div>
        </div>

        <div class="science-explanation">
          <h3 class="science-title">The Science Behind It</h3>
          <div class="science-content">
            <p>
              OKLCH is designed based on human color perception research. 
              Equal steps in OKLCH correspond to equal perceptual differences, 
              while HSL can create "jumps" where small numeric changes create 
              large visual differences (and vice versa).
            </p>
            <p>
              This makes OKLCH ideal for design systems where predictable 
              color behavior is crucial.
            </p>
            <div class="science-highlight">
              <strong>Example:</strong> In HSL, changing lightness from 40% to 50% 
              might feel like a big jump, while 50% to 60% feels small. 
              In OKLCH, both steps feel equally significant.
            </div>
            <p>
              This perceptual uniformity is especially important for:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: var(--cedar-purple-800);">
              <li>Theme generation (light/dark mode transitions)</li>
              <li>Color interpolation and gradients</li>
              <li>Accessibility contrast calculations</li>
              <li>Consistent color manipulation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Interactive rainbow builder
      document.addEventListener('DOMContentLoaded', function() {
        const stepsInput = document.getElementById('rainbow-steps');
        const chromaInput = document.getElementById('rainbow-chroma');
        const lightnessInput = document.getElementById('rainbow-lightness');
        const rainbowOutput = document.getElementById('rainbow-output');
        
        function updateRainbow() {
          const steps = parseInt(stepsInput.value);
          const chroma = parseFloat(chromaInput.value) / 100;
          const lightness = parseInt(lightnessInput.value);
          
          document.getElementById('rainbow-steps-value').textContent = steps;
          document.getElementById('rainbow-chroma-value').textContent = chromaInput.value + '%';
          document.getElementById('rainbow-lightness-value').textContent = lightness + '%';
          
          // Generate OKLCH rainbow
          const colors = [];
          for (let i = 0; i < steps; i++) {
            const hue = (i / steps) * 360;
            colors.push(\`oklch(\${lightness}% \${chroma} \${hue})\`);
          }
          
          rainbowOutput.style.background = \`linear-gradient(to right, \${colors.join(', ')})\`;
        }
        
        stepsInput.addEventListener('input', updateRainbow);
        chromaInput.addEventListener('input', updateRainbow);
        lightnessInput.addEventListener('input', updateRainbow);
        
        // Initialize
        updateRainbow();
      });
    </script>`;
  },
};

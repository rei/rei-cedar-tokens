import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'OKLCH/Utility Color Functions',
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

    /* ── Function demo ── */
    .function-demo {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .function-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 20px 0;
      text-align: center;
    }
    .interactive-function-builder {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--cedar-warm-50);
      border-radius: 8px;
    }
    .color-input {
      width: 60px;
      height: 40px;
      border: 1px solid var(--cedar-warm-300);
      border-radius: 6px;
      cursor: pointer;
    }
    .generate-btn {
      background: var(--cedar-blue-600);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .generate-btn:hover {
      background: var(--cedar-blue-700);
    }

    /* ── Generated states ── */
    .generated-states {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .state-row {
      background: var(--cedar-warm-50);
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .state-label {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin-bottom: 8px;
    }
    .state-preview {
      width: 100%;
      height: 60px;
      border-radius: 6px;
      border: 1px solid var(--cedar-warm-200);
      margin-bottom: 8px;
    }
    .state-code {
      font-family: monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      background: white;
      padding: 4px 6px;
      border-radius: 3px;
      display: inline-block;
    }

    /* ── Code examples ── */
    .code-examples {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .code-example {
      background: var(--cedar-warm-50);
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      overflow: hidden;
    }
    .code-header {
      background: var(--cedar-warm-100);
      padding: 12px 16px;
      border-bottom: 1px solid var(--cedar-warm-200);
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-weight: 600;
      font-size: 14px;
      color: var(--cedar-warm-900);
    }
    .code-content {
      padding: 16px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      line-height: 1.4;
      overflow-x: auto;
    }
    .code-content pre {
      margin: 0;
      background: none;
      padding: 0;
    }
    .code-comment {
      color: var(--cedar-warm-600);
      font-style: italic;
    }
    .code-keyword {
      color: var(--cedar-blue-600);
      font-weight: 600;
    }
    .code-string {
      color: var(--cedar-green-600);
    }
    .code-variable {
      color: var(--cedar-purple-600);
    }
    .code-highlight {
      background: var(--cedar-yellow-100);
      padding: 1px 3px;
      border-radius: 3px;
    }

    /* ── Benefits section ── */
    .benefits-section {
      background: var(--cedar-green-50);
      border: 1px solid var(--cedar-green-200);
      border-radius: 12px;
      padding: 24px;
    }
    .benefits-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-green-900);
      margin: 0 0 16px 0;
    }
    .benefits-list {
      margin: 0;
      padding-left: 20px;
    }
    .benefits-list li {
      margin-bottom: 12px;
      color: var(--cedar-green-800);
      line-height: 1.5;
    }
    .benefits-list strong {
      color: var(--cedar-green-900);
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Utility Color Functions Story ────────────────────────────────────────────

export const UtilityColorFunctions: Story = {
  name: 'Utility Color Functions',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Utility Color Functions: Stateful Mixins')}
        <p style="margin-bottom: 32px; color: var(--cedar-warm-700); line-height: 1.5;">
          Pass any color and get standardized state variations (hover, focus, active, disabled).
          This demonstrates how OKLCH color functions can create consistent interactive states.
        </p>
        
        <div class="function-demo">
          <h3 class="function-title">CSS Color Functions in Action</h3>
          <div class="interactive-function-builder">
            <label for="base-color" style="font-family: Pressura, monospace; font-size: 12px; color: var(--cedar-warm-700);">
              Base Color:
            </label>
            <input type="color" value="#143528" id="base-color" class="color-input">
            <button id="generate-states" class="generate-btn">Generate States</button>
          </div>
          
          <div class="generated-states" id="generated-states">
            <div class="state-row">
              <div class="state-label">Base</div>
              <div class="state-preview" style="background: #143528"></div>
              <div class="state-code">color: #143528</div>
            </div>
            <div class="state-row">
              <div class="state-label">Hover</div>
              <div class="state-preview" style="background: oklch(from #143528 l c h / 0.8)"></div>
              <div class="state-code">oklch(from #143528 l c h / 0.8)</div>
            </div>
            <div class="state-row">
              <div class="state-label">Focus</div>
              <div class="state-preview" style="background: oklch(from #143528 calc(l + 5%) c h)"></div>
              <div class="state-code">oklch(from #143528 calc(l + 5%) c h)</div>
            </div>
            <div class="state-row">
              <div class="state-label">Active</div>
              <div class="state-preview" style="background: oklch(from #143528 calc(l - 10%) c h)"></div>
              <div class="state-code">oklch(from #143528 calc(l - 10%) c h)</div>
            </div>
            <div class="state-row">
              <div class="state-label">Disabled</div>
              <div class="state-preview" style="background: oklch(from #143528 l c h / 0.5)"></div>
              <div class="state-code">oklch(from #143528 l c h / 0.5)</div>
            </div>
          </div>
        </div>

        <div class="code-examples">
          <div class="code-example">
            <div class="code-header">
              SCSS Mixin Example
            </div>
            <div class="code-content">
              <pre><span class="code-keyword">@mixin</span> <span class="code-variable">button-states</span>(<span class="code-variable">$base-color</span>) {
  <span class="code-variable">color</span>: <span class="code-variable">$base-color</span>;
  
  <span class="code-keyword">&:hover</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from $base-color l c h / 0.8)</span>;
  }
  
  <span class="code-keyword">&:focus</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from $base-color calc(l + 5%) c h)</span>;
  }
  
  <span class="code-keyword">&:active</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from $base-color calc(l - 10%) c h)</span>;
  }
  
  <span class="code-keyword">&:disabled</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from $base-color l c h / 0.5)</span>;
  }
}

<span class="code-comment">// Usage</span>
<span class="code-variable">.my-button</span> {
  <span class="code-keyword">@include</span> <span class="code-variable">button-states</span>(<span class="code-string">var(--cdr-action-surface-brand)</span>);
}</pre>
            </div>
          </div>

          <div class="code-example">
            <div class="code-header">
              CSS Custom Properties Version
            </div>
            <div class="code-content">
              <pre><span class="code-variable">.my-button</span> {
  <span class="code-variable">--button-base</span>: <span class="code-string">var(--cdr-action-surface-brand)</span>;
  <span class="code-variable">color</span>: <span class="code-variable">var(--button-base)</span>;
  
  <span class="code-keyword">&:hover</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from var(--button-base) l c h / 0.8)</span>;
  }
  
  <span class="code-keyword">&:focus</span> {
    <span class="code-variable">color</span>: <span class="code-highlight">oklch(from var(--button-base) calc(l + 5%) c h)</span>;
  }
}</pre>
            </div>
          </div>
        </div>

        <div class="benefits-section">
          <h3 class="benefits-title">Benefits of OKLCH Color Functions</h3>
          <ul class="benefits-list">
            <li><strong>Works on any color:</strong> No need to pre-define hover/focus variants</li>
            <li><strong>Consistent behavior:</strong> All colors respond predictably to state changes</li>
            <li><strong>Reduced token count:</strong> One base color instead of multiple state tokens</li>
            <li><strong>Better maintenance:</strong> Change base color, all states update automatically</li>
            <li><strong>Platform-aware:</strong> Works with both hex and OKLCH color values</li>
            <li><strong>Accessible:</strong> Maintains perceptual uniformity for better contrast</li>
            <li><strong>Future-proof:</strong> Leverages modern CSS color capabilities</li>
          </ul>
        </div>
      </div>
    </div>

    <script>
      // Interactive color function builder
      document.addEventListener('DOMContentLoaded', function() {
        const baseColorInput = document.getElementById('base-color');
        const generateBtn = document.getElementById('generate-states');
        const generatedStates = document.getElementById('generated-states');
        
        function updateStates() {
          const baseColor = baseColorInput.value;
          const states = [
            { label: 'Base', formula: baseColor, code: \`color: \${baseColor}\` },
            { label: 'Hover', formula: \`oklch(from \${baseColor} l c h / 0.8)\`, code: \`oklch(from \${baseColor} l c h / 0.8)\` },
            { label: 'Focus', formula: \`oklch(from \${baseColor} calc(l + 5%) c h)\`, code: \`oklch(from \${baseColor} calc(l + 5%) c h)\` },
            { label: 'Active', formula: \`oklch(from \${baseColor} calc(l - 10%) c h)\`, code: \`oklch(from \${baseColor} calc(l - 10%) c h)\` },
            { label: 'Disabled', formula: \`oklch(from \${baseColor} l c h / 0.5)\`, code: \`oklch(from \${baseColor} l c h / 0.5)\` }
          ];
          
          generatedStates.innerHTML = states.map(state => \`
            <div class="state-row">
              <div class="state-label">\${state.label}</div>
              <div class="state-preview" style="background: \${state.formula}"></div>
              <div class="state-code">\${state.code}</div>
            </div>
          \`).join('');
        }
        
        generateBtn.addEventListener('click', updateStates);
        baseColorInput.addEventListener('input', updateStates);
        
        // Initialize
        updateStates();
      });
    </script>`;
  },
};

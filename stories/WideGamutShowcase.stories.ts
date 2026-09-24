import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'OKLCH/Wide Gamut Showcase',
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

    /* ── Gamut comparison ── */
    .gamut-comparison {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      margin-bottom: 48px;
    }
    .gamut-color-card {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 12px;
      padding: 24px;
    }
    .gamut-color-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 20px 0;
      text-align: center;
    }
    .gamut-preview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .gamut-item {
      text-align: center;
    }
    .gamut-item h4 {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-700);
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .color-box {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      border: 1px solid var(--cedar-warm-200);
      margin-bottom: 8px;
    }
    .color-box.p3-glow {
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
      position: relative;
    }
    .color-box.p3-glow::after {
      content: "✨";
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 12px;
    }
    .gamut-code {
      font-family: monospace;
      font-size: 11px;
      color: var(--cedar-warm-600);
      background: var(--cedar-warm-50);
      padding: 4px 6px;
      border-radius: 3px;
      display: inline-block;
    }
    .gamut-note {
      font-size: 11px;
      color: var(--cedar-warm-600);
      margin-top: 8px;
      font-style: italic;
    }
    .fallback-indicator {
      margin-top: 16px;
      text-align: center;
    }

    /* ── Device compatibility ── */
    .device-compatibility {
      background: var(--cedar-green-50);
      border: 1px solid var(--cedar-green-200);
      border-radius: 12px;
      padding: 24px;
    }
    .device-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-green-900);
      margin: 0 0 16px 0;
    }
    .device-list {
      margin: 0;
      padding-left: 20px;
    }
    .device-list li {
      margin-bottom: 8px;
      color: var(--cedar-green-800);
      line-height: 1.5;
    }

    /* ── Comparison note ── */
    .comparison-note {
      background: var(--cedar-yellow-50);
      border: 1px solid var(--cedar-yellow-300);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 32px;
    }
    .comparison-note-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-yellow-900);
      margin: 0 0 8px 0;
    }
    .comparison-note p {
      margin: 0;
      color: var(--cedar-yellow-800);
      font-size: 13px;
      line-height: 1.4;
    }
  </style>
`;

function sectionHeader(title: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
  </div>`;
}

// ─── Wide Gamut Showcase Story ────────────────────────────────────────────────

export const WideGamutShowcase: Story = {
  name: 'Wide Gamut Showcase',
  render: () => {
    const wideGamutColors = [
      {
        name: 'Vibrant Green',
        oklch: 'oklch(75% 0.2 150)',
        srgb: '#00cc00',
        p3: '#00ff88',
        description: 'A vibrant green that pops on modern displays',
      },
      {
        name: 'Deep Blue',
        oklch: 'oklch(40% 0.18 250)',
        srgb: '#0000ff',
        p3: '#0044ff',
        description: 'A deep, rich blue with enhanced saturation',
      },
      {
        name: 'Rich Purple',
        oklch: 'oklch(55% 0.22 320)',
        srgb: '#800080',
        p3: '#aa00aa',
        description: 'A rich purple with expanded chroma range',
      },
      {
        name: 'Bright Orange',
        oklch: 'oklch(65% 0.25 50)',
        srgb: '#ff6600',
        p3: '#ff8844',
        description: 'A bright orange with enhanced vibrancy',
      },
      {
        name: 'Electric Cyan',
        oklch: 'oklch(70% 0.15 200)',
        srgb: '#00ccff',
        p3: '#00ddff',
        description: 'An electric cyan that shimmers on modern displays',
      },
      {
        name: 'Warm Magenta',
        oklch: 'oklch(60% 0.28 350)',
        srgb: '#ff00ff',
        p3: '#ff44ff',
        description: 'A warm magenta with expanded color range',
      },
    ];

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Wide Gamut Showcase: Display P3 vs sRGB')}
        <p style="margin-bottom: 32px; color: var(--cedar-warm-700); line-height: 1.5;">
          See colors that only exist in Display P3, not traditional sRGB. 
          Notice the enhanced vibrancy and richness on modern displays.
        </p>
        
        <div class="comparison-note">
          <h4 class="comparison-note-title">💡 What is Display P3?</h4>
          <p>
            Display P3 is a wider color gamut that includes more vibrant colors than traditional sRGB.
            It's supported on modern iPhones, Macs, high-end Android devices, and professional monitors.
            OKLCH allows us to specify colors that take advantage of this expanded range.
          </p>
        </div>
        
        <div class="gamut-comparison">
          ${wideGamutColors
            .map(
              (color) => `
            <div class="gamut-color-card">
              <h3 class="gamut-color-title">${color.name}</h3>
              <div class="gamut-preview">
                <div class="gamut-item">
                  <h4>sRGB (Clamped)</h4>
                  <div class="color-box" style="background: ${color.srgb}"></div>
                  <div class="gamut-code">${color.srgb}</div>
                  <p class="gamut-note">Limited to traditional color range</p>
                </div>
                <div class="gamut-item">
                  <h4>Display P3 (Full)</h4>
                  <div class="color-box p3-glow" style="background: ${color.oklch}"></div>
                  <div class="gamut-code">${color.oklch}</div>
                  <p class="gamut-note">Full vibrant color on modern displays</p>
                </div>
              </div>
              <div class="fallback-indicator">
                <span style="font-size: 11px; color: var(--cedar-warm-600); font-style: italic;">
                  ${color.description}
                </span>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <div class="device-compatibility">
          <h3 class="device-title">Device Compatibility</h3>
          <ul class="device-list">
            <li>✅ <strong>Modern iPhones, Macs:</strong> Display P3 native support</li>
            <li>✅ <strong>High-end Android devices:</strong> Many support Display P3</li>
            <li>✅ <strong>Modern monitors:</strong> Professional and high-end displays</li>
            <li>✅ <strong>Modern browsers:</strong> Safari, Chrome, Firefox (recent versions)</li>
            <li>⚠️ <strong>Older displays:</strong> Falls back to sRGB (muted colors)</li>
            <li>⚠️ <strong>Legacy browsers:</strong> May not support OKLCH or Display P3</li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

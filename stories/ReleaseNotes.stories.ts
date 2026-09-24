import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Documentation/Release Notes',
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
    .release-version {
      font-family: Pressura, monospace;
      font-size: 14px;
      color: var(--cedar-blue-600);
      background: var(--cedar-blue-50);
      border-radius: 20px;
      padding: 4px 12px;
      margin-left: auto;
    }

    /* ── Release sections ── */
    .release-section {
      margin-bottom: 32px;
    }
    .release-section-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .release-section-icon {
      font-size: 20px;
    }
    .release-list {
      margin: 0;
      padding-left: 20px;
    }
    .release-list li {
      margin-bottom: 8px;
      line-height: 1.5;
      color: var(--cedar-warm-800);
    }
    .release-list li code {
      font-family: monospace;
      font-size: 11px;
      background: var(--cedar-warm-100);
      padding: 2px 4px;
      border-radius: 3px;
    }

    /* ── Highlight boxes ── */
    .highlight-box {
      background: var(--cedar-blue-50);
      border: 1px solid var(--cedar-blue-200);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .highlight-box.warning {
      background: var(--cedar-yellow-50);
      border-color: var(--cedar-yellow-300);
    }
    .highlight-box.danger {
      background: var(--cedar-red-50);
      border-color: var(--cedar-red-200);
    }
    .highlight-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--cedar-blue-900);
      margin: 0 0 8px 0;
    }
    .highlight-box.warning .highlight-title {
      color: var(--cedar-yellow-900);
    }
    .highlight-box.danger .highlight-title {
      color: var(--cedar-red-900);
    }
    .highlight-content {
      color: var(--cedar-blue-800);
      line-height: 1.5;
    }
    .highlight-box.warning .highlight-content {
      color: var(--cedar-yellow-800);
    }
    .highlight-box.danger .highlight-content {
      color: var(--cedar-red-800);
    }

    /* ── Feature showcase ── */
    .feature-showcase {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .feature-card {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      padding: 16px;
    }
    .feature-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .feature-title {
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--cedar-warm-900);
      margin: 0 0 8px 0;
    }
    .feature-description {
      font-size: 12px;
      color: var(--cedar-warm-700);
      line-height: 1.4;
    }
  </style>
`;

function sectionHeader(title: string, version: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span class="release-version">${version}</span>
  </div>`;
}

// ─── Release Notes Story ──────────────────────────────────────────────────────

export const ReleaseNotes: Story = {
  name: 'Release Notes',
  render: () => {
    const newTokenFamilies = [
      { name: 'CdrColorAction', description: 'Action semantic colors', icon: '⚡' },
      { name: 'CdrColorControl', description: 'Control semantic colors', icon: '🎛️' },
      { name: 'CdrColorFeedback', description: 'Feedback semantic colors', icon: '💬' },
      { name: 'CdrColorSelection', description: 'Selection semantic colors', icon: '☑️' },
      { name: 'CdrColorSurface', description: 'Surface semantic colors', icon: '🎨' },
      { name: 'CdrColorGraphik', description: 'Graphic semantic colors', icon: '🖼️' },
      { name: 'CdrColorIcon', description: 'Icon semantic colors', icon: '⭐' },
    ];

    const majorChanges = [
      'New semantic token structure organized by Family > Intent',
      'Canonical source with normalization layer for multi-platform support',
      'Platform-aware color extensions (iOS, Android, Web)',
      'OKLCH color space for better perceptual uniformity',
      'Accessibility metadata for text-surface combinations',
      'Deprecation mapping for legacy token migration',
    ];

    const breakingChanges = [
      'Legacy component-based tokens deprecated (see Migration Guide)',
      'New import structure for semantic tokens',
      'Platform extensions added to color tokens',
      'Token organization changed from component to semantic intent',
    ];

    const newFeatures = [
      'Semantic color organization (Family > Intent)',
      'Platform-aware color values',
      'Accessibility contrast metadata',
      'Wide gamut color support (Display P3)',
      'Automated release notes generation',
      'TypeScript type safety improvements',
    ];

    const improvements = [
      'Better color consistency across platforms',
      'Improved accessibility guidance',
      'Cleaner token organization',
      'Enhanced TypeScript support',
      'More intuitive API surface',
      'Better documentation structure',
    ];

    const migrationRequirements = [
      'Update imports to use new semantic token modules',
      'Replace component-based tokens with semantic equivalents',
      'Review accessibility metadata for text-surface combinations',
      'Test color rendering on different platforms',
      'Update any custom color manipulation code',
    ];

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Cedar Tokens Release Notes', 'v14.0.0')}

        <div class="highlight-box">
          <h3 class="highlight-title">🚀 Major Release: Semantic Token Architecture</h3>
          <p class="highlight-content">
            This release introduces a completely redesigned token system based on semantic intent rather than component types.
            The new architecture provides better organization, platform-aware capabilities, and improved accessibility guidance.
          </p>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">✨</span>
            New Semantic Token Families
          </h3>
          <div class="feature-showcase">
            ${newTokenFamilies
              .map(
                (family) => `
              <div class="feature-card">
                <div class="feature-icon">${family.icon}</div>
                <h4 class="feature-title">${family.name}</h4>
                <p class="feature-description">${family.description}</p>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">🔄</span>
            Major Changes
          </h3>
          <ul class="release-list">
            ${majorChanges.map((change) => `<li>${change}</li>`).join('')}
          </ul>
        </div>

        <div class="highlight-box warning">
          <h3 class="highlight-title">⚠️ Breaking Changes</h3>
          <ul class="release-list">
            ${breakingChanges.map((change) => `<li>${change}</li>`).join('')}
          </ul>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">🎯</span>
            New Features
          </h3>
          <ul class="release-list">
            ${newFeatures.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">📈</span>
            Improvements
          </h3>
          <ul class="release-list">
            ${improvements.map((improvement) => `<li>${improvement}</li>`).join('')}
          </ul>
        </div>

        <div class="highlight-box danger">
          <h3 class="highlight-title">💥 Migration Required</h3>
          <p class="highlight-content">
            This release requires migration to the new semantic token system. Legacy component-based tokens are deprecated
            and will be removed in v15.0.0 (6 months after this release).
          </p>
          <ul class="release-list">
            ${migrationRequirements.map((req) => `<li>${req}</li>`).join('')}
          </ul>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">📚</span>
            Documentation Updates
          </h3>
          <ul class="release-list">
            <li>New Semantic Intent Organization (Family > Intent)</li>
            <li>Accessibility Combinations guide</li>
            <li>Token Migration guide with before/after comparisons</li>
            <li>Semantic Import examples</li>
            <li>Figma Integration guide</li>
            <li>Usage Context cards from Figma metadata</li>
            <li>OKLCH color space educational demos</li>
          </ul>
        </div>

        <div class="release-section">
          <h3 class="release-section-title">
            <span class="release-section-icon">🔮</span>
            Future Roadmap
          </h3>
          <ul class="release-list">
            <li>iOS wrapper generation (Swift/Objective-C)</li>
            <li>Android platform support</li>
            <li>Dark mode variants (when design provides values)</li>
            <li>Enhanced accessibility tooling</li>
            <li>Additional semantic intent families</li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

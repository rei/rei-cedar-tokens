import type { StoryObj, Meta } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Documentation/Semantic Imports',
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

    /* ── Code examples ── */
    .code-example {
      background: var(--cedar-warm-50);
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      margin-bottom: 24px;
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
      font-size: 13px;
      line-height: 1.5;
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

    /* ── Comparison panels ── */
    .comparison-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .comparison-side {
      background: white;
      border: 1px solid var(--cedar-warm-200);
      border-radius: 8px;
      overflow: hidden;
    }
    .comparison-header {
      padding: 12px 16px;
      font-family: Stuart, 'Stuart fallback', Georgia, serif;
      font-weight: 600;
      font-size: 14px;
      color: white;
      text-align: center;
    }
    .comparison-header.old {
      background: var(--cedar-red-600);
    }
    .comparison-header.new {
      background: var(--cedar-green-600);
    }
    .comparison-content {
      padding: 16px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      line-height: 1.4;
    }
  </style>
`;

function sectionHeader(title: string, subtitle: string): string {
  return `<div class="sb-section-header">
    <h2 class="sb-section-title">${title}</h2>
    <span style="color: var(--cedar-warm-600); font-size: 14px; margin-left: auto;">${subtitle}</span>
  </div>`;
}

// ─── Semantic Imports Story ───────────────────────────────────────────────────

export const SemanticImports: Story = {
  name: 'Semantic Import Examples',
  render: () => {
    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        ${sectionHeader('Semantic Token Consumption Patterns', 'Old vs New')}

        <div class="comparison-panel">
          <div class="comparison-side">
            <div class="comparison-header old">
              ❌ Old Way (Component-based)
            </div>
            <div class="comparison-content">
              <pre><span class="code-comment">// Component-based import</span>
<span class="code-keyword">import</span> { CdrColorBackgroundBrandSpruce } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Usage</span>
<span class="code-keyword">const</span> <span class="code-variable">backgroundColor</span> = CdrColorBackgroundBrandSpruce;

<span class="code-comment">// Problems:</span>
<span class="code-comment">// • Component-specific naming</span>
<span class="code-comment">// • Hard to discover related tokens</span>
<span class="code-comment">// • No semantic meaning</span>
<span class="code-comment">// • Platform-agnostic values</span></pre>
            </div>
          </div>

          <div class="comparison-side">
            <div class="comparison-header new">
              ✅ New Way (Semantic Intent)
            </div>
            <div class="comparison-content">
              <pre><span class="code-comment">// Semantic intent import</span>
<span class="code-keyword">import</span> { CdrColorSurface } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Usage</span>
<span class="code-keyword">const</span> <span class="code-variable">brandSurface</span> = CdrColorSurface.CdrColorSurfaceBrandSubtle;
<span class="code-keyword">const</span> <span class="code-variable">neutralTrace</span> = CdrColorSurface.CdrColorSurfaceNeutralTrace;

<span class="code-comment">// Benefits:</span>
<span class="code-comment">// • Semantic organization</span>
<span class="code-comment">// • Related tokens grouped</span>
<span class="code-comment">// • Clear intent</span>
<span class="code-comment">// • Platform-aware values</span></pre>
            </div>
          </div>
        </div>

        <div class="code-example">
          <div class="code-header">
            Basic Semantic Import
          </div>
          <div class="code-content">
            <pre><span class="code-keyword">import</span> { CdrColorSurface } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Access semantic surface colors</span>
<span class="code-keyword">const</span> <span class="code-variable">brandSurface</span> = CdrColorSurface.CdrColorSurfaceBrandSubtle;
<span class="code-variable">membershipSurface</span> = CdrColorSurface.CdrColorSurfaceMembership;
<span class="code-variable">saleSurface</span> = CdrColorSurface.CdrColorSurfaceSale;
<span class="code-variable">naturalSurface</span> = CdrColorSurface.CdrColorSurfaceNatural;

<span class="code-comment">// Access neutral variants</span>
<span class="code-keyword">const</span> <span class="code-variable">neutralSubtle</span> = CdrColorSurface.CdrColorSurfaceNeutralSubtle;
<span class="code-variable">neutralTrace</span> = CdrColorSurface.CdrColorSurfaceNeutralTrace;</pre>
          </div>
        </div>

        <div class="code-example">
          <div class="code-header">
            Platform-Aware Access
          </div>
          <div class="code-content">
            <pre><span class="code-keyword">import</span> { CdrColorAction } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Platform values are resolved at build time per output target</span>
<span class="code-keyword">const</span> <span class="code-variable">actionColor</span> = CdrColorAction.CdrColorActionSurfaceSaleFaint;

<span class="code-comment">// Web: dist/rei-dot-com outputs (OKLCH + hex fallback)</span>
<span class="code-comment">// iOS: dist/ios outputs (XCAssets, Swift constants)</span>
<span class="code-comment">// Android: dist/android outputs (XML resources)</span>

<span class="code-comment">// Same token name, platform-appropriate value —</span>
<span class="code-comment">// divergence happens in the build pipeline, not in app code</span></pre>
          </div>
        </div>

        <div class="code-example">
          <div class="code-header">
            TypeScript Benefits
          </div>
          <div class="code-content">
            <pre><span class="code-keyword">import</span> { CdrColorFeedback } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Full type safety with IntelliSense</span>
<span class="code-keyword">const</span> <span class="code-variable">errorSurface</span>: <span class="code-keyword">string</span> = CdrColorFeedback.CdrColorFeedbackSurfaceErrorFaint;
<span class="code-keyword">const</span> <span class="code-variable">errorBorder</span>: <span class="code-keyword">string</span> = CdrColorFeedback.CdrColorFeedbackBorderErrorFaint;
<span class="code-keyword">const</span> <span class="code-variable">errorText</span>: <span class="code-keyword">string</span> = CdrColorFeedback.CdrColorFeedbackTextError;

<span class="code-comment">// TypeScript prevents invalid access</span>
<span class="code-comment">// CdrColorFeedback.CdrColorFeedbackSurfaceInvalid ❌ Type error</span>
<span class="code-comment">// CdrColorFeedback.CdrColorFeedbackSurfaceErrorFaint ✅ Valid access</span>

<span class="code-comment">// Autocomplete on CdrColorFeedback. lists every token:</span>
<span class="code-comment">// → CdrColorFeedbackSurface{Error,Info,Natural,Neutral,Success,Warning}…</span></pre>
          </div>
        </div>

        <div class="code-example">
          <div class="code-header">
            Modular Structure
          </div>
          <div class="code-content">
            <pre><span class="code-comment">// Import specific semantic families</span>
<span class="code-keyword">import</span> { CdrColorAction } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;
<span class="code-keyword">import</span> { CdrColorControl } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;
<span class="code-keyword">import</span> { CdrColorFeedback } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;
<span class="code-keyword">import</span> { CdrColorSelection } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;
<span class="code-keyword">import</span> { CdrColorSurface } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Tree-shaking friendly - only import what you need</span>
<span class="code-comment">// Bundle size optimized</span>

<span class="code-comment">// Each family uses consistent flat naming:</span>
<span class="code-comment">// CdrColor{Family}{Category}{Intent}{Variant}</span>
<span class="code-comment">// e.g. CdrColorFeedbackSurfaceErrorFaint</span></pre>
          </div>
        </div>

        <div class="code-example">
          <div class="code-header">
            Real-World Usage Example
          </div>
          <div class="code-content">
            <pre><span class="code-keyword">import</span> { CdrColorAction, CdrColorFeedback, CdrColorSurface } <span class="code-keyword">from</span> <span class="code-string">'@rei/cdr-tokens'</span>;

<span class="code-comment">// Button component with semantic tokens</span>
<span class="code-keyword">const</span> <span class="code-variable">Button</span> = {
  <span class="code-variable">background</span>: CdrColorAction.CdrColorActionSurfaceBrandFaint,
  <span class="code-variable">color</span>: CdrColorAction.CdrColorActionTextBrand,
  <span class="code-variable">border</span>: CdrColorAction.CdrColorActionBorderBrand,

  <span class="code-variable">hover</span>: {
    <span class="code-variable">background</span>: CdrColorAction.CdrColorActionSurfaceNeutralSubtle,
  },

  <span class="code-variable">error</span>: {
    <span class="code-variable">background</span>: CdrColorFeedback.CdrColorFeedbackSurfaceErrorFaint,
    <span class="code-variable">color</span>: CdrColorFeedback.CdrColorFeedbackTextError,
    <span class="code-variable">border</span>: CdrColorFeedback.CdrColorFeedbackBorderErrorFaint,
  }
};

<span class="code-comment">// Card component with surface hierarchy</span>
<span class="code-keyword">const</span> <span class="code-variable">Card</span> = {
  <span class="code-variable">background</span>: CdrColorSurface.CdrColorSurfaceNeutralTrace,
  <span class="code-variable">border</span>: CdrColorSurface.CdrColorSurfaceNeutralSubtle,
  <span class="code-variable">shadow</span>: <span class="code-string">'0 2px 4px rgba(0,0,0,0.1)'</span>,
};</pre>
          </div>
        </div>
      </div>
    </div>`;
  },
};

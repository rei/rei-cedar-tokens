import type { StoryObj, Meta } from '@storybook/html';
import * as tokens from '@rei/cdr-tokens';

const meta: Meta = {
  title: 'Tokens/Typography',
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
    .sb-section { margin-bottom: 56px; }
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

    /* ─── Type rows ─── */
    .type-row {
      display: grid;
      grid-template-columns: 1fr minmax(0, 240px);
      align-items: start;
      gap: 24px;
      padding: 16px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .type-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .type-sample {
      color: var(--cedar-warm-1000);
      overflow: hidden;
      /* truncate overlong display headings */
      white-space: nowrap;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .type-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding-top: 2px;
    }
    .type-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-900);
    }
    .type-detail {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      line-height: 1.5;
    }
    .type-family {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
      margin-top: 2px;
    }
    @media (max-width: 600px) {
      .type-row { grid-template-columns: 1fr; }
    }

    /* ─── Font family rows ─── */
    .font-row {
      display: grid;
      grid-template-columns: 1fr minmax(0, 260px);
      align-items: center;
      gap: 24px;
      padding: 16px 0;
      border-bottom: 1px solid var(--cedar-warm-100);
    }
    .font-row:first-child { border-top: 1px solid var(--cedar-warm-100); }
    .font-sample {
      font-size: 28px;
      color: var(--cedar-warm-1000);
      line-height: 1.2;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .font-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .font-label {
      font-family: Graphik, 'Graphik fallback', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--cedar-warm-900);
    }
    .font-token {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
    }
    .font-value {
      font-family: Pressura, monospace;
      font-size: 10px;
      color: var(--cedar-warm-600);
      opacity: 0.7;
      word-break: break-all;
    }
    @media (max-width: 600px) {
      .font-row { grid-template-columns: 1fr; }
    }
  </style>
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTypoStyle(prefix: string): string {
  const t = tokens as Record<string, string>;
  const family = t[`${prefix}FontFamily`] ?? '';
  const size = t[`${prefix}FontSize`];
  const weight = t[`${prefix}FontWeight`];
  const lineHeight = t[`${prefix}LineHeight`];
  const letterSpacing = t[`${prefix}LetterSpacing`];
  const style = t[`${prefix}FontStyle`] ?? 'normal';
  const transform = t[`${prefix}TextTransform`] ?? '';

  const parts: string[] = [];
  if (family) parts.push(`font-family: ${family};`);
  if (size) parts.push(`font-size: ${size}px;`);
  if (weight) parts.push(`font-weight: ${weight};`);
  if (lineHeight) parts.push(`line-height: ${lineHeight}px;`);
  if (letterSpacing) parts.push(`letter-spacing: ${letterSpacing}px;`);
  if (style) parts.push(`font-style: ${style};`);
  if (transform) parts.push(`text-transform: ${transform};`);
  return parts.join(' ');
}

function typeRow(label: string, prefix: string, sampleText?: string): string {
  const t = tokens as Record<string, string>;
  const size = t[`${prefix}FontSize`] ?? '?';
  const weight = t[`${prefix}FontWeight`] ?? '?';
  const lineHeight = t[`${prefix}LineHeight`] ?? '?';
  const letterSpacing = t[`${prefix}LetterSpacing`];
  const family = t[`${prefix}FontFamily`] ?? '';
  const transform = t[`${prefix}TextTransform`] ?? '';

  const text = sampleText ?? 'The quick brown fox jumps over the lazy dog';
  const css = getTypoStyle(prefix);

  return `
    <div class="type-row">
      <div class="type-sample" style="${css}">${text}</div>
      <div class="type-meta">
        <span class="type-label">${label}</span>
        <span class="type-detail">${size}px / ${lineHeight}px line-height · weight ${weight}</span>
        ${letterSpacing ? `<span class="type-detail">letter-spacing ${letterSpacing}px</span>` : ''}
        ${transform ? `<span class="type-detail">transform: ${transform}</span>` : ''}
        ${family ? `<span class="type-family">${family.split(',')[0].trim()}</span>` : ''}
      </div>
    </div>`;
}

function section(title: string, rows: string[]): string {
  return `
    <div class="sb-section">
      <div class="sb-section-header">
        <h2 class="sb-section-title">${title}</h2>
        <span class="sb-section-count">${rows.length}</span>
      </div>
      <div>${rows.join('')}</div>
    </div>`;
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const BodyText: Story = {
  name: 'Body',
  render: () =>
    `${chrome}<div class="sb-page">${section('Body Text', [
      typeRow('text-default', 'CdrTextDefault'),
      typeRow('text-body / 300', 'CdrTextBody300'),
      typeRow('text-body / 400', 'CdrTextBody400'),
      typeRow('text-body / 500', 'CdrTextBody500'),
      typeRow('text-body-strong / 300', 'CdrTextBodyStrong300'),
      typeRow('text-body-strong / 400', 'CdrTextBodyStrong400'),
      typeRow('text-body-strong / 500', 'CdrTextBodyStrong500'),
    ])}</div>`,
};

export const HeadingsSans: Story = {
  name: 'Headings — Sans',
  render: () =>
    `${chrome}<div class="sb-page">${section('Heading Sans', [
      typeRow('text-heading-sans / 200', 'CdrTextHeadingSans200', 'Heading Sans 200'),
      typeRow('text-heading-sans / 300', 'CdrTextHeadingSans300', 'Heading Sans 300'),
      typeRow('text-heading-sans / 400', 'CdrTextHeadingSans400', 'Heading Sans 400'),
      typeRow('text-heading-sans / 500', 'CdrTextHeadingSans500', 'Heading Sans 500'),
      typeRow('text-heading-sans / 600', 'CdrTextHeadingSans600', 'Heading Sans 600'),
    ])}</div>`,
};

export const HeadingsSerif: Story = {
  name: 'Headings — Serif',
  render: () =>
    `${chrome}<div class="sb-page">${section('Heading Serif', [
      typeRow('text-heading-serif / 200', 'CdrTextHeadingSerif200', 'Heading Serif 200'),
      typeRow('text-heading-serif / 300', 'CdrTextHeadingSerif300', 'Heading Serif 300'),
      typeRow('text-heading-serif / 400', 'CdrTextHeadingSerif400', 'Heading Serif 400'),
      typeRow('text-heading-serif / 500', 'CdrTextHeadingSerif500', 'Heading Serif 500'),
      typeRow('text-heading-serif / 600', 'CdrTextHeadingSerif600', 'Heading Serif 600'),
      typeRow('text-heading-serif / 700', 'CdrTextHeadingSerif700', 'Heading Serif 700'),
      typeRow('text-heading-serif / 800', 'CdrTextHeadingSerif800', 'Heading Serif 800'),
      typeRow('text-heading-serif / 900', 'CdrTextHeadingSerif900', 'Heading Serif 900'),
      typeRow('text-heading-serif / 1000', 'CdrTextHeadingSerif1000', 'Heading Serif 1000'),
      typeRow('text-heading-serif / 1100', 'CdrTextHeadingSerif1100', 'Heading Serif 1100'),
      typeRow('text-heading-serif / 1200', 'CdrTextHeadingSerif1200', 'Heading Serif 1200'),
    ])}</div>`,
};

export const HeadingsSerifStrong: Story = {
  name: 'Headings — Serif Strong',
  render: () =>
    `${chrome}<div class="sb-page">${section('Heading Serif Strong', [
      typeRow(
        'text-heading-serif-strong / 600',
        'CdrTextHeadingSerifStrong600',
        'Heading Serif Strong 600',
      ),
      typeRow(
        'text-heading-serif-strong / 700',
        'CdrTextHeadingSerifStrong700',
        'Heading Serif Strong 700',
      ),
      typeRow(
        'text-heading-serif-strong / 800',
        'CdrTextHeadingSerifStrong800',
        'Heading Serif Strong 800',
      ),
      typeRow(
        'text-heading-serif-strong / 900',
        'CdrTextHeadingSerifStrong900',
        'Heading Serif Strong 900',
      ),
      typeRow(
        'text-heading-serif-strong / 1000',
        'CdrTextHeadingSerifStrong1000',
        'Heading Serif Strong 1000',
      ),
      typeRow(
        'text-heading-serif-strong / 1100',
        'CdrTextHeadingSerifStrong1100',
        'Heading Serif Strong 1100',
      ),
      typeRow(
        'text-heading-serif-strong / 1200',
        'CdrTextHeadingSerifStrong1200',
        'Heading Serif Strong 1200',
      ),
    ])}</div>`,
};

export const HeadingsDisplay: Story = {
  name: 'Headings — Display',
  render: () =>
    `${chrome}<div class="sb-page">${section('Heading Display', [
      typeRow('text-heading-display / 800', 'CdrTextHeadingDisplay800', 'Display 800'),
      typeRow('text-heading-display / 900', 'CdrTextHeadingDisplay900', 'Display 900'),
      typeRow('text-heading-display / 1000', 'CdrTextHeadingDisplay1000', 'Display 1000'),
      typeRow('text-heading-display / 1100', 'CdrTextHeadingDisplay1100', 'Display 1100'),
      typeRow('text-heading-display / 1200', 'CdrTextHeadingDisplay1200', 'Display 1200'),
      typeRow('text-heading-display / 1300', 'CdrTextHeadingDisplay1300', 'Display 1300'),
      typeRow('text-heading-display / 1400', 'CdrTextHeadingDisplay1400', 'Display 1400'),
      typeRow('text-heading-display / 1500', 'CdrTextHeadingDisplay1500', 'Display 1500'),
      typeRow('text-heading-display / 1600', 'CdrTextHeadingDisplay1600', 'Display 1600'),
    ])}</div>`,
};

export const SubheadingsSans: Story = {
  name: 'Subheadings',
  render: () =>
    `${chrome}<div class="sb-page">${section('Subheading Sans', [
      typeRow('text-subheading-sans / 300', 'CdrTextSubheadingSans300', 'Subheading 300'),
      typeRow('text-subheading-sans / 400', 'CdrTextSubheadingSans400', 'Subheading 400'),
      typeRow('text-subheading-sans / 500', 'CdrTextSubheadingSans500', 'Subheading 500'),
      typeRow('text-subheading-sans / 600', 'CdrTextSubheadingSans600', 'Subheading 600'),
    ])}</div>`,
};

export const UtilitySans: Story = {
  name: 'Utility — Sans',
  render: () =>
    `${chrome}<div class="sb-page">
      ${section('Utility Sans', [
        typeRow('text-utility-sans / 100', 'CdrTextUtilitySans100'),
        typeRow('text-utility-sans / 200', 'CdrTextUtilitySans200'),
        typeRow('text-utility-sans / 300', 'CdrTextUtilitySans300'),
        typeRow('text-utility-sans / 400', 'CdrTextUtilitySans400'),
        typeRow('text-utility-sans / 500', 'CdrTextUtilitySans500'),
        typeRow('text-utility-sans / 600', 'CdrTextUtilitySans600'),
        typeRow('text-utility-sans / 700', 'CdrTextUtilitySans700'),
        typeRow('text-utility-sans / 800', 'CdrTextUtilitySans800'),
      ])}
      ${section('Utility Sans Strong', [
        typeRow('text-utility-sans-strong / 100', 'CdrTextUtilitySansStrong100'),
        typeRow('text-utility-sans-strong / 200', 'CdrTextUtilitySansStrong200'),
        typeRow('text-utility-sans-strong / 300', 'CdrTextUtilitySansStrong300'),
        typeRow('text-utility-sans-strong / 400', 'CdrTextUtilitySansStrong400'),
        typeRow('text-utility-sans-strong / 500', 'CdrTextUtilitySansStrong500'),
        typeRow('text-utility-sans-strong / 600', 'CdrTextUtilitySansStrong600'),
        typeRow('text-utility-sans-strong / 700', 'CdrTextUtilitySansStrong700'),
        typeRow('text-utility-sans-strong / 800', 'CdrTextUtilitySansStrong800'),
      ])}
    </div>`,
};

export const UtilitySerif: Story = {
  name: 'Utility — Serif',
  render: () =>
    `${chrome}<div class="sb-page">
      ${section('Utility Serif', [
        typeRow('text-utility-serif / 200', 'CdrTextUtilitySerif200'),
        typeRow('text-utility-serif / 300', 'CdrTextUtilitySerif300'),
        typeRow('text-utility-serif / 400', 'CdrTextUtilitySerif400'),
        typeRow('text-utility-serif / 500', 'CdrTextUtilitySerif500'),
        typeRow('text-utility-serif / 600', 'CdrTextUtilitySerif600'),
        typeRow('text-utility-serif / 700', 'CdrTextUtilitySerif700'),
        typeRow('text-utility-serif / 800', 'CdrTextUtilitySerif800'),
      ])}
      ${section('Utility Serif Strong', [
        typeRow('text-utility-serif-strong / 200', 'CdrTextUtilitySerifStrong200'),
        typeRow('text-utility-serif-strong / 300', 'CdrTextUtilitySerifStrong300'),
        typeRow('text-utility-serif-strong / 400', 'CdrTextUtilitySerifStrong400'),
        typeRow('text-utility-serif-strong / 500', 'CdrTextUtilitySerifStrong500'),
        typeRow('text-utility-serif-strong / 600', 'CdrTextUtilitySerifStrong600'),
        typeRow('text-utility-serif-strong / 700', 'CdrTextUtilitySerifStrong700'),
        typeRow('text-utility-serif-strong / 800', 'CdrTextUtilitySerifStrong800'),
      ])}
    </div>`,
};

export const EyebrowText: Story = {
  name: 'Eyebrow',
  render: () =>
    `${chrome}<div class="sb-page">${section('Eyebrow', [
      typeRow('text-eyebrow / 100', 'CdrTextEyebrow100', 'Eyebrow Label'),
    ])}</div>`,
};

export const FontFamilies: Story = {
  name: 'Font Families',
  render: () => {
    const t = tokens as Record<string, string>;
    const families: [string, string][] = [
      ['CdrFontFamilySerifBrandFont', 'Serif Brand Font'],
      ['CdrFontFamilySerif', 'Serif'],
      ['CdrFontFamilySansBrandFont', 'Sans Brand Font'],
      ['CdrFontFamilySans', 'Sans'],
      ['CdrFontFamilyMonoBrandFont', 'Mono Brand Font'],
    ];

    const rows = families
      .map(([key, label]) => {
        const val = t[key] ?? '';
        return `
          <div class="font-row">
            <div class="font-sample" style="font-family: ${val}">Aa Bb Cc 123 — The Trail Awaits</div>
            <div class="font-meta">
              <span class="font-label">${label}</span>
              <span class="font-token">${key}</span>
              <span class="font-value">${val}</span>
            </div>
          </div>`;
      })
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Font Families</h2>
          <span class="sb-section-count">${families.length}</span>
        </div>
        <div>${rows}</div>
      </div>
    </div>`;
  },
};

export const FluidTypeScale: Story = {
  name: 'Fluid Type Scale',
  render: () => {
    const t = tokens as Record<string, string>;
    const scaleKeys = Object.keys(t).filter((k) => k.startsWith('CdrTypeScale'));
    // Fluid type scale tokens are raw clamp values, render as sample text at that size
    const scaleRows = scaleKeys
      .map((key) => {
        const val = t[key] ?? '';
        const label = key.replace('CdrTypeScale', 'scale-');
        return `
          <div class="type-row">
            <div class="type-sample" style="font-size: ${val}; font-family: Stuart, Georgia, serif; line-height: 1.2;">${label}</div>
            <div class="type-meta">
              <span class="type-label">${key}</span>
              <span class="type-detail">${val}</span>
            </div>
          </div>`;
      })
      .join('');

    return `${chrome}<div class="sb-page">
      <div class="sb-section">
        <div class="sb-section-header">
          <h2 class="sb-section-title">Fluid Type Scale</h2>
          <span class="sb-section-count">${scaleKeys.length}</span>
        </div>
        <div>${scaleRows}</div>
      </div>
    </div>`;
  },
};

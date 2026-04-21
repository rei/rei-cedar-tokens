import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Guides/Consumer TypeScript Contract',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function codeBlock(code: string): string {
  return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
}

const modularImport = `
import type { CdrSpaceTokens } from "@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space";
`;

const unionExample = `
import type { CdrColorBackgroundTokenName } from "@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background.names";

type BackgroundTokenMap = Record<CdrColorBackgroundTokenName, string>;
declare const tokens: BackgroundTokenMap;

function getToken(name: CdrColorBackgroundTokenName) {
  return tokens[name];
}
`;

const moduleInterfaceExample = `
import type { CdrColorBackgroundTokens } from "@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background";

const bg: Partial<CdrColorBackgroundTokens> = {
  CdrColorBackgroundPrimary: "#fff",
  CdrColorBackgroundSecondary: "#f5f5f5",
};
`;

const currentMainlineExample = `
import type { CdrSpaceTokens } from "@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space";
import type { CdrSpaceTokenName } from "@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space.names";
`;

const page = `
<style>
  .contract-root {
    max-width: 1080px;
    margin: 0 auto;
    padding: 36px 20px 64px;
    color: #222;
  }

  .hero {
    border: 1px solid #d8dbd4;
    background: linear-gradient(180deg, #f7f9f6 0%, #ffffff 100%);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .kicker {
    font-family: Pressura, monospace;
    font-size: 11px;
    color: #5b6757;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  h1 {
    font-family: Stuart, Georgia, serif;
    font-size: 30px;
    margin: 0 0 8px;
    color: #1f241d;
  }

  .lede {
    font-family: Graphik, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #3d473b;
    margin: 0;
  }

  .note {
    margin-top: 14px;
    border-left: 4px solid #3f6f54;
    background: #edf6f1;
    padding: 10px 12px;
    font-family: Graphik, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #234634;
  }

  .sections {
    display: grid;
    gap: 16px;
  }

  .card {
    border: 1px solid #e1e4de;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
  }

  .card-head {
    padding: 14px 16px;
    border-bottom: 1px solid #eceeea;
    background: #fafbf9;
  }

  .card-title {
    font-family: Graphik, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1f241d;
    margin: 0;
  }

  .card-body {
    padding: 14px 16px;
    font-family: Graphik, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #2f372e;
  }

  .row-title {
    font-weight: 700;
    color: #21291f;
    margin: 0 0 4px;
  }

  pre {
    margin: 10px 0 0;
    background: #111715;
    color: #e9f4ef;
    border-radius: 8px;
    overflow: auto;
    padding: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    line-height: 1.5;
  }

  .foot {
    margin-top: 18px;
    font-family: Graphik, sans-serif;
    font-size: 13px;
    color: #3d473b;
  }

  a { color: #1f5f43; }
</style>

<div class="contract-root">
  <section class="hero">
    <div class="kicker">Canonical Consumer Contract</div>
    <h1>TypeScript Consumer Contract</h1>
    <p class="lede">
      This reference describes the current supported TypeScript API for token consumers and how engineers should import,
      validate, and type token usage in application code.
    </p>
    <div class="note">
      Current supported usage in mainline is through theme-scoped type module paths.
    </div>
  </section>

  <section class="sections">
    <article class="card">
      <header class="card-head"><h2 class="card-title">Import Pattern</h2></header>
      <div class="card-body">
        <p>
          Theme-scoped generated type paths are currently available and working.
        </p>
        <p class="row-title">Example</p>
        ${codeBlock(currentMainlineExample)}
      </div>
    </article>

    <article class="card">
      <header class="card-head"><h2 class="card-title">1) Modular Types</h2></header>
      <div class="card-body">
        <p class="row-title">What this is</p>
        <p>Responsibility-oriented module types exposed through theme-scoped paths.</p>
        <p class="row-title">Why it exists</p>
        <p>To avoid monolithic type files and give consumers focused, ergonomic imports.</p>
        <p class="row-title">How to import</p>
        ${codeBlock(modularImport)}
      </div>
    </article>

    <article class="card">
      <header class="card-head"><h2 class="card-title">2) Literal Union Token Names</h2></header>
      <div class="card-body">
        <p class="row-title">What this is</p>
        <p>Compile-time constrained token-name unions.</p>
        <p class="row-title">Why it exists</p>
        <p>To validate token names and improve autocomplete safety.</p>
        <p class="row-title">How to use</p>
        ${codeBlock(unionExample)}
      </div>
    </article>

    <article class="card">
      <header class="card-head"><h2 class="card-title">3) Module Interfaces</h2></header>
      <div class="card-body">
        <p class="row-title">What this is</p>
        <p>Typed interfaces representing grouped token modules.</p>
        <p class="row-title">Why it exists</p>
        <p>To type module-level token objects used by app code and tests.</p>
        <p class="row-title">How to use</p>
        ${codeBlock(moduleInterfaceExample)}
      </div>
    </article>
  </section>

  <p class="foot">
    ADR reference: <a href="https://github.com/rei/rei-cedar-tokens/blob/next/adr/0002-typescript-pipeline-and-consumer-types.md" target="_blank" rel="noreferrer">ADR 0002: TypeScript Pipeline and Consumer Types API</a>
  </p>
</div>
`;

export const ConsumerTypeScriptContract: Story = {
  render: () => page,
};

import type { Meta, StoryObj } from '@storybook/html';
import { card, codeBlock, renderGuidePage } from './guide-display';

const meta: Meta = {
  title: 'Guides/Consumer Token Contract',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const guideFooter = `
  ADR reference: <a href="https://github.com/rei/rei-cedar-tokens/blob/next/adr/0002-typescript-pipeline-and-consumer-types.md" target="_blank" rel="noreferrer">ADR 0002: TypeScript Pipeline and Consumer Types API</a><br />
  Follow-up ticket: <a href="https://github.com/rei/rei-cedar-tokens/blob/next/docs/tickets/token-dictionary-implementation.md" target="_blank" rel="noreferrer">TokenDictionary public contract implementation</a>
`;

const modularImport = `
import type { CdrSpaceTokens } from "@rei/cdr-tokens/types";
`;

const unionExample = `
import type { CdrColorBackgroundTokenName } from "@rei/cdr-tokens/types";

type BackgroundTokenMap = Record<CdrColorBackgroundTokenName, string>;
declare const tokens: BackgroundTokenMap;

function getToken(name: CdrColorBackgroundTokenName) {
  return tokens[name];
}
`;

const moduleInterfaceExample = `
import type { CdrColorBackgroundTokens } from "@rei/cdr-tokens/types";

const bg: Partial<CdrColorBackgroundTokens> = {
  CdrColorBackgroundPrimary: "#fff",
  CdrColorBackgroundSecondary: "#f5f5f5",
};
`;

const currentMainlineExample = `
import type { CdrSpaceTokens } from "@rei/cdr-tokens/types";
import type { CdrSpaceTokenName } from "@rei/cdr-tokens/types";
`;

const docsiteImportExample = `
import type { CdrSpaceTokens } from "@rei/cdr-tokens/docsite/types";
import type { CdrSpaceTokenName } from "@rei/cdr-tokens/docsite/types";
`;

const runtimeImportExample = `
import { CdrSpaceScale2 } from "@rei/cdr-tokens";
import { CdrSpaceScale2 as DocsiteCdrSpaceScale2 } from "@rei/cdr-tokens/docsite";
`;

const assetEntrypointsExample = `
/* Preferred entrypoints */
@import "@rei/cdr-tokens/css";
@import "@rei/cdr-tokens/scss";

/* Theme-specific entrypoints */
@import "@rei/cdr-tokens/docsite/css";
@import "@rei/cdr-tokens/docsite/scss";
`;

const modularAssetExample = `
/* Backwards-compatible modular path (optional) */
@import "@rei/cdr-tokens/dist/rei-dot-com/css/foundations/cdr-color-background.css";
@import "@rei/cdr-tokens/dist/rei-dot-com/scss/foundations/cdr-space.scss";
`;

export const ConsumerTypeScriptContract: Story = {
  name: 'Overview',
  render: () =>
    renderGuidePage({
      kicker: 'Canonical Consumer Contract',
      title: 'Consumer Contract Overview',
      lede: 'This guide has been split by output type. Use the focused stories in this section for Types, Runtime, and Web Asset consumption paths.',
      note: 'The output-specific stories replace the previously grouped single page.',
      footer: guideFooter,
      sections: [
        card(
          'Types Output',
          `<p>Theme-specific type barrels are the primary contract for compile-time safety.</p>
           <p class="cdr-guide-row-title">rei-dot-com</p>${codeBlock(currentMainlineExample)}
           <p class="cdr-guide-row-title">docsite</p>${codeBlock(docsiteImportExample)}`,
        ),
        card(
          'Runtime Output',
          `<p>Runtime values are imported from root entrypoints, not type barrels.</p>${codeBlock(runtimeImportExample)}`,
        ),
        card(
          'Preferred Web Asset Entrypoints',
          `<p>Use simplified entrypoints for CSS/SCSS consumption.</p>${codeBlock(assetEntrypointsExample)}`,
        ),
        card(
          'Legacy Modular Asset Paths',
          `<p>Legacy modular deep paths remain available for optional, gradual migration.</p>${codeBlock(modularAssetExample)}`,
        ),
      ].join(''),
    }),
};

export const TypesOutput: Story = {
  render: () =>
    renderGuidePage({
      kicker: 'Output Type: Types',
      title: 'Type Declarations',
      lede: 'Theme-specific type barrels are the public API for compile-time safety. They expose interfaces, literal unions, and module-oriented types for every token category.',
      note: 'Supported entrypoints: @rei/cdr-tokens/types and @rei/cdr-tokens/docsite/types.',
      footer: guideFooter,
      sections: [
        card(
          'Why use type barrels?',
          `<ul>
             <li>Catch token-name typos at compile time instead of at runtime.</li>
             <li>Autocomplete token names in your editor without searching the source.</li>
             <li>Decouple your code from dist internals — the barrel is the stable contract.</li>
           </ul>`,
        ),
        card(
          'Import pattern',
          `<p class="cdr-guide-row-title">rei-dot-com theme</p>${codeBlock(currentMainlineExample)}
            <p class="cdr-guide-row-title">docsite theme</p>${codeBlock(docsiteImportExample)}`,
        ),
        card(
          'Modular types — example',
          `<p>Import only the module you need rather than the full barrel.</p>
           ${codeBlock(modularImport)}`,
        ),
        card(
          'Literal union token names — example',
          `<p>Use a union as a key constraint so invalid names are a compile error.</p>
           ${codeBlock(unionExample)}`,
        ),
        card(
          'Module interfaces — example',
          `<p>Use an interface to build a typed partial override map or fixture.</p>
           ${codeBlock(moduleInterfaceExample)}`,
        ),
        card(
          'Common mistake',
          `<p>Do <strong>not</strong> import types from the runtime entrypoint — it ships no type declarations.</p>
           ${codeBlock(`// ✗ wrong — runtime entrypoint has no exported types
import type { CdrSpaceTokens } from "@rei/cdr-tokens";

// ✓ correct — explicitly typed barrel
import type { CdrSpaceTokens } from "@rei/cdr-tokens/types";`)}`,
        ),
      ].join(''),
    }),
};

export const RuntimeOutput: Story = {
  render: () =>
    renderGuidePage({
      kicker: 'Output Type: Runtime',
      title: 'Runtime Values',
      lede: 'Runtime token values are consumed from root package entrypoints as named ES module exports. Keep value imports separate from type-only barrels.',
      note: 'Use @rei/cdr-tokens or @rei/cdr-tokens/docsite for values. Use the /types barrel for types.',
      footer: guideFooter,
      sections: [
        card(
          'Why use runtime entrypoints?',
          `<ul>
             <li>Stable named exports — the token name is the public contract, not internal file paths.</li>
             <li>Tree-shakeable: bundlers only include the tokens your code actually references.</li>
             <li>Works in any JS/TS environment with no build tool configuration.</li>
           </ul>`,
        ),
        card(
          'Import pattern — example',
          `<p>Both themes are available from their respective root entrypoints.</p>
           ${codeBlock(runtimeImportExample)}`,
        ),
        card(
          'Common mistake',
          `<p>Do <strong>not</strong> deep-link into dist paths — those are internal and may change between releases.</p>
           ${codeBlock(`// ✗ wrong — internal dist path, not part of the public contract
import { CdrSpaceScale2 } from "@rei/cdr-tokens/dist/rei-dot-com/js/cdr-tokens.mjs";

// ✓ correct — stable root entrypoint
import { CdrSpaceScale2 } from "@rei/cdr-tokens";`)}`,
        ),
      ].join(''),
    }),
};

export const WebAssetEntrypoints: Story = {
  render: () =>
    renderGuidePage({
      kicker: 'Output Type: Web Assets',
      title: 'CSS and SCSS Entrypoints',
      lede: 'Use simplified package entrypoints for all new CSS and SCSS integrations. These are the recommended, stable paths that abstract away dist internals.',
      note: 'These are the preferred paths for all new web asset consumption.',
      footer: guideFooter,
      sections: [
        card(
          'Why use entrypoints instead of deep paths?',
          `<ul>
             <li>Insulates your app from internal dist restructures — the entrypoint path never changes.</li>
             <li>One import loads the complete token set for the theme, no cherry-picking required.</li>
             <li>Compatible with any bundler that resolves the package <code>exports</code> field (Vite, webpack 5+, esbuild).</li>
           </ul>`,
        ),
        card('Import pattern — example', codeBlock(assetEntrypointsExample)),
        card(
          'Common mistake',
          `<p>Do <strong>not</strong> import CSS entrypoints in server-rendered environments that have no CSS loader — import them only at the app entry layer.</p>
           ${codeBlock(`// ✗ wrong — CSS side-effect in a server-only module
import "@rei/cdr-tokens/css"; // SSR context, no CSS loader

// ✓ correct — import in your app entry or global stylesheet
// app/main.ts  →  import "@rei/cdr-tokens/css";
// app/global.scss  →  @use "@rei/cdr-tokens/scss";`)}`,
        ),
      ].join(''),
    }),
};

export const WebAssetModularLegacyPaths: Story = {
  render: () =>
    renderGuidePage({
      kicker: 'Output Type: Web Assets (Legacy)',
      title: 'Modular Deep Asset Paths',
      lede: 'Deep modular paths remain available for backward compatibility. Use them only when you need granular, per-category control and prefer an incremental migration over switching to entrypoints all at once.',
      note: 'Not preferred for new code — use the CSS/SCSS entrypoints for new integrations.',
      footer: guideFooter,
      sections: [
        card(
          'Why keep deep paths at all?',
          `<ul>
             <li>Existing apps already referencing granular paths do not need a big-bang migration.</li>
             <li>Useful when you need a single token category (e.g., only space tokens) without loading the full set.</li>
             <li>Non-breaking — deep paths are still exported via the package <code>exports</code> map.</li>
           </ul>`,
        ),
        card('Import pattern — example', codeBlock(modularAssetExample)),
        card(
          'Migration path',
          `<p>When you are ready to consolidate, replace each deep import with the single preferred entrypoint.</p>
           ${codeBlock(`// Before — multiple granular imports
@import "@rei/cdr-tokens/dist/rei-dot-com/css/foundations/cdr-color-background.css";
@import "@rei/cdr-tokens/dist/rei-dot-com/css/foundations/cdr-space.css";

// After — single entrypoint (all token categories in one)
@import "@rei/cdr-tokens/css";`)}`,
        ),
      ].join(''),
    }),
};

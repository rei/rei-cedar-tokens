import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t;function n(){return(n=e((()=>{t={selectedFile:`2026-05-20-cedar-tokens-14.md`,availableFiles:[`2026-05-20-cedar-tokens-14.md`,`2026-06-10-cedar-tokens-14.0.1.md`,`2026-07-01-cedar-tokens-node-24.md`],allReleaseNotes:[{fileName:`2026-05-20-cedar-tokens-14.md`,version:`14.0.0`,markdown:`# Release notes – v14.0.0

## Overview

Teams can now import only the token categories they use — \`@rei/cdr-tokens/css/color\`, \`@rei/cdr-tokens/scss/space\` — instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the \`exports\` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with \`@rei/cedar\` v17 — the 2 packages are a hard co-release.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Upgrade \`@rei/cedar\` to v17** — both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR.

- [ ] **Upgrade \`@rei/cdr-component-variables\` to v11** — this is the aligned release for Cedar 17 and cdr-tokens 14. Upgrade together with Cedar and Tokens.

  \`\`\`
  npm install @rei/cedar@17 @rei/cdr-tokens@14 @rei/cdr-component-variables@11
  \`\`\`

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** CSS imports (if using a single bundle):

  \`\`\`diff
  - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
  + import '@rei/cdr-tokens/css/color'
  + import '@rei/cdr-tokens/css/space'
  + // add only the categories you need
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [CSS Consumer Contract](?path=/docs/consumer-contract-css--docs) for migration guidance.

- [ ] **Updated:** SCSS imports (if importing SCSS variables):

  \`\`\`diff
  - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
  + @use '@rei/cdr-tokens/scss/color' as color;
  + @use '@rei/cdr-tokens/scss/space' as space;
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [SCSS Consumer Contract](?path=/docs/consumer-contract-scss--docs) for migration guidance.

- [ ] **Updated:** Direct \`dist/\` path references (if bypassing \`package.json\` exports):

  \`\`\`diff
  - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
  + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
  \`\`\`

  See the [Consumer Contract](?path=/docs/consumer-contract-overview--docs) for the full path mapping.

- [ ] **Update LESS imports** (if using LESS — no longer distributed):

  Replace LESS imports with CSS, SCSS, JavaScript, TypeScript, or JSON token outputs.

- [ ] **Update runtime constant imports** (if importing generated JavaScript constants):

  \`\`\`diff
  - import { CdrBreakpointLg } from '@rei/cdr-tokens'
  + import { CdrBreakpointLg } from '@rei/cdr-tokens/tokens'
  \`\`\`

  Use \`@rei/cdr-tokens/tokens\` for generated JavaScript constants. Use \`@rei/cdr-tokens/types\` for semantic foundation objects like \`CdrBreakpointOrder\`.

- [ ] **Update token JSON consumption** (if your build consumes token JSON artifacts):

  Copy the full JSON tree recursively so the new \`foundations/\` and \`components/\` directories are included. Use exported JSON paths like \`@rei/cdr-tokens/json\` or \`@rei/cdr-tokens/json/foundations/cdr-space.json\` instead of direct \`dist/\` paths.

- [ ] **Update SCSS utility imports** (if using short \`@rei/cdr-tokens/scss/*\` paths):

  The short \`@rei/cdr-tokens/scss/*\` path is now only for utility mixins like \`breakpoint-mixins\`, \`display-mixins\`, and \`type-mixins\`. Foundation SCSS partials are exposed through themed paths like \`@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space.scss\`.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Check for updated token values that may improve visual consistency
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** TypeScript type imports — per-foundation type modules for type-safe token keys:

  \`\`\`typescript
  import type { CdrColorKey } from '@rei/cdr-tokens/types/color';
  import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space';
  \`\`\`

  See the [TypeScript Consumer Contract](?path=/docs/consumer-contract-typescript--docs) for details.

### To get the most out of this update

This release enables the following new capabilities:

- Import only the tokens you use — smaller bundles for partial Cedar adoption
- Better entrypoints — per-category imports for CSS, SCSS, and TypeScript instead of monolithic barrels
- Type-safe token keys with editor autocomplete — kebab-case unions that work directly in code
- Canonical breakpoint ordering that stays synchronized with token source
- DTCG-aligned typography tokens compatible with design tooling
- Per-foundation TypeScript type modules with correct type narrowing and TS 4/5 compatibility

</details>

<details>
<summary>## New features</summary>

- **Import only the tokens you use** — a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now \`import '@rei/cdr-tokens/css/color'\` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  **Business value:** Smaller bundles → faster page loads → better user experience → higher conversion rates. Partial Cedar adopters no longer pay the bundle cost for features they don't use.
  To get started: replace \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\` with per-category imports for the foundations you need

- **Type-safe token keys** — every foundation exports kebab-case key unions (\`'one-x' | 'two-x' | ...\`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  **Business value:** Fewer runtime errors from typos, better IDE autocomplete, reduced maintenance overhead for mapping code, faster developer velocity.
  To get started: \`import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'\`

- **Canonical breakpoint ordering** — \`CdrBreakpointOrder\` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode \`['xs', 'sm', 'md', 'lg']\` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  **Business value:** Consistent responsive behavior across the codebase, reduced bugs from mismatched breakpoint arrays, single source of truth for responsive logic.
  To get started: \`import { CdrBreakpointOrder } from '@rei/cdr-tokens'\`

- **DTCG-aligned typography tokens** — all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly — no adapter required.
  **Business value:** Faster design-to-dev handoff, better integration with modern design tooling, reduced maintenance for custom translation layers, design systems stay in sync automatically.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** — every foundation ships its own \`.d.ts\` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required \`skipLibCheck\` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  **Business value:** Better IDE support, fewer type-related bugs, faster development with accurate autocomplete and refactoring, reduced need for TypeScript configuration workarounds.
  To get started: \`import type { CdrColorKey } from '@rei/cdr-tokens/types/color'\`

</details>

<details>
<summary>## Breaking changes</summary>

- **Package.json \`exports\` map restructured** — direct \`dist/\` path imports may no longer resolve
  - **Why:** the \`exports\` map uses explicit per-category entry points instead of a catch-all glob
  - **Before:** \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\`
  - **After:** \`import '@rei/cdr-tokens/css/color'\`
  - **Migrate:** replace direct \`dist/\` path imports with per-category entry points. See the migration guide for the full mapping

- **Per-foundation dist outputs relocated** — foundation outputs moved from flat theme directories to \`dist/*/foundations/\`
  - **Why:** modular architecture requires a consistent per-category directory structure
  - **Before:** \`dist/rei-dot-com/cdr-color.css\`
  - **After:** \`dist/rei-dot-com/foundations/color.css\`
  - **Migrate:** use per-category import paths rather than referencing dist files directly. If you must use dist paths, update to the \`foundations/\` structure

### Token changes

#### Relocated

- All foundation token outputs moved from flat theme directories to \`dist/*/foundations/<category>.*\`

#### Added

- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., \`CdrColorKey\`, \`CdrSpaceKey\`)
- \`CdrBreakpointOrder\` typed const tuple export

#### Format changes

- Typography tokens now use DTCG composite format (\`$value\`, \`$type\`, \`$description\`)

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The per-category import paths use \`package.json\` \`exports\` conditions. Bundlers that don't support \`exports\` (older Webpack 4 configurations, for example) will need to reference \`dist/\` paths directly using the new \`foundations/\` structure
- The kebab-case key unions are strict — if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (\`map-resolved\`, \`map-vars\`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside \`@rei/cedar\` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

</details>`},{fileName:`2026-06-10-cedar-tokens-14.0.1.md`,version:`14.0.1`,markdown:"# Release notes – v14.0.1\n\n## Overview\n\nPatch release that fixes a TypeScript declaration bug in the barrel file generation and restores backward compatibility for v13-style flat token imports from the root entrypoint.\n\n## Bug fixes\n\n- **TypeScript barrel export bug** — The `generate-types-barrel` action applied `export type *` uniformly to all `.d.ts` file re-exports in `tokens.d.ts`. This stripped runtime `const` exports (grouped objects, key arrays, order arrays) from the `/types` barrel entrypoint, making them unusable as values at runtime.\n  - **Root cause:** The barrel generator did not distinguish between type-only declaration files and files containing `declare const` runtime value exports.\n  - **Files changed:**\n    - `style-dictionary/actions/generate-types-barrel.ts` — Added logic to identify type-only files (`.names.d.ts`, `base/` directory) and use `export type *` only for those. All other `.d.ts` files now use `export *`. Also strips `.d.ts` extensions from barrel import paths to avoid TS2846 errors.\n    - `style-dictionary/token-keys.test.ts` — Added regression test to verify the barrel uses the correct export keyword for each file type.\n  - **Before:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — TypeScript error: \"cannot be used as a value because it was exported using 'export type'\"\n  - **After:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — works as both types and runtime values\n\n- **Backward-compat flat token re-exports** — The v14.0.0 release moved flat token values (e.g., `CdrBreakpointSm`) from the root `@rei/cdr-tokens` entrypoint to the `/tokens` subpath, breaking existing consumer imports. This patch re-exports all flat token values from the root entrypoint as **deprecated**, so v13-style imports continue to work while consumers migrate.\n  - **Files changed:**\n    - `style-dictionary/semantic-contract.ts` — Generates `_compat-deprecated.mjs` and `_compat-deprecated.d.ts` with `@deprecated` JSDoc tags on every flat export. These are re-exported from the main `index.mjs` / `index.d.ts`.\n  - **Before:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` — TypeScript error: module has no exported member\n  - **After:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` — works (with `@deprecated` warning in IDE)\n\n## Migration guide\n\n### No breaking changes\n\nThis is a drop-in patch. No code changes required for existing consumers.\n\n### v13 flat imports are restored (deprecated)\n\nIf you were using v13-style flat imports from the root entrypoint, they work again:\n\n```typescript\n// Works again — but deprecated, IDE will show strikethrough\nimport { CdrBreakpointSm, CdrColorBackgroundPrimary } from '@rei/cdr-tokens';\n```\n\nMigrate to grouped objects (recommended) or the `/tokens` subpath:\n\n```typescript\n// Preferred: grouped objects from root entrypoint\nimport { CdrBreakpoint, CdrColorBackground } from '@rei/cdr-tokens';\nconst sm = CdrBreakpoint.CdrBreakpointSm;\n\n// Alternative: flat values from /tokens subpath\nimport { CdrBreakpointSm } from '@rei/cdr-tokens/tokens';\n```\n\n### New capabilities unlocked\n\nThe `/types` entrypoint now correctly exports runtime values:\n\n```typescript\nimport { CdrBreakpoint, CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';\n\nconst keysToVars = (keys: readonly string[], prefix: string) =>\n  Object.fromEntries(keys.map((key) => [key, `var(--${prefix}-${key})`]));\n\nexport default {\n  theme: {\n    screens: {\n      xs: `${CdrBreakpoint.CdrBreakpointXs}px`,\n      sm: `${CdrBreakpoint.CdrBreakpointSm}px`,\n      md: `${CdrBreakpoint.CdrBreakpointMd}px`,\n      lg: `${CdrBreakpoint.CdrBreakpointLg}px`,\n    },\n    extend: {\n      spacing: keysToVars(CdrSpaceScaleKeys, 'cdr-space-scale'),\n      colors: {\n        background: keysToVars(CdrColorBackgroundKeys, 'cdr-color-background'),\n      },\n    },\n  },\n};\n```\n\n## Be Aware Of\n\n### Notices\n\n- The deprecated flat re-exports will be **removed in the next major version** (v15). Consumers should migrate to grouped objects or the `/tokens` subpath.\n- CJS `require('@rei/cdr-tokens')` still resolves to the flat token constants (unchanged).\n- This patch does not change any token values, CSS output, SCSS output, or JSON artifacts.\n- A regression test has been added to `style-dictionary/token-keys.test.ts` to prevent the barrel export bug from recurring."},{fileName:`2026-07-01-cedar-tokens-node-24.md`,version:`14.1.0`,markdown:`# Release notes – v14.1.0

## Overview

Minor release that adds official support for Node.js 24 by updating the engines field to allow Node 24 and above.

## Features

- **Node.js 24 support** — Updated the \`engines.node\` field in \`package.json\` from \`">= 22.12.0 <23"\` to \`">= 24.0.0"\` to officially support Node.js 24.
  - **Files changed:**
    - \`package.json\` — Updated engines.node field to \`">= 24.0.0"\`
    - \`.nvmrc\` — Updated to Node 24.0.0
    - \`.github/workflows/*.yml\` — Updated CI workflows to use Node 24.0.0
  - **Before:** Node 24 was not officially supported, causing EBADENGINE warnings during installation
  - **After:** Node 24 is fully supported with no warnings

## Migration guide

### No breaking changes

This is a backward-compatible update. Existing consumers using Node 22 or later will continue to work without any changes.

### Node.js version requirement

The minimum supported Node.js version is now 24.0.0. If you are using an earlier version, you will need to upgrade Node.js before installing this version.

## Be Aware Of

### Notices

- This release requires Node.js 24.0.0 or later
- CI/CD pipelines should be updated to use Node 24 or later
- The \`.nvmrc\` file has been updated to Node 24.0.0 for local development`}],markdown:`# Release notes – v14.0.0

## Overview

Teams can now import only the token categories they use — \`@rei/cdr-tokens/css/color\`, \`@rei/cdr-tokens/scss/space\` — instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the \`exports\` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with \`@rei/cedar\` v17 — the 2 packages are a hard co-release.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Upgrade \`@rei/cedar\` to v17** — both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR.

- [ ] **Upgrade \`@rei/cdr-component-variables\` to v11** — this is the aligned release for Cedar 17 and cdr-tokens 14. Upgrade together with Cedar and Tokens.

  \`\`\`
  npm install @rei/cedar@17 @rei/cdr-tokens@14 @rei/cdr-component-variables@11
  \`\`\`

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** CSS imports (if using a single bundle):

  \`\`\`diff
  - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
  + import '@rei/cdr-tokens/css/color'
  + import '@rei/cdr-tokens/css/space'
  + // add only the categories you need
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [CSS Consumer Contract](?path=/docs/consumer-contract-css--docs) for migration guidance.

- [ ] **Updated:** SCSS imports (if importing SCSS variables):

  \`\`\`diff
  - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
  + @use '@rei/cdr-tokens/scss/color' as color;
  + @use '@rei/cdr-tokens/scss/space' as space;
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [SCSS Consumer Contract](?path=/docs/consumer-contract-scss--docs) for migration guidance.

- [ ] **Updated:** Direct \`dist/\` path references (if bypassing \`package.json\` exports):

  \`\`\`diff
  - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
  + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
  \`\`\`

  See the [Consumer Contract](?path=/docs/consumer-contract-overview--docs) for the full path mapping.

- [ ] **Update LESS imports** (if using LESS — no longer distributed):

  Replace LESS imports with CSS, SCSS, JavaScript, TypeScript, or JSON token outputs.

- [ ] **Update runtime constant imports** (if importing generated JavaScript constants):

  \`\`\`diff
  - import { CdrBreakpointLg } from '@rei/cdr-tokens'
  + import { CdrBreakpointLg } from '@rei/cdr-tokens/tokens'
  \`\`\`

  Use \`@rei/cdr-tokens/tokens\` for generated JavaScript constants. Use \`@rei/cdr-tokens/types\` for semantic foundation objects like \`CdrBreakpointOrder\`.

- [ ] **Update token JSON consumption** (if your build consumes token JSON artifacts):

  Copy the full JSON tree recursively so the new \`foundations/\` and \`components/\` directories are included. Use exported JSON paths like \`@rei/cdr-tokens/json\` or \`@rei/cdr-tokens/json/foundations/cdr-space.json\` instead of direct \`dist/\` paths.

- [ ] **Update SCSS utility imports** (if using short \`@rei/cdr-tokens/scss/*\` paths):

  The short \`@rei/cdr-tokens/scss/*\` path is now only for utility mixins like \`breakpoint-mixins\`, \`display-mixins\`, and \`type-mixins\`. Foundation SCSS partials are exposed through themed paths like \`@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space.scss\`.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Check for updated token values that may improve visual consistency
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** TypeScript type imports — per-foundation type modules for type-safe token keys:

  \`\`\`typescript
  import type { CdrColorKey } from '@rei/cdr-tokens/types/color';
  import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space';
  \`\`\`

  See the [TypeScript Consumer Contract](?path=/docs/consumer-contract-typescript--docs) for details.

### To get the most out of this update

This release enables the following new capabilities:

- Import only the tokens you use — smaller bundles for partial Cedar adoption
- Better entrypoints — per-category imports for CSS, SCSS, and TypeScript instead of monolithic barrels
- Type-safe token keys with editor autocomplete — kebab-case unions that work directly in code
- Canonical breakpoint ordering that stays synchronized with token source
- DTCG-aligned typography tokens compatible with design tooling
- Per-foundation TypeScript type modules with correct type narrowing and TS 4/5 compatibility

</details>

<details>
<summary>## New features</summary>

- **Import only the tokens you use** — a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now \`import '@rei/cdr-tokens/css/color'\` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  **Business value:** Smaller bundles → faster page loads → better user experience → higher conversion rates. Partial Cedar adopters no longer pay the bundle cost for features they don't use.
  To get started: replace \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\` with per-category imports for the foundations you need

- **Type-safe token keys** — every foundation exports kebab-case key unions (\`'one-x' | 'two-x' | ...\`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  **Business value:** Fewer runtime errors from typos, better IDE autocomplete, reduced maintenance overhead for mapping code, faster developer velocity.
  To get started: \`import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'\`

- **Canonical breakpoint ordering** — \`CdrBreakpointOrder\` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode \`['xs', 'sm', 'md', 'lg']\` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  **Business value:** Consistent responsive behavior across the codebase, reduced bugs from mismatched breakpoint arrays, single source of truth for responsive logic.
  To get started: \`import { CdrBreakpointOrder } from '@rei/cdr-tokens'\`

- **DTCG-aligned typography tokens** — all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly — no adapter required.
  **Business value:** Faster design-to-dev handoff, better integration with modern design tooling, reduced maintenance for custom translation layers, design systems stay in sync automatically.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** — every foundation ships its own \`.d.ts\` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required \`skipLibCheck\` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  **Business value:** Better IDE support, fewer type-related bugs, faster development with accurate autocomplete and refactoring, reduced need for TypeScript configuration workarounds.
  To get started: \`import type { CdrColorKey } from '@rei/cdr-tokens/types/color'\`

</details>

<details>
<summary>## Breaking changes</summary>

- **Package.json \`exports\` map restructured** — direct \`dist/\` path imports may no longer resolve
  - **Why:** the \`exports\` map uses explicit per-category entry points instead of a catch-all glob
  - **Before:** \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\`
  - **After:** \`import '@rei/cdr-tokens/css/color'\`
  - **Migrate:** replace direct \`dist/\` path imports with per-category entry points. See the migration guide for the full mapping

- **Per-foundation dist outputs relocated** — foundation outputs moved from flat theme directories to \`dist/*/foundations/\`
  - **Why:** modular architecture requires a consistent per-category directory structure
  - **Before:** \`dist/rei-dot-com/cdr-color.css\`
  - **After:** \`dist/rei-dot-com/foundations/color.css\`
  - **Migrate:** use per-category import paths rather than referencing dist files directly. If you must use dist paths, update to the \`foundations/\` structure

### Token changes

#### Relocated

- All foundation token outputs moved from flat theme directories to \`dist/*/foundations/<category>.*\`

#### Added

- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., \`CdrColorKey\`, \`CdrSpaceKey\`)
- \`CdrBreakpointOrder\` typed const tuple export

#### Format changes

- Typography tokens now use DTCG composite format (\`$value\`, \`$type\`, \`$description\`)

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The per-category import paths use \`package.json\` \`exports\` conditions. Bundlers that don't support \`exports\` (older Webpack 4 configurations, for example) will need to reference \`dist/\` paths directly using the new \`foundations/\` structure
- The kebab-case key unions are strict — if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (\`map-resolved\`, \`map-vars\`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside \`@rei/cedar\` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

</details>

<details>
<summary>## Changes in this branch</summary>

- Updates branch: no file changes detected.

</details>`,changedFiles:[],deletedTickets:[],generatedAt:`2026-09-30T19:20:25.876Z`}})))()}function r(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function i(e){return r(e).replace(/\[([^\]]+)\]\(([^)]+)\)/g,`<a href="$2" target="_blank" rel="noreferrer">$1</a>`).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(/`([^`]+)`/g,`<code>$1</code>`)}function a(e){return/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(e)}function o(e){return e.trim().replace(/^\|/,``).replace(/\|$/,``).split(`|`).map(e=>e.trim())}function s(e){let t=e.replace(/\r\n/g,`
`).split(`
`),n=[],s=null,c=!1,l=!1,u=!1,d=()=>{s&&=(n.push(`</${s}>`),null)};for(let e=0;e<t.length;e+=1){let f=t[e]??``,p=f.trimEnd(),m=p.match(/^\s*<\/?(details|summary)(?:\s[^>]*)?>\s*$/);if(m&&!c){d();let e=m[1];e===`details`?p.startsWith(`</`)?(l&&u&&n.push(`</div>`),l=!1,u=!1):(l=!0,u=!1):e===`summary`&&p.startsWith(`</`)&&(u=!0,n.push(`<div class="accordion-content">`)),n.push(p);continue}let h=p.match(/^<summary>\s*##\s+(.+)<\/summary>$/);if(h&&!c){d(),n.push(`<summary><h2>${i(h[1]??``)}</h2></summary>`),u=!0,n.push(`<div class="accordion-content">`);continue}if(p.trimStart().startsWith("```")){if(c)n.push(`</code></pre>`),c=!1;else{d();let e=p.trimStart().slice(3).trim(),t=e?` class="language-${e}"`:``;n.push(`<pre${t}><code>`),c=!0}continue}if(c){n.push(`${r(f)}\n`);continue}if(!p){d();continue}let g=t[e+1]?.trimEnd()??``;if(p.includes(`|`)&&a(g)){d();let r=o(p);n.push(`<table>`),n.push(`<thead><tr>`);for(let e of r)n.push(`<th>${i(e)}</th>`);for(n.push(`</tr></thead>`),n.push(`<tbody>`),e+=2;e<t.length;){let r=t[e]?.trimEnd()??``;if(!r||!r.includes(`|`)){--e;break}let a=o(r);n.push(`<tr>`);for(let e of a)n.push(`<td>${i(e)}</td>`);n.push(`</tr>`),e+=1}n.push(`</tbody>`),n.push(`</table>`);continue}if(p===`Copy`){d(),n.push(`<p class="copy-chip">Copy</p>`);continue}if(p.startsWith(`##### `)){d(),n.push(`<h5>${i(p.slice(6))}</h5>`);continue}if(p.startsWith(`#### `)){d(),n.push(`<h4>${i(p.slice(5))}</h4>`);continue}if(p.startsWith(`### `)){d(),n.push(`<h3>${i(p.slice(4))}</h3>`);continue}if(p.startsWith(`## `)){d(),n.push(`<h2>${i(p.slice(3))}</h2>`);continue}if(p.startsWith(`# `)){d(),n.push(`<h1>${i(p.slice(2))}</h1>`);continue}if(p.startsWith(`> `)){d(),n.push(`<blockquote>${i(p.slice(2))}</blockquote>`);continue}let _=p.match(/^(\d+)\.\s+(.*)$/);if(_){s!==`ol`&&(d(),n.push(`<ol>`),s=`ol`),n.push(`<li>${i(_[2]??``)}</li>`);continue}let v=p.match(/^- \[([ xX])\] (.*)$/);if(v){s!==`ul`&&(d(),n.push(`<ul class="checklist">`),s=`ul`);let e=v[1]===` `?` disabled`:` checked disabled`;n.push(`<li><input type="checkbox"${e}> ${i(v[2]??``)}</li>`);continue}let y=p.match(/^\s+- \[([ xX])\] (.*)$/);if(y){let e=y[1]===` `?` disabled`:` checked disabled`;n.push(`<li class="indent"><input type="checkbox"${e}> ${i(y[2]??``)}</li>`);continue}let b=p.match(/^(\s{2,})- (.*)$/);if(b){n.push(`<li class="indent">${i(b[2]??``)}</li>`);continue}let x=p.match(/^(\s{2,})(.+)$/);if(x&&s){n.push(`<p class="indent">${i(x[2]??``)}</p>`);continue}if(p.startsWith(`- `)){s!==`ul`&&(d(),n.push(`<ul>`),s=`ul`),n.push(`<li>${i(p.slice(2))}</li>`);continue}d(),n.push(`<p>${i(p)}</p>`)}return d(),c&&n.push(`</code></pre>`),n.join(`
`)}var c,l,u,d,f,p;function m(){return(m=e((()=>{n(),c={title:`Release Notes`,parameters:{layout:`fullscreen`,controls:{disable:!0},actions:{disable:!0}}},l=(e,t)=>({name:e,render:()=>`
      <div class="docs-page cdr-doc-content">
        <article>
          ${s(t)}
          <p class="release-notes-meta">Cedar Tokens is supported one major version back from the current release. For questions or help upgrading, reach out in the <strong>#cedar-user-support</strong> Slack channel.</p>
        </article>
      </div>
    `}),u=t.allReleaseNotes||[],d=l(`14.0.0`,u.find(e=>e.version===`14.0.0`)?.markdown||t.markdown),f=l(`14.0.1`,u.find(e=>e.version===`14.0.1`)?.markdown||``),d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`createReleaseNoteStory('14.0.0', allReleaseNotes.find(rn => rn.version === '14.0.0')?.markdown || releaseNotesData.markdown)`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`createReleaseNoteStory('14.0.1', allReleaseNotes.find(rn => rn.version === '14.0.1')?.markdown || '')`,...f.parameters?.docs?.source}}},p=[`V14_0_0`,`V14_0_1`]})))()}m();export{d as V14_0_0,f as V14_0_1,p as __namedExportsOrder,c as default};
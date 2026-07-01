---
default: true
version: 14.0.0
date: 2026-05-20
---

# Release notes – v14.0.0

## Overview

Teams can now import only the token categories they use — `@rei/cdr-tokens/css/color`, `@rei/cdr-tokens/scss/space` — instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the `exports` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with `@rei/cedar` v17 — the 2 packages are a hard co-release.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Upgrade `@rei/cedar` to v17** — both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR.

- [ ] **Upgrade `@rei/cdr-component-variables` to v11** — this is the aligned release for Cedar 17 and cdr-tokens 14. Upgrade together with Cedar and Tokens.

  ```
  npm install @rei/cedar@17 @rei/cdr-tokens@14 @rei/cdr-component-variables@11
  ```

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** CSS imports (if using a single bundle):

  ```diff
  - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
  + import '@rei/cdr-tokens/css/color'
  + import '@rei/cdr-tokens/css/space'
  + // add only the categories you need
  ```

  Legacy paths continue to work for backwards compatibility. See the [CSS Consumer Contract](?path=/docs/consumer-contract-css--docs) for migration guidance.

- [ ] **Updated:** SCSS imports (if importing SCSS variables):

  ```diff
  - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
  + @use '@rei/cdr-tokens/scss/color' as color;
  + @use '@rei/cdr-tokens/scss/space' as space;
  ```

  Legacy paths continue to work for backwards compatibility. See the [SCSS Consumer Contract](?path=/docs/consumer-contract-scss--docs) for migration guidance.

- [ ] **Updated:** Direct `dist/` path references (if bypassing `package.json` exports):

  ```diff
  - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
  + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
  ```

  See the [Consumer Contract](?path=/docs/consumer-contract-overview--docs) for the full path mapping.

- [ ] **Update LESS imports** (if using LESS — no longer distributed):

  Replace LESS imports with CSS, SCSS, JavaScript, TypeScript, or JSON token outputs.

- [ ] **Update runtime constant imports** (if importing generated JavaScript constants):

  ```diff
  - import { CdrBreakpointLg } from '@rei/cdr-tokens'
  + import { CdrBreakpointLg } from '@rei/cdr-tokens/tokens'
  ```

  Use `@rei/cdr-tokens/tokens` for generated JavaScript constants. Use `@rei/cdr-tokens/types` for semantic foundation objects like `CdrBreakpointOrder`.

- [ ] **Update token JSON consumption** (if your build consumes token JSON artifacts):

  Copy the full JSON tree recursively so the new `foundations/` and `components/` directories are included. Use exported JSON paths like `@rei/cdr-tokens/json` or `@rei/cdr-tokens/json/foundations/cdr-space.json` instead of direct `dist/` paths.

- [ ] **Update SCSS utility imports** (if using short `@rei/cdr-tokens/scss/*` paths):

  The short `@rei/cdr-tokens/scss/*` path is now only for utility mixins like `breakpoint-mixins`, `display-mixins`, and `type-mixins`. Foundation SCSS partials are exposed through themed paths like `@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space.scss`.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Check for updated token values that may improve visual consistency
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** TypeScript type imports — per-foundation type modules for type-safe token keys:

  ```typescript
  import type { CdrColorKey } from '@rei/cdr-tokens/types/color';
  import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space';
  ```

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

- **Import only the tokens you use** — a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now `import '@rei/cdr-tokens/css/color'` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  **Business value:** Smaller bundles → faster page loads → better user experience → higher conversion rates. Partial Cedar adopters no longer pay the bundle cost for features they don't use.
  To get started: replace `import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'` with per-category imports for the foundations you need

- **Type-safe token keys** — every foundation exports kebab-case key unions (`'one-x' | 'two-x' | ...`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  **Business value:** Fewer runtime errors from typos, better IDE autocomplete, reduced maintenance overhead for mapping code, faster developer velocity.
  To get started: `import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'`

- **Canonical breakpoint ordering** — `CdrBreakpointOrder` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode `['xs', 'sm', 'md', 'lg']` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  **Business value:** Consistent responsive behavior across the codebase, reduced bugs from mismatched breakpoint arrays, single source of truth for responsive logic.
  To get started: `import { CdrBreakpointOrder } from '@rei/cdr-tokens'`

- **DTCG-aligned typography tokens** — all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly — no adapter required.
  **Business value:** Faster design-to-dev handoff, better integration with modern design tooling, reduced maintenance for custom translation layers, design systems stay in sync automatically.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** — every foundation ships its own `.d.ts` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required `skipLibCheck` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  **Business value:** Better IDE support, fewer type-related bugs, faster development with accurate autocomplete and refactoring, reduced need for TypeScript configuration workarounds.
  To get started: `import type { CdrColorKey } from '@rei/cdr-tokens/types/color'`

</details>

<details>
<summary>## Breaking changes</summary>

- **Package.json `exports` map restructured** — direct `dist/` path imports may no longer resolve
  - **Why:** the `exports` map uses explicit per-category entry points instead of a catch-all glob
  - **Before:** `import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'`
  - **After:** `import '@rei/cdr-tokens/css/color'`
  - **Migrate:** replace direct `dist/` path imports with per-category entry points. See the migration guide for the full mapping

- **Per-foundation dist outputs relocated** — foundation outputs moved from flat theme directories to `dist/*/foundations/`
  - **Why:** modular architecture requires a consistent per-category directory structure
  - **Before:** `dist/rei-dot-com/cdr-color.css`
  - **After:** `dist/rei-dot-com/foundations/color.css`
  - **Migrate:** use per-category import paths rather than referencing dist files directly. If you must use dist paths, update to the `foundations/` structure

### Token changes

#### Relocated

- All foundation token outputs moved from flat theme directories to `dist/*/foundations/<category>.*`

#### Added

- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., `CdrColorKey`, `CdrSpaceKey`)
- `CdrBreakpointOrder` typed const tuple export

#### Format changes

- Typography tokens now use DTCG composite format (`$value`, `$type`, `$description`)

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The per-category import paths use `package.json` `exports` conditions. Bundlers that don't support `exports` (older Webpack 4 configurations, for example) will need to reference `dist/` paths directly using the new `foundations/` structure
- The kebab-case key unions are strict — if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (`map-resolved`, `map-vars`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside `@rei/cedar` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

</details>

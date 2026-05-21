# Release notes – v14.0.0

## Overview

Teams can now import only the token categories they use — `@rei/cdr-tokens/css/color`, `@rei/cdr-tokens/scss/space` — instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the `exports` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with `@rei/cedar` v17 — the 2 packages are a hard co-release.**

## Do I need to update?

**Requires action:** YES — import paths and the TypeScript entry point changed
**Safe to upgrade from:** v13.3.0 with the migration steps below

## Breaking changes

- **TypeScript entry point moved** — the root declaration file changed from `cdr-tokens.d.mts` to `types/index.d.ts`
  - **Why:** each foundation now ships its own `.d.ts` alongside its CSS and JS outputs, and the root barrel re-exports them
  - **Before:** `import type { ... } from '@rei/cdr-tokens'` resolved to `cdr-tokens.d.mts`
  - **After:** resolves to `types/index.d.ts`
  - **Migrate:** if you import from the package root (`@rei/cdr-tokens`), no change needed — the new entry point is wired in `package.json`. If you referenced the `.d.mts` path directly, switch to the package root import

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

- **Root type export surface changed** — consumers importing types from the package root get the new `types/index.d.ts` contract
  - **Why:** types are now organized as per-foundation modules, re-exported through a barrel
  - **Migrate:** if your code compiles after upgrading, no action needed. If you imported type names no longer in the root barrel, check the per-foundation type modules

## New features

- **Import only the tokens you use** — a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now `import '@rei/cdr-tokens/css/color'` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  To get started: replace `import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'` with per-category imports for the foundations you need

- **Type-safe token keys** — every foundation exports kebab-case key unions (`'one-x' | 'two-x' | ...`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  To get started: `import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'`

- **Canonical breakpoint ordering** — `CdrBreakpointOrder` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode `['xs', 'sm', 'md', 'lg']` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  To get started: `import { CdrBreakpointOrder } from '@rei/cdr-tokens'`

- **DTCG-aligned typography tokens** — all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly — no adapter required.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** — every foundation ships its own `.d.ts` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required `skipLibCheck` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  To get started: `import type { CdrColorKey } from '@rei/cdr-tokens/types/color'`

## BOLO

- The per-category import paths use package.json `exports` conditions. Bundlers that don't support `exports` (older Webpack 4 configurations, for example) will need to reference `dist/` paths directly using the new `foundations/` structure
- The kebab-case key unions are strict — if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (`map-resolved`, `map-vars`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside `@rei/cedar` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

## Token changes

### Relocated
- All foundation token outputs moved from flat theme directories to `dist/*/foundations/<category>.*`

### Added
- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., `CdrColorKey`, `CdrSpaceKey`)
- `CdrBreakpointOrder` typed const tuple export

### Format changes
- Typography tokens now use DTCG composite format (`$value`, `$type`, `$description`)

## Migration guide

1. **Update the root CSS import** (if using a single bundle):
   ```diff
   - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
   + import '@rei/cdr-tokens/css/color'
   + import '@rei/cdr-tokens/css/space'
   + // add only the categories you need
   ```

2. **Update SCSS imports** (if importing SCSS variables):
   ```diff
   - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
   + @use '@rei/cdr-tokens/scss/color' as color;
   + @use '@rei/cdr-tokens/scss/space' as space;
   ```

3. **Update TypeScript type imports** (if importing token types):
   ```diff
   - import type { CdrTokens } from '@rei/cdr-tokens'
   + import type { CdrColorKey } from '@rei/cdr-tokens/types/color'
   + import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'
   ```

4. **Update direct dist/ path references** (if bypassing package.json exports):
   ```diff
   - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
   + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
   ```

5. **Upgrade `@rei/cedar` to v17** — both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR

6. **Remove alpha workarounds** — if you used `map-resolved` or `map-vars` SCSS imports from the alpha, remove them. If you used a deep import path for `CdrBreakpointOrder`, switch to the barrel import: `import { CdrBreakpointOrder } from '@rei/cdr-tokens'`

# Release intent — v14.0.0

## What this release is about

This release delivers the modular token architecture. Every foundation category (color, spacing, typography, breakpoint, radius, motion, prominence) now ships as an independent importable module with its own CSS, SCSS, JS, JSON, and TypeScript type outputs. A semantic foundation contract defines the stable public surface. Kebab-case key unions and typed breakpoint ordering are now part of the TypeScript contract.

## What consumers will care about most

- Per-category imports: a consuming app that previously had to load the entire
  token bundle now imports only what it needs — `@rei/cdr-tokens/css/color`,
  `@rei/cdr-tokens/scss/space`, `@rei/cdr-tokens/types/breakpoint`. Teams with
  partial Cedar adoption get meaningfully smaller bundles without changing any
  component code.

- Kebab-case key unions per foundation: TypeScript consumers can now reference
  token keys as `'one-x' | 'two-x' | ...` instead of stripping and transforming
  PascalCase constant names. SCSS loops that generate utility classes from token
  keys work directly against these unions without local mapping code.

- `CdrBreakpointOrder` typed export: responsive logic that previously hardcoded
  `['xs', 'sm', 'md', 'lg']` locally can now import the canonical order directly
  from `@rei/cdr-tokens`. The order is typed as a const tuple — breakpoint logic
  gets type safety and stays synchronized with the token source automatically.

- DTCG-aligned typography tokens: all typography tokens now follow the W3C Design
  Token Community Group composite format. This makes Cedar tokens directly readable
  by Tokens Studio, Figma Variables, and any tooling that consumes the DTCG spec —
  no translation layer required. Teams using Tokens Studio or planning a Figma
  Variables sync benefit immediately.

- Per-component TypeScript type modules: every foundation now ships its own
  `.d.ts` file alongside the CSS and JS outputs. Editor autocomplete, type
  narrowing, and rename refactors work correctly against token names without
  requiring `skipLibCheck` workarounds.

## What changed internally that should NOT appear in release notes

- Token source files migrated from .json5 to .json
- Style Dictionary filter files reorganized into foundations/components/palettes structure
- Build config split into per-output modules
- Validate structure JSON overhauled
- Style Dictionary semantic contract generator extracted
- Speculative SCSS map entrypoints added then reverted (map-resolved, map-vars)
- ADR directory cleanup (moved to docs/)
- Test consumer tsconfig updated for TS6

## Known breaking changes

- TypeScript entry point moved: `cdr-tokens.d.mts` → `types/index.d.ts`
- Package.json `exports` map completely restructured — direct `dist/` path imports may no longer resolve
- Root type export surface changed — consumers importing from the package root get the new `types/index.d.ts` contract
- Per-foundation dist outputs now live under `dist/*/foundations/` rather than flat in the theme directory

## Cross-repo notes

`@rei/cedar` v17 depends on the direct token export paths introduced in this release. These two versions must ship together. The internal token adapter layer in Cedar was rewritten to consume these new paths.

## BOLO — things consumers should watch for

- The per-category import paths use package.json `exports` conditions. Bundlers that don't support `exports` will need to reference `dist/` paths directly.
- The kebab-case key unions are strict — if you were using camelCase token name strings in TypeScript, you'll get type errors.
- SCSS map entrypoints (map-resolved, map-vars) were added in alpha then reverted. They are not in this release.

## Alpha history

- alpha.2 announced SCSS dual map entrypoints (map-resolved, map-vars) — reverted before stable
- alpha.5 required a deep import path for CdrBreakpointOrder — fixed in stable
- alpha.6 added CdrBreakpointOrder to barrel files
- alpha.7 added type-safe breakpoint order exports and consumer compile CI test

## Success criteria

- No consumer build failures from import path changes within 1 week
- Successful co-upgrade with `@rei/cedar` v17 across consuming apps
- Per-category imports working in at least 1 consuming app build

## Sections to include

- [x] Breaking changes
- [x] New features
- [x] Improvements
- [x] Bug fixes
- [x] BOLO
- [x] Token changes
- [ ] Component API changes
- [x] Migration guide
- [x] Design changes

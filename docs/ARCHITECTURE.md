# REI Cedar Tokens - Architecture

## Purpose

This document explains the TypeScript token tooling end-to-end:

- what each tooling component is
- why it exists
- how it works
- how components fit together into a single build and distribution pipeline

Decision-level contract details (consumer API boundaries and TokenDictionary acceptance) are defined in [ADR 0002](./adr/0002-typescript-pipeline-and-consumer-types.md).

## System At A Glance

REI Cedar Tokens transforms source token JSON into platform-specific assets and TypeScript consumer surfaces.

```text
Token JSON -> Preprocess -> Transforms -> Filters -> Formats -> Actions -> dist/
                                   |
                                   +-> Validation + Tests + Package Exports
```

Primary outputs:

- runtime values: JS (ESM + CJS), CSS, SCSS, Android, iOS, Figma, site JSON
- type surfaces: module interfaces, token-name unions, type barrels

## Source Of Truth

### Token Inputs

- `tokens/_options/**` internal option values (not exported as consumer tokens)
- `tokens/global/**` global token definitions
- `tokens/web/**` and `tokens/mobile/**` platform-oriented sources
- `tokens/themes/rei-dot-com/**` and `tokens/themes/docsite/**` theme overrides

### Build Dimensions

Defined in [style-dictionary/constants.ts](../style-dictionary/constants.ts):

- themes: `rei-dot-com`, `docsite`
- platforms: `site/global`, `site/web`, `site/android`, `site/ios`, `web`, `android`, `ios`, `figma`

The build executes every `theme x platform` combination.

## Build Orchestration

Main orchestrator: [style-dictionary/build.ts](../style-dictionary/build.ts)

Responsibilities:

1. register Tokens Studio preprocessor
2. register custom transforms
3. register custom formats
4. register custom actions
5. register custom filters
6. iterate themes and platforms
7. build each configuration via `StyleDictionary(...).buildAllPlatforms()`

Why this matters:

- central registration guarantees deterministic build behavior
- explicit registration order enforces transform dependencies

## Configuration Assembly

Configuration entrypoint: [style-dictionary/configs/index.ts](../style-dictionary/configs/index.ts)

Platform configs:

- [style-dictionary/configs/js.ts](../style-dictionary/configs/js.ts)
- [style-dictionary/configs/css.ts](../style-dictionary/configs/css.ts)
- [style-dictionary/configs/scss.ts](../style-dictionary/configs/scss.ts)
- [style-dictionary/configs/android.ts](../style-dictionary/configs/android.ts)
- [style-dictionary/configs/ios.ts](../style-dictionary/configs/ios.ts)
- [style-dictionary/configs/figma.ts](../style-dictionary/configs/figma.ts)
- [style-dictionary/configs/site.global.ts](../style-dictionary/configs/site.global.ts)
- [style-dictionary/configs/site.web.ts](../style-dictionary/configs/site.web.ts)
- [style-dictionary/configs/site.android.ts](../style-dictionary/configs/site.android.ts)
- [style-dictionary/configs/site.ios.ts](../style-dictionary/configs/site.ios.ts)
- [style-dictionary/configs/types.ts](../style-dictionary/configs/types.ts)

Why config layering is needed:

- keeps source loading, transforms, and output formats platform-specific
- avoids one monolithic build config with conflicting behavior

## Transform Layer

Transform files are under [style-dictionary/transforms](../style-dictionary/transforms).

Core rule:

- `attribute/deprecated` must run first because it mutates token metadata and path context used by downstream transforms and filters

Value transforms cover:

- px/rem conversion
- spacing normalization
- unit stripping for JS/SCSS targets
- platform-specific sizing (dp for Android)
- clamp value generation

Detailed transform ordering guidance lives in [docs/TRANSFORMS.md](./TRANSFORMS.md).

Why transforms are needed:

- source tokens are authored semantically, not in final platform units
- each output target has different unit and formatting expectations

## Filter Layer

Filter files are under [style-dictionary/filters](../style-dictionary/filters).

Filter categories:

- foundational responsibilities: color, space, radius, motion, prominence, form, icon
- palette responsibilities
- utility filters: remove source-only namespaces and categories

Why filters are needed:

- isolate responsibility-specific token modules
- prevent internal-only options/theme scaffolding from leaking into consumer outputs

Every filter has tests (`*.test.ts`) to guard contract drift.

## Format Layer

Format files are under [style-dictionary/formats](../style-dictionary/formats).

Types of custom formats:

- SCSS mixin/map outputs
- site JSON outputs
- Figma JSON output
- TypeScript module values, interfaces, and token-name unions

Type generation formats:

- [style-dictionary/formats/typescript-module-values.ts](../style-dictionary/formats/typescript-module-values.ts)
- [style-dictionary/formats/typescript-module-declarations.ts](../style-dictionary/formats/typescript-module-declarations.ts)
- [style-dictionary/formats/typescript-token-name-union.ts](../style-dictionary/formats/typescript-token-name-union.ts)

Why formats are needed:

- each consumer environment needs a different output shape
- TypeScript consumers need compile-time interfaces and unions in addition to runtime values

## Action Layer

Action files are under [style-dictionary/actions](../style-dictionary/actions).

Responsibilities:

- concatenate generated utility assets where needed
- include static SCSS utility files in output
- generate types barrels via [style-dictionary/actions/generate-types-barrel.ts](../style-dictionary/actions/generate-types-barrel.ts)

Why actions are needed:

- not all output operations are pure token formatting
- some outputs require post-format assembly and file composition

## Type Generation Pipeline

Type modules are defined via [style-dictionary/token-modules.ts](../style-dictionary/token-modules.ts) and wired by [style-dictionary/configs/types.ts](../style-dictionary/configs/types.ts).

Per module, the build emits:

- `*.mjs` typed value module
- `*.d.ts` module interface/value declaration
- `*.names.d.ts` token-name union declaration

Then `generate-types-barrel` creates:

- `index.mjs`
- `index.d.ts`

for each theme type output root.

Base schema types are generated by [style-dictionary/generate-base-types.ts](../style-dictionary/generate-base-types.ts).

Why this pipeline is needed:

- avoids one monolithic declaration file
- preserves module boundaries for type-safe imports
- gives consumers stable barrel entrypoints while keeping internals evolvable

## Runtime + Type Contract Surfaces

Public package entrypoints are defined in [package.json](../package.json).

Current consumer contract includes:

- runtime: `@rei/cdr-tokens`, `@rei/cdr-tokens/docsite`
- type barrels: `@rei/cdr-tokens/types`, `@rei/cdr-tokens/docsite/types`
- base schema types: `@rei/cdr-tokens/types/base`

Theme-scoped deep type patterns (`./rei-dot-com/types/*`, `./docsite/types/*`) exist as compatibility surfaces but are less preferred than barrels.

Why this split exists:

- runtime imports and type-only imports have different lifecycle and stability requirements
- barrels reduce coupling to generated folder internals

## Validation And Safety Nets

Validation stack:

- [validate.ts](../validate.ts): token structure and rules validation
- [validate-structure.json](../validate-structure.json): dist shape snapshot validation
- unit tests via Vitest (`style-dictionary/**/*.test.ts`)

Why validation is needed:

- catches accidental output drift
- prevents malformed token trees from entering dist
- enforces contract continuity across refactors

## Tokens Studio Integration

Token Studio sync tooling is in [tokens-studio/token-updater.ts](../tokens-studio/token-updater.ts).

Role in the architecture:

- keeps source token JSON aligned with upstream design-tool workflows
- sits before build generation; it does not replace Style Dictionary output logic

## Script Topology

Build and validation scripts are defined in [package.json](../package.json):

- `build:base-types`
- `build:tokens`
- `site-tokens`
- `validate`
- `build`

Supporting scripts:

- testing (`test`, `test:watch`, `test:coverage`)
- formatting and linting (`format`, `lint`, `format:check`)

Why script separation is needed:

- supports targeted local workflows
- allows CI to enforce distinct guarantees (build, validate, test)

## How Everything Fits Together

### Phase 1: Source Preparation

- token JSON files loaded from include/source paths
- theme overrides layered on top of base tokens

### Phase 2: Semantic Transformation

- transforms normalize values and attributes for target platforms

### Phase 3: Responsibility Partitioning

- filters isolate output scopes by responsibility and platform

### Phase 4: Artifact Emission

- formats emit runtime and type artifacts
- actions perform post-processing and barrel generation

### Phase 5: Contract Verification

- validate output structure and content assumptions
- execute tests and smoke checks

### Phase 6: Distribution

- package exports expose only supported public entrypoints

## Extension Playbook

When adding a new responsibility/platform/theme:

1. update source token definitions
2. add or update filters
3. update token module mapping (if TypeScript surface is required)
4. update platform configs/formats/actions as needed
5. add tests and validation expectations
6. confirm package exports impact
7. update ADR/docs if consumer contract changes

## Assessing TokenDictionary Work

Use [ADR 0002](./adr/0002-typescript-pipeline-and-consumer-types.md) as the decision and acceptance source.

A TokenDictionary PR should be assessed against:

1. no public export regressions
2. generated union/interface outputs remain source-of-truth-driven
3. generic constraints match generated module key/value shapes
4. runtime/type surfaces remain compatible with existing entrypoints
5. build, validation, and tests remain green

## Related Documentation

- [ADR 0001](./adr/0001-modularize-tokens-output.md)
- [ADR 0002](./adr/0002-typescript-pipeline-and-consumer-types.md)
- [docs/TRANSFORMS.md](./TRANSFORMS.md)
- [README.md](../README.md)

# Architecture Review: Spike vs. Mainline

Repos compared:

- **Spike:** `/Users/mhewson/Code/REI/rei-cedar-token-pipeline-spike`
- **Mainline:** `/Users/mhewson/Code/REI/rei-cedar-tokens`

## A. Source Token Organization

|                      | Spike                                                                                                                                                          | Mainline                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Layout               | Flat `tokens/` directory of per-concern JSON files (options, aliases, platform overrides), normalized by a custom script into a single `canonical/tokens.json` | Hierarchical, hand-authored `tokens/{_options,global,web,mobile,themes/<theme>}/**/*.json`, consumed directly by Style Dictionary |
| Authoring model      | Figma-variable-shaped input → normalization layer enforces the canonical shape (ADR-0002 Normalization Layer)                                                  | Token files are the canonical shape; no separate normalization pass                                                               |
| Platform differences | Modeled as `$extensions.cedar.platformOverrides` on option tokens (see `adr-0004`, Platform Override Governance)                                               | Modeled as separate `web/` and `mobile/` token trees                                                                              |

## B. Build Pipeline

|                          | Spike                                                                                                                                                                                     | Mainline                                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Passes                   | Two-pass: (1) `normalize.ts` builds `canonical/tokens.json` from the flat `tokens/` input, (2) separate Style Dictionary builds consume the canonical file for types vs. platform outputs | Single-pass: one Style Dictionary orchestrator builds every `theme × platform` combination, then runs `generateSemanticContract()` as a post-build step |
| Custom tooling           | Custom normalization/validation scripts sit in front of Style Dictionary                                                                                                                  | Style Dictionary transforms/formats/filters/actions do the full job; no separate normalization step                                                     |
| Style Dictionary version | v5                                                                                                                                                                                        | v5 (same major version in both repos)                                                                                                                   |

## C. Style Dictionary Usage

|              | Spike                                                                                                         | Mainline                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Config size  | Minimal — a handful of transforms/formats, mostly delegating to the normalization layer for shape correctness | Extensive — custom transforms, formats, and filters per domain (foundations/components/palettes), see `style-dictionary/filters/`, `style-dictionary/configs/` |
| Filter model | Coarse; mostly one filter set for "everything normalized"                                                     | Domain-partitioned filters (foundations vs. components vs. palettes), enumerated in ADR-0001 §"Filter Structure Contract"                                      |

## D. Generated Artifacts

**Spike** (`dist/themes/rei-dot-com/...`):

- `types/` — TypeScript output from the types-focused Style Dictionary pass
- `meta/` — metadata artifacts
- `css/light/cdr-color-text.css` (etc.) — per-module CSS, split by theme mode
- `ios/CdrTypography.swift`, `ios/CdrSpacing.swift` — native platform outputs

Known defect: some CSS modules emit duplicate custom-property declarations for the same
variable (e.g. a hex value followed immediately by an OKLCH value for
`--cdr-text-brand`) in
<ref_file file="/Users/mhewson/Code/REI/rei-cedar-token-pipeline-spike/dist/themes/rei-dot-com/css/light/cdr-color-text.css" />.
This should be fixed as part of any adoption of the spike's color-space handling, not
carried forward.

**Mainline** (`dist/<theme>/...`):

- `js/cdr-tokens.mjs` (+ `.cjs`, `.d.ts`) — aggregate runtime + declarations
- `types/index.d.ts` plus per-domain modules (`types/foundations/cdr-color-background.d.ts`, `*.names.d.ts`)
- `css/cdr-tokens.css` plus per-domain CSS
- `scss/` mixins and forwards
- `json/web.json` — aggregate JSON artifact

Module/type generation is schema-driven and documented in
<ref_file file="/Users/mhewson/Code/REI/rei-cedar-tokens/docs/adr/0001-modular-output-architecture.md" />:
foundations are the only domain that emits typed public surfaces (token-name unions +
module interfaces); components and palettes are value-layer only (JSON/SCSS/CSS, no
`.d.ts`).

## E. Distribution Structure & Public API Surface

|                          | Spike                                                                                                                                                  | Mainline                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Package exports          | Not yet finalized/productionized — spike is a validation harness, not a published package                                                              | Stable `package.json` exports: `@rei/cdr-tokens/types`, `/css`, `/scss`, `/docsite/types`, `/docsite/css`, `/docsite/scss`, theme-scoped deep paths                                              |
| Type generation strategy | Style Dictionary "types" pass emits grouped objects (e.g. `CdrColorText`) with kebab-case keys — inconsistent with idiomatic TS/PascalCase conventions | Per-module literal union (`*.names.d.ts`) + module interface (`*.d.ts`), aggregated into a stable barrel; theme is a first-class type-level union (`Theme = 'rei-dot-com' \| 'docsite'`)         |
| Validation               | `validate-contract.ts` / normalization-layer invariants enforce ADR-0004's (now superseded) naming grammar                                             | `validateExportMap()` in `validate.ts` is a CI guard that catches package.json export entries pointing at non-existent dist files; `canonical-contract.test.ts` enforces output-shape invariants |

## Summary of Divergence

- **Token structure:** spike is a flat, Figma-normalized input funneled into one
  canonical file; mainline is a hierarchical, manually authored tree with no
  intermediate normalization step.
- **Build process:** spike runs a custom two-pass pipeline in front of Style
  Dictionary; mainline runs a single Style Dictionary orchestration pass plus a
  contract-generation step.
- **Semantic model:** spike is built around a semantic/alias token model (with
  component tokens deprecated); mainline still has first-class component tokens
  alongside foundation tokens (see `docs/adr/0001-modular-output-architecture.md`
  §Domain Families).
- **Distribution maturity:** mainline has a stable, CI-validated public contract
  (package exports, typed barrels, export-map validation); spike does not yet have an
  equivalent distribution layer.

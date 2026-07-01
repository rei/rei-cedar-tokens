# Semantic Contract: Open Questions for Consumers

> **Purpose:** This document tracks design questions that block stable semantic contract
> outputs from the token repo. Each question affects public API shape and cannot be
> answered unilaterally by the token team — the answer must come from the consuming
> system (Cedar or otherwise) and then be frozen before a stable release.
>
> These questions are intentionally framed as general contract principles, not as
> one-off implementation decisions. Once answered, the answers become part of the
> semantic contract spec and should be recorded in ADR 0001 and reflected in the
> public docs.

---

## Q1: What is the canonical semantic key vocabulary for surface properties?

**Why this is blocking:**  
The token outputs have named modules for `color-background`, `color-border`,
`color-icon`, `color-text`, and `prominence`. But the token repo does not know which
subset of those raw token keys maps to a _surface semantic key_ that consumers use in
class generation or attribute selectors.

For example: does `CdrColorBackgroundPrimary` map to a surface key of `primary`,
`background`, `background-primary`, or something else? The token repo cannot
canonicalize the surface-facing key without this.

**Questions to answer:**

1. What is the complete list of surface semantic key names Cedar uses for class/attribute
   generation (e.g. `background`, `background-secondary`, `border-color`,
   `shadow-prominence`, etc.)?
2. Are surface semantic keys namespaced by property (e.g. `background:primary`) or flat
   (e.g. `primary`)?
3. Should semantic keys be stable and frozen before stable release, or are they expected
   to evolve with aliasing during alpha?
4. Does a surface semantic key ever map to _multiple_ token values (e.g. a compound
   key that drives both background + border)?

**Decision:**

- Surface keys are property-scoped, not flat. Canonical shape is namespaced by property:
  - `background`: `primary | secondary | brand | sale`
  - `border-color`: `primary | secondary | success | warning | error | info`
  - `border-style`: `solid | dotted | dashed`
  - `border-radius`: `sharp | soft | softer | softest | round`
  - `box-shadow`: `flat | raised | elevated | floating | lifted`
- Do not use flat shared keys like `primary` without property context.
- Semantic key set is frozen at stable. During alpha, additive changes are allowed; renames require aliasing and deprecation metadata.
- A surface semantic key maps to one responsibility domain. Compound behaviors require a separate explicit composite key — no silent overloading.

**Affects outputs:**  
`utility-map.scss` surface groups, TS runtime surface maps, JSON contract artifact.

---

## Q2: Should SCSS semantic maps use CSS var references or resolved values?

**Why this is blocking:**  
`utility-map.scss` currently emits resolved rem values:

```scss
$spacing: (
  cdr-space-one-x: 1.6rem,
  ...,
);
```

But if Cedar's SCSS loops generate `var()` calls for dynamic theming, the maps need:

```scss
$spacing: (
  cdr-space-one-x: var(--cdr-space-one-x),
  ...,
);
```

These are structurally incompatible — resolved values can be used in `calc()` and
arithmetic; `var()` references cannot. A map cannot safely provide both in the same
variable.

**Questions to answer:**

1. Do consuming SCSS loops need to do arithmetic on map values (e.g. `calc(value / 2)`)?
   If yes, resolved values are required.
2. Do consuming SCSS loops need to survive theme switching at runtime (e.g. dark mode
   via CSS custom property override)? If yes, `var()` references are required.
3. Are both patterns needed by different consumers? If yes, two parallel maps are needed
   (e.g. `$spacing` for resolved and `$spacing-vars` for var references).
4. Should `utility-map.scss` expose both, or should resolved values live in a separate
   import (e.g. `@use '@rei/cdr-tokens/scss/map-resolved'` vs
   `@use '@rei/cdr-tokens/scss/map-vars'`)?

**Decision:**

- Both are needed. Provide parallel maps:
  - Resolved maps for arithmetic and compile-time math
  - `var()` maps for runtime theming and dynamic overrides
- Export as separate entrypoints to avoid ambiguity:
  - `scss/map-resolved` — current resolved-value maps
  - `scss/map-vars` — parallel maps using `var(--cdr-*)` references
- Keep naming consistent across both map families so consumers can switch with minimal code churn.

**Affects outputs:**  
`utility-map.scss`, any new surface/breakpoint/radius SCSS maps, the `./scss/map`
package export entrypoint.

---

## Q3: What is the canonical ordering contract for ordered-dimension tokens?

**Why this is blocking:**  
Breakpoints have a natural order (`xs → sm → md → lg`) that is implicit in the token
names but not in the emitted object. Consumers currently hardcode this order (e.g. in
`other.ts`). The same problem may apply to:

- type scale steps (100 → 200 → ... → 1600)
- spacing scale steps (scale-0 → scale-8)
- animation timing/duration steps if chained

**Questions to answer:**

1. Which token families need a canonical order export, beyond breakpoints?
2. Should order be expressed as an array of semantic keys (`['xs', 'sm', 'md', 'lg']`),
   as an array of token names (`['CdrBreakpointXs', ...]`), or as an indexed map
   (`{ 0: 'xs', 1: 'sm', ... }`)?
3. Should the order array be part of the same module file, or a separate module
   (e.g. `cdr-breakpoint-order.mjs`)?
4. Is the order contract additive-only (new steps are always appended) or can steps be
   inserted between existing ones? The answer determines whether numeric indexing is
   safe for consumers.

**Decision:**

- Required families now: `breakpoints`, `space-scale`, `text-size` scale.
- Order exported as semantic key arrays; a key union is derived from the array.
  Example: `CdrBreakpointOrder = ["xs","sm","md","lg"] as const` + `CdrBreakpointOrderKey`.
- Keep separate order modules per family (`cdr-breakpoint-order`, `cdr-space-scale-order`,
  `cdr-text-size-order`) and re-export all from root.
- Contract rule:
  - Stable channel is **append-only** — new steps are always added at the end.
  - Inserting between existing members is a breaking change and requires a major version.
  - If insertion is unavoidable during alpha, it must include an explicit release note callout.

**Affects outputs:**  
`cdr-breakpoint.mjs` / `.d.ts`, any future `cdr-text-size-order`, `cdr-space-scale-order`
equivalents.

---

## Q4: What is the expected shape of the machine-readable contract artifact?

**Why this is blocking:**  
The token repo already emits `dist/rei-dot-com/json/web.json` with full token metadata.
But a "contract artifact" for downstream validation has different requirements than a
full data dump. Before generating one, the repo needs to know what shape consumers
expect to validate against.

**Questions to answer:**

1. What fields must be present in each entry: token name, CSS var, resolved value,
   semantic key, module, responsibility?
2. Should the artifact be flat (one entry per token) or grouped (by module/responsibility)?
3. Should deprecated tokens appear in the artifact, or be filtered out?
4. What is the intended update frequency — regenerated on every build, or only on
   contract-breaking changes?
5. Who owns validation against the artifact — the token repo, Cedar, or shared?

**Decision:**

- Add a dedicated `contract.json` artifact distinct from the full `web.json` dump.
- Each entry must include at minimum: `tokenName`, `module`, `responsibility`,
  `semanticKey`, `cssVar`, `resolvedValue`, `valueType`, `deprecated`,
  `replacement` (nullable), `sinceVersion`.
- Provide a grouped-by-module object and an optional flat list for simpler diffing.
- Include deprecated entries with flags — do not drop them silently.
- Regenerate on every build and validate schema in CI.
- Ownership: tokens repo owns generation and schema validity; Cedar owns downstream
  drift validation against released artifact.

**Affects outputs:**  
New `dist/rei-dot-com/json/contract.json` artifact, contract drift tests.

---

## Q5: What is the deprecation / migration contract for semantic key renames?

**Why this is blocking:**  
Once a semantic key is published in the stable channel, renaming it is a breaking change
for every downstream consumer using that key in class generation, attribute selectors, or
runtime maps. The token repo needs a policy before freezing the semantic key vocabulary.

**Questions to answer:**

1. How long must a deprecated semantic key remain in the output before removal
   (one major version? two alpha cycles?)?
2. Should deprecated semantic keys emit a SCSS `@warn` and TS `@deprecated` JSDoc, or
   be silently removed?
3. Is there a machine-readable deprecation record (e.g. `deprecated: true` in the JSON
   artifact) that downstream consumers can use in automated checks?
4. Who approves a semantic key rename — token team alone, or requires Cedar
   sign-off?

**Decision:**

- Minimum retention: one full major version after deprecation.
- Deprecations must emit:
  - TS `@deprecated` JSDoc on the affected export
  - SCSS `@warn` on deprecated map key access where possible
  - JSON `deprecated: true` + `replacement` + `sinceVersion` fields in `contract.json`
- Semantic key renames/removals require Cedar sign-off before stable release.
- Token name changes are breaking changes and must be listed in the release notes
  under a **Semantic Contract Changes** / breaking changes section.
- That section must list explicit adds, deprecations (with replacement), removals,
  and any token-name renames that change the consumer-facing contract.

**Affects outputs:**  
Deprecation tags in generated `.d.ts`, `@warn` in SCSS utilities, `docs/DEPRECATION.md`
policy, JSON artifact `deprecated` field.

---

## Resolution Process

When an answer is reached for any question:

1. Record the decision in this file under the corresponding question (add `**Decision:**`
   after the question block).
2. Update `docs/adr/0001-modular-output-architecture.md` Domain Contracts section.
3. Open an implementation ticket in `docs/tickets/` with the specific output changes
   required.
4. Freeze the decision in the next alpha release notes.

---

## Alpha v14 — Semantic Contract Changes Tracking

> **Status:** Pre-release / `feature/cedarContract` branch (targeting `next`).
> This section is the source of truth for the **Semantic Contract Changes** section
> in the v14 release notes. All items below require Cedar sign-off before promotion
> to stable.

### Additive (non-breaking — new exports)

| Symbol / entrypoint                       | Kind                | Notes                                                                                                                                              |
| ----------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CdrBreakpointOrder`                      | `readonly string[]` | Canonical breakpoint order `["xs","sm","md","lg"]`. Exported from root, `./types`, and `./types/cdr-breakpoint-order`.                             |
| `CdrBreakpointOrderKey`                   | type                | `(typeof CdrBreakpointOrder)[number]` union.                                                                                                       |
| `CdrSpaceScaleOrder`                      | `readonly string[]` | Canonical space-scale order including range keys `["0","01","1","2","3","34","35","4","5","6","7","8"]`.                                           |
| `CdrSpaceScaleOrderKey`                   | type                | `(typeof CdrSpaceScaleOrder)[number]` union.                                                                                                       |
| `CdrTextSizeOrder`                        | `readonly string[]` | Canonical text-size step order.                                                                                                                    |
| `CdrTextSizeOrderKey`                     | type                | `(typeof CdrTextSizeOrder)[number]` union.                                                                                                         |
| `*.keys.mjs` runtime arrays               | module              | Every token group (e.g. `cdr-space-scale.keys.mjs`) now ships a runtime JS array of semantic keys alongside the existing `*.keys.d.ts` type union. |
| `CdrBreakpointTokenName`, `Cdr*TokenName` | types               | Token-name union types for all groups added to `*.names.d.ts` and re-exported via `./types` barrel.                                                |

### Finalized — Space Scale Range Symbol Naming

| Final symbol             | Semantic key |
| ------------------------ | ------------ |
| `CdrSpaceScaleRange0To1` | `"01"`       |
| `CdrSpaceScaleRange3To4` | `"34"`       |
| `CdrSpaceScaleRange3To5` | `"35"`       |

**Context:** Space-scale range entries are now represented with explicit `Range*To*`
identifiers in generated TypeScript/JavaScript symbols so range intent remains clear.

**Scope of change:** Affects `CdrSpaceScaleTokenName` union, `cdr-space-scale.names.d.ts`,
`cdr-space-scale.keys.d.ts` key literal, `cdr-space-scale.keys.mjs` array entry, and
`CdrSpaceScaleOrder` array entry.

**Action required:** Include these finalized symbol names in v14 release notes.

### Module / Entrypoint Changes

| Change                                                                               | Notes                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New `./types/*` wildcard entrypoint (per-group)                                      | `@rei/cdr-tokens/types/cdr-breakpoint` etc. now resolve to individual module files. Non-breaking addition.                                                                                                                                                                                              |
| Speculative SCSS map entrypoints (`map-resolved`, `map-vars`) added and **reverted** | These were introduced in `feat(tokens): add dual SCSS map entrypoints` and fully reverted in `revert(scss): remove speculative map-resolved and map-vars entrypoints`. No consumer impact.                                                                                                              |
| New `./scss/*` wildcard maps to `utilities/`                                         | `@rei/cdr-tokens/scss/cdr-breakpoint-mixins` and `@rei/cdr-tokens/scss/cdr-type-mixins` (and other utility files) now available as named per-file entrypoints for granular imports. Existing `@use '@rei/cdr-tokens/scss'` barrel import unchanged. Non-breaking addition enabling better tree-shaking. |

### Consumer Migration Guide (Optional, Non-Breaking)

All existing consumer imports continue to work without any changes. The following are **optional improvements** consumers can adopt at their own pace:

#### SCSS Typography Mixins (Optional Optimization)

**Today (still supported):**

```scss
@use '@rei/cdr-tokens/scss' as cdr;
@include cdr.cdr-text-body-300();
```

**Optional (more granular, better tree-shaking):**

```scss
@use '@rei/cdr-tokens/scss/cdr-type-mixins' as typeHelpers;
@include typeHelpers.cdr-text-body-300();
```

Benefits: Reduces bundle size if your build system can tree-shake unused mixins from the file-level import.

#### TypeScript / JavaScript Semantic Tokens (Optional Granularity)

**Today (still supported):**

```ts
import { CdrSpace, CdrBreakpoint } from '@rei/cdr-tokens';
```

**Optional (per-group imports for stricter boundaries):**

```ts
import { CdrSpace } from '@rei/cdr-tokens/types/space';
import { CdrBreakpoint } from '@rei/cdr-tokens/types/breakpoint';
```

Benefits: Enables more explicit dependency declarations and can improve type-checking performance in large monorepos.

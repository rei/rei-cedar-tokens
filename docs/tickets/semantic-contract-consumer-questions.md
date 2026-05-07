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

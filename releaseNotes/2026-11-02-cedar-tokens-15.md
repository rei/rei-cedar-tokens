---
default: true
version: 15.0.0
date: 2026-11-02
---

# Release notes – v15.0.0

## Overview

Semantic color tokens now match Figma variable names 1:1 — the taxonomy designers use in Figma is the same set of names engineers write in code, with no translation table. A new intents layer (Primary, Secondary, Brand, link) lets consumers apply a coordinated color set instead of composing individual tokens, and all semantic colors ship in OKLCH with sRGB fallbacks. This is a major version because the color taxonomy was renamed and restructured, several legacy outputs are deprecated ahead of removal in the next major, and iOS/Android output changed. **Deprecated v14 names still ship in this release — nothing hard-breaks on upgrade, but plan the renames below.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Replace `utility-map.scss` imports** — the aggregated Sass map (`$radius`, `$spacing`, `$spacing-inset`, etc.) is removed. The individual `$cdr-*` variables it wrapped are unaffected.

  ```diff
  - @use '@rei/cdr-tokens/rei-dot-com/scss/utility-map' as map;
  + // use the individual variables instead:
  + @use '@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-radius' as radius;
  + @use '@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space' as space;
  ```

- [ ] **Android consumers: pin to v14** — Android output is removed in this release (ADR-0005). AAR/XML/Compose distribution returns in a future release tracked in `docs/tickets/android-reenablement.md`.

- [ ] **iOS consumers: expect color and size tokens to be absent** — this release ships `CedarText.swift` (typography only). Colors and sizes return in a follow-up release tracked in `docs/tickets/ios-canonical-migration.md`. If your app needs `CdrColor`/`CdrSize` today, stay on v14.

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** `--cdr-color-background-*` custom properties — renamed to the `--cdr-surface-*` taxonomy and retuned. The old names are still emitted (marked `@deprecated`) this major and will be removed next major.

  ```diff
  - background: var(--cdr-color-background-primary);
  + background: var(--cdr-surface-neutral);
  ```

- [ ] **Updated:** Sass utility mixins — `breakpoint-mixins`, `display-mixins`, and `type-mixins` still resolve via `@rei/cdr-tokens/scss/*` but are deprecated. Canonical replacements land in `@rei/cedar`; migrate when they ship.

- [ ] **Updated:** Semantic color tokens regrouped — colors now live in named families (surface, text, border, icon, action, control, feedback, selection, graphik) matching Figma. Most v14 names are still emitted; new names are the canonical spelling going forward.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** Intent token modules — coordinated Primary/Secondary/Brand/link color sets:

  ```typescript
  import '@rei/cdr-tokens/css/intents/cdr-text';
  // or in SCSS: @use '@rei/cdr-tokens/rei-dot-com/scss/intents/cdr-text';
  ```

- [ ] **New:** Universal semantic layer — `--cdr-surface-*`, `--cdr-border-*`, `--cdr-text-*`, `--cdr-icon-*` covering all 163 canonical semantic colors:

  ```diff
  - import '@rei/cdr-tokens/css/color-background'
  + import '@rei/cdr-tokens/css/color-universal'
  ```

- [ ] **New:** OKLCH color output — every semantic token emits an OKLCH value alongside its sRGB fallback in the same `:root` block; no action needed unless you parse values out of the CSS.

### To get the most out of this update

This release enables the following new capabilities:

- Figma-true naming — designer specs translate directly to code, no translation table
- Coordinated intent colors — pick Primary/Secondary/Brand/link and get text, icon, border, and surface together
- Wide-gamut color — OKLCH values with automatic sRGB fallback
- Universal semantic variables — a single import covers every canonical semantic color

</details>

<details>
<summary>## New features</summary>

- **Figma-true token names** — every semantic color token name matches its Figma variable exactly. Before this release, design specs used one vocabulary (`action.text.trigger-bold`) and code used another (`--cdr-color-text-button-primary`), so every handoff needed mental translation. Now the designer's variable name is the engineer's token name.
  **Business value:** Faster design-to-dev handoff → fewer spec misreads → fewer visual QA cycles.
  To get started: browse the Tokens/Colors stories in this Storybook — family and subcategory groupings match the Figma panel structure

- **Intent color modules** — `cdr-border`, `cdr-icon`, `cdr-surface`, `cdr-text`, and `cdr-text-emphasis` intent outputs expose Primary/Secondary/Brand/link sets. Before this release, applying "the brand look" meant hand-picking 4 separate tokens and hoping the combination was legal. Now the legal combinations ship as data.
  **Business value:** Fewer arbitrary color combinations in production → more consistent brand application → less design-review churn.
  To get started: `import { CdrColorTextOrder } from '@rei/cdr-tokens'` to enumerate available intents

- **Universal semantic layer** — `cdr-color-universal` emits all 163 canonical semantic colors under `--cdr-surface-*`/`--cdr-border-*`/`--cdr-text-*`/`--cdr-icon-*`. Before this release, 7 canonical tokens (including `--cdr-border-neutral` and `--cdr-text-neutral-prominent`) never reached output at all. Now coverage is complete.
  **Business value:** No more gaps between the design spec and shipped tokens → fewer one-off hex overrides in product code.
  To get started: `import '@rei/cdr-tokens/css/color-universal'`

- **OKLCH semantic colors** — every semantic custom property now emits both an sRGB hex and an OKLCH value, so modern browsers get wide-gamut color and older browsers fall back automatically.
  **Business value:** Better color fidelity on wide-gamut displays → brand colors render as designed on modern hardware → no extra work for older browsers.

</details>

<details>
<summary>## Breaking changes</summary>

- **`utility-map.scss` removed** — the aggregated Sass map file no longer exists
  - **Why:** it was a convenience wrapper around the individual `$cdr-*` variables with no remaining consumers
  - **Before:** `@use '@rei/cdr-tokens/rei-dot-com/scss/utility-map'`
  - **After:** `@use` the per-foundation partials (`foundations/cdr-radius`, `foundations/cdr-space`, ...)
  - **Migrate:** replace map lookups with the individual variables, which are unchanged

- **`cdr-color-background` foundation renamed to `cdr-surface` taxonomy** — the 9 `--cdr-color-background-*` variables are renamed (and retuned) as `--cdr-surface-*`
  - **Why:** "background" conflated page backgrounds with component surfaces; the new family matches Figma
  - **Before:** `--cdr-color-background-primary`, `--cdr-color-background-secondary`, ...
  - **After:** `--cdr-surface-neutral`, `--cdr-surface-neutral-subtle`, ...
  - **Migrate:** swap variable names per the mapping in the Tokens/Colors story. Old names still emit this major, marked deprecated

- **Android output removed** — no Android tokens ship in this release
  - **Why:** deliberate deferral (ADR-0005) while the normalization layer's Android extensions are rebuilt
  - **Before:** v14 Android token outputs
  - **After:** none; re-enablement tracked in `docs/tickets/android-reenablement.md`
  - **Migrate:** pin Android consumers to v14 until re-enablement lands

- **iOS output reduced to typography** — `CdrColor`/`CdrSize` outputs are absent
  - **Why:** the iOS platform migration to canonical tokens is in progress; only text tokens shipped this cycle
  - **Before:** v14 `CdrColor`/`CdrSize` Swift/ObjC outputs
  - **After:** `CedarText.swift` only; full restoration tracked in `docs/tickets/ios-canonical-migration.md`
  - **Migrate:** iOS consumers needing colors/sizes stay on v14

### Deprecations (still emitted — removal planned next major)

- `scss/utilities/` mixin files (`cdr-breakpoint-mixins`, `cdr-display-mixins`, `cdr-type-mixins`) — replaced by equivalents shipped in `@rei/cedar`
- `cdr-color-background` foundation outputs (css/scss) — replaced by the `cdr-surface`/`color-universal` taxonomy
- All `components/cdr-*` token outputs — component tokens are deprecated as a category

</details>

<details>
<summary>## Be Aware Of</summary>

### Bug fixes

- **`color.feedback.border.natural-faint`** — corrected the misspelled `nautral` token name and restored the token to output (`--cdr-feedback-border-natural-faint: #e6ddc9`)
- **7 canonical tokens missing from output** — `--cdr-border-neutral`, `--cdr-border-neutral-prominent`, `--cdr-border-neutral-trace`, `--cdr-text-neutral`, `--cdr-text-neutral-bold`, `--cdr-text-neutral-prominent`, and `--cdr-feedback-border-natural-faint` now emit in the universal layer

### Notices

- **`node >= 24` is required** to build or consume this package's tooling; the engines field was raised this release
- **Intent values are not yet barrel-exported** — `import { CdrColorPrimaryText } from '@rei/cdr-tokens'` won't resolve yet; intent _order_ arrays are exported, values are reachable via deep imports today. Root-level intent exports are tracked in `docs/tickets/intents-export-surface.md`
- **Token descriptions/deprecation metadata don't reach output yet** — descriptions exist in the canonical data but are stripped at emit; tracked in `docs/tickets/token-metadata-emission.md`
- **The release-notes generator's commit filter still drops `chore:`/`refactor:` commits** — some consumer-facing changes in this release wouldn't appear in auto-generated notes; tracked in `docs/tickets/commit-hygiene-release-notes-readiness.md`

</details>

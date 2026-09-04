# Migration Plan

Phased to minimize consumer disruption. The delivery model (package exports, module
boundaries, type-generation mechanism) stays stable throughout; only the **color**
token taxonomy, canonical shape, and filter/validation rules change.

**Scope:** this plan covers the `color` foundation only. `radius`, `spacing`,
`typography`, `motion`, `size`, and `shape` are not part of this migration and keep
their current naming/structure. If/when a semantic layer is scoped for another
foundation, it should go through its own alignment and design work — it should not be
assumed to reuse this taxonomy's shape.

## Phase 0 — Alignment (no code changes)

- Confirm the five-tier color taxonomy with design/architecture stakeholders as the
  authoritative model for `color` (supersedes ADR-0004 and the confluence doc for
  color). Update or deprecate `adr-0004-semantic-token-architecture.md` in the spike
  repo to point at the new taxonomy source and to scope ADR-0004's cross-category claims
  down to color only.
- Resolve the open questions in `05-open-questions.md` that block schema work
  (especially: `overlay` classification, exact identity list).
- Run a design/engineering workshop to produce the authoritative legacy → new-taxonomy
  token mapping for color (starting point: `03-future-state-proposal.md` §4).

## Phase 1 — Canonical Model & Schema (mainline repo)

- Reshape the canonical `color` tree (only) to the corrected grammar:
  `color[.interaction-family].role.identity[.expression]`. Other foundation trees in
  the canonical model are untouched.
- Update `src/schema/token-schema.json` (or mainline equivalent) to validate the new
  grammar for `color`, including the omission rules (no literal `base`, no literal
  `universal`).
- Port the spike's `$extensions.cedar.platformOverrides` mechanism and governance rules
  into mainline's canonical model for platform-specific value divergence (applies to
  color first; extending it to other foundations is a separate decision).
- Rewrite `validate-contract.ts` / `canonical-contract.test.ts` invariants for `color`
  against the new grammar; leave non-color invariants as-is.

## Phase 2 — Build Pipeline & Filters (mainline repo)

- Regenerate the color entries in the module registry
  (`style-dictionary/token-modules.ts` or equivalent) from Role × Identity, replacing
  the current color-related foundations/components domain list. Non-color module
  definitions are untouched.
- Rewrite `style-dictionary/filters/foundations/color-*` to select on the new grammar
  segments. Leave all other `foundations/*` filters (radius, space, text, motion,
  breakpoint, prominence, etc.) as-is.
- Remove component-domain filters and component module generation once Phase 3
  (consumer mapping) is far enough along that no consumer still needs them. (This
  cleanup applies to component tokens broadly and is independent of the color taxonomy
  work.)
- Fix the duplicate CSS custom-property declaration defect if/when the spike's
  color-space handling is ported in.

## Phase 3 — Type Generation & Distribution (mainline repo)

- Update `typescript/module-interface` and `typescript/token-name-union` formats to
  handle optional interaction-family/expression segments and `base` omission for color
  modules. Non-color module type generation is unaffected.
- Regenerate per-module `.names.d.ts` / `.d.ts` outputs for the color modules; keep the
  existing barrel mechanism (`generate-types-barrel.ts`) and package export paths
  unchanged.
- Add new module exports only if the color Role set expands (e.g. if `overlay`
  becomes its own role).

## Phase 4 — Component Token Retirement

The entire `components` domain family is **already decided as deprecated** (see
`06-foundation-lane-triage.md`) — this is not gated on Phase 0/1 completion. No new
component-token domains should be added to `style-dictionary/filters/components/**`
going forward.

- For each of the 18+ component domains currently listed in ADR-0001 §Domain Families,
  confirm the Phase 0 mapping target, then:
  - Update component-library consumers to reference the new semantic tokens directly
    (e.g. `color.action.surface.brand` + state mode) instead of a component-scoped
    token.
  - Remove the corresponding component token source files and filters once all known
    consumers have migrated.
- Track this as a checklist per component domain; do not do a single big-bang removal.

## Phase 5 — State Layer

- Implement Figma-mode-based state resolution end to end (rest/hover/focus/active/disabled/selected)
  per the spike's `adr-0006`/`adr-0016` direction, without state segments in token
  names.
- Verify web, iOS, and Android outputs all resolve state correctly from the same
  canonical token.

## Phase 6 — Consumer Migration & Deprecation

- Publish a new minor/major version (major, if the component-token removal is a
  breaking change for any consumer) with both old and new tokens available during a
  deprecation window, following the existing pattern in
  <ref_file file="/Users/mhewson/Code/REI/rei-cedar-tokens/docs/DEPRECATION.md" />.
- Provide codemods or a mapping table (from Phase 0) for consumers migrating off
  component tokens.
- Remove deprecated tokens after the deprecation window closes.

## Sequencing Notes

- Phases 1–3 can proceed largely independently of Phase 0's _full_ resolution, since
  this migration is scoped to `color` only.
- **This plan does not extend to other foundations.** Whether `typography`, `spacing`,
  `radius`, or `motion` ever get a semantic layer — and if so, what shape it takes — is
  a separate, not-yet-scoped decision. Do not treat the color rollout as a template
  that automatically applies to those foundations; their existing naming/structure
  stays as-is unless and until that separate work happens.
- Phase 4 (component retirement) is the highest-risk, highest-coordination phase and
  should not start until Phase 1–3 are stable in at least one published prerelease.
- The spike repo itself does not need to be merged wholesale; it should be treated as
  the source of the canonical-model and normalization-layer _design_, re-implemented
  inside mainline's existing pipeline structure.

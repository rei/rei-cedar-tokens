# Migration Plan

Phased to minimize consumer disruption. The delivery model (package exports, module
boundaries, type-generation mechanism) stays stable throughout; only the token
taxonomy, canonical shape, and filter/validation rules change.

## Phase 0 — Alignment (no code changes)

- Confirm the five-tier taxonomy with design/architecture stakeholders as the
  authoritative model (supersedes ADR-0004 and the confluence doc). Update or deprecate
  `adr-0004-semantic-token-architecture.md` in the spike repo to point at the new
  taxonomy source.
- Resolve the open questions in `05-open-questions.md` that block schema work
  (especially: `overlay` classification, exact identity list, non-color expression
  application).
- Run a design/engineering workshop to produce the authoritative legacy → new-taxonomy
  token mapping (starting point: `03-future-state-proposal.md` §4).

## Phase 1 — Canonical Model & Schema (mainline repo)

- Reshape `canonical/tokens.json` (or equivalent) to the corrected grammar:
  `foundation[.interaction-family].role.identity[.expression]`.
- Update `src/schema/token-schema.json` (or mainline equivalent) to validate the new
  grammar, including the omission rules (no literal `base`, no literal `universal`).
- Port the spike's `$extensions.cedar.platformOverrides` mechanism and governance rules
  into mainline's canonical model for platform-specific value divergence.
- Rewrite `validate-contract.ts` / `canonical-contract.test.ts` invariants against the
  new grammar.

## Phase 2 — Build Pipeline & Filters (mainline repo)

- Regenerate the module registry (`style-dictionary/token-modules.ts` or equivalent)
  from Foundation × Role, replacing the current foundations/components/palettes domain
  list where components are involved.
- Rewrite `style-dictionary/filters/foundations/*` to select on the new grammar
  segments.
- Remove component-domain filters and component module generation once Phase 3
  (consumer mapping) is far enough along that no consumer still needs them.
- Fix the duplicate CSS custom-property declaration defect if/when the spike's
  color-space handling is ported in.

## Phase 3 — Type Generation & Distribution (mainline repo)

- Update `typescript/module-interface` and `typescript/token-name-union` formats to
  handle optional interaction-family/expression segments and `base` omission.
- Regenerate per-module `.names.d.ts` / `.d.ts` outputs; keep the existing barrel
  mechanism (`generate-types-barrel.ts`) and package export paths unchanged.
- Add new module exports only if the Foundation × Role set expands (e.g. if `overlay`
  becomes its own role).

## Phase 4 — Component Token Retirement

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

- Phases 1–3 can proceed largely independently of Phase 0's _full_ resolution, as long
  as color is the first foundation implemented end-to-end (per the taxonomy doc's
  focus) — other foundations (typography, spacing, radius, motion) can follow once the
  color pipeline is validated.
- Phase 4 (component retirement) is the highest-risk, highest-coordination phase and
  should not start until Phase 1–3 are stable in at least one published prerelease.
- The spike repo itself does not need to be merged wholesale; it should be treated as
  the source of the canonical-model and normalization-layer _design_, re-implemented
  inside mainline's existing pipeline structure.

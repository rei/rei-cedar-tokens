# ADR 0006: Figma Variable `description` Field Contract

## Status

Accepted (decision); normative grammar lives in
[`docs/TOKEN_DESCRIPTION_CONTRACT.md`](../TOKEN_DESCRIPTION_CONTRACT.md).

## Governed paths

Claims in this ADR depend on these paths; a commit touching them may invalidate the status below (see the `docs-drift` skill):

- `src/normalization/normalize-utils.ts` (`parseTokenDescription`, `parseTokenDeprecation`, accessibility parsing)
- `src/sync/figma-to-tokens.ts`, `src/sync/tokens-to-figma.ts`
- `docs/TOKEN_DESCRIPTION_CONTRACT.md`
- `canonical/tokens.json`, `tokens/` (`$description` fields)

## Implementation Status

- **Done:** line-by-line `$description` parsing into `$extensions.cedar.{docs,deprecation,accessibility}` exists in `src/normalization/normalize-utils.ts`; unmatched prose becomes `docs.summary`.
- **Done:** Figma → repo description sync (`src/sync/figma-to-tokens.ts` copies `variable.description` verbatim into `$description`).
- **Ongoing (policy):** the "human guidance only, no authored contrast data" rule is enforced by convention + the contract doc, not by a validator. Descriptions violating the grammar are a known parser hazard (unrecognized `key:` lines append to the previous field) — no mechanical gate exists yet.

## TL;DR

- The Figma variable `description` field is **consumer-facing tooltip text** —
  the same string designers see in the Variables panel and the only source for
  the human-readable line engineering generates into TSDoc/JSDoc.
- During the CDR-3791/3792 migration, structured annotation text
  (`Legacy: ...; ✓ AAA: ...; ✗ Avoid: ...`) was written into that field,
  displacing hand-authored prose entirely on ~21+ tokens.
- **Decision:** `description` carries concise human guidance only. Accessibility
  contrast data is computed metadata, never authored text. The normative
  grammar, layer policy, and forbidden-content rules are defined in the Token
  Description Contract; the intents/evidence model that replaces pairing prose
  is defined in ADR 0007.

## Context

Token metadata flows in two directions:

- **Figma → repo:** `src/sync/figma-to-tokens.ts` + `src/tokens-export.ts` copy
  `variable.description` verbatim into `$description` on exported tokens.
- **repo → typed output:** `src/normalization/normalize-utils.ts` parses
  `$description` line-by-line against a fixed key set into
  `$extensions.cedar.{docs,deprecation,accessibility}`; unmatched prose lines
  become `docs.summary`, rendered as the leading JSDoc comment for consumers.

For the semantic tokens touched by the migration, descriptions became 100%
structured annotation with no prose left for `docs.summary` — so generated
types lost their descriptive comment, and designers saw contrast-ratio strings
in the Figma description field instead of usage guidance. A compounding parser
hazard: unrecognized `key:`-shaped lines (`✗ Avoid:`) silently append onto
whatever structured field preceded them.

## Decision

1. **`description` is reserved for concise consumer-facing guidance** — summary
   - usage + optional guidance + deprecation block, per the Token Description
     Contract grammar. Nothing else is written there.
2. **Accessibility contrast data does not belong in `description`.** It is
   pipeline-computed data stored under `$extensions.cedar.accessibility` and
   used to validate intent compositions in CI (see ADR 0007) — computed from
   resolved values rather than authored, which removes the drift vector.
3. **`Legacy:` remains valid inside `description`** — a single short line the
   parser extracts into `cedar.deprecation`, kept alongside human prose rather
   than replacing it.
4. **Zero-summary descriptions are a build failure.** A semantic description
   that parses entirely into structured keys (no prose) trips CI — the guard
   that catches prose being wiped by annotation writes.
5. **Descriptions are generated, not hand-maintained** — long-term the field
   becomes a render target synced from repo sources (see ADR 0007 and contract
   section 10); the parser remains as validation fallback.

## Consequences

- Designers see usage guidance in tooltips; developers see the same in
  IntelliSense; contrast data moves to inspectable generated surfaces.
- `docs.summary` is restored for all covered tokens without parser changes —
  the parser's contract (prose + optional annotation lines) is honored, the
  Figma side simply stops violating it.
- The original hand-written descriptions displaced during migration are
  catalogued for restoration in the contract's Appendix C.

## Related

- `docs/TOKEN_DESCRIPTION_CONTRACT.md` — normative grammar, layer policy,
  forbidden content, agent prompt, sync outline, restoration handoff
- ADR 0007 — UI intents manifest; the composition layer that replaces pairing
  prose, and the decisions-vs-evidence model for usage data

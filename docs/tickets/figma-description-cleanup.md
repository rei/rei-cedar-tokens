# Ticket: Figma Semantic Variable Description Cleanup (ADR 0006 Conformance)

## Goal

Bring all semantic variable descriptions in the Figma color library into
conformance with ADR 0006 and `docs/TOKEN_DESCRIPTION_CONTRACT.md`:
descriptions are concise consumer-facing guidance (`summary` + `usage:` +
deprecation lines only) — no accessibility annotations, no pairing prose, no
component inventories. This is the manual/agent step (Phase 0) that precedes
pipeline enforcement (Phase 1+).

## Why this matters

The description field is the hover tooltip for designers and the source of
`docs.summary` → JSDoc for developers. Non-conforming content either renders
as tooltip noise (contrast tables) or silently corrupts parsed fields
(unrecognized `key:` lines append onto the previous field). A clean pass now
means the later sync/lint work starts from a conforming baseline instead of
fighting drift.

## Acceptance Criteria

- [ ] No semantic variable description contains accessibility annotations:
      `✓`, `△`, `✗`, `AAA:`, `AA:`, "Large only", "Avoid", or `(N.N:1)` ratios.
- [ ] Every semantic variable has a `summary` line and a `usage:` line that is
      a selection condition, not a component inventory or a tautology
      ("needs the X treatment" where X restates the token name is a failure).
- [ ] `Legacy:` lines are preserved verbatim where present.
- [ ] Deprecated variables carry `migrateToToken:` where the target is known.
- [ ] Primitive and component collections are untouched.

## Confirmed cleanup list (from latest library export)

### Must fix — accessibility strings present (3)

These are also the only semantic variables missing a `usage:` line:

- `color.graphic.border.natural`
- `color.action.border.brand`
- `color.action.icon.neutral`

### Should improve — formulaic usage text (26)

`usage:` matches the "needs the X treatment" template with no real selection
condition and no intent reference. Rewrite per the contract's selection
boundary rule (examples: surface tokens → which treatment/context; graphic
borders → emphasis/role):

- `color.surface.membership`, `color.surface.sale`, `color.surface.neutral`
- `color.border.brand`
- `color.text.sale`, `color.text.brand`, `color.text.accent`, `color.text.natural`
- `color.graphic.surface.*` (brand, membership, natural, accent, sale, rating)
- `color.graphic.border.*` (brand, accent, neutral, sale, membership, rating)
- `color.action.text.neutral`, `color.action.icon.sale`
- `color.control.text.neutral`
- `color.selection.surface.natural`, `color.selection.surface.neutral`,
  `color.selection.border.neutral`

### Verify only — displaced prose

ADR 0006 identified ~30 descriptions wiped by annotation text during the
CDR-3791/3792 migration; the restoration list is in the contract's Appendix C.
The latest export shows all descriptions populated, so this is a
verification pass — confirm restored prose conforms to the grammar rather than
re-pasting old text wholesale.

## Figma agent prompt

```
You are cleaning up the `description` field of variables in the Figma semantic
color library to conform to a contract. Descriptions are hover tooltips for
designers and JSDoc source for developers — concise selection guidance, never
data dumps.

SCOPE
- Semantic collections only. Do not touch primitives or component variables.

DO
- Remove every accessibility annotation: lines/segments starting with ✓, △, ✗,
  "AAA:", "AA:", "Large only", "Avoid", and any "(N.N:1)" contrast ratios.
- Ensure each variable has: a summary line (≤80 chars, sentence case, what the
  token IS) and a `usage:` line (≤120 chars) expressing a SELECTION CONDITION —
  the state, surface, role, or emphasis condition that makes this the right
  choice (e.g. "Low-emphasis boundary for disabled or subdued controls").
- Preserve `Legacy: --cdr-...` lines verbatim. Where a token is deprecated and
  the replacement is known, add `migrateToToken: <canonical.path>`.
- Rewrite `usage:` lines of the form "needs the X treatment" — they restate
  the token name and carry no decision information.

DO NOT
- Write pairing instructions ("use with", "avoid on", "do not pair") — pairing
  is encoded by the UI intents collection, not prose.
- Restate resolved values (hex/px) or list components that bind the token.
- Invent migration targets — flag deprecated variables you cannot resolve.

OUTPUT
- Write updated descriptions via the Variables API.
- Report old → new diffs, and flag anything ambiguous for human review.
```

## Reference

- `docs/TOKEN_DESCRIPTION_CONTRACT.md` — normative grammar, field limits,
  forbidden content, Appendix C restoration list
- `docs/adr/0006-figma-variable-description-contract.md` — why annotation text
  was excluded from descriptions
- `docs/TOKEN_INTENT_ROADMAP.md` — this ticket is Phase 0

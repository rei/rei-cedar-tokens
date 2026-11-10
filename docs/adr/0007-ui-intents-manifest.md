# ADR 0007: UI Intents Manifest — Platform-Agnostic Contract and Usage Evidence Model

## Status

Proposed — direction-setting. The manifest draft exists (`metadata/intents.json`);
the sync, push, and audit machinery described here does not yet.

## Governed paths

Claims in this ADR depend on these paths; a commit touching them may invalidate the status below (see the `docs-drift` skill):

- `metadata/intents.json`
- `canonical/tokens.json` (legacy `UI` section — to be superseded by the manifest)
- `style-dictionary/utils/intents-output.ts` (intents build output)
- `src/sync/` (future push machinery; `sync:tokens-to-figma` does not push intents yet)
- `dist/*/intents/` (generated outputs)

## Implementation Status

- **Done:** `metadata/intents.json` manifest draft exists.
- **Done:** intents build output exists today via the legacy `UI` section → `style-dictionary/utils/intents-output.ts` → `dist/*/…/intents/cdr-*` + `figma/intents/cdr-*.json` stub.
- **Not started:** migration of intent compositions out of `canonical/tokens.json` `UI` section into the manifest; push of intents to Figma via the variables API; per-platform usage-evidence auditors; build-time WCAG validation of intent compositions.

## TL;DR

- Intent compositions ("Primary = this surface + this text + this border") move
  out of the hand-maintained `UI` section in `canonical/tokens.json` and into an
  authored manifest: `metadata/intents.json`. This repo is the **originator** of
  intent data; Figma becomes a **consumer** of it (pushed via the variables API),
  not an authoring surface.
- **Decisions and evidence are different kinds of data and must stay in
  different layers.** Authored contract (intents, descriptions, governance)
  lives in `metadata/` and is platform-agnostic. Observed usage (Figma toolkit
  `boundVariables`, Cedar component SCSS consumption, future iOS/Android
  bindings) is _evidence_ — ingested by per-platform auditors and never written
  into the manifest.
- Accessibility contrast is pipeline-computed metadata used to **validate intent
  compositions at build time** — the system shields consumers from WCAG math
  rather than documenting it at them. (Aligns with ADR 0006, decision #2.)
- Multi-platform: the intent vocabulary is the stable center; each platform gets
  a realization (build output) plus an obligation (audit of that platform's
  bindings against the contract). The schema doesn't change per platform.

## Context

Three layers exist today:

1. **Primitives** (`color.option.*`) — raw values, no usage meaning.
2. **Semantics** (`color.text.*`, `color.surface.*`, `color.action.*`,
   `color.control.*`, `color.feedback.*`, `color.selection.*`,
   `color.graphic.*`) — named roles, described by ADR 0006's contract.
3. **Composite UI intents** — the `UI` section of `canonical/tokens.json`
   (`Primary`, `Secondary`, `Brand`, `link`), which composes semantic slots and
   already feeds `style-dictionary/utils/intents-output.ts` →
   `dist/*/…/intents/cdr-*.{css,scss,mjs,d.ts,json}` plus a
   `figma/intents/cdr-*.json` stub.

The problem the intents layer solves: per-token documentation ("this text pairs
with these surfaces") puts the pairing burden on every consumer — designer, dev,
and agent. Curated intent sets encode the pairing as a _decision the system
made_, which is what makes the tokens usable by construction rather than by
careful reading. A semantic token's `usage:` line (see
`docs/TOKEN_DESCRIPTION_CONTRACT.md`) is a _selection condition_ pointing at the
intent set it belongs to — not a pairing rule.

## Decision

### 1. `metadata/intents.json` is the authored source of truth for intents

- Authored in this repo, reviewed in PRs, CI-linted: every slot filled, every
  `{alias}` resolves against canonical tokens, every `text`/`border`-on-`surface`
  composition passes computed WCAG checks.
- Shape: `intents.<name>.{summary, usage, slots, states}` — `summary`/`usage`
  generate the Figma collection descriptions and TS tooltips (same grammar as
  the description contract); `slots` are the always-on composition; `states`
  are variants (`rest`, `selected`, `active`, `visited`…).
- Draft covers: Primary, Secondary, Brand, Selection, Link, Feedback
  (info/success/warning/error/neutral), Membership, Sale, Rating.
- Known gaps recorded in the manifest's `gaps` block: no `Disabled` semantics
  exist anywhere; `color.action.*`'s emphasis scale has no state mapping;
  `color.control.*` (27 tokens) has no intent owner. These are design-system
  decisions, not pipeline problems.
- `canonical/tokens.json`'s `UI` section should eventually be _sourced_ from
  this manifest during normalization (same pattern as
  `metadata/tokens.json` → `mergeMetadata`), not edited directly — canonical
  is generated output.

### 2. Repo → Figma push for intent data

- `metadata/intents.json` → a Figma `UI intents` variable collection: one
  variable per `intent.slot`/`intent.state.slot`, each aliasing its semantic
  variable; descriptions generated from `summary`/`usage`.
- Figma-side edits to intents are not authoritative — next push overwrites,
  CI audits drift. Same model as generated descriptions.

### 3. Usage data is evidence, not contract

Observed usage flows inward through platform-specific auditors, each answering
"does platform X's reality match the declared intent?":

| Source                             | Evidence type   | Mechanism                                                            |
| ---------------------------------- | --------------- | -------------------------------------------------------------------- |
| Figma UI toolkit                   | Design bindings | `boundVariables` on component nodes (plugin API or REST `GET nodes`) |
| rei-cedar (web)                    | Dev consumption | `var(--cdr-*)` usage in component SCSS/code                          |
| Figma iOS/Android toolkit variants | Design bindings | Same `boundVariables` mechanism, per file/mode — TBD                 |
| Cedar iOS/Android output           | Dev consumption | TBD with platform output format                                      |

Evidence lands in a parallel layer (audit reports / `metadata/usage/*.json` or
CI artifacts), never in `intents.json`. Audits flag: path-vs-binding
contradictions, tokens bound outside any intent, intent slots bound nowhere.

### 4. Platform-agnostic vocabulary, per-platform realization

The intent vocabulary does not fork per platform. Each platform receives:

- a **realization** — build output of the compositions in that platform's
  format (CSS vars today; Swift/etc. TBD), and
- an **obligation** — an auditor comparing that platform's bindings to the
  contract.

New platforms = one new realization + one new evidence source. The schema is
unchanged. Platform variance lives in resolution (`cedar.resolved.web.light`,
`ios`/`web` extension blocks already exist in normalization) — not in the
intent definition.

## Consequences

- Figma stops being where token _meaning_ is authored. It becomes: (a) the
  originator of token _values_ (extract flow, unchanged) and (b) a render
  target for generated intent/description content.
- The "usage" question for AI preparedness resolves as: agents consume the
  intent manifest (the curated decision set) rather than inferring pairings
  from raw semantics; audits keep the manifest honest against real bindings.
- Contrast validation shifts left into CI — pairing failures fail the build,
  which is the operational form of "accessibility is our job, not the
  consumer's."
- Near-term manual step (per ADR 0006 handoff): strip residual accessibility
  strings from Figma semantic descriptions; descriptions then regenerate from
  this manifest's `summary`/`usage` fields rather than being hand-authored.

## Open questions

- Figma push mechanics: plugin-side write vs. REST `POST/PUT variables` — needs
  a decision on which agent/tool owns the write path.
- Whether the intents collection in Figma uses modes for `states` or nested
  variable paths (`Selection.selected.surface` vs. mode columns).
- `intents:` as a parsed description key — add to `KNOWN_KEYS` in
  `parseTokenDescription` so `usage:` strings can reference membership
  structurally, or keep it manifest-only.
- Evidence schema and storage location — deliberately deferred until a second
  platform produces real evidence.

## Related

- ADR 0006 — description-field contract (what goes in `description` vs.
  extensions)
- `docs/TOKEN_DESCRIPTION_CONTRACT.md` — grammar, layer policy, Figma agent
  prompt, sync/audit outline
- `metadata/intents.json` — manifest draft
- `style-dictionary/utils/intents-output.ts` — existing intents build output

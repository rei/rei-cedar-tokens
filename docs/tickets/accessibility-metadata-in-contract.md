# Ticket: accessibility metadata in the token contract

**Status:** proposed
**Date:** 2026-11-10
**Origin:** Storybook IA rebuild — text/icon token pages compute WCAG contrast at
render time in `stories/colors-shared.ts` (`relLuminance`, `textPreviewHtml`,
`iconPreviewHtml`). That knowledge is doc-layer only: untestable, invisible to
Figma sync, and it drifts. Art-director review also flagged P0 defects this
creates (NaN heuristics, unverifiable ratios).

## Goal

Move contrast/ground pairing data into the token contract so it is **computed at
build time, emitted to dist, and gated by contract tests** — one source consumed
by Storybook, tests, and Figma.

## Proposal

1. **Declared grounds per token.** For each `color.text.*` / `color.icon.*` token,
   declare its intended ground set. Derive it where possible from intent/slot
   pairings (`metadata/intents.json` — e.g. `Brand.text` ⇒ ground
   `color.surface.brand`); fill the remainder explicitly in `canonical/tokens.json`.
2. **Computed, not authored.** A pipeline step (style-dictionary format/action or
   `src/` post-process) computes WCAG ratios at build time and emits
   `$extensions.cedar.accessibility: { grounds: { "<ground-ref>": { ratio, aa, nonText3to1 } } }`
   into `dist/*/json/web.json` (and any other json artifacts).
   Constraint: per AGENTS.md/`TOKEN_DESCRIPTION_CONTRACT.md`, `description` is
   human guidance — computed data must live in `$extensions.cedar.accessibility`
   (a reserved slot the parser already recognizes), never in description text.
3. **Contract tests.** `src/contract/` assertions, run by `build:tokens`:
   - every text token has ≥ 1 ground passing AA 4.5:1;
   - every icon token has ≥ 1 ground passing 3:1 non-text;
   - every intent slot pair (surface/text, surface/icon) passes its threshold —
     this makes "slots are only valid as a set" an enforced property, not doc copy.
4. **Consumers switch to reading, not computing.** `stories/token-metadata.ts`
   `getMeta()` extends to return `accessibility`; `textPreviewHtml`/
   `iconPreviewHtml` render contract data instead of running WCAG math in a
   story file.

## Acceptance criteria

- `pnpm run build` regenerates `web.json` with `$extensions.cedar.accessibility`
  populated for all text/icon tokens; fails (or contract test fails) if a token
  has no passing declared ground.
- Storybook Text/Icon pages show identical previews driven by contract data.
- No contrast math remains in `stories/`.
- `docs/STORYBOOK-IA.md` decision #3 updated to cite the contract as the source.

## Out of scope

- Retrofitting grounds for families with no declared pairing yet — those emit an
  empty grounds set and surface as a contract-test gap, same pattern as ADR 0001.
- Figma-side consumption of the new extension field (follows in the sync work).

## Dependencies / notes

- `metadata/intents.json` is draft (ADR 0007); ground derivation should read
  slots from it but tolerate the unshipped-intent gaps.
- Keep the Ground set small and declared (Primary background, Brand surface, …) —
  not a computed-permutation matrix against every surface.

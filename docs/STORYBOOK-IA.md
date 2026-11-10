# Token Storybook — IA & decision record

Why this doc exists: the token Storybook was rebuilt over several sessions (2026-11-10)
after a benchmark-driven critique (Material 3, Carbon, Atlassian token docs). This file
records what was decided, why, and what was rejected — so the next agent review
extends reasoning instead of re-litigating it.

**Audience of this surface:** Cedar maintainers + consuming engineers (DXP). It is
internal tooling — the consumer-facing token surface is `cedar-site-nuxt`
(see `docs/tickets/token-docs-ia-redesign.md`). Precision and honesty beat polish.

## Information architecture

```
Release Notes
Tokens
  UI Semantics   — single values bound to a role (ADR 0001 foundations, stable contract)
    Overview · All tokens · Surface · Text · Border · Icon · Action · Control · Feedback · Selection · Graphic
  UI Intents     — value sets: curated multi-slot compositions (ADR 0007)
    Playground (interactive) · Reference
  Palette        — primitive ramps, internal ref layer (ADR 0001: not a contract)
Guides
  Using tokens   — per-format consumption contracts (type/css/scss/js/json)
Cedar Tokens     — Semantic Diff (maintainer QA tool)
```

## Decisions

1. **Element-first nav, intents as sibling** — not intent-first, not flattened.
   Users look tokens up by the element they color; the export structure is
   element-keyed (`CdrColorText`, …). Intents cover only 4 of 9 authored sets
   (`color.control.*` has no intent owner) so intent-primary nav would orphan
   families. The slots×intents matrix on the Reference page provides the
   intent-grouped view without a second canonical home.
   _Change if:_ intents reach full family coverage AND the tool's primary task
   becomes consumer selection rather than maintainer lookup.

2. **One canonical home per token set** — Text/Border/Icon are dedicated pages,
   not repeated in Overview, because they carry AA/3:1 contrast preview
   scaffolding that cannot compress into a shared section.

3. **Measured, never inferred** — text previews show only grounds the token
   passes WCAG AA (4.5:1) on; icons fall back Primary→Brand at 3:1 non-text.
   Ratios print as visible captions (tooltips hide data from keyboard/touch).
   `relLuminance` returns NaN on unparseable input → rendered "n/a"; a
   fabricated pass is the worst failure mode for a precision tool.

4. **Contract tier declared per page** — Stable contract / Intent contract /
   Internal reference badges + ADR-0001 alarm banner on Palette. The fact is
   surfaced neutrally; the alarm tone is appropriate only for internal tooling.

5. **Docs name the contract, not the mechanism** — token pages say "consume via
   `CdrIntents` / `--cdr-color-*` / `CdrSurface`"; mixin APIs belong to
   rei-cedar docs and link back. Documenting a downstream API here guarantees
   drift.

6. **Intents = the dev↔design shared surface** — `metadata/intents.json`
   (summary/usage per ADR 0007) feeds both Figma and the typed export;
   encourage intent-first consumption in docs.

7. **No addon panel on static reference pages** — controls/actions/interactions
   disabled globally; the Release Notes panel gated by `paramKey` and enabled
   only on Release Notes stories. The single exception is UI Intents →
   Playground, where the exposed control _is_ the API demo.

8. **Every row is a lookup target** — click-to-copy on token name, CSS var,
   hex; searchable "All tokens" table; hex + step printed on palette ramps;
   label↔syntax parity (page labels match token names; the `CdrColorGraphik`
   filename quirk is footnoted, not hidden).

## Rejected benchmarks (do not re-propose without new evidence)

- M3's M-shaped color-role diagram — positional role model; Cedar's is nominal.
- M3 dynamic-color generator; Carbon's dark docs chrome.
- Folding palette/component tokens into the main contract pages (ADR 0001 forbids).

## Known gaps / open questions

- **SCSS-only consumers can't engage palettes** — palette switching is
  `data-palette` + CSS vars; no SCSS-native map exists. Documented as a known
  gap on the SCSS guide; needs a contract-level decision (emit palette maps in
  scss? bless css+scss co-consumption?).
- **Syntax toggle** (JS/CSS/SCSS primary-column switch) — deferred; Carbon
  parity item, medium effort.
- **5 intents defined-but-unshipped** — Selection, Feedback, Membership, Sale,
  Rating wait on `TOKEN_INTENT_ROADMAP.md` Phase 2.
- **Storybook MCP** — `@storybook/addon-mcp` serves `/mcp` on the dev server;
  configured in `.devin/mcp_config.json`.

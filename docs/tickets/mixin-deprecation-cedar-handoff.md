# Ticket: Restore Sass Mixins as Deprecated, Hand Ownership to Cedar

## Status: token-package side complete (PR #316); Cedar replacement still open

All acceptance criteria below are satisfied on the `@rei/cdr-tokens` side. The
release blocker now lives entirely on the Cedar side —
`rei-cedar/docs/tickets/scss-mixin-replacement.md` must ship before the
deprecated mixins can be removed in v16.

## Goal

Teams building pages today use a set of Sass mixins (responsive breakpoints, typography styles, container/display helpers) that ship from the token package. We removed these outright. We want them back and working, marked as deprecated, while Cedar builds the long-term replacement — so no one's build breaks on upgrade, and there's a clear path forward.

## Why this matters

These mixins are relied on for everyday page-building (e.g. `@include cdr-sm-mq-up`). Deleting them with no warning and no replacement means any consumer upgrading immediately breaks, with no migration window. Mixins are also arguably the wrong thing for a _token_ package to own long-term — Cedar, as the component/web layer, should own how tokens get turned into usable CSS patterns. But that handoff needs to happen with an overlap period, not a cliff.

## Acceptance Criteria

- [x] All previously-available mixins (breakpoint media queries, container queries, display/utility helpers, typography mixins) work again exactly as before. (Restored via `emit-utility-files.ts`; verified `cdr-sm-mq-up` compiles identically under Dart Sass.)
- [x] Each one now warns at build time that it's deprecated and will move to Cedar, with a version/timeframe if known. (`@warn` naming v16, added in PR #316; verified end-to-end that `@use` prints the warning.)
- [x] A corresponding story exists on the Cedar side to build the real replacement. (`rei-cedar/docs/tickets/scss-mixin-replacement.md`)
- [x] Nothing currently using these mixins breaks on upgrade. (`@rei/cdr-tokens/scss/*` export paths unchanged; output CSS identical — verified.)

## Reference

Full list of affected mixins and the deleted source files is in the PR discussion / git history if needed for implementation — not required reading to scope this ticket. There's also a previously started (unmerged) branch exploring a modern replacement for the typography mixins specifically, worth checking before rebuilding from scratch.

Related, but separate scope: `docs/tickets/intent-css-attribute-selector.md` — a new CSS consumption pattern for intents (not a restoration of removed mixins), filed separately since it's net-new work rather than put-back-what-we-broke.

# Ticket: SCSS Dual Map Entrypoints (Q2) — Closed, Not Pursuing

## Status: closed

This was originally planned as a split of `utility-map.scss` into separate resolved-value and `var()` reference maps (decision Q2 in `docs/tickets/semantic-contract-consumer-questions.md`).

`utility-map.scss` was removed in PR #298 along with the rest of the legacy Sass utility layer. Before rebuilding a replacement, we checked actual usage across every consuming repo (`rei-cedar`, `cedar-site-nuxt`, `guidebook`, `mobile`, `rei-cedar-component-variables`, `rei-cedar-token-pipeline-spike`) and found none of them reference `utility-map.scss` — the individual resolved Sass variables it wrapped (`$cdr-radius-sharp`, `$cdr-space-one-x`, etc.) are untouched and still ship on their own.

Closing this rather than carrying it forward. If a real consumer later needs a map-shaped entrypoint, build it `var()`-first — that's already the team's preferred pattern for anything new — rather than reviving the original dual resolved/var split.

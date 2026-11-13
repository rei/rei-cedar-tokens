# Ticket: Make Designer-Written Descriptions and Deprecation Notices Visible to Consumers

## Goal

Designers write usage guidance and deprecation notes on tokens in Figma. Right now that information gets into our internal data but is stripped out before it reaches anything a consumer actually imports (CSS, SCSS, TypeScript). We want that guidance to show up where consumers actually see it — code comments, editor tooltips, deprecation warnings.

## Why this matters

Today a consumer importing a token gets a bare name and a value, nothing else. No explanation of what it's for, no warning if it's on its way out. This is especially painful for teams building tooling on top of our tokens (e.g. editor/CMS integrations), where this metadata is the difference between a usable token picker and a wall of unlabeled hex codes.

## Acceptance Criteria

- [ ] A token with a description in Figma shows that description as a comment/doc-comment in the generated TypeScript, SCSS, and CSS output.
- [ ] A token marked deprecated shows a deprecation warning in each of those outputs (TypeScript `@deprecated`, SCSS build warning, etc.).
- [ ] Tokens without a description or deprecation are unaffected — no blank/placeholder comments.
- [ ] At least one automated test confirms this works, so it doesn't silently regress.

## Reference

There's already a design decision in place for how deprecation data is structured at the source (`docs/tickets/deprecation-infrastructure.md`) and for how descriptions get pulled from Figma (`docs/adr/0006-figma-variable-description-contract.md`). This ticket is specifically about the last mile: getting that data out to consumers, not redefining the data itself.

Note: the v15 branch currently marks deprecated artifacts with file-level `/* @deprecated */` headers (component outputs, `cdr-color-background`, restored `scss/utilities/` mixins) — but the token-level `deprecated` attribute produced by the `attribute/deprecated` transform is dropped before it reaches any output. This ticket is what makes deprecation real at the token level; the file-level headers are the stopgap it should absorb/supersede.

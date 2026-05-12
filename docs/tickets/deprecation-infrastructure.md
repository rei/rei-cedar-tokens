# Ticket: Deprecation Infrastructure (Q5)

## Summary

Add first-class deprecation support to all token output formats — TypeScript `@deprecated` JSDoc, SCSS `@warn`, and `deprecated`/`replacement`/`sinceVersion` fields in `contract.json` — so consumers get deprecation signals at their natural tool boundary.

## Background

Decision recorded in `docs/tickets/semantic-contract-consumer-questions.md` → Q5.

Once semantic keys and token names are published in the stable channel, renaming them is a breaking change for every downstream consumer. The token repo needs a machine-readable deprecation record that flows through to TS, SCSS, and JSON simultaneously — so that a deprecation added in one place propagates to all three output surfaces without manual coordination.

**Note:** No tokens are currently deprecated. This ticket implements the infrastructure so the pipeline is ready when the first deprecation is needed. The work is generator-only — no token data changes until a deprecation is actually required.

## Deprecation Record Format

Deprecations should be declared in source token data as DTCG extension fields. Add the following optional fields to token entries in `tokens/` source files:

```json
{
  "cdr-space-one-x": {
    "$value": "1.6rem",
    "$type": "dimension",
    "$extensions": {
      "rei.deprecated": true,
      "rei.replacement": "cdr-space-scale-1",
      "rei.sinceVersion": "14.0.0"
    }
  }
}
```

These extension fields are the single source of truth — the generator reads them and emits appropriate deprecation signals to each output surface.

## Acceptance Criteria

### TypeScript (`.d.ts` output)

1. Any token with `rei.deprecated: true` in its source data has a `/** @deprecated Use {replacement} instead. Deprecated since {sinceVersion}. */` JSDoc comment prepended to its declaration in the generated `.d.ts`.
2. Both the per-module `cdr-*.d.ts` and the root `index.d.ts` re-exports carry the `@deprecated` tag (IDEs surface `@deprecated` on re-exports).
3. Non-deprecated tokens are unaffected.

### SCSS output

4. Any SCSS variable or map key derived from a deprecated token emits a `@warn` when accessed:

   ```scss
   // For standalone variables:
   $cdr-space-one-x: /* @warn "cdr-space-one-x is deprecated. Use cdr-space-scale-1 instead." */ 1.6rem;

   // For utility maps (map-resolved.scss / map-vars.scss):
   // Emit a CSS comment on the deprecated key line — true @warn inside a map is not valid SCSS.
   // The deprecation warning must fire at @use time via a dedicated mixin check.
   ```

5. Implement a `_deprecation-warnings.scss` partial (included in `cdr-tokens.scss`) that uses `@warn` for each deprecated token so the warning fires at `@use` time in consuming SCSS pipelines.

### JSON (`contract.json`)

6. Every deprecated token entry in `contract.json` has `"deprecated": true`, a non-null `"replacement"` string, and a non-empty `"sinceVersion"` string.
7. Deprecated entries are **not filtered out** — they must remain in the contract artifact so consumers can detect the deprecation programmatically.

### Schema

8. `schema/contract.schema.json` (from the contract.json ticket) must mark `deprecated`, `replacement`, and `sinceVersion` as required fields on each entry and validate that `replacement` is non-null when `deprecated: true`.

### Source schema

9. `schema/token.schema.json` is updated to document the `$extensions` fields `rei.deprecated`, `rei.replacement`, and `rei.sinceVersion` as optional, typed extension properties.

### Documentation

10. `docs/DEPRECATION.md` is updated (currently exists) to document:
    - How to mark a token deprecated in source
    - The minimum one-major-version retention policy
    - The requirement for Cedar sign-off before removing a semantic key
    - The three output surfaces where deprecations appear

### Test coverage

11. Add at least one vitest test (e.g. in `style-dictionary/utils.test.ts` or a new `deprecation.test.ts`) that:
    - Reads a fixture token with `rei.deprecated: true`
    - Asserts the generator produces `@deprecated` JSDoc in `.d.ts` output
    - Asserts `deprecated: true` in the `contract.json` entry

## Implementation Notes

- Do **not** require deprecated tokens to be split into a separate file. Deprecation is a metadata annotation on existing entries.
- The generator must handle the case where `rei.deprecated` is true but `rei.replacement` is null — this is valid (token is removed without a 1:1 replacement) but must not crash the build. Emit `@deprecated No direct replacement.` in that case.
- SCSS `@warn` inside a map literal is invalid. The recommended pattern is a dedicated `_deprecation-warnings.scss` partial with an `@if` guard:
  ```scss
  @mixin check-deprecated-tokens() {
    @warn "cdr-space-one-x is deprecated since 14.0.0. Use cdr-space-scale-1 instead.";
  }
  @include check-deprecated-tokens();
  ```
- The `sinceVersion` field in source data is set by the author at the time they add the deprecation — not derived at build time. The build reads it and propagates it; it does not set it.
- This ticket has a hard dependency on the contract.json ticket (for the JSON surface) but can proceed independently for TS and SCSS surfaces.

## Scope

- `style-dictionary/build.ts` — read `$extensions.rei.*` fields and emit deprecation signals per surface
- `dist/rei-dot-com/types/**/*.d.ts` — `@deprecated` JSDoc on affected tokens (generated)
- `dist/rei-dot-com/scss/_deprecation-warnings.scss` — `@warn` partial (generated)
- `dist/rei-dot-com/scss/cdr-tokens.scss` — `@forward` or `@use` the deprecation warnings partial
- `dist/rei-dot-com/json/contract.json` — `deprecated`/`replacement`/`sinceVersion` fields (generated, depends on contract.json ticket)
- `schema/token.schema.json` — add `$extensions` documentation
- `schema/contract.schema.json` — enforce deprecation field requirements (depends on contract.json ticket)
- `docs/DEPRECATION.md` — update policy documentation
- `style-dictionary/deprecation.test.ts` — vitest regression tests

## Dependencies

- **contract.json ticket** (`docs/tickets/contract-json-artifact.md`) — the `contract.json` artifact must exist before the JSON deprecation fields can be validated in CI.
- Contract.json and deprecation infrastructure can be developed in parallel; integration happens at the `contract.json` schema validation step.

## References

- Q5 decision: `docs/tickets/semantic-contract-consumer-questions.md`
- Existing deprecation policy: `docs/DEPRECATION.md`
- W3C DTCG `$extensions` spec: https://design-tokens.github.io/community-group/format/#extensions
- ADR 0001: `docs/adr/0001-modular-output-architecture.md`

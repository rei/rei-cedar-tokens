# Ticket Draft: Migrate Generated Declarations to `.d.mts`

## Summary

Current TypeScript support is stable with generated `.d.ts` declarations and NodeNext-safe type barrels.

Follow-up work should migrate generated declaration outputs to ESM-native declaration layout and then simplify barrel declaration specifiers.

## Why

- Reduce ambiguity between ESM/CJS declaration semantics.
- Align declaration output shape with modern NodeNext expectations.
- Remove compatibility workarounds in generated declaration barrel exports.

## Scope

- Generate `.d.mts` declaration files where appropriate for ESM outputs.
- Revisit type barrel declaration specifier generation after migration.
- Keep runtime entrypoint typings intact for `@rei/cdr-tokens` and `@rei/cdr-tokens/docsite`.
- Preserve type-only contract for `@rei/cdr-tokens/types` and `@rei/cdr-tokens/docsite/types`.

## Validation

- Consumer TypeScript smoke tests under `moduleResolution=nodenext`.
- Full `pnpm run build`.
- No regressions in lint/test/validate.

## Current Contract Reminder

- Type-only entrypoints:
  - `@rei/cdr-tokens/types`
  - `@rei/cdr-tokens/docsite/types`
- Runtime value entrypoints:
  - `@rei/cdr-tokens`
  - `@rei/cdr-tokens/docsite`

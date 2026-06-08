# Ticket: TokenDictionary Public Contract Implementation

## Summary

Complete the `TokenDictionary` generic type and publish it as a stable public export from the type barrels (`@rei/cdr-tokens/types` and `@rei/cdr-tokens/docsite/types`).

## Background

ADR 0002 defines `TokenDictionary` as the typed runtime contract for the token pipeline. The modular `.d.ts` outputs, literal unions, and module interfaces are already implemented. `TokenDictionary` itself is the remaining planned output from that architecture decision.

## Planned Public Signature

```ts
export type TokenDictionary<
  Theme extends string = string,
  Platform extends string = string,
  Responsibility extends string = string,
  Module extends Record<string, string> = Record<string, string>,
> = {
  readonly theme: Theme;
  readonly platform: Platform;
  readonly responsibility: Responsibility;
  readonly module: string;
  readonly tokens: Readonly<Module>;
};
```

## Acceptance Criteria

1. Preserve the existing public entrypoint contract for `.` / `./docsite` / `./types` / `./docsite/types`.
2. Keep TypeScript modular outputs aligned with module responsibility mapping (`foundations`, `palettes`; utilities excluded from value type modules).
3. Ensure generated unions and module interfaces remain source-of-truth-driven from token modules and filters, not hardcoded ad-hoc literals.
4. Publish a stable `TokenDictionary` type export from public type surfaces.
5. Validate that `TokenDictionary` generic constraints match generated module shapes (token keys and value types).
6. Add NodeNext consumer smoke tests covering valid and invalid combinations for theme/platform/responsibility/module typing.

## Scope

- Implement and export `TokenDictionary` from both type barrels.
- Confirm generic constraints against generated module interfaces.
- Add smoke test fixture under `moduleResolution: nodenext` for theme/platform/responsibility/module type combinations.

## References

- [ADR 0001: Modular Output Architecture](../adr/0001-modular-output-architecture.md)

# ADR 0002: TypeScript Pipeline and Consumer Types API

## Status

Planned

## Problem Statement

Mainline already has meaningful TypeScript output progress: modular generated `.d.ts` files, per-module token-name unions, and module interfaces under theme-scoped output paths.

The remaining gap is consumer contract stability and ergonomics. Consumers still depend on theme/deep-path knowledge and the package-level `cdr-tokens.d.mts` entrypoint, instead of a single stable public API for modular imports, token-name validation, and typed runtime dictionary usage.

This ADR addresses that gap by defining a stable `/types` contract and migration path that builds on existing mainline outputs without overstating current maturity.

## Goals

- Produce modular TypeScript outputs rather than one monolithic declaration file.
- Use JSON Schema as the canonical generation contract.
- Generate literal union types for token names.
- Generate module interfaces for grouped token surfaces.
- Define `TokenDictionary` as the typed runtime contract.
- Expose a stable public `/types` API surface.
- Provide a barrel entrypoint for ergonomic imports.
- Define a deprecation path for legacy `cdr-tokens.d.mts` consumption.

## Architecture

### 1. Schema-driven generation

- A canonical schema defines token shape and generation boundaries.
- Type generation reads schema + token module metadata to emit consumer types.
- Type generation is deterministic for a given schema and token graph state.

### 2. Module-to-file mapping

- Token responsibilities map to modular `.d.ts` outputs.
- Each module output represents a consumer-facing token responsibility group.
- A module map controls output naming and responsibility partitioning.

### 3. Literal union generation

- For each module, token names are emitted as literal union types.
- These unions support compile-time validation for token-name usage.

### 4. Module interface generation

- For each module, an interface is generated with typed keys/values.
- Interfaces provide a strongly-typed shape for grouped token usage.

### 5. TokenDictionary generic

- `TokenDictionary<Theme, Platform, Responsibility, Module>` provides a typed runtime contract.
- Theme/platform/responsibility dimensions are explicit type parameters.
- The generic makes runtime loading patterns statically verifiable.

### 6. Barrel generation

- A single barrel export is generated for consumer ergonomics.
- Barrel surface re-exports module interfaces, token-name unions, and dictionary primitives.

### 7. Package exports integration

- `@rei/cdr-tokens/types` is the only supported public API for TypeScript consumer types.
- Internal generated files remain implementation details and are not part of the public contract.

### Planned Barrel API Details (Theme-Aware)

The target barrel must account for both supported themes (`rei-dot-com` and `docsite`) while still exposing a single stable public entrypoint.

Target requirements:

- One stable import surface for consumers: `@rei/cdr-tokens/types`.
- Theme-aware typing in the public contract (for example via exported `Theme` union and theme-constrained module types).
- No requirement for consumers to know internal generated file layout to select theme-specific types.
- Backward-compatible naming strategy for type exports as themes evolve.

Practical implication:

- The barrel should make it possible to write theme-safe code without deep imports, while preserving clear typing for `rei-dot-com` and `docsite` token modules.

## Public API vs Internal Implementation

Public API:

- `@rei/cdr-tokens/types`

Internal implementation (non-contract):

- Generation internals, intermediate mapping artifacts, and deep generated file paths.
- Any deep import path below the barrel surface.

## Deprecation Plan

- Legacy `cdr-tokens.d.mts` is deprecated for consumer typing workflows once `/types` API is available.
- Consumers should migrate to modular types via `@rei/cdr-tokens/types`.
- Deprecation messaging should include timeline, migration examples, and compatibility guidance.

Legacy monolithic typing patterns to migrate from:

- Relying only on package-level `cdr-tokens.d.mts` for all type needs.
- Deep imports into generated internals or dist-like paths tied to output layout.
- Token-name usage as unconstrained `string` values (no literal union validation).
- Ad-hoc object typing (`Record<string, string>`) instead of module interfaces.
- Untyped dictionary loaders that do not encode theme/platform/responsibility dimensions.

Migration direction:

- Move to barrel imports from `@rei/cdr-tokens/types`.
- Use module interfaces for grouped token shapes.
- Use literal union token names for token lookup safety.
- Use `TokenDictionary` for runtime dictionary typing across `Theme`, `Platform`, and `Responsibility`.

Migration examples:

```ts
// old style (legacy)
// import type { SomeType } from "@rei/cdr-tokens/dist/.../cdr-tokens.d.mts";

// new style (public API)
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/types';
```

```ts
import type { CdrColorBackground } from '@rei/cdr-tokens/types';

const bg: CdrColorBackground = {
  CdrColorBackgroundPrimary: '#fff',
  CdrColorBackgroundSecondary: '#f5f5f5',
};
```

## Future Direction

- Add themes/platforms/responsibilities by extending schema and module maps.
- Add new generated module surfaces without breaking existing barrel imports.
- Use semver to signal API-level type changes.
- Preserve backward compatibility at the public barrel boundary where feasible.

## Current Mainline Maturity Note

This ADR defines the target architecture and consumer contract for mainline adoption.

Current state is partial implementation:

- Implemented: modular generated `.d.ts` module files, literal token-name unions, and module interfaces in generated type outputs.
- Implemented: theme-scoped type export patterns (`./rei-dot-com/types/*`, `./docsite/types/*`).
- Still current: `cdr-tokens.d.mts` remains the package-level `types` entrypoint.
- Planned: stable `@rei/cdr-tokens/types` barrel, `TokenDictionary` public export contract, and complete deprecation rollout from legacy monolithic typing workflows.

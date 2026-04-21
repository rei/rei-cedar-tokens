# ADR 0002: TypeScript Pipeline and Consumer Types API

## Status

Accepted

## Problem Statement

Mainline now has modular generated `.d.ts` files, per-module token-name unions, module interfaces, and a stable barrel export at `@rei/cdr-tokens/types`.

The remaining gap is completing the runtime dictionary contract (`TokenDictionary`) and finalizing deprecation rollout messaging for legacy typing workflows.

This ADR defines and records the `/types` contract and ongoing migration path from legacy patterns.

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

- `@rei/cdr-tokens/types` (rei-dot-com) and `@rei/cdr-tokens/docsite/types` (docsite) are supported public APIs for TypeScript consumer types.
- Internal generated files remain implementation details and are not part of the public contract.

### Barrel API Details (Theme-Aware)

The barrel contract accounts for both supported themes (`rei-dot-com` and `docsite`) through stable theme-specific entrypoints.

Current requirements:

- Stable import surfaces for consumers: `@rei/cdr-tokens/types` (rei-dot-com) and `@rei/cdr-tokens/docsite/types` (docsite).
- Theme-aware typing in the public contract (for example via exported `Theme` union and theme-constrained module types).
- No requirement for consumers to know internal generated file layout to select theme-specific types.
- Backward-compatible naming strategy for type exports as themes evolve.
- Theme values remain theme-specific; barrels do not merge values across themes.

Practical implication:

- The barrel makes it possible to write theme-safe code without deep imports, while preserving clear typing for `rei-dot-com` and `docsite` token modules.

## Public API vs Internal Implementation

Public API:

- `@rei/cdr-tokens/types` (stable barrel)
- `@rei/cdr-tokens/docsite/types` (docsite-specific barrel)

Internal implementation (non-contract):

- Generation internals, intermediate mapping artifacts, and deep generated file paths.
- Any deep import path below the barrel surface.

## Deprecation Plan

The legacy `cdr-tokens.d.mts` path has been removed from build output and package exports before broad consumer rollout.

Current contract:

- Type-only entrypoints:
  - `@rei/cdr-tokens/types` (rei-dot-com)
  - `@rei/cdr-tokens/docsite/types` (docsite)
- Runtime value entrypoints:
  - `@rei/cdr-tokens` (rei-dot-com)
  - `@rei/cdr-tokens/docsite` (docsite)

Legacy patterns to avoid:

- Deep imports into generated internals or dist-like paths tied to output layout.
- Token-name usage as unconstrained `string` values (no literal union validation).
- Ad-hoc object typing (`Record<string, string>`) instead of module interfaces.
- Untyped dictionary loaders that do not encode theme/platform/responsibility dimensions.

Migration direction:

- Import types only from theme-specific `/types` barrels.
- Import runtime token values only from root/docsite runtime entrypoints.
- Use module interfaces for grouped token shapes.
- Use literal union token names for token lookup safety.
- Adopt `TokenDictionary` when the public runtime dictionary contract is finalized.

Migration examples:

```ts
// old style (legacy deep import)
// import type { SomeType } from "@rei/cdr-tokens/dist/.../types/foundations/...";

// new style (public API)
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/types';
```

```ts
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/types';

const bg: CdrColorBackgroundTokens = {
  CdrColorBackgroundPrimary: '#fff',
  CdrColorBackgroundSecondary: '#f5f5f5',
};
```

```ts
// Runtime values are imported from runtime entrypoints, not /types.
import { CdrSpaceScale2 } from '@rei/cdr-tokens';
```

## Future Direction

- Add themes/platforms/responsibilities by extending schema and module maps.
- Add new generated module surfaces without breaking existing barrel imports.
- Use semver to signal API-level type changes.
- Preserve backward compatibility at the public barrel boundary where feasible.
- Track declaration format migration work in [docs/tickets/ts-declaration-migration-ticket.md](../docs/tickets/ts-declaration-migration-ticket.md).

## Current Mainline Maturity Note

This ADR defines the adopted architecture and consumer contract for mainline usage.

Current state is partial implementation:

- Implemented: modular generated `.d.ts` module files, literal token-name unions, and module interfaces in generated type outputs.
- Implemented: stable barrel exports (`./types` and `./docsite/types`) mapped in package exports.
- Implemented: existing theme-scoped type export patterns (`./rei-dot-com/types/*`, `./docsite/types/*`) remain available.
- Implemented: legacy `cdr-tokens.d.mts` generation and exports removed.
- Planned: `TokenDictionary` public export contract and complete deprecation rollout from legacy monolithic typing workflows.

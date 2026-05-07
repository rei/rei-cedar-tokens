# Consumer TypeScript Contract

This document is the canonical consumer contract for TypeScript token usage in this repository.

## Maturity Note

This document describes the supported TypeScript consumer usage patterns currently available.

- Type-only barrel entrypoints available for both themes.
- Literal token-name union files (`*.names.d.ts`) exported for modules.
- Module interfaces available for strongly-typed usage.

These patterns work today and are ready for production use.

## Import Pattern

Use theme-specific type barrels for type imports.

Type-only entrypoints:

- `@rei/cdr-tokens/types` (rei-dot-com)
- `@rei/cdr-tokens/docsite/types` (docsite)

Runtime value entrypoints:

- `@rei/cdr-tokens/tokens` (rei-dot-com flat runtime values)
- `@rei/cdr-tokens/docsite` (docsite flat runtime values)

The root `@rei/cdr-tokens` entrypoint exports the **semantic contract** — grouped foundation objects (e.g., `CdrColorText`, `CdrSpace`). This is the recommended entrypoint for framework integrations. Use `@rei/cdr-tokens/tokens` for flat token values.

Type example:

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/types';
import type { CdrSpaceTokenName } from '@rei/cdr-tokens/types';
```

Runtime example:

```ts
import { CdrSpaceScale2 } from '@rei/cdr-tokens/tokens';
```

## Public API Boundary

Public API:

- Semantic contract (grouped foundation objects):
  - `@rei/cdr-tokens` (rei-dot-com)
- Type-only barrels:
  - `@rei/cdr-tokens/types`
  - `@rei/cdr-tokens/docsite/types`
- Runtime flat values:
  - `@rei/cdr-tokens/tokens`
  - `@rei/cdr-tokens/docsite`

Not public API:

- Deep imports into generated internals.
- Direct `dist` filesystem paths.

## 1) Modular Types

### What it is

Module-specific types (for example spacing, color background) exported from theme-specific type barrels.

### Why it exists

To give consumers focused, responsibility-based typing instead of one monolithic type file.

### How to import it

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/types';
```

### How to use it

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/types';

const spacing: Partial<CdrSpaceTokens> = {
  CdrSpaceScale2: '0.25rem',
  CdrSpaceScale4: '1rem',
};
```

### Public vs internal

- Public: theme-scoped type exports
- Internal: module output file paths under generated directories

## 2) Literal Union Token Names

### What it is

Token name unions that constrain valid token-name inputs at compile time.

### Why it exists

To prevent invalid token-name string usage and improve editor autocomplete.

### How to import it

```ts
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/types';
```

### How to use it

```ts
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/types';

type BackgroundTokenMap = Record<CdrColorBackgroundTokenName, string>;

declare const tokens: BackgroundTokenMap;

function getToken(name: CdrColorBackgroundTokenName) {
  return tokens[name];
}
```

### Public vs internal

- Public: union types re-exported by theme-specific type barrels
- Internal: generated literal-type source files

## 3) Module Interfaces

### What it is

Responsibility-grouped interfaces representing token objects for a module.

### Why it exists

To support strongly-typed module-level token usage and test fixtures.

### How to import it

```ts
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/types';
```

### How to use it

```ts
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/types';

const bg: Partial<CdrColorBackgroundTokens> = {
  CdrColorBackgroundPrimary: '#fff',
  CdrColorBackgroundSecondary: '#f5f5f5',
};
```

### Public vs internal

- Public: module interfaces from theme-specific type barrels
- Internal: generated interface fragments

## Theme, Platform, Responsibility Model

Consumers should treat tokens as dimensioned by:

- `Theme` (for example site theme)
- `Platform` (web, ios, android)
- `Responsibility` (module grouping such as spacing, color-background)

This is currently represented through theme-scoped module selection.

## ADR Reference

- [ADR 0001: Modular Output Architecture](./adr/0001-modular-output-architecture.md)

# Consumer TypeScript Contract

This document is the canonical consumer contract for TypeScript token usage in this repository.

## Maturity Note

This document describes the supported TypeScript consumer usage patterns currently available.

- Modular per-module types available under theme-specific paths.
- Literal token-name union files (`*.names.d.ts`) exported for modules.
- Module interfaces available for strongly-typed usage.

These patterns work today and are ready for production use.

## Import Pattern

Theme-scoped module imports are available and working.

Use one of these theme roots:

- `@rei/cdr-tokens/rei-dot-com/types/...`
- `@rei/cdr-tokens/docsite/types/...`

Example:

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space';
import type { CdrSpaceTokenName } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space.names';
```

## Public API Boundary

Public API:

- Theme-scoped types exports from package `exports`, such as:
  - `@rei/cdr-tokens/rei-dot-com/types/*`
  - `@rei/cdr-tokens/docsite/types/*`

Not public API:

- Deep imports into generated internals.
- Direct `dist` filesystem paths.

## 1) Modular Types

### What it is

Module-specific types (for example spacing, color background) exported from one public barrel.

Module-specific types (for example spacing, color background) exported under theme-scoped type paths.

### Why it exists

To give consumers focused, responsibility-based typing instead of one monolithic type file.

### How to import it

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space';
```

### How to use it

```ts
import type { CdrSpaceTokens } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-space';

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
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background.names';
```

### How to use it

```ts
import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background.names';

type BackgroundTokenMap = Record<CdrColorBackgroundTokenName, string>;

declare const tokens: BackgroundTokenMap;

function getToken(name: CdrColorBackgroundTokenName) {
  return tokens[name];
}
```

### Public vs internal

- Public: union types re-exported by the barrel
- Public: union types exported by theme-scoped module name files
- Internal: generated literal-type source files

## 3) Module Interfaces

### What it is

Responsibility-grouped interfaces representing token objects for a module.

### Why it exists

To support strongly-typed module-level token usage and test fixtures.

### How to import it

```ts
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background';
```

### How to use it

```ts
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/rei-dot-com/types/foundations/cdr-color-background';

const bg: Partial<CdrColorBackgroundTokens> = {
  CdrColorBackgroundPrimary: '#fff',
  CdrColorBackgroundSecondary: '#f5f5f5',
};
```

### Public vs internal

- Public: module interfaces from theme-scoped type modules
- Internal: generated interface fragments

## Theme, Platform, Responsibility Model

Consumers should treat tokens as dimensioned by:

- `Theme` (for example site theme)
- `Platform` (web, ios, android)
- `Responsibility` (module grouping such as spacing, color-background)

This is currently represented through theme-scoped module selection.

## ADR Reference

- [ADR 0002: TypeScript Pipeline and Consumer Types API](../adr/0002-typescript-pipeline-and-consumer-types.md)

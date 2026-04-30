# ADR 0002: TypeScript Pipeline and Consumer Types API

## Status

Accepted

## Problem Statement

The cedar-tokens build produced a single monolithic declaration file shared across all token categories. As the token surface grew, this created friction for consumers needing type safety and autocomplete for specific token groups.

This ADR defines the modular TypeScript output architecture, the `/types` public barrel contract, and the typed runtime dictionary shape.

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

### Module Responsibility Mapping

Token responsibilities follow the same folder taxonomy established in ADR 0001.

| Responsibility | Example generated `.d.ts`                                             |
| -------------- | --------------------------------------------------------------------- |
| `foundations`  | `foundations/cdr-color-background.d.ts`, `foundations/cdr-space.d.ts` |
| `palettes`     | No public `.d.ts` module surface                                      |
| `utilities`    | SCSS-only mixins; no value `.d.ts` module surface                     |
| `components`   | No public `.d.ts` module surface                                      |

Each generated foundations module emits:

- one token-name union file (`*.names.d.ts`)
- one module interface/value file (`*.d.ts`)

> Note on utilities: the `utilities/` responsibility (for example breakpoint/display/container query mixins) is SCSS-only and excluded from TypeScript module generation.
>
> Note on palettes and components: these are value-layer outputs and not consumer type contracts. They are intentionally excluded from TypeScript module generation.

### 3. Literal union generation

- For each module, token names are emitted as literal union types.
- These unions support compile-time validation for token-name usage.

### 4. Module interface generation

- For each module, an interface is generated with typed keys/values.
- Interfaces provide a strongly-typed shape for grouped token usage.

### Generated Output Example

For `rei-dot-com/types/foundations/cdr-color-background`:

```ts
// generated: dist/rei-dot-com/types/foundations/cdr-color-background.names.d.ts
export type CdrColorBackgroundTokenName =
  | 'CdrColorBackgroundPrimary'
  | 'CdrColorBackgroundSecondary';
```

```ts
// generated: dist/rei-dot-com/types/foundations/cdr-color-background.d.ts
export interface CdrColorBackgroundTokens {
  readonly CdrColorBackgroundPrimary: string;
  readonly CdrColorBackgroundSecondary: string;
}

export declare const cdrColorBackground: CdrColorBackgroundTokens;
export default cdrColorBackground;
```

The type barrel re-exports both files via `@rei/cdr-tokens/types`.

### 5. TokenDictionary generic

- `TokenDictionary<Theme, Platform, Responsibility, Module>` provides a typed runtime contract.
- Theme/platform/responsibility dimensions are explicit type parameters.
- The generic makes runtime loading patterns statically verifiable.

Planned public signature:

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

Until the public export is finalized, consumers should not depend on this type directly from deep internal paths.

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

#### Theme Union

The public contract treats theme as a constrained union:

```ts
export type Theme = 'rei-dot-com' | 'docsite';
```

Theme values are not interchangeable across theme-specific type entrypoints. `@rei/cdr-tokens/types` is the rei-dot-com barrel, while `@rei/cdr-tokens/docsite/types` is the docsite barrel.

## Public API vs Internal Implementation

Public API:

- `@rei/cdr-tokens/types` (stable barrel)
- `@rei/cdr-tokens/docsite/types` (docsite-specific barrel)

Internal implementation (non-contract):

- Generation internals, intermediate mapping artifacts, and deep generated file paths.
- Any deep import path below the barrel surface.

## Domain Contracts And Entrypoints (Cross-PR Reference)

This section defines the complete token domain set and the output contract expected from each domain family. It is the shared reference for developers working across parallel PRs so the build remains predictable, schema-aligned, and consistent.

### Contract Objectives

- Define the complete set of token domains (foundations, components, palettes).
- Clarify which domains emit TypeScript contracts and which do not.
- Establish modularization expectations by consumer type.
- Keep outputs deterministic across themes and platforms.

### Domain Families

#### Foundations

Foundations are the stable, cross-component contract of the design system. Foundations are the only domains that emit typed public surfaces.

Canonical foundation domains that must emit SCSS, JSON, TypeScript, and CSS:

- `color-background`
- `color-text`
- `color-border`
- `color-icon`
- `motion-duration`
- `motion-timing`
- `prominence`
- `radius`
- `space`

Additional schema-backed foundation domains that must also be represented consistently in modular output:

- Typography
  - `font-family`
  - `line-height` (heading, subheading, body, utility)
  - `text-size-root`
  - `type-scale`
  - text variants
- Layout
  - `breakpoints`
- Extended spacing
  - `spacing`
  - `spacing-inset`

#### Components

Components consume foundations but are not a stable typed contract surface.

Current component set:

- `accordion`
- `button`
- `chip`
- `form`
- `icon`
- `input`
- `link`
- `message`
- `modal`
- `pagination`
- `rating`
- `slide`
- `surface`
- `surface-selection`
- `switch`
- `tab`
- `table`
- `toggle-button`
- `tooltip`

Component output rules:

- Do not emit component-specific token-name unions.
- Do not emit component-specific TypeScript interfaces.
- Do emit modular JSON, SCSS, and CSS bundles.
- Do expose a simple generic tokens map type for JS/TS convenience when needed.
- Do preserve barrel exports for modular runtime/asset consumption.

#### Palettes

Palettes are independent token sets used for membership and brand contexts.

Current palette set:

- `membership-vibrant`
- `membership-subtle`

Palette output rules:

- Emit JSON, SCSS, and CSS.
- Do not emit TypeScript contract surfaces.

### Output Matrix By Domain Family

| Domain family | JSON | SCSS | CSS | TypeScript unions/interfaces |
| ------------- | ---- | ---- | --- | ---------------------------- |
| Foundations   | Yes  | Yes  | Yes | Yes                          |
| Components    | Yes  | Yes  | Yes | No                           |
| Palettes      | Yes  | Yes  | Yes | No                           |

### Platform Deliverables Matrix

This matrix defines what each platform pipeline is expected to publish at a module level.

| Platform deliverable | Foundations modules | Components modules | Palettes modules | Utilities modules |
| -------------------- | ------------------- | ------------------ | ---------------- | ----------------- |
| JS runtime values    | Yes                 | Yes                | Optional/No      | No                |
| TypeScript modules   | Yes                 | No                 | No               | No                |
| CSS modules          | Yes                 | Yes                | Yes              | No                |
| SCSS modules         | Yes                 | Yes                | Yes              | Yes               |
| JSON modules         | Yes                 | Yes                | Yes              | No                |

Palette behavior clarification:

- Palettes are theme bundles that apply value overrides to existing tokens (for example via `data-palette` switching behavior).
- Palettes are not first-class consumer token contracts.
- Palettes should remain in value-layer outputs (CSS, SCSS, JSON) and be excluded from consumer type exports.

### Modularization Strategy

#### Foundations

- Required modularization for TypeScript and assets.
- Supports tree-shaking, domain-focused iteration, and clearer ownership boundaries.

#### Components

- Modularization required for JSON/SCSS/CSS.
- No requirement for component-specific TypeScript modules.

#### JSON and JS consumers

Modularization is beneficial but optional at consumption time. Consumers may choose:

- full/root imports
- domain-level imports
- component-level imports

This flexibility supports incremental migration without forcing all consumers to adopt modular paths at once.

### Entrypoint Contract

Preferred stable entrypoints:

- Runtime values: `@rei/cdr-tokens`, `@rei/cdr-tokens/docsite`
- Type barrels: `@rei/cdr-tokens/types`, `@rei/cdr-tokens/docsite/types`
- Theme CSS/SCSS: `@rei/cdr-tokens/css`, `@rei/cdr-tokens/scss`, `@rei/cdr-tokens/docsite/css`, `@rei/cdr-tokens/docsite/scss`

Internal deep dist paths remain available for compatibility but are not the preferred contract for new integrations.

#### Package Exports Map (Relevant Entries)

```json
{
  "exports": {
    ".": {
      "types": "./dist/rei-dot-com/js/cdr-tokens.d.ts",
      "import": "./dist/rei-dot-com/js/cdr-tokens.mjs",
      "require": "./dist/rei-dot-com/js/cdr-tokens.cjs"
    },
    "./docsite": {
      "types": "./dist/docsite/js/cdr-tokens.d.ts",
      "import": "./dist/docsite/js/cdr-tokens.mjs",
      "require": "./dist/docsite/js/cdr-tokens.cjs"
    },
    "./types": {
      "types": "./dist/rei-dot-com/types/index.d.ts"
    },
    "./docsite/types": {
      "types": "./dist/docsite/types/index.d.ts"
    }
  }
}
```

Deep paths below these entrypoints are implementation details and may change.

## Deprecation Plan

The legacy `cdr-tokens.d.mts` path has been removed from build output and package exports before broad consumer rollout.

### Asset Entrypoint Evolution

To provide a unified, consistent import experience across all asset types (types, runtime, CSS, SCSS), we are introducing simplified entrypoints. This is an **optional, non-breaking migration**.

#### Current Public Contract

**Type entrypoints:**

- `@rei/cdr-tokens/types` (rei-dot-com)
- `@rei/cdr-tokens/docsite/types` (docsite)

**Runtime value entrypoints:**

- `@rei/cdr-tokens` (rei-dot-com)
- `@rei/cdr-tokens/docsite` (docsite)

**New unified asset entrypoints (preferred):**

- `@rei/cdr-tokens/css` (rei-dot-com CSS)
- `@rei/cdr-tokens/scss` (rei-dot-com SCSS)
- `@rei/cdr-tokens/docsite/css` (docsite CSS)
- `@rei/cdr-tokens/docsite/scss` (docsite SCSS)

**Backwards-compatible deep paths (still work, non-contractual):**

- `@rei/cdr-tokens/dist/...` - all internal dist paths remain accessible via wildcard export

### Migration Guidance

Migration to new entrypoints is **optional and gradual**. No breaking changes are planned. Choose to migrate at your own pace.

**Old pattern (still works):**

```scss
// Deep import - still functional, not recommended for new code
@import '@rei/cdr-tokens/dist/rei-dot-com/scss/cdr-tokens.scss';
```

**New pattern (preferred):**

```scss
// Unified entrypoint - recommended for new code
@import '@rei/cdr-tokens/scss';
```

**Mixed approach (coexistence):**

```ts
// Types: use new barrel
import type { CdrColorBackgroundTokens } from '@rei/cdr-tokens/types';

// CSS/SCSS: can stay on old paths or migrate to new
// Old way: @import '@rei/cdr-tokens/dist/rei-dot-com/css/cdr-tokens.css';
// New way: @import '@rei/cdr-tokens/css';
```

### Legacy Patterns to Avoid in New Code

- Deep imports into generated internals or dist-like paths tied to output layout.
- Token-name usage as unconstrained `string` values (no literal union validation).
- Ad-hoc object typing (`Record<string, string>`) instead of module interfaces.
- Untyped dictionary loaders that do not encode theme/platform/responsibility dimensions.

### Recommended Migration Path (Optional)

For new projects or when updating existing code:

1. **Import types only from theme-specific `/types` barrels.**

   ```ts
   import type { CdrColorBackgroundTokenName } from '@rei/cdr-tokens/types';
   ```

2. **Import CSS/SCSS from unified entrypoints.**

   ```scss
   @import '@rei/cdr-tokens/scss';
   @import '@rei/cdr-tokens/css';
   ```

3. **Import runtime token values only from root/docsite entrypoints.**

   ```ts
   import { CdrSpaceScale2 } from '@rei/cdr-tokens';
   ```

4. **Use module interfaces for grouped token shapes.**

   ```ts
   const bg: CdrColorBackgroundTokens = {
     CdrColorBackgroundPrimary: '#fff',
     CdrColorBackgroundSecondary: '#f5f5f5',
   };
   ```

5. **Use literal union token names for token lookup safety.**

   ```ts
   const tokenName: CdrColorBackgroundTokenName = 'CdrColorBackgroundPrimary';
   ```

6. **Adopt `TokenDictionary` when the public runtime dictionary contract is finalized.**

### Coexistence Strategy

Old and new entrypoints coexist without conflict. Existing code using deep imports continues to work. Teams can migrate on their own schedule:

- **Immediate migration not required.** Your code is not broken.
- **Migrate when convenient.** Update entrypoints incrementally as you touch files.
- **No special tooling needed.** Simple search-and-replace for most migrations.

## Future Direction

- Add themes/platforms/responsibilities by extending schema and module maps.
- Add new generated module surfaces without breaking existing barrel imports.
- Use semver to signal API-level type changes.
- Preserve backward compatibility at the public barrel boundary where feasible.
- Complete `TokenDictionary` public export contract — tracked in [docs/tickets/token-dictionary-implementation.md](../docs/tickets/token-dictionary-implementation.md).

## Current Mainline Maturity Note

This ADR defines the adopted architecture and consumer contract for mainline usage.

Current state is partial implementation:

- Implemented: modular generated `.d.ts` module files, literal token-name unions, and module interfaces in generated type outputs.
- Implemented: stable barrel exports (`./types` and `./docsite/types`) mapped in package exports.
- Implemented: existing theme-scoped type export patterns (`./rei-dot-com/types/*`, `./docsite/types/*`) remain available.
- Implemented: legacy `cdr-tokens.d.mts` generation and exports removed.
- Planned: `TokenDictionary` public export contract and complete deprecation rollout from legacy monolithic typing workflows.

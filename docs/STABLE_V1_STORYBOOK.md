# Semantic Contract - Storybook Documentation

## Overview

The Semantic Contract is Cedar's versioned, guaranteed interface for semantic foundation tokens. This documentation explains what tokens are stable, how consumers use them, and the versioning strategy that protects downstream teams.

## What is Semantic Contract?

Semantic Contract (`@rei/cdr-tokens/semantic`) is a curated export of **semantic foundation tokens only**. It represents Cedar's commitment to token stability—tokens in this export will not change name, be removed, or have values altered without a major version bump.

### Core Principle

Cedar guarantees the **interface** (token names and types), but consumers own the **mapping** (how tokens are used in their framework).

```typescript
// ✅ Cedar guarantees this never changes within v1:
import { CdrColorText, CdrSpacing } from '@rei/cdr-tokens/semantic';

CdrColorText.CdrColorTextPrimary; // Token name is stable
CdrSpacing.CdrSpaceOneX; // Token name is stable

// ❌ Cedar does NOT provide this (consumers implement):
// Tailwind config mapping, styled-components definitions, etc.
```

## What's Included in Semantic Contract

### Color Tokens

- **CdrColorText** — semantic text colors (primary, secondary, brand, sale, error, success, warning, info, inverse, emphasis, disabled)
- **CdrColorBackground** — semantic background colors
- **CdrColorBorder** — semantic border colors
- **CdrColorIcon** — semantic icon colors

### Spacing Tokens

- **CdrSpace** — atomic spacing values (one-x, two-x, three-x, four-x, five-x, etc.)
- **CdrSpaceInset** — inset-specific spacing (useful for padding)
- **CdrSpaceScale** — scaled spacing sequences

### Typography Tokens

- **CdrFont** — font family groupings
- **CdrText** — composite typography (complete type styles)
- **CdrType** — typography scale collections (headings, body, etc.)
- **CdrTextFontFamily**, **CdrTextFontSize**, **CdrTextFontWeight**, **CdrTextFontStyle**, **CdrTextLetterSpacing**, **CdrTextLineHeight** — typography primitives

### Motion Tokens

- **CdrMotionDuration** — animation duration values
- **CdrMotionTiming** — animation easing/timing functions

### Structural Tokens

- **CdrRadius** — border radius values
- **CdrProminence** — semantic prominence levels (for shadows, overlays, etc.)
- **CdrBreakpoint** — responsive breakpoint values

## What's NOT Included

**Component tokens** are intentionally excluded from semantic:

- Button-specific tokens
- Input-specific states (focus, active, disabled)
- Component-scoped colors, spacing, or typography
- These tokens evolve with component implementations and should not be surfaced to consumers

**Option/utility tokens** are excluded:

- Raw palette colors like `CdrColorGreen50`, `CdrColorBlue900`
- Unscoped utility values
- Internal transformation tokens

## Usage Example: Tailwind Integration

```typescript
// tailwind.config.ts
import { CdrColorText, CdrSpacing, CdrBreakpoint, CdrType } from '@rei/cdr-tokens/semantic';

export default {
  theme: {
    extend: {
      colors: {
        text: {
          'cdr-color-text-primary': CdrColorText.CdrColorTextPrimary,
          'cdr-color-text-secondary': CdrColorText.CdrColorTextSecondary,
          'cdr-color-text-brand': CdrColorText.CdrColorTextBrand,
          'cdr-color-text-sale': CdrColorText.CdrColorTextSale,
          'cdr-color-text-error': CdrColorText.CdrColorTextError,
        },
      },
      spacing: {
        'cdr-space-one-x': CdrSpacing.CdrSpaceOneX,
        'cdr-space-two-x': CdrSpacing.CdrSpaceTwoX,
        'cdr-space-three-x': CdrSpacing.CdrSpaceThreeX,
      },
      screens: {
        'cdr-breakpoint-xs': CdrBreakpoint.CdrBreakpointXs,
        'cdr-breakpoint-sm': CdrBreakpoint.CdrBreakpointSm,
        'cdr-breakpoint-md': CdrBreakpoint.CdrBreakpointMd,
        'cdr-breakpoint-lg': CdrBreakpoint.CdrBreakpointLg,
      },
    },
  },
};
```

## Consumer Contracts

Use one contract per output type, each with what, why, and how.

### type

- what: TypeScript contracts for semantic token objects and generated token modules.
- why: Enables IntelliSense and compile-time safety in consumer mappings.
- how:

```typescript
import type { CdrColorTextTokens } from '@rei/cdr-tokens/types/color-text';
import { CdrColorText } from '@rei/cdr-tokens/semantic';

const text: CdrColorTextTokens = CdrColorText;
```

### css

- what: Prebuilt CSS token bundles and foundation CSS modules.
- why: Fast adoption for apps that consume plain CSS without Sass.
- how:

```typescript
import '@rei/cdr-tokens/css';
import '@rei/cdr-tokens/css/color-text';
```

### scss

- what: Sass token outputs and utility mixins/maps.
- why: Supports Sass-native theming and utility composition.
- how:

```scss
@use '@rei/cdr-tokens/scss';
@use '@rei/cdr-tokens/scss/type-mixins' as typeMixins;
@use '@rei/cdr-tokens/scss/breakpoint-mixins' as breakpoints;
```

### js

- what: JavaScript token value contracts at root entrypoint and semantic semantic contract.
- why: Primary runtime integration path for framework mappings and app theme objects.
- how:

```typescript
import * as tokens from '@rei/cdr-tokens';
import { CdrColorText, CdrSpace, CdrType } from '@rei/cdr-tokens/semantic';

tokens.CdrColorTextPrimary;
CdrColorText.CdrColorTextPrimary;
CdrSpace.CdrSpaceOneX;
CdrType.CdrTextHeadingSans400FontSize;
```

### json

- what: Raw JSON token artifacts in dist outputs by theme/platform.
- why: Useful for pipelines, audits, and non-JS consumers.
- how:

```typescript
import globalTokens from '@rei/cdr-tokens/json/global.json';
import webTokens from '@rei/cdr-tokens/json';

console.log(globalTokens, webTokens);
```

## Versioning Strategy: V1 → V2

### What Triggers a Major Version Bump?

- **Rename**: `CdrColorTextSale` → `CdrColorTextPromotion`
- **Removal**: Token no longer exported from semantic
- **Restructure**: Token hierarchy reorganized

### What Does NOT Trigger a Bump?

- **Adding new tokens**: New semantic values are additive
- **Value updates**: Cedar can tune hex codes or timing values
- **Documentation changes**: Clarifications don't break the interface

### When V2 is Released

1. Cedar announces breaking changes with migration guide
2. Consumers stay on v1 as long as needed (typically 1-2 releases)
3. v1 branch receives critical bug fixes but no new features
4. Consumers opt-in to v2 when ready
5. New stable interface: `@rei/cdr-tokens/stable-v2`

```typescript
// Migration example (v1 → v2)
// ❌ Old import (v1)
import { CdrColorTextSale } from '@rei/cdr-tokens/semantic';

// ✅ New import (v2)
import { CdrColorTextPromotion } from '@rei/cdr-tokens/stable-v2';
```

## For Cedar Maintainers

### Adding a New Semantic Token to Semantic Contract

1. Create the token semantically in `tokens/global/`
2. Style Dictionary build automatically includes it
3. It appears in semantic at next release
4. No filter changes needed (semantic tokens are default)

### Evolving the Contract

- **Non-breaking (within v1)**: Always allowed
- **Breaking (requires v2)**: Plan with team, update CHANGELOG, communicate to consumers

### Validation Checklist

Before merging token changes:

- [ ] No component tokens leaked into semantic layer
- [ ] Filter shapes verified (see ADR-0002)
- [ ] TypeScript types correctly reflect exports
- [ ] CHANGELOG updated
- [ ] Consumer teams notified of changes

## Design Principles

### 1. Simplicity

The stable contract exports only what consumers need: semantic foundation tokens. Framework-specific logic stays in consumer code.

### 2. Durability

Tokens in semantic are **permanent within a major version**. We don't rename or remove casually. Breaking changes are rare and planned.

### 3. Autonomy

Consumers own their framework mappings. Cedar provides tokens; teams decide how to use them in Tailwind, styled-components, etc.

### 4. Transparency

Changes to the contract are documented, versioned, and communicated. No surprises.

## Related References

- [Semantic Contract Contract Specification](../docs/STABLE_V1_CONTRACT.md)
- [ADR-0002: Filter Shape Specification](../adr/0002-filter-shape-specification.md)
- [Architecture Overview](../docs/ARCHITECTURE.md)
- [Changelog](../CHANGELOG.md)

## Support & Questions

For questions about semantic:

- Open an issue in the [rei/rei-cedar-tokens](https://github.com/rei/rei-cedar-tokens) repository
- Tag with `question: semantic`
- Cedar team will respond within 2 business days

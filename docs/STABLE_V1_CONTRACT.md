# Semantic Contract: Cedar Foundation Tokens

## Overview

The `semantic` contract layer provides a versioned, stable export of Cedar's semantic foundation tokens. This is a **guaranteed interface** that consumers (DXP, other product teams) can depend on without worrying about breaking changes mid-lifecycle.

## What's Included

Semantic Contract exports **semantic foundation tokens only**:

### Colors

- `CdrColorText` — semantic text colors (primary, secondary, brand, sale, etc.)
- `CdrColorBackground` — semantic background colors
- `CdrColorBorder` — semantic border colors
- `CdrColorIcon` — semantic icon colors

### Spacing

- `CdrSpace` — atomic spacing values
- `CdrSpaceInset` — inset-specific spacing
- `CdrSpaceScale` — scaled spacing sequences

### Typography

- `CdrFont`, `CdrText`, `CdrType` — composite typography definitions
- `CdrTextFontFamily`, `CdrTextFontSize`, `CdrTextFontWeight`, `CdrTextFontStyle`, `CdrTextLetterSpacing`, `CdrTextLineHeight`, `CdrLineHeight` — typography primitives

### Motion

- `CdrMotionDuration` — animation duration values
- `CdrMotionTiming` — animation timing functions

### Structural

- `CdrRadius` — border radius tokens
- `CdrProminence` — semantic prominence levels
- `CdrBreakpoint` — responsive breakpoint tokens

## What's Excluded

- **Component tokens** — consumers use component prop interfaces instead
- **Utility/option tokens** — these are internal and may change
- **Internal/deprecated tokens** — removed from public contract

## Stability Guarantee

Within a **major version (e.g., v1)**, Cedar guarantees:

✅ **Exported tokens keep their names** — `CdrColorTextPrimary` will always be `CdrColorTextPrimary`

✅ **Tokens won't be removed** — if Cedar needs to deprecate something, it goes to v2

✅ **Values are stable** — design decisions don't change without intention

✅ **New tokens can be added** — additive changes don't break the contract

❌ **Renames/removals require v2** — breaking changes only on major version bumps

## Usage Example

Import stable tokens and map them to your framework:

```typescript
// tailwind.config.ts
import { CdrColorText, CdrSpacing, CdrBreakpoint } from '@rei/cdr-tokens/semantic';

export default {
  theme: {
    extend: {
      colors: {
        text: {
          'cdr-color-text-primary': CdrColorText.CdrColorTextPrimary,
          'cdr-color-text-secondary': CdrColorText.CdrColorTextSecondary,
          'cdr-color-text-brand': CdrColorText.CdrColorTextBrand,
          'cdr-color-text-sale': CdrColorText.CdrColorTextSale,
        },
      },
      spacing: {
        'cdr-space-one-x': CdrSpacing.CdrSpaceOneX,
        'cdr-space-two-x': CdrSpacing.CdrSpaceTwoX,
      },
      screens: {
        'cdr-breakpoint-xs': CdrBreakpoint.CdrBreakpointXs,
        'cdr-breakpoint-sm': CdrBreakpoint.CdrBreakpointSm,
      },
    },
  },
};
```

## Versioning Strategy

### Within V1

- Additive changes (new semantic tokens) are allowed
- Consumers benefit from Cedar extensions automatically
- No breaking changes to existing tokens

### V2 Trigger

A new major version (v2) is required if Cedar needs to:

- Rename or remove a token
- Change a token's semantic meaning
- Restructure the token hierarchy

### Migration Path

When v2 is released:

1. Cedar announces the changes
2. Consumers stay on v1 as long as needed
3. v1 is maintained in a branch for critical fixes
4. Consumers can upgrade to v2 on their timeline
5. Stable export remains available: `@rei/cdr-tokens/stable-v2`

## For Cedar Maintainers

### Adding a New Stable Token

1. Create the token semantically in `/tokens/global/`
2. Ensure it passes the Style Dictionary build
3. It automatically appears in semantic at next release

### Deprecating a Token

1. Don't remove it from semantic
2. Mark it as deprecated in the source token definition
3. Plan its removal for v2

### Evolving the Contract

1. Use semantic versioning strictly (major.minor.patch)
2. Document all changes in the CHANGELOG
3. Notify consumer teams of new/deprecated tokens
4. Provide migration guides for v1→v2 upgrades

## Consumer Responsibilities

- Consumers own the mapping logic (tailwind, styled-components, etc.)
- Consumer code is responsible for consuming semantic correctly
- Consumer maintains IntelliSense by importing types from semantic
- Consumer can extend locally while tracking Cedar versions

## Related Documents

- [Storybook Documentation](./STABLE_V1_STORYBOOK.md) — For end-users and framework integrators
- [Architecture Overview](./ARCHITECTURE.md) — full token system design
- [Filter Shape Specification](../adr/0002-filter-shape-specification.md) — Token separation rules
- [Contract Alignment Review Map](./CONTRACT_ALIGNMENT_REVIEW_MAP.md) — token usage across consumers

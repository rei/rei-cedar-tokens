# ADR 0001: Modularize Tokens Output

## Version

v13.4.0

## Status

In Review

---

## Context

The cedar-tokens repository currently produces a single global token output per platform (e.g. cdr-tokens.scss, cdr-tokens.css). While simple to consume, this structure has several drawbacks:

- All consumers must import all tokens, regardless of need.
- Foundational values, semantic roles, component tokens, and utilities are mixed together.
- The structure does not align with Cedar’s naming strategy:## Decision
- The component determines which price values to display based on discount presence, range detection, and compare‑at validity.

## Decision

We will modularize token outputs by responsibility, while keeping a global entry point for backward compatibility.

### Modular Output Structure

```text
dist/
  <theme>/
    scss/
      foundations/
        cdr-color-text.scss
        cdr-color-background.scss
        cdr-color-border.scss
        cdr-dimension-spacing.scss
        cdr-motion.scss
        cdr-radius.scss
        cdr-space.scss
      palettes/
        cdr-palette-membership-subtle.scss
        cdr-palette-membership-vibrant.scss
      utilities/
        cdr-type-mixins.scss
        cdr-breakpoint-mixins.scss
      cdr-tokens.scss
```

### Folder Overview

- `<theme>/`
  - Theme-specific output (e.g. `rei-dot-com`, `docsite`).
- `foundations/`
  - Core semantic token layers used across the design system:
    - Color for background, border, icon and text.
    - Spacing and dimension scales.
    - Motion related tokens.
- `palettes/`
  - Context specific color palettes intended for composition on top of our fondations.
- `utilities/`
  - Reusable SCSS mixins:
    - Typography.
    - Breakpoints.
    - Display behavior.
- `cdr-tokens.<extension>/`
  - Entry point that imports and exposes all tokens.

---

## Maintaining Token Separation

To prevent component tokens from leaking into foundation exports, strict filter shapes are enforced during the build process. See [ADR-0002: Filter Shape Specification](./0002-filter-shape-specification.md) for detailed rules.

**Key Guidelines:**

- Foundations contain **only** semantic tokens (no component-specific states like focus, active, disabled)
- Components contain tokens scoped to specific component needs
- Palettes contain context-specific color compositions
- Utilities contain reusable SCSS mixins (not value exports)

Before adding a new token:

1. Determine its responsibility (foundation / component / palette / utility)
2. Verify it matches the filter shape spec in ADR-0002
3. Ensure no cross-contamination with other categories
4. Run `pnpm run validate` to confirm separation

---

## Related Resources

- [ADR-0002: Filter Shape Specification](./0002-filter-shape-specification.md) — Explicit token path rules
- [Jira: CDR-3504](https://rei-coop.atlassian.net/browse/CDR-3504)

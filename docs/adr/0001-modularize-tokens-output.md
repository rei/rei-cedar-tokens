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
        cdr-breakpoint.scss
        cdr-color-background.scss
        cdr-color-border.scss
        cdr-color-icon.scss
        cdr-color-text.scss
        cdr-font.scss
        cdr-line-height.scss
        cdr-motion-duration.scss
        cdr-motion-timing.scss
        cdr-prominence.scss
        cdr-radius.scss
        cdr-space.scss
        cdr-space-icon.scss
        cdr-space-inset.scss
        cdr-space-scale.scss
        cdr-text-font-family.scss
        cdr-text-font-size.scss
        cdr-text-font-style.scss
        cdr-text-font-weight.scss
        cdr-text-letter-spacing.scss
        cdr-text-line-height.scss
        cdr-text.scss
        cdr-type.scss
      palettes/
        cdr-palette-membership-subtle.scss
        cdr-palette-membership-vibrant.scss
      utilities/
        cdr-type-mixins.scss
        cdr-breakpoint-mixins.scss
      cdr-tokens.scss
```

> The canonical list of foundation modules is maintained in `style-dictionary/configs/filters/modules.ts` and is the source of truth for what modules are emitted.

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

## Related Resources

- [Jira: CDR-3504](https://rei-coop.atlassian.net/browse/CDR-3504)

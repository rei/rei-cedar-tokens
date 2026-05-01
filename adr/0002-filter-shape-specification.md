# ADR 0002: Filter Shape Specification for Token Output Separation

## Version

v14.0.0

## Status

Active

---

## Context

The token build process uses filters to separate tokens by responsibility (foundations, components, palettes, utilities, etc.). Without explicit filter shape documentation, there's risk of:

- Component tokens accidentally reintroduced into foundations exports
- Inconsistent filtering logic across token categories
- Maintenance burden when adding new tokens
- Unclear expectations for what should/shouldn't be exported in each layer

This ADR codifies the exact filter shapes used to prevent token leakage between layers.

---

## Decision

We establish formal filter shapes for each output category. All filters must explicitly match the documented shape to ensure tokens remain in their intended layer.

### Filter Shape Specification

#### Foundations (Semantic Layer)

**Purpose**: Core design tokens used directly in consumer applications. Public stable interface.

**Included Token Paths**:

```
color/text/*              (semantic text colors)
color/background/*        (semantic background colors)
color/border/*            (semantic border colors)
color/icon/*              (semantic icon colors)
space/*                   (atomic and composed spacing)
space-inset/*            (inset-specific spacing)
space-scale/*            (scaled spacing sequences)
radius/*                 (border radius values)
motion-duration/*        (animation duration)
motion-timing/*          (animation easing functions)
prominence/*             (semantic prominence levels)
font/*                   (typography family/weight/style)
text/*                   (composite typography)
type/*                   (typography scale collections)
text-font-family/*       (font family primitives)
text-font-size/*         (font size primitives)
text-font-weight/*       (font weight primitives)
text-font-style/*        (font style primitives)
text-letter-spacing/*    (letter spacing primitives)
text-line-height/*       (line height primitives)
line-height/*            (line height collections)
breakpoint/*             (responsive breakpoints)
```

**Excluded Token Paths** (never in foundations):

```
<any>/focus-*            (component-specific focus states)
<any>/active-*           (component-specific active states)
<any>/disabled-*         (component-specific disabled states)
component/*              (all component tokens)
accordion/*              (component-specific)
button/*                 (component-specific)
chip/*                   (component-specific)
form/*                   (component-specific)
input/*                  (component-specific)
link/*                   (component-specific)
message/*                (component-specific)
modal/*                  (component-specific)
pagination/*             (component-specific)
rating/*                 (component-specific)
slide/*                  (component-specific)
surface/*                (component-specific)
surface-selection/*      (component-specific)
switch/*                 (component-specific)
tab/*                    (component-specific)
table/*                  (component-specific)
toggle-button/*          (component-specific)
tooltip/*                (component-specific)
```

#### Components

**Purpose**: Design tokens scoped to specific component needs. Private to component implementations.

**Included Token Paths**:

```
accordion/*
button/*
chip/*
form/*
input/*
link/*
message/*
modal/*
pagination/*
rating/*
slide/*
surface/*
surface-selection/*
switch/*
tab/*
table/*
toggle-button/*
tooltip/*
<any>/{component}-focus-*        (component focus states)
<any>/{component}-active-*       (component active states)
<any>/{component}-disabled-*     (component disabled states)
```

**Excluded Token Paths** (never in components):

```
space/*                  (use foundations instead)
color/text/*             (use semantic colors)
color/background/*       (use semantic colors)
color/border/*           (use semantic colors)
color/icon/*             (use semantic colors)
breakpoint/*             (use foundations instead)
motion-duration/*        (use foundations instead)
motion-timing/*          (use foundations instead)
```

#### Palettes

**Purpose**: Context-specific color palettes for composition. Ephemeral for specific use cases.

**Included Token Paths**:

```
membership-subtle/*      (membership palette)
membership-vibrant/*     (membership palette)
<context>-*             (any context-specific palette)
```

**Excluded Token Paths**:

```
All non-palette tokens should use foundations or components
```

#### Utilities

**Purpose**: Reusable mixins and helper functions. Not value exports.

**Included**:

```
scss/
  utilities/
    cdr-type-mixins.scss      (typography helpers)
    cdr-breakpoint-mixins.scss (responsive helpers)
    cdr-display.scss          (display/visibility helpers)
```

---

## Implementation Rules

### Rule 1: Explicit Inclusion in Foundations

Every token added to `foundations/` exports must match **only** the Included paths listed above. Before adding a token to foundations:

- ✅ Confirm it's semantic (not component-specific)
- ✅ Confirm it appears in the Included list
- ✅ Confirm it does NOT appear in the Excluded list for any other category

### Rule 2: Component Tokens Isolation

Component tokens must **never** leak into foundation exports. Review filters quarterly:

```bash
# Verify no component tokens in foundations
find dist/rei-dot-com/types/foundations -name "*.d.ts" | xargs grep -l "CdrButton\|CdrChip\|CdrInputs" && echo "LEAK DETECTED" || echo "✓ Clean"
```

### Rule 3: Semantic Color Boundaries

Color tokens must be categorized as:

- **text** — only for text
- **background** — only for backgrounds
- **border** — only for borders
- **icon** — only for icons

Avoid generic "color" tokens that cross these boundaries.

### Rule 4: New Token Review

When proposing new tokens:

1. Identify the responsibility (foundation / component / palette)
2. Confirm the path matches the filter shape spec
3. Add an entry to this ADR before merging
4. Update filters in `style-dictionary/filters/` if needed

---

## Filter Implementation Location

Filter logic is implemented in:

```
style-dictionary/filters/
  foundations/       (separate filter per responsibility)
    color-text-tokens.ts
    color-background-tokens.ts
    color-border-tokens.ts
    color-icon-tokens.ts
    space-tokens.ts
    radius-tokens.ts
    motion-tokens.ts
    prominence-tokens.ts
    typography-tokens.ts

style-dictionary/filters/
  components/        (one filter per component family)
    accordion-tokens.ts
    button-tokens.ts
    chip-tokens.ts
    [etc]
```

Each filter explicitly returns a function that tests `token.path` against the patterns in this ADR.

---

## Testing & Validation

### Build-Time Validation

Run `pnpm run validate` to verify:

- No component tokens in foundations
- No foundations tokens in components
- All exported tokens match their category shape
- No orphaned tokens

### Review Checklist

When proposing new tokens or renaming existing ones:

- [ ] Token path matches the filter shape for its category
- [ ] No cross-contamination between foundations/components
- [ ] TypeScript types are correctly filtered
- [ ] Documentation reflects new token location

---

## Why This Matters

**Without explicit filter shapes:**

- Maintenance burden grows with each token addition
- Easy to accidentally break the single source of truth
- Consumers can't trust stable-v1 contract if tokens keep changing shape
- Hard to reason about what belongs where

**With explicit shapes:**

- Clear rules prevent token leakage
- Easy to add new tokens safely
- Reviewers can verify compliance
- Stable-v1 contract remains durable

---

## Related Resources

- [ADR-0001: Modularize Tokens Output](./0001-modularize-tokens-output.md)
- [Stage 3: Stable V1 Contract Documentation](../docs/STABLE_V1_CONTRACT.md)
- [Jira: CDR-3504](https://rei-coop.atlassian.net/browse/CDR-3504)

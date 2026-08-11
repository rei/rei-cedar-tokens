# ADR 001: Token Directory Structure Reorganization

## Status

**Accepted**

## Context

The current token directory structure in cedar-tokens has evolved without a clear architectural convention, resulting in scattered tokens across multiple directories (`global/`, `web/`, `themes/`). This structure makes it difficult to:

1. Identify which tokens are primitive vs. semantic vs. component-specific
2. Maintain clear boundaries between platform-agnostic and platform-specific tokens

Current structure issues:

- Primitive tokens (color palette, spacing scale, typography values) mixed with semantic tokens
- Semantic tokens (text colors, background colors) split between `global/` and `web/`
- Component tokens (button, link, input) mixed with semantic tokens in `global/`
- SCSS utilities contain implementation details that should live in Cedar
- No clear canonical structure aligned with modern design token best practices
- Platform artifacts (CSS, Swift, XML) incorrectly treated as source rather than generated outputs

## Decision

We will reorganize the token directory structure to align with a canonical design token architecture that separates concerns by function rather than platform. The new structure will enable clear separation between:

1. **Primitive tokens** - Raw design token values (color palette, spacing scale, typography primitives)
2. **Semantic tokens** - Contextual design tokens that reference primitives
3. **Component token maps** - Canonical component token definitions with nested variant/state structure

Platform artifacts (CSS, Swift, XML, etc.) are generated outputs under `dist/`, not source directories.

**Key architectural principle**: The token repository owns canonical token definitions (primitives, semantic, component maps). Implementation concerns (breakpoints, composite typography, SCSS utilities, component CSS) belong to Cedar/cedar-styles.

### Target Directory Structure

```
cedar-tokens/
├── tokens/
│   ├── primitives/                 # Raw design token values
│   │   ├── color/
│   │   │   └── palette.json      # Color palette values
│   │   ├── spacing/
│   │   │   └── scale.json        # Spacing scale values
│   │   ├── typography/
│   │   │   ├── family.json      # Font family values
│   │   │   ├── size.json        # Font size values
│   │   │   ├── weight.json      # Font weight values
│   │   │   └── spacing.json     # Letter spacing values
│   │   ├── motion/
│   │   │   ├── duration.json    # Animation duration values
│   │   │   └── timing.json      # Timing function values
│   │   └── radius/
│   │       └── scale.json       # Border radius values
│   │
│   ├── semantic/                  # Semantic tokens that reference primitives
│   │   ├── color/
│   │   │   ├── text.json        # Text color tokens
│   │   │   ├── icon.json        # Icon color tokens
│   │   │   ├── background.json  # Background color tokens
│   │   │   └── border.json      # Border color tokens
│   │   ├── surface/
│   │   │   ├── background.json  # Surface background colors
│   │   │   └── border.json      # Surface border colors
│   │   ├── action/
│   │   │   └── button.json      # Action component colors
│   │   ├── selection/
│   │   │   └── checkbox.json    # Selection component colors
│   │   ├── navigation/
│   │   │   └── link.json        # Navigation component colors
│   │   ├── feedback/
│   │   │   ├── success.json     # Success state colors
│   │   │   ├── warning.json     # Warning state colors
│   │   │   └── error.json       # Error state colors
│   │   ├── spacing/
│   │   │   ├── inset.json       # Inset spacing tokens
│   │   │   └── stack.json       # Stack spacing tokens
│   │   ├── typography/
│   │   │   ├── heading.json     # Heading typography tokens
│   │   │   ├── body.json        # Body typography tokens
│   │   │   └── utility.json    # Utility typography tokens
│   │   ├── motion/
│   │   │   ├── duration.json    # Semantic duration tokens
│   │   │   └── timing.json      # Semantic timing tokens
│   │   └── prominence/
│   │       └── shadow.json      # Shadow/prominence tokens
│   │
│   ├── component/                 # Canonical component token maps
│   │   ├── button.json           # Button component token map
│   │   ├── link.json             # Link component token map
│   │   ├── input.json            # Input component token map
│   │   └── ...                   # Other component token maps
│   │
│   └── index.json                 # Main entry point that references all token files
```

### What Moves to Cedar/cedar-styles

The following items will be moved from cedar-tokens to Cedar/cedar-styles:

**1. SCSS Mixins and Utilities**

- `cdr-breakpoint-mixins.scss` → @rei/cedar-styles
- `cdr-display-mixins.scss` → @rei/cedar-styles
- `cdr-type-mixins.scss` → @rei/cedar-styles

**Rationale**: These are implementation details for consuming tokens in SCSS. They should live in cedar-styles as shared utilities, not in the token repository.

**2. Web-Specific Primitives**

- Breakpoint values and breakpoint mixins → @rei/cedar-styles
- Composite text/typography styles → Cedar components / @rei/cedar-styles

**Rationale**: Web-specific and composite concerns are implementation details that belong in Cedar/cedar-styles, not the canonical token repository.

**3. Component Implementation**

- Component CSS with selectors → Cedar components
- Component SCSS maps and mixins → Cedar components
- Component variable types → Cedar components

**Rationale**: Component implementation (CSS generation, selectors, Sass maps) belongs to Cedar, not the token repository. The token repository provides the canonical component token maps; Cedar determines how to consume them.

### Component Token Map Structure

Component token maps use a nested variant/state structure, not suffix-based naming:

```json
{
  "component": {
    "button": {
      "background": {
        "rest": { "$value": "{color.action.brand.rest}" },
        "hover": { "$value": "{color.action.brand.hover}" }
      },
      "text": {
        "rest": { "$value": "{color.text.inverse}" }
      }
    }
  }
}
```

This structure:

- References semantic alias tokens only (Tier 3 in three-tier model)
- Uses nested variant/state instead of suffixes (e.g., `button-background-rest` vs `button.background.rest`)
- Serves as the canonical source for all platforms
- Allows Cedar to generate platform-specific implementations (CSS variables, Sass maps, etc.)

### Output Matrix

| Domain Family                                             | Token Repo Output                     | Cedar/cedar-styles Output         |
| --------------------------------------------------------- | ------------------------------------- | --------------------------------- |
| Primitives (color, space, radius, static font/line atoms) | CSS, SCSS, JS, TS, JSON               | —                                 |
| Web-specific atoms (web fluid, font stacks)               | Web-only module, not in public barrel | —                                 |
| Breakpoints                                               | Optional dimension reference or none  | Mixins, utility classes, CSS vars |
| Composite text styles                                     | No                                    | Components / cedar-styles         |
| Component token maps                                      | JSON + optional Sass data map         | Component CSS, SCSS maps, mixins  |
| Component variable types                                  | No                                    | Cedar / cedar-types               |

**Default entrypoint contract**: The public barrel (@rei/cdr-tokens/css, /scss, /types) includes only cross-platform primitives. Component token maps, web-only values, and utilities are opt-in or Cedar-owned.

### Migration Path

The migration will be executed in phases to avoid breaking consumers:

#### Phase 1: Primitive and Semantic Token Consolidation (Non-Breaking)

**Goal**: Consolidate primitive and semantic tokens without changing public API

**Steps**:

1. Create new `primitives/` and `semantic/` directory structure alongside existing structure
2. Move primitive tokens from `global/` and `web/` to `primitives/`
3. Move semantic tokens from `global/` and `web/` to `semantic/`
4. Create new `component/` directory structure for canonical component token maps
5. Restructure existing component tokens from `tokens/global/` to nested variant/state format in `tokens/component/`
6. Create alias files in old locations that reference new locations
7. Update `index.json` to include both old and new paths temporarily
8. Run full test suite to ensure no breaking changes
9. Document deprecation of old paths

**Risk**: Low (backward compatible via aliases)

#### Phase 2: SCSS Mixin and Web-Specific Migration (Breaking Change)

**Goal**: Move SCSS mixins and web-specific primitives to Cedar/cedar-styles

**Steps**:

1. Move SCSS mixin files to @rei/cedar-styles
2. Move breakpoint values and mixins to @rei/cedar-styles
3. Move composite text/typography styles to Cedar components / @rei/cedar-styles
4. Remove `dist/docsite/scss/utilities/` from cedar-tokens
5. Remove `tokens/web/` directory from cedar-tokens (breakpoints, composite typography)
6. Publish major version bump for cedar-tokens (v2.0.0)
7. @rei/cedar-styles publishes coordinated major version bump
8. Update consuming applications to import mixins from @rei/cedar-styles instead of cedar-tokens

**Risk**: High (requires coordination across repositories)
**Mitigation**: Provide migration guide and support for consuming applications

#### Phase 3: Component Output Restructuring (Breaking Change)

**Goal**: Restructure component token outputs to canonical maps only

**Steps**:

1. Update token repo build process to emit component token maps as JSON only
2. Remove per-component CSS with selectors from token repo outputs
3. Remove composite Sass mixins from token repo outputs
4. Cedar components update build process to consume component token maps and generate CSS
5. Cedar components implement three-tier fallback chain generation
6. Cedar components generate Sass maps from token maps
7. Publish minor version bump for cedar-tokens (v2.1.0)
8. Cedar components publish coordinated minor version bump
9. Update consuming applications to use Cedar-generated component CSS

**Risk**: Medium (affects component CSS generation)
**Mitigation**: Provide migration guide and support for consuming applications

#### Phase 4: Cleanup (Non-Breaking)

**Goal**: Remove temporary aliases and finalize structure

**Steps**:

1. Remove alias files from old directory locations
2. Remove old empty directories
3. Update documentation to reflect new structure
4. Publish patch version bump for cedar-tokens (v2.1.1)
5. Archive migration guide

**Risk**: Low (cleanup only)

### Backward Compatibility Strategy

During Phase 1, we will maintain backward compatibility through alias files:

```json
// tokens/global/color.json (temporary alias)
{
  "$extends": ["../semantic/color/text.json"]
}
```

This allows consumers to continue using old import paths while we transition them to new paths.

### Consumer Migration Guide

We will provide a migration guide for consuming applications:

1. **Primitive Token Imports**
   - Old: `@import 'cedar-tokens/tokens/global/color'`
   - New: `@import 'cedar-tokens/tokens/primitives/color/palette'`

2. **Semantic Token Imports**
   - Old: `@import 'cedar-tokens/tokens/global/color'`
   - New: `@import 'cedar-tokens/tokens/semantic/color/text'`

3. **Component Token Map Imports**
   - Old: `@import 'cedar-tokens/tokens/global/button'`
   - New: `@import 'cedar-tokens/tokens/component/button'`
   - Note: Component token maps now use nested variant/state structure

4. **SCSS Mixin Imports**
   - Old: `@import 'cedar-tokens/dist/docsite/scss/utilities/cdr-type-mixins'`
   - New: `@import '@rei/cedar-styles/utilities/cdr-type-mixins'`

5. **Breakpoint Imports**
   - Old: `@import 'cedar-tokens/tokens/web/breakpoints'`
   - New: `@import '@rei/cedar-styles/breakpoints'`

6. **Component CSS**
   - Old: Import from cedar-tokens dist output
   - New: Import from Cedar components (Cedar generates CSS from token maps)

## Consequences

### Positive

- **Clear separation of concerns** between primitive, semantic, and component token maps
- **Reduced token repository scope** to only canonical token definitions
- **Platform artifacts properly treated as generated outputs** under `dist/`
- **Better maintainability** with implementation concerns in Cedar/cedar-styles
- **Canonical component token maps** provide single source of truth for all platforms
- **Alignment with industry best practices** for design token architecture
- **Easier onboarding** for new developers with intuitive directory structure
- **Flexible component implementation** - Cedar can evolve CSS generation without changing token maps

### Negative

- **Breaking changes** for consuming applications (mitigated through phased migration)
- **Coordination overhead** with Cedar/cedar-styles teams
- **Temporary complexity** during migration period with both old and new structures
- **Documentation updates** required across multiple repositories
- **Component token restructuring** requires Cedar components to update build process

### Risks

- **Consumer adoption**: Applications may delay upgrading to new structure
  - **Mitigation**: Provide comprehensive migration guide and support
- **Coordination failure**: Cedar/cedar-styles may not align with timeline
  - **Mitigation**: Establish clear ownership and communication channels
- **Component build process complexity**: Cedar components may struggle with new token map consumption
  - **Mitigation**: Provide build process templates and examples

## Sign-Off

- **Author**: Cedar Design System Team
- **Date**: August 2026
- **Status**: Revision
- **Next Review**: After Phase 1 completion

## Vocabulary

- **Primitive tokens**: Raw design token values (color palette, spacing scale, typography primitives)
- **Semantic tokens**: Contextual design tokens that reference primitives
- **Component token maps**: Canonical component token definitions with nested variant/state structure
- **Platform artifacts**: Generated outputs (CSS, Swift, XML, etc.) under `dist/`, not source directories
- **Cedar/cedar-styles**: Implementation layer that consumes token maps and generates CSS, SCSS mixins, utilities
- **Three-tier model**: Primitive → Semantic → Component token hierarchy
- **Canonical source**: Single source of truth for token definitions (token repository)

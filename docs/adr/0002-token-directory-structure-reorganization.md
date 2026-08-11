# ADR 001: Token Directory Structure Reorganization

## Status

**Accepted**

## Context

The current token directory structure in cedar-tokens has evolved without a clear architectural architeral convention, resulting in scattered primitive tokens across multiple directories (`global/`, `web/`, `themes/`). This structure makes it difficult to:

1. Identify which tokens are Primitive vs. component-specific
2. Maintain clear boundaries between platform-agnostic and platform-specific tokens
3. Support theme overrides in a consistent manner

Current structure issues:

- Primitive tokens (color, spacing, typography) split between `global/` and `web/`
- Component tokens (button, link, input) mixed with Primitive tokens in `global/`
- Theme-specific overrides (`themes/rei-dot-com/`, `themes/docsite/`) contain Primitive tokens
- SCSS utilities contain implementation details that should live in Cedar
- No clear canonical structure aligned with modern design token best practices

## Decision

We will reorganize the token directory structure to align with a canonical design token architecture that separates concerns by function rather than platform. The new structure will enable clear separation between:

1. **Primitive tokens** - Raw design token values (color palette, spacing scale, typography primitives)
2. **Semantic tokens** - Contextual design tokens that reference primitives
3. **Component tokens** - Component-specific design tokens (thin maps, palettes, themes)

### Target Directory Structure

```
cedar-tokens/
├── tokens/
│   ├── primitives/              # Raw design token values
│   │   ├── color/
│   │   │   └── palette.json     # Color palette values
│   │   ├── spacing/
│   │   │   └── space.json       # Spacing scale values
│   │   ├── typography/
│   │   │   ├── family.json      # Font family values
│   │   │   ├── size.json        # Font size values
│   │   │   ├── weight.json      # Font weight values
│   │   │   └── spacing.json     # Letter spacing values
│   │   ├── motion/
│   │   │   ├── duration.json    # Animation duration values
│   │   │   └── timing.json      # Timing function values
│   │   ├── breakpoint/
│   │   │   └── breakpoint.json  # Timing function values
│   │   └── radius/
│   │       └── scale.json       # Border radius values
│   │
│   ├── semantic/                  # Semantic tokens that reference primitives
│   │   ├── color/
│   │   │   ├── text.json        # Text color tokens
│   │   │   ├── icon.json        # Icon color tokens
│   │   │   ├── background.json  # Background color tokens
│   │   │   └── border.json      # Border color tokens
│   │   ├── feedback/
│   │   │   ├── success.json     # Success state colors
│   │   │   ├── warning.json     # Warning state colors
│   │   │   └── error.json       # Error state colors
│   │   ├── surface/
│   │   │   ├── background.json  # Surface background colors
│   │   │   └── border.json      # Surface border colors
│   │   ├── action/
│   │   │   └── button.json      # Action component colors
│   │   ├── selection/
│   │   │   └── checkbox.json    # Selection component colors
│   │   ├── navigation/
│   │   │   └── link.json        # Navigation component colors
│   │   ├── spacing/
│   │   │   ├── inset.json       # Inset spacing tokens
│   │   │   └── scale.json       # Stack spacing tokens
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
│   ├── component/ # Component-specific tokens (thin maps)
│   │   ├── palettes/             # Component-specific color palettes
│   │   └── themes/               # Component-specific themes/modes
```

### What Moves to Cedar Component Repository

The following items will be moved from cedar-tokens to the Cedar component repository:

**1. SCSS Mixins and Utilities**

- `cdr-breakpoint-mixins.scss` → Cedar component repo
- `cdr-display-mixins.scss` → Cedar component repo
- `cdr-type-mixins.scss` → Cedar component repo

**Rationale**: These are implementation details for consuming tokens in SCSS. They should live alongside the components that use them, not in the token repository.

**2. Component Tokens**
All component-specific tokens from `tokens/global/` will move to Cedar:

- `button.json` → Cedar button component
- `link.json` → Cedar link component
- `input.json` → Cedar input component
- `chip.json` → Cedar chip component
- `message.json` → Cedar message component
- `modal.json` → Cedar modal component
- `pagination.json` → Cedar pagination component
- `rating.json` → Cedar rating component
- `slide.json` → Cedar slide component
- `surface-selection.json` → Cedar surface-selection component
- `surface.json` → Cedar surface component
- `switch.json` → Cedar switch component
- `tab.json` → Cedar tab component
- `table.json` → Cedar table component
- `toggle-button.json` → Cedar toggle-button component
- `tooltip.json` → Cedar tooltip component
- `form.json` → Cedar form component
- `icon.json` → Cedar icon component
- `accordion.json` → Cedar accordion component

**Rationale**: Component tokens are specific to component implementation and should be co-located with component code for better maintainability.

**3. Theme-Specific Overrides**
All theme-specific tokens will be removed from cedar-tokens:

- `themes/docsite/` → Delete (docsite should consume Cedar tokens directly)
- `themes/rei-dot-com/` → Move to REI.com application codebase

**Rationale**: Theme-specific overrides are application-specific and should not live in the shared token repository.

### Theme Support Strategy

**Principle**: cedar-tokens provides the canonical token set. Theme-specific overrides are the responsibility of consuming applications.

**Implementation**:

1. **No Theme Directory in cedar-tokens**
   - Remove `tokens/themes/` entirely
   - Applications should override tokens at consumption time using their build process

2. **Application-Level Theme Overrides**
   - Each application (REI.com, docsite, etc.) maintains its own theme override files
   - Override files reference cedar-tokens values and customize as needed
   - Example structure in consuming application:
     ```
     cedar/
     ├── tokens/
     │   ├── theme-rei-membership.json
     │   └── theme-docsite.json
     └── build-config/
         └── token-override-config.js
     ```

3. **Theme Override Mechanism**
   - Applications use Style Dictionary or similar tool to merge cedar-tokens with their overrides
   - Override files only contain the tokens they need to customize
   - All other tokens fall back to cedar-tokens canonical values

4. **Membership Palette Support**
   - Membership palette colors (currently in `themes/rei-dot-com/color.json`) move to REI.com application
   - These are specific to REI's membership program branding
   - Other applications can adopt similar patterns for their specific theming needs

### Migration Path

The migration will be executed in phases to avoid breaking consumers:

#### Phase 1: Primitive, Semantic, and Platform Token Consolidation (Non-Breaking)

**Goal**: Consolidate primitive, semantic, and platform tokens without changing public API

**Steps**:

1. Create new `primitives/`, `semantic/`, and `platform/` directory structure alongside existing structure
2. Move primitive tokens from `global/` and `web/` to `primitives/`
3. Move semantic tokens from `global/` and `web/` to `semantic/`
4. Move platform tokens from `web/` to `platform/web/`
5. Create alias files in old locations that reference new locations
6. Update `index.json` to include both old and new paths temporarily
7. Run full test suite to ensure no breaking changes
8. Document deprecation of old paths

**Risk**: Low (backward compatible via aliases)

#### Phase 2: Component Token Migration (Breaking Change)

**Goal**: Move component tokens to Cedar component repository

**Steps**:

1. Move component token files to Cedar component repo
2. Update cedar-tokens `index.json` to remove component token references
3. Cedar component repo updates its build process to consume component tokens locally
4. Publish major version bump for cedar-tokens (v2.0.0)
5. Cedar component repo publishes coordinated major version bump
6. Coordinate rollout with consuming applications

**Risk**: High (requires coordination across repositories)
**Mitigation**: Provide migration guide and support for consuming applications

#### Phase 3: SCSS Mixin Migration (Breaking Change)

**Goal**: Move SCSS mixins to Cedar component repository

**Steps**:

1. Move SCSS mixin files to Cedar component repo
2. Update Cedar component repo's SCSS import paths
3. Remove `/utilities/` from cedar-tokens
4. Publish minor version bump for cedar-tokens (v2.1.0)
5. Cedar component repo publishes minor version bump
6. Update consuming applications to import mixins from Cedar instead of cedar-tokens

**Risk**: Medium (affects SCSS imports)

#### Phase 4: Cleanup (Non-Breaking)

**Goal**: Remove temporary aliases and finalize structure

**Steps**:

1. Remove alias files from old directory locations
2. Remove old empty directories
3. Update documentation to reflect new structure
4. Publish patch version bump for cedar-tokens (v2.1.1)
5. Archive migration guide

**Risk**: Low (cleanup only)

#### Phase 5: Cleanup (Non-Breaking)

**Goal**: Remove temporary aliases and finalize structure

**Steps**:

1. Remove alias files from old directory locations
2. Remove old empty directories
3. Update documentation to reflect new structure
4. Publish patch version bump for cedar-tokens (v2.2.1)
5. Archive migration guide

**Risk**: Low (cleanup only)

### Backward Compatibility Strategy

During Phase 1, we will maintain backward compatibility through alias files:

```json
// tokens/global/color.json (temporary alias)
{
  "$extends": ["../primitive/color.json"]
}
```

This allows consumers to continue using old import paths while we transition them to new paths.

### Consumer Migration Guide

We will provide a migration guide for consuming applications:

1. **Foundation Token Imports**
   - Old: `@import 'cedar-tokens/tokens/...'`
   - New: `@import 'cedar-tokens/tokens/primitive/color'`

2. **Component Token Imports**
   - Old: `@import 'cedar-tokens/tokens/...'`
   - New: `@import '@rei/cedar/components/button/tokens'`

3. **SCSS Mixin Imports**
   - Old: `@import 'cedar-tokens/dist/docsite/scss/utilities/cdr-type-mixins'`
   - New: `@import '@rei/cedar/utilities/cdr-type-mixins'`

4. **Theme Overrides**
   - Old: Reference `cedar-tokens/tokens/themes/rei-dot-com/color`
   - New: Create local theme override file in application

## Consequences

### Positive

- **Clear separation of concerns** between primitive, semantic, and component tokens
- **Reduced token repository scope** to only platform-agnostic design primitives
- **Better maintainability** with co-located component tokens and SCSS in Cedar
- **Flexible theming** model that doesn't pollute shared token repository
- **Alignment with industry best practices** for design token architecture
- **Easier onboarding** for new developers with intuitive directory structure

### Negative

- **Breaking changes** for consuming applications (mitigated through phased migration)
- **Coordination overhead** with Cedar component repository team
- **Temporary complexity** during migration period with both old and new structures
- **Documentation updates** required across multiple repositories

### Risks

- **Consumer adoption**: Applications may delay upgrading to new structure
  - **Mitigation**: Provide comprehensive migration guide and support
- **Coordination failure**: Cedar component repo may not align with timeline
  - **Mitigation**: Establish clear ownership and communication channels
- **Theme complexity**: Applications may struggle with local theme override setup
  - **Mitigation**: Provide theme override templates and examples

## Sign-Off

- **Author**: Cedar Design System Team
- **Date**: August 2026
- **Status**: Revision
- **Next Review**: After Phase 1 completion

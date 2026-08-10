# ADR 001: Token Directory Structure Reorganization

## Status

**Accepted**

## Context

The current token directory structure in cedar-tokens has evolved without a clear architectural architeral convention, resulting in scattered foundation tokens across multiple directories (`global/`, `web/`, `themes/`). This structure makes it difficult to:

1. Identify which tokens are foundation vs. component-specific
2. Maintain clear boundaries between platform-agnostic and platform-specific tokens
3. Support theme overrides in a consistent manner

Current structure issues:

- Foundation tokens (color, spacing, typography) split between `global/` and `web/`
- Component tokens (button, link, input) mixed with foundation tokens in `global/`
- Theme-specific overrides (`themes/rei-dot-com/`, `themes/docsite/`) contain foundation tokens
- SCSS utilities contain implementation details that should live in Cedar
- No clear canonical structure aligned with modern design token best practices

## Decision

We will reorganize the token directory structure to align with a canonical design token architecture that separates concerns by function rather than platform. The new structure will enable clear separation between:

1. **Foundation tokens** - Platform-agnostic design primitives
2. **Semantic tokens** - Contextual design tokens
3. **Component tokens** - Component-specific design tokens (moved to Cedar)
4. **Theme tokens** - Theme-specific overrides (moved to Cedar or consuming applications)

### Target Directory Structure

```
cedar-tokens/
├── tokens/
│   ├── options/                    # Raw design token values (primitives)
│   │   ├── color.json             # Color palette values
│   │   ├── spacing.json           # Spacing scale values
│   │   ├── typography.json       # Font family, size, weight, spacing values
│   │   ├── motion.json           # Duration and timing function values
│   │   └── radius.json           # Border radius values
│   │
│   ├── foundation/                # Platform-agnostic foundation tokens
│   │   ├── color.json            # Semantic color tokens (text, icon, background, border)
│   │   ├── spacing.json          # Spacing system tokens (static, fluid, inset)
│   │   ├── typography.json       # Typography scale tokens (type scale, line-height)
│   │   ├── motion.json           # Motion tokens (duration, timing)
│   │   ├── prominence.json       # Shadow/prominence tokens
│   │   └── radius.json           # Border radius tokens
│   │
│   ├── web/                       # Web-specific foundation tokens
│   │   ├── typography.json       # Web-specific composite typography tokens
│   │   └── breakpoints.json      # Web-specific breakpoint tokens
│   │
│   └── index.json                 # Main entry point that references all token files
│
└── docs/
    └── adr/
        └── 001-token-directory-structure-reorganization.md
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

#### Phase 1: Foundation Token Consolidation (Non-Breaking)

**Goal**: Consolidate foundation tokens without changing public API

**Steps**:

1. Create new directory structure alongside existing structure
2. Move foundation tokens from `global/` and `web/` to new locations
3. Create alias files in old locations that reference new locations
4. Update `index.json` to include both old and new paths temporarily
5. Run full test suite to ensure no breaking changes
6. Document deprecation of old paths

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

#### Phase 4: Theme Token Removal (Breaking Change)

**Goal**: Remove theme-specific tokens from cedar-tokens

**Steps**:

1. REI consuming applications and Docsite use Cedar local theme override files
2. Remove `tokens/themes/` directory from cedar-tokens
3. Publish minor version bump for cedar-tokens (v2.2.0)
4. REI.com and docsite teams deploy updated theme implementations

**Risk**: Medium (requires application changes)

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
  "$extends": ["../foundation/color.json"]
}
```

This allows consumers to continue using old import paths while we transition them to new paths.

### Consumer Migration Guide

We will provide a migration guide for consuming applications:

1. **Foundation Token Imports**
   - Old: `@import 'cedar-tokens/tokens/...'`
   - New: `@import 'cedar-tokens/tokens/foundation/color'`

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

- **Clear separation of concerns** between foundation, semantic, and component tokens
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

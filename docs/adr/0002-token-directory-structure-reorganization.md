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

Platform artifacts (CSS, Swift, XML, etc.) are generated outputs under `dist/`, not source directories.

**Key architectural principle**: The token repository owns only platform-agnostic token definitions (primitives, semantic). Component token maps are platform-specific and belong to their respective Cedar implementations (Cedar web, Cedar iOS, Cedar Android).

### Target Directory Structure

```
cedar-tokens/
├── tokens/
│   ├── primitives/                 # Raw design token values
│   │   ├── color/
│   │   │   └── palette.json      # Color palette values
│   │   ├── spacing/
│   │   │   ├── space.json      # Spacing values
│   │   │   ├── inset.json      # Inset values
│   │   │   └── scale.json      # Scale values
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
```

### What Moves to Cedar Implementations

The following items will be moved from cedar-tokens to Cedar platform implementations:

**1. SCSS Mixins and Utilities**

- `cdr-breakpoint-mixins.scss` → Cedar web (@rei/cedar-styles)
- `cdr-display-mixins.scss` → Cedar web (@rei/cedar-styles)
- `cdr-type-mixins.scss` → Cedar web (@rei/cedar-styles)

**Rationale**: These are web-specific implementation details. They should live in Cedar web, not the platform-agnostic token repository.

**2. Web-Specific Foundations**

- Breakpoint values and breakpoint mixins → Cedar web (@rei/cedar-styles)
- Composite text/typography styles → Cedar web (@rei/cedar-styles)

**Rationale**: Web-specific and composite concerns are implementation details that belong to Cedar web, not the canonical token repository.

**3. Component Token Maps**

- Component token maps from `tokens/global/` → Cedar web
- Component token maps from `tokens/global/` → Cedar iOS (platform-specific bindings)
- Component token maps from `tokens/global/` → Cedar Android (platform-specific bindings)

**Rationale**: Component token maps are platform-specific (different states, tokens, APIs per platform). Cedar web produces flat CSS variables, data-attribute selectors, Sass maps, and three-tier fallback. Cedar iOS and Android have their own component token bindings. The token repository should only contain platform-agnostic primitives and semantic tokens.

### Output Matrix

| Domain Family                                       | Token Repo Output                     | Cedar Web Output                                                                                                | Cedar iOS Output                     | Cedar Android Output                 |
| --------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| Primitives (color, space, radius, typography atoms) | CSS, SCSS, JS, TS, JSON               | —                                                                                                               | —                                    | —                                    |
| Semantic tokens (text colors, surface colors, etc.) | CSS, SCSS, JS, TS, JSON               | —                                                                                                               | —                                    | —                                    |
| Web-specific atoms (web fluid, font stacks)         | Web-only module, not in public barrel | —                                                                                                               | —                                    | —                                    |
| Breakpoints                                         | Optional dimension reference or none  | Mixins, utility classes, CSS vars                                                                               | Platform-specific breakpoints        | Platform-specific breakpoints        |
| Composite text styles                               | No                                    | Components / cedar-styles                                                                                       | Platform-specific text styles        | Platform-specific text styles        |
| Component token maps                                | No                                    | Component maps (nested variant/state) → flat CSS vars, data-attribute selectors, Sass maps, three-tier fallback | Platform-specific component bindings | Platform-specific component bindings |
| Component variable types                            | No                                    | Cedar / cedar-types                                                                                             | Platform-specific types              | Platform-specific types              |

**Default entrypoint contract**: The public barrel (@rei/cdr-tokens/css, /scss, /types) includes only cross-platform primitives and semantic tokens. Component token maps, web-only values, and utilities are platform-specific and owned by respective Cedar implementations.

### Migration Path

The migration will be executed in phases to avoid breaking consumers:

#### Phase 1: Primitive and Semantic Token Consolidation (Non-Breaking)

**Goal**: Consolidate primitive and semantic tokens without changing public API

**Steps**:

1. Create new `primitives/` and `semantic/` directory structure alongside existing structure
2. Move primitive tokens from `global/` and `web/` to `primitives/`
3. Move semantic tokens from `global/` and `web/` to `semantic/`
4. Create alias files in old locations that reference new locations
5. Run full test suite to ensure no breaking changes
6. Document deprecation of old paths

**Risk**: Low (backward compatible via aliases)

#### Phase 2: Component Token Map Migration (Breaking Change)

**Goal**: Move component token maps to Cedar platform implementations

**Steps**:

1. Move component token maps from `tokens/global/` to Cedar web
2. Cedar web implements nested variant/state structure for component maps
3. Cedar web generates flat CSS variables, data-attribute selectors, Sass maps, and three-tier fallback
4. Remove component token files from cedar-tokens
5. Publish major version bump for cedar-tokens (v2.0.0)
6. Cedar web publishes coordinated major version bump
7. Update consuming applications to use Cedar-generated component CSS

**Risk**: High (requires coordination across repositories)
**Mitigation**: Provide migration guide and support for consuming applications

#### Phase 3: SCSS Mixin and Web-Specific Migration (Breaking Change)

**Goal**: Move SCSS mixins and web-specific foundations to Cedar web

**Steps**:

1. Move SCSS mixin files to Cedar web (@rei/cedar-styles)
2. Move breakpoint values and mixins to Cedar web (@rei/cedar-styles)
3. Move composite text/typography styles to Cedar web (@rei/cedar-styles)
4. Remove `dist/<theme>/scss/utilities/` from cedar-tokens
5. Remove `tokens/web/` directory from cedar-tokens (breakpoints, composite typography)
6. Publish minor version bump for cedar-tokens (v2.1.0)
7. Cedar web publishes coordinated minor version bump
8. Update consuming applications to import mixins from Cedar web instead of cedar-tokens

**Risk**: Medium (affects SCSS imports)
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

3. **Component Token Map Imports (Web)**
   - Old: `@import 'cedar-tokens/tokens/global/button'`
   - New: Import from Cedar web (Cedar web owns component token maps)
   - Note: Component token maps are platform-specific and owned by Cedar implementations

4. **SCSS Mixin Imports (Web)**
   - Old: `@import 'cedar-tokens/dist/docsite/scss/utilities/cdr-type-mixins'`
   - New: `@import '@rei/cedar-styles/utilities/cdr-type-mixins'`

5. **Breakpoint Imports (Web)**
   - Old: `@import 'cedar-tokens/tokens/web/breakpoints'`
   - New: `@import '@rei/cedar-styles/breakpoints'`

6. **Component CSS (Web)**
   - Old: Import from cedar-tokens dist output
   - New: Import from Cedar web (Cedar web generates CSS from component token maps)

7. **Component Token Bindings (iOS/Android)**
   - Old: Import from cedar-tokens (if applicable)
   - New: Import from Cedar iOS / Cedar Android (platform-specific bindings)

## Consequences

### Positive

- **Clear separation of concerns** between platform-agnostic tokens (primitives, semantic) and platform-specific implementations
- **Reduced token repository scope** to only platform-agnostic token definitions
- **Platform artifacts properly treated as generated outputs** under `dist/`
- **Better maintainability** with implementation concerns in respective Cedar implementations
- **Platform-specific flexibility** - Each Cedar platform (web, iOS, Android) can optimize component token bindings for their needs
- **Alignment with industry best practices** for design token architecture
- **Easier onboarding** for new developers with intuitive directory structure
- **Platform-agnostic token repository** can be consumed by any platform without web-specific assumptions

### Negative

- **Breaking changes** for consuming applications (mitigated through phased migration)
- **Coordination overhead** with Cedar web, iOS, and Android teams
- **Temporary complexity** during migration period with both old and new structures
- **Documentation updates** required across multiple repositories
- **Component token map migration** requires all Cedar platforms to implement their own bindings
- **Potential divergence** between platform-specific component token implementations

### Risks

- **Consumer adoption**: Applications may delay upgrading to new structure
  - **Mitigation**: Provide comprehensive migration guide and support
- **Coordination failure**: Cedar web, iOS, Android may not align with timeline
  - **Mitigation**: Establish clear ownership and communication channels
- **Platform-specific complexity**: Cedar platforms may struggle with implementing their own component token bindings
  - **Mitigation**: Provide implementation templates and examples for each platform
- **Inconsistent component token bindings**: Different platforms may implement component tokens inconsistently
  - **Mitigation**: Establish cross-platform guidelines and review process

## Sign-Off

- **Author**: Cedar Design System Team
- **Date**: August 2026
- **Status**: Revision
- **Next Review**: After Phase 1 completion

## Vocabulary

- **Primitive tokens**: Raw design token values (color palette, spacing scale, typography primitives)
- **Semantic tokens**: Contextual design tokens that reference primitives
- **Platform artifacts**: Generated outputs (CSS, Swift, XML, etc.) under `dist/`, not source directories
- **Cedar web**: Web implementation that consumes primitives/semantic tokens and generates component token maps, CSS, SCSS mixins, utilities
- **Cedar iOS**: iOS implementation that consumes primitives/semantic tokens and creates platform-specific component token bindings
- **Cedar Android**: Android implementation that consumes primitives/semantic tokens and creates platform-specific component token bindings
- **Platform-agnostic**: Token definitions that work across all platforms without platform-specific assumptions
- **Platform-specific**: Implementation details that vary by platform (component token maps, breakpoints, composite styles)

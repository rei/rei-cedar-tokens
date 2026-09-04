# Future-State Proposal

## Bottom Line

**Adopt the spike's semantic token model — corrected to the taxonomy below — combined
with mainline's build orchestration, modular distribution, package exports, and
TypeScript generation.** The token names, canonical paths, filter definitions, and
type-generation inputs for `color` need to be rebuilt against the corrected grammar;
the mainline distribution/export layer does not need to change shape to do this.

**This taxonomy covers `color` only.** It is a semantic _color_ taxonomy, not a
general-purpose token grammar. Other foundations (`radius`, `spacing`, `typography`,
`motion`, `size`, `shape`) have their own, more primitive semantic structures and are
explicitly out of scope for this proposal. They keep their current naming until a
separate effort defines whether/how each one gets a semantic layer.

---

## Taxonomy Correction

The spike's `ADR-0004` grammar (`color.<intent>[.<family>][.<variant>]`) and the
historical `semantic-taxonomy-confluence.md` notes are **superseded** by the "Cedar
Semantic Taxonomy — Discovery & Alignment" document supplied by design/architecture
stakeholders. All recommendations below use the corrected five-tier model.

**Scope: this taxonomy is a semantic model for `color` only.** It has not been worked
through for any other foundation. `size`, `shape`, `radius`, `spacing`, `typography`,
and `motion` tokens are **out of scope** for this model and must keep their current
naming/structure until a separate, dedicated design/architecture effort decides how (or
whether) each of those foundations gets a semantic layer. Radius, spacing, etc. tend to
have a much more primitive semantic structure than color and should not be assumed to
map onto this same five-tier shape.

```
color[.INTERACTION FAMILY].ROLE.IDENTITY[.EXPRESSION]
```

| Tier                   | Values                                                                                                                                          | Notes                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Foundation**         | `color`                                                                                                                                         | Scoped to color only — see scope note above. Not a template for other foundations. |
| **Interaction Family** | `action` \| `feedback` \| `selection` \| `control`                                                                                              | **Optional.** Omitted = universal/foundation-only context.                         |
| **Role**               | `surface` \| `text` \| `border` \| `icon`                                                                                                       | Required.                                                                          |
| **Identity**           | `brand` \| `accent` \| `warning` \| `success` \| `sale` \| `trigger` \| `neutral` \| `natural` \| `info` \| `membership` \| `rating` \| `error` | Required.                                                                          |
| **Expression**         | `trace` \| `faint` \| `subtle` \| `base` \| `prominent` \| `bold` \| `intense`                                                                  | **Optional.** `base` is an omission default, never a literal suffix.               |

Key rules:

- **Omission is not a value.** There is no `universal` interaction family and no
  literal `base` segment. `color.surface.brand` means `color.surface.brand.base`.
- **Expression, as defined here, is a color-hierarchy concept**, not a generic
  cross-foundation primitive. Whether an analogous prominence/emphasis scale makes
  sense for other foundations (e.g. spacing rhythm, radius prominence) is an open
  question, not a decided extension — see `05-open-questions.md`. Until that is
  decided, other foundations keep their existing naming.
- **Icon is its own role**, not mirrored from text.
- **`inverse` and `link` are not identities.** A dark/inverse variant is
  `identity: neutral` at an `intense`/`bold` expression. A link is `identity: trigger`.
- **States are not in the token path.** `rest`/`hover`/`focus`/`active`/`disabled`/`selected`
  are resolved via Figma variable modes or platform metadata, not by adding state
  segments to the token name.

This corrects the prior mixing of "role" and "interaction family" seen in the spike's
module list in
<ref_snippet file="/Users/mhewson/Code/REI/rei-cedar-token-pipeline-spike/src/build/token-output-utils.ts" lines="42-108" />
(`cdr-color-surface`, `cdr-color-text`, `cdr-color-border`, `cdr-color-action`,
`cdr-color-selection`, `cdr-color-feedback`, ...) — that list conflates `role` with
`interaction-family` and would produce incorrect names under the confirmed grammar.

---

## 1. Token Path Grammar

```
color[.<interaction-family>].<role>.<identity>[.<expression>]
```

Canonical examples:

```
color.surface.brand                 (universal surface, brand, base expression)
color.action.surface.brand.faint    (action surface, brand, faint)
color.feedback.text.warning.bold    (feedback text, warning, bold)
color.icon.trigger                  (universal icon, trigger, base)
color.control.border.neutral        (control border, neutral, base)
```

**This grammar applies to `color` only.** `radius`, `spacing`, `typography`, `motion`,
`size`, and `shape` tokens are not touched by this proposal and should continue to use
their current mainline naming/structure (e.g. existing `radius`/`space` foundation
modules per ADR-0001) until a separate taxonomy effort is scoped for each of them.

## 2. Module Boundary Recommendation

**Recommended module grouping: by Foundation + Role**, not by interaction family,
because Interaction Family and Expression are optional segments and role is the most
stable, CSS-property-aligned grouping:

| Module          | Contains                                                         |
| --------------- | ---------------------------------------------------------------- |
| `color-surface` | `color[.<interaction-family>].surface.<identity>[.<expression>]` |
| `color-text`    | `color[.<interaction-family>].text.<identity>[.<expression>]`    |
| `color-border`  | `color[.<interaction-family>].border.<identity>[.<expression>]`  |
| `color-icon`    | `color[.<interaction-family>].icon.<identity>[.<expression>]`    |

This matches mainline's existing foundations module set
(`color-background`/`color-text`/`color-border`/`color-icon` in
<ref_file file="/Users/mhewson/Code/REI/rei-cedar-tokens/docs/adr/0001-modular-output-architecture.md" />
§Domain Families), so the module boundary itself is largely reusable — only the token
membership within each module changes.

### Token name generation rules

- Omit `base` expression.
- Omit interaction family when absent.
- Produce PascalCase object keys and kebab-case CSS variables:

| Canonical path                     | JS/TS object key                  | CSS variable                             |
| ---------------------------------- | --------------------------------- | ---------------------------------------- |
| `color.surface.brand`              | `CdrColorSurfaceBrand`            | `--cdr-color-surface-brand`              |
| `color.action.surface.brand.faint` | `CdrColorSurfaceActionBrandFaint` | `--cdr-color-action-surface-brand-faint` |
| `color.feedback.text.warning.bold` | `CdrColorTextFeedbackWarningBold` | `--cdr-color-feedback-text-warning-bold` |
| `color.text.trigger`               | `CdrColorTextTrigger`             | `--cdr-color-text-trigger`               |

Per-module literal unions and interfaces continue to follow mainline's existing
generation pattern (`*.names.d.ts` + `*.d.ts`, see ADR-0001 §"Generated Output
Example"); only the token population changes.

## 3. State Handling

State must not appear in token names. Build-time/runtime state resolution instead maps
to platform-native mode mechanisms:

- **Figma**: one variable `color.action.brand` with a `State` mode (rest, hover, focus,
  active, disabled, selected).
- **Web**: CSS custom properties resolve to the `rest` value by default; components (or
  Cedar's style layer) apply state overrides referencing state-specific values
  generated from the same variable.
- **iOS/Android**: state color lists / Compose `ColorStateList` / `ColorScheme` are
  generated by pre-computing mode values at build time.

This aligns with the spike's own state-layer ADRs
(`adr-0006-state-layer-system.md`, `adr-0016-semantic-color-and-state-architecture.md`)
and the confirmed taxonomy's explicit exclusion of state from the token path.

## 4. Legacy Mainline Token Mapping (illustrative — requires design sign-off)

Mainline's component-scoped tokens (e.g. `CdrColorBackgroundButtonPrimaryRest`) must be
**retired, not renamed**. Where a value is still semantically meaningful, it should be
re-derived from the new taxonomy, not mechanically mapped:

| Legacy token concept                    | Candidate new semantic token                                       | Notes                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `color-text-primary`                    | `color.text.natural` or `color.text.neutral`                       | Needs design audit to pick the correct identity.                                                    |
| `color-text-secondary`                  | `color.text.neutral.faint` / `color.text.natural.faint`            | Lower prominence via expression, not a new identity.                                                |
| `color-text-brand`                      | `color.text.brand`                                                 | Direct identity mapping.                                                                            |
| `color-text-sale`                       | `color.text.sale`                                                  | Direct identity mapping.                                                                            |
| `color-text-inverse`                    | `color.text.neutral` at `intense`/`bold` on a dark surface context | Not an identity — a usage context.                                                                  |
| `color-text-link`                       | `color.text.trigger`                                               | Identity is `trigger`.                                                                              |
| `color-background-button-primary-rest`  | `color.action.surface.brand`                                       | State is a mode, not a token suffix.                                                                |
| `color-background-button-primary-hover` | Same variable, `hover` mode                                        | Resolved at build/usage layer.                                                                      |
| `color-background-modal-overlay`        | `color.overlay` (tentative)                                        | Whether `overlay` is a role or interaction context needs confirmation — see `05-open-questions.md`. |
| `*-disabled` tokens                     | State mode on the base semantic token                              | Not a separate identity.                                                                            |

This table is a starting point for the design/engineering token-mapping workshop in the
migration plan, not a final mapping.

## 5. Architectural Changes Required in Mainline's Pipeline

All of the following are scoped to the `color` foundation only, unless noted otherwise.

1. **Canonical `tokens.json` shape** — reshape the canonical color tree so that
   `surface`/`text`/`border`/`icon` are roles and `action`/`feedback`/`selection`/`control`
   are optional interaction-family segments, rather than mixed top-level groupings.
   Non-color foundation trees (`radius`, `spacing`, `typography`, `motion`, etc.) are
   left untouched by this change.
2. **Module registry** — regenerate the color-related entries in
   `foundationsModulesName`/module definitions from a schema-driven list of Role ×
   Identity, not a hard-coded list mixing old and new concepts. Non-color foundation
   modules (`radius`, `space`, `motion-duration`, `motion-timing`, `prominence`, text
   modules, etc.) keep their current definitions unchanged. Delete
   `componentModulesName` and the component domain family entirely (phased — see
   migration plan) — this is a separate cleanup, not dependent on the color taxonomy.
3. **Filter layer** — rewrite `style-dictionary/filters/foundations/color-*` to match
   role/identity/expression instead of the current domain list; remove component
   filters. All other `style-dictionary/filters/foundations/*` files (radius, space,
   text, motion, breakpoint, prominence, etc.) are unaffected.
4. **Type generation** — `typescript/module-interface` and `typescript/token-name-union`
   formats must handle optional intermediate segments (interaction family, expression)
   and correctly omit `base`.
5. **CSS custom property output** — fix the duplicate hex+OKLCH declaration defect
   (see `01-architecture-review.md` §D) and align variable names to the corrected
   grammar.
6. **Validation** — `validate-contract.ts` and `canonical-contract.test.ts` must enforce
   the five-tier grammar instead of the ADR-0004 rules.

## 6. What Does _Not_ Change

- Package export surface: `@rei/cdr-tokens/types`, `/css`, `/scss`, theme-scoped deep
  paths.
- Single-pass Style Dictionary orchestration across `theme × platform`.
- `TokenDictionary` typed runtime contract direction (still planned, per ADR-0001).
- `validateExportMap()` CI guard mechanism.
- Theme model (`rei-dot-com`, `docsite`) and palette-as-context-override mechanism.
- **All non-color foundations** (`radius`, `spacing`, `typography`, `motion`, `size`,
  `shape`) — naming, canonical shape, filters, and module definitions for these are
  unaffected by this proposal and are not implied to be moving to this taxonomy.

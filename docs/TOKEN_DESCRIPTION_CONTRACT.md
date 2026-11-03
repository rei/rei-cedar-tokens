# Token Description Contract

Cedar design decisions across Figma, code, documentation, and automation.

**Core principle:** A description should carry the minimum shared semantic
context necessary to make the next decision wherever the token is encountered.

This document defines what the Figma variable `description` field is for, why
each class of information belongs where it does, the grammar it must follow, and
how descriptions are generated, validated, and consumed.

## 1. Principle

A description should help a consumer make the next decision, not explain every
decision Cedar has already made.

The description carries the minimum shared semantic context needed to choose a
token wherever that token is encountered. The same guidance can appear as a
Figma tooltip for designers, generated JSDoc and TypeScript IntelliSense for
developers, reference content for documentation, and deterministic context for
automated consumers.

Shared and concise are equally important. A tooltip is a point-of-decision
surface, not a reference page. Long descriptions become uncomfortable to read,
obscure the variable list, and can turn repeated hover behavior into an
annoyance. Character limits are therefore part of the contract, not a formatting
preference.

The goal is not to put the entire specification in the tooltip. The goal is to
make the essential specification travel with the decision.

## 2. Information placement

Not all useful token information belongs in a variable description. Cedar places
information according to the decision it should support.

| Consumer question                             | System surface                 | Responsibility                                                           |
| --------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| What is this?                                 | Summary                        | Identify the decision in plain language.                                 |
| When should I choose it?                      | Usage                          | Define the semantic selection boundary.                                  |
| What nuance is necessary to use it correctly? | Guidance                       | Provide rare, shared guidance that does not fit usage.                   |
| What decisions belong together?               | UI intent collection           | Represent compositions such as surface, text, emphasis text, and border. |
| Is the composition accessible and valid?      | Computed metadata and CI       | Validate Cedar-defined relationships before consumers use them.          |
| Why is it valid, and what is the evidence?    | Generated docs or plugin panel | Expose contrast results, bindings, aliases, and diagnostic detail.       |
| What replaces an obsolete decision?           | Deprecation fields             | Provide migration guidance at the point of encounter.                    |

This creates an intentional progression: choose → compose → validate → inspect.
The description field serves the first responsibility and limited parts of the
last. It does not need to carry every responsibility.

## 3. Why contrast and pairing rules are not descriptions

Accessibility information benefits consumers, but calculating and interpreting
accessibility requirements should not become the consumer's responsibility every
time a token is selected.

A tooltip containing pass/fail labels, ratios, and pairing warnings exposes
Cedar's decision model without resolving the decision. It effectively gives the
consumer ingredients and asks the consumer to determine which combinations are
safe.

Where Cedar defines a composition, Cedar should validate that composition. For
example, a Primary UI intent may compose a default surface, default text,
emphasis text, and default border. The relationships are represented
structurally, their resolved values are validated by Cedar, and the detailed
evidence remains inspectable in generated reference surfaces.

> **Design-system position:** Cedar should provide accessible design decisions,
> not merely expose enough data for consumers to construct them.

## 4. Audiences and shared value

- **Design:** reads concise selection guidance in the Figma variable tooltip.
- **Development:** reads the same semantic guidance through generated JSDoc and
  TypeScript IntelliSense.
- **Documentation:** reuses canonical metadata rather than asking Design or
  Engineering to rewrite the same specification.
- **Automated consumers:** parse a small deterministic grammar without treating
  free-form prose as structured data.

The contract eliminates duplicate specification, not the need for richer
documentation. Defining the decision once supplies the shared core; generated
reference surfaces add examples, evidence, implementation detail, and broader
system explanation.

A small deterministic grammar keeps descriptions easy for people to scan,
straightforward to validate, and unambiguous for automated consumers.

## 5. Description content

Descriptions contain local, actionable context about the variable itself:

- **Summary:** a brief statement of what the token is.
- **Usage:** the semantic selection condition and, where useful, the UI intent
  it participates in.
- **Guidance:** optional shared nuance necessary to apply the decision
  correctly and not expressible in usage.
- **Legacy:** the legacy `--cdr-*` token replaced by a deprecated token.
- **Migrate to token:** the canonical replacement path for a deprecated token.
- **Removed in:** the version in which a deprecated token is removed.
- **Reason:** why a token was deprecated.

## 6. Grammar

A description is UTF-8 text with an unprefixed leading summary followed by
`key: value` lines, one per line:

```
<summary line>
usage: <selection condition>
[guidance: <shared nuance>]
[Legacy: --cdr-<legacy-token-name>]
[migrateToToken: <canonical-token-path>]
[removedIn: <version>]
[reason: <deprecation reason>]
```

### Fields

| Field             | Required            | Limit      | Tooltip   | Purpose                                                                             |
| ----------------- | ------------------- | ---------- | --------- | ----------------------------------------------------------------------------------- |
| summary           | Semantics & intents | ≤80 chars  | Lead text | What this token is.                                                                 |
| `usage:`          | Semantics & intents | ≤120 chars | Yes       | The condition under which this token is appropriate; may include intent membership. |
| `guidance:`       | Optional            | ≤120 chars | Yes       | Rare shared nuance that cannot be folded into usage.                                |
| `Legacy:`         | Deprecated only     | —          | Yes       | Legacy `--cdr-*` token this decision replaces.                                      |
| `migrateToToken:` | Deprecated only     | —          | Yes       | Canonical path of the replacement token.                                            |
| `removedIn:`      | Deprecated only     | —          | Yes       | Version in which the token is removed.                                              |
| `reason:`         | Deprecated only     | ≤120 chars | Yes       | Why the token was deprecated.                                                       |

The total visible description should normally remain within three concise lines
for an active semantic token: summary, usage, and only when necessary, guidance.
Deprecation metadata is an intentional exception because migration help is
needed where obsolete tokens are encountered.

### Selection boundary rule

The `usage` field defines the semantic selection boundary of the token: the
state, surface, role, or emphasis condition that makes the decision appropriate.
A precise inclusion condition should make most exclusions implicit.

```
Faint neutral control border
usage: Low-emphasis boundary for disabled or subdued controls
```

Avoid treating usage as a component inventory:

```
Avoid: usage: For disclosure dividers in open states, or disabled control boundaries
```

Component bindings are evidence used to derive or verify intent, but the
authored description should express the reusable semantic condition behind
those bindings.

## 7. Content that must not appear in descriptions

- **Accessibility results:** no `AAA:`, `AA:`, pass/fail symbols, contrast
  ratios, or "large text only" guidance. Contrast is computed and surfaced
  elsewhere.
- **Pairing instructions:** no "use with X," "avoid on Y," or equivalent prose.
  Relationships belong in UI intents.
- **Resolved hex, pixel, or other raw values:** the value is already available
  in Figma and generated outputs; duplication creates drift.
- **Component inventories:** usage describes the selection condition, not every
  current binding.
- **Platform-specific implementation instructions:** these belong in platform
  documentation, APIs, types, or examples.
- **Multi-paragraph prose:** anything a tooltip makes difficult to scan is
  misplaced.
- **Exhaustive examples:** examples belong in reference documentation unless one
  short example is essential to disambiguate the decision.

## 8. Layer policy

| Layer               | Description policy                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives          | Blank, or one short summary naming the raw value's role, such as "Core brand spruce." No usage field.                                           |
| Semantics           | Full grammar. Summary and usage are required; guidance is rare; include the deprecation block when applicable.                                  |
| UI intents          | Summary names the intent. Usage identifies the semantic roles composed by the intent. Detailed validation evidence remains outside the tooltip. |
| Component variables | Blank by default when semantic intent is inherited. Populate only when the component narrows or overrides the semantic meaning.                 |

## 9. Examples

Semantic token:

```
Faint neutral control border
usage: Low-emphasis boundary for disabled or subdued controls
```

Semantic token with rare shared guidance:

```
Selected control foreground
usage: Active state of selected interactive elements - part of intent: selection
guidance: Preserve selected-state meaning across interaction states
```

Deprecated token:

```
Legacy neutral control border
usage: Previous low-emphasis control boundary
Legacy: --cdr-control-border-neutral-faint
migrateToToken: color.border.control.subdued
removedIn: 15.0.0
reason: Consolidated into the canonical subdued control role
```

UI intent:

```
Primary UI composition
usage: Composes surface/default, text/default, text/emphasis, and border/default
```

The examples illustrate the grammar and information placement. Final wording
and canonical paths must be verified against Cedar's actual taxonomy, intent
model, and deprecation map.

## 10. Policy invariants

These rules hold regardless of how the pipeline implements them:

- Descriptions are **generated, not hand-authored** — a canonical source
  produces them; Figma's field is a render target. Hand edits are drift and are
  overwritten on next sync.
- Contrast is **computed, not authored** — pairing validity is validated by the
  system and its evidence inspectable in generated reference surfaces, never
  written into descriptions.
- Every contract violation is detectable mechanically: field limits, forbidden
  patterns, required-field presence, and grammar conformance are all lintable.
- A semantic description that parses to **zero summary** (all lines consumed by
  structured keys) is a build failure — this is the guard that catches a Figma
  sync wiping human prose with annotation text.

## 11. Open questions

- **`guidance:` parser support** — this contract adopts `guidance:` as the key
  for shared nuance. The normalization parser currently recognizes `design:`;
  adopting this contract requires adding `guidance` to the recognized keys and
  rendering path, and migrating existing `design:` content. Design-only
  workflow instruction should move to design documentation instead.
- `codeSyntax`: it is currently extracted into extensions and later dropped
  downstream. Either propagate it for a defined consumer or remove it from
  export.
- `aliases`: not part of the authoring grammar. Decide whether it remains as
  generated metadata, for example when derived from `Legacy`.
- Tooltip budget: retain the per-field limits and add a total-description lint
  if real Figma usage shows that independently valid lines still produce an
  uncomfortable tooltip.
- `intents:` membership is expressed inline in `usage:` text rather than as its
  own grammar key. Promote it to a key only if a consumer needs it parsed
  structurally.

---

## Appendix A. Figma agent prompt — description refactor

```
You are refactoring the description field of variables in the Figma semantic
color library so they conform to a strict contract. The description renders as
a hover tooltip for designers and as JSDoc/IntelliSense for developers. It is
concise, shared, user-facing selection guidance, not a data dump.

SCOPE
- Process only variables in semantic collections and the UI intents collection,
  if present.
- Do not modify primitive collections.
- Do not modify component descriptions unless they contain forbidden content or
  the component narrows or overrides semantic meaning.

PHASE 1 - INVESTIGATE TOOLKIT USAGE
Before writing any description, build a binding map from the published UI
toolkit component library:
- Traverse component nodes and read boundVariables for fills, strokes, text,
  effects, and layout properties.
- Record which components bind each semantic variable, on which property, and
  in which variant states where determinable.
- Treat these bindings as authoritative evidence of intended toolkit
  expression, not as consumer analytics.

Use the map to:
1. Ground usage in the state, surface, role, or emphasis condition that
   triggers selection.
2. Validate the variable path's implied role.
3. Detect semantic variables consistently bound together as candidate UI
   intent members.

Write usage as a reusable SELECTION CONDITION, never as a component inventory.

PHASE 2 - FLAG MISMATCHES FOR HUMAN REVIEW
- Variable path role and toolkit bindings disagree.
- A token is bound in ways that contradict its existing selection condition.
- migrateToToken cannot be determined from canonical deprecation data.
- A variable is never bound; draft from the path only and mark the usage
  unverified.
- A candidate intent grouping is inferred from bindings but is not represented
  in the canonical intent membership map.

TARGET GRAMMAR
<summary line>
usage: <selection condition>
[guidance: <shared nuance>]
[Legacy: --cdr-<token>]
[migrateToToken: <canonical.path>]
[removedIn: <version>]
[reason: <text>]

RULES
- summary: <=80 characters, sentence case, no trailing period. State what the
  token is.
- usage: <=120 characters. State the semantic selection boundary and intent
  membership where known.
- guidance: optional, <=120 characters, and only for shared nuance that cannot
  be folded into usage.
- Preserve an existing Legacy line when valid.
- For deprecated variables, derive migration fields only from canonical
  deprecation data. Do not guess.
- Prefer two concise lines for active semantic tokens. Use a third line only
  when guidance is necessary.

REMOVE UNCONDITIONALLY
- Accessibility results, AA/AAA labels, pass/fail symbols, contrast ratios,
  "large only," and pairing warnings.
- Pairing instructions such as "use with," "avoid on," or "do not pair."
- Resolved hex, pixel, and other duplicated raw values.
- Component inventories presented as usage.
- Platform-specific implementation instructions.
- Multi-paragraph prose.

OUTPUT
- Write the canonical description through the Variables API.
- Report each old-to-new description diff.
- Report Phase 2 flags separately and never resolve them by guessing.
- Preserve meaningful existing guidance by folding it into usage or guidance
  when it meets the contract.

HARD FAILURES
Refuse to write a semantic description that:
- exceeds a field limit,
- contains accessibility results or a contrast-ratio pattern,
- contains pairing instructions,
- is missing usage,
- uses guidance for information that belongs in intent structure, validation,
  or reference documentation.
```

## Appendix B. Sync and audit script outline

```
scripts/sync-descriptions.ts

1. GET local variables for the library through the Figma Variables REST API,
   using the same entry point as src/sync/figma-to-tokens.ts.

2. For each variable in semantic and intent collections:
   a. Build the expected description from repository sources:
      - summary from token-path naming rules or a curated override
      - usage from semantic selection metadata and intent membership
      - guidance from a curated shared-guidance map, only when required
      - deprecation from the canonical legacy/deprecation map
   b. Render the grammar and assert field lengths, total tooltip budget, and
      forbidden-pattern checks.
   c. Compare with variable.description after whitespace normalization.

3. Modes:
   --audit  Print diffs and violations; exit 1 on any mismatch.
   --write  PUT canonical descriptions through the API.

4. Report:
   - updated, conforming, and flagged variable counts
   - variables requiring human-authored summary, usage, or guidance
   - unverified usage derived only from token path
   - candidate intent memberships that require review

5. Persist approved exceptions in curated repository maps so the next
   generation is deterministic.
```

## Appendix C. Migration handoff — descriptions to restore in Figma

From ADR 0006: during the CDR-3791/3792 migration, several semantic
descriptions were overwritten with structured annotation text
(`Legacy:` + contrast ratios), wiping the hand-authored prose entirely. These
are the original human descriptions from the pre-migration source
(`tokens/global/color.json` at `v14.0.0`), to be re-entered (with the new
`usage:` line added per the grammar — these summaries predate it):

| Legacy CSS var                        | Description to restore                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `--cdr-color-text-primary`            | The default, primary text color                                                                                       |
| `--cdr-color-text-secondary`          | The secondary text color                                                                                              |
| `--cdr-color-text-emphasis`           | The emphasis text color                                                                                               |
| `--cdr-color-text-brand`              | Text set in our primary brand color                                                                                   |
| `--cdr-color-text-sale`               | The color of sale text                                                                                                |
| `--cdr-color-text-inverse`            | Text color on dark background                                                                                         |
| `--cdr-color-text-disabled`           | The color of text when it is disabled                                                                                 |
| `--cdr-color-text-success`            | Color of success messages                                                                                             |
| `--cdr-color-text-warning`            | Color of warning messages                                                                                             |
| `--cdr-color-text-error`              | Color of error messages                                                                                               |
| `--cdr-color-text-info`               | Color of informational messages                                                                                       |
| `--cdr-color-icon-default`            | The default icon color                                                                                                |
| `--cdr-color-icon-emphasis`           | Emphasis or darkest icon color on a light background                                                                  |
| `--cdr-color-icon-link`               | The icon link color                                                                                                   |
| `--cdr-color-icon-disabled`           | The disabled icon color                                                                                               |
| `--cdr-color-background-transparent`  | A transparent color option                                                                                            |
| `--cdr-color-background-primary`      | The default, primary background color of most pages                                                                   |
| `--cdr-color-background-secondary`    | An alternate, secondary background color used on some pages                                                           |
| `--cdr-color-background-sale`         | Background color for sale messages                                                                                    |
| `--cdr-color-background-brand-spruce` | An alternate, spruce brand background color used on some pages                                                        |
| `--cdr-color-background-success`      | Background color for success messages                                                                                 |
| `--cdr-color-background-info`         | Background color for informational messages                                                                           |
| `--cdr-color-background-warning`      | Background color for warning messages                                                                                 |
| `--cdr-color-background-error`        | Background color for error messages                                                                                   |
| `--cdr-color-border-transparent`      | A transparent color option                                                                                            |
| `--cdr-color-border-primary`          | Default border color for separating content                                                                           |
| `--cdr-color-border-secondary`        | An alternate, secondary border color _(original appears copy-pasted from background.secondary — confirm with design)_ |
| `--cdr-color-border-success`          | Border color for success elements                                                                                     |
| `--cdr-color-border-warning`          | Border color for warning elements                                                                                     |
| `--cdr-color-border-error`            | Border color for error elements                                                                                       |
| `--cdr-color-border-info`             | Border color for informational elements                                                                               |

## Appendix D. Pipeline context (implementation detail, not contract)

Kept separate so the contract above never depends on current plumbing:

- Export: `src/tokens-export.ts` maps Figma `variable.description` to
  `$description` and `variable.codeSyntax` to `$extensions['com.figma'].codeSyntax`.
- Parse: `src/normalization/normalize-utils.ts` maps `$description` into
  `cedar.docs { summary, usage, design, aliases }` plus `deprecation` and
  `accessibility` under `$extensions.cedar`. `parseTokenAccessibility` reads
  a11y data from descriptions today; per section 10 it is superseded by
  build-time computation and should be retired once that lands. `guidance`
  must be added to `KNOWN_KEYS` (see open question 1).
  ⚠ Known parser hazard: unrecognized `key:`-shaped lines (e.g. `✗ Avoid:`)
  silently append onto whatever structured field preceded them — another
  reason forbidden patterns are a hard failure rather than a cleanup task.
- Render: `rei-cedar-token-pipeline-spike/src/build/build-style-dictionary.ts`
  renders `cedar.docs` into JSDoc and per-module `*.docs.json` artifacts.
  Computed accessibility data is not rendered into token descriptions or
  IntelliSense.

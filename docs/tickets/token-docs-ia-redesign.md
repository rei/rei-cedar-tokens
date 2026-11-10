---
status: proposed
priority: high
---

# Ticket: Token Documentation Information Architecture — Reference / Code / Examples / Changelog

## Status: architecture plan — needs human UX + architecture sign-off before implementation

## The question this answers

Where should a consumer go to understand a Cedar token, and what should they find when they get there? Today the answer is "an internal Storybook most consumers never see, showing whatever the compiled JS bundle happens to export, with no usage guidance and no distinction between the stable contract and internal implementation detail." This ticket proposes a replacement, benchmarked against `atlassian.design/components/tokens/all-tokens`.

## Key finding: we were about to fix the wrong surface

This investigation started by auditing `rei-cedar-tokens`' Storybook `Colors.stories.ts` (Palette/Semantic/By Component/Text/Border/Icon pages — see the harsh-critique session notes for the full finding list: no ADR-contract distinction between stable and internal tokens, `getDesc()` guidance text wired into only one of four pages, an unlabeled 340-swatch "Palette" wall, invisible text-color previews on white backgrounds).

That critique stands and that fix is landing separately (see "What's already in flight" below). But it's fixing the **internal QA/reference tool**, not the **consumer-facing surface**:

| Surface                                                          | Audience                                                                                     | Confirmed role                                                                                                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rei-cedar-tokens` Storybook (`stories/Colors.stories.ts`, etc.) | Cedar maintainers                                                                            | Internal reference + `SemanticDiff` review tool. Not linked from anywhere a consumer would find it.                                                     |
| `cedar-site-nuxt` (`cedar.rei.com`)                              | Real consumers (designers + developers)                                                      | **This is Atlassian's actual counterpart.** `content/tokens/index.md` + `components/tokens/Tokens*.vue` render the token tables consumers actually use. |
| `rei-cedar` Storybook                                            | Real consumers, via iframe embed in `cedar-site-nuxt` (`components/docs/DocsDemoLoader.vue`) | Consumer-facing for component demos specifically — separate problem, separate fix.                                                                      |

**Implication:** the four-tab pattern (Reference / Code / Examples / Changelog) belongs on `cedar-site-nuxt`'s token pages. Improving `rei-cedar-tokens` Storybook further than the in-flight fix is good hygiene for maintainers but does not reach the people this ticket is for.

## Current state of `cedar-site-nuxt`'s token pages (measured, not assumed)

Read directly, not inferred:

- **`content/tokens/index.md`** is genuinely good — "What are design tokens," "Why use tokens," a Do/Don't usage block, a developer "how to consume" section with real SCSS/JS code samples, a naming-structure table, a "Contract of intent" section. This is most of Atlassian's **Code** tab already written, just as one global page rather than scoped per token category.
- **`components/tokens/TokensTypeColor.vue`** (and its siblings `TokensTypeSpace`, `TokensTypeMotion`, etc.) render the actual per-token rows, and they are bare: swatch, token name, copy button, raw value. **No description, no usage guidance, no deprecation flag, no search, no filter** — despite `rei-cedar-tokens` already generating `docs.description.{what,when}` for 576 of 718 color tokens (see `token-metadata.ts` / `TOKEN_DESCRIPTION_CONTRACT.md`). The data exists upstream; this component never asks for it.
- **No "Examples" content exists for tokens** on either surface — nothing showing a token used in a realistic composition, the way Atlassian's Button/Modal examples do.
- **Changelog exists but is disconnected**: `content/whats-new/releases/*.md` is a separate site section, not scoped to the token category a consumer is currently reading, mirroring the same disconnection in `rei-cedar-tokens` Storybook's standalone `Release Notes` story.
- **Search/filter**: nothing found in `components/tokens/` matching `TokensSorter.vue`/`TokensMixinSorter.vue`'s apparent purpose beyond a basic sort — needs a closer read before Phase 1 scoping below, flagged as an open item, not assumed either way.

## Proposed IA (mapped to what we actually have, not a blind Atlassian copy)

| Tab                          | What Atlassian does                                          | What we propose                                                                                                                                                                                                                                                                                                                                                                        | Source of truth (single, no duplicate authoring)                                                                               |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Reference** ("All tokens") | Searchable table, filters, syntax toggle, description inline | Enrich `TokensTypeColor.vue` + siblings with description/usage text, a search box, and a filter for category/deprecated. Visually distinguish stable (foundations/semantic) tokens from component/palette internals — same ADR-0001 distinction driving the `rei-cedar-tokens` Storybook fix.                                                                                          | `dist/*/json/*.json` `docs` field (already generated) — pipe it into the Vue props, don't re-author in the Nuxt content layer. |
| **Code**                     | Install, API reference, syntax notes                         | Mostly exists in `content/tokens/index.md` — this is **not new work**, it needs to move from "one global page" to "surfaced per category" (or stay global with better in-page anchors, see open question below).                                                                                                                                                                       | `content/tokens/index.md`, lightly restructured.                                                                               |
| **Examples**                 | Real component patterns with runnable code and states        | New. Compose from the **Intents** work (`metadata/intents.json` + shipped `dist/*/intents/cdr-intents.mjs`) — e.g. "Primary intent → button," "Brand intent → surface" — real, shipped compositions only, not draft/unrealized intents. **Blocked on nothing for the 4 shipped intents (Primary/Secondary/Brand/Link); blocked on `TOKEN_INTENT_ROADMAP.md` Phase 2 for the other 5.** | `dist/*/intents/cdr-intents.mjs` realized slots + `metadata/intents.json` summary/usage text for the matching 4.               |
| **Changelog**                | Version history scoped to this domain, commit-linked         | Scope `content/whats-new/releases` entries by the token category they touch, surfaced inline on that category's page instead of only on the separate releases index.                                                                                                                                                                                                                   | Existing release-notes generation pipeline (`scripts/agent-config/`) — do not hand-author a second changelog.                  |

## What's already in flight (separate, don't block this ticket on it)

The `rei-cedar-tokens` Storybook `Colors.stories.ts` rebuild (contract-first grouping, ADR warnings on `By Component`/`Palette`, `getDesc()` wired into every table, intents section for the 4 shipped intents) is landing as its own change. It remains valuable as the maintainer-facing QA tool and as the generator/reference implementation this ticket's Nuxt work can borrow logic from — but it is not a substitute for this ticket.

## Open questions for UX + architecture sign-off (this is why it's a plan, not a diff)

1. **Per-category tabs vs. one global Code/Changelog page.** Real tabs (Atlassian's pattern) imply per-category content volume that may not exist yet for every token domain (Breakpoints, Motion). Recommend: start with the existing single global Code page and a single global Changelog-with-anchors; only split into true per-category tabs where content volume justifies it (Colors and Typography are the obvious first candidates).
2. **Does "Examples" show live-rendered components or code-only?** Atlassian shows both. `cedar-site-nuxt` already proves live rendering works for component docs (the `DocsDemoLoader.vue` iframe pattern) — worth reusing that mechanism rather than inventing a second one, scoped to intent compositions instead of whole components.
3. **Who owns `TokensSorter.vue`/`TokensCategory.vue`'s existing grouping logic**, and does it already support what's needed for search/filter, or does that need to be built new? Needs a read before Phase 1 is scoped into stories.
4. **Should the Reference table visually warn on non-contract tokens** (component/palette internals) the same way the `rei-cedar-tokens` Storybook fix does, given ADR 0001 explicitly says these aren't a stable surface? Recommend yes, for consistency, but this is a real content/design decision, not just an engineering one.

## Discovery findings (ux-lead, pending human sign-off)

Dispatched against the four open questions above. Full reports retained in session notes; summarized here with confidence levels — these are recommendations, not decisions.

1. **Per-category tabs vs. global page** — `content/tokens/index.md` has _zero_ category-specific content today (it's all global explanation/how-to/reference); per-category tabs would need content authored, not just reframed. **Recommend**: hybrid — stay global for now, split per-category only where content volume justifies it (Colors, Typography first). Confidence: Medium-High. Flag: token pages already fragment by _platform_ (web/ios/android via `pages/tokens/[id].vue`); adding _category_ as a second tab axis needs deliberate design so readers don't hold two independent axes in their head. Worth checking `content/guidelines/{color,motion,spacing}` for category content that could be relocated rather than authored fresh, before Phase 3.
2. **Live-rendered vs. code-only examples** — `DocsDemoLoader.vue` hardcodes the **`rei-cedar`** Storybook base URL; it has no path to `rei-cedar-tokens`' Storybook without new wiring. **Recommend**: reuse it only if intent compositions get published as real `rei-cedar` stories; otherwise code-only with an inline rendered swatch is the fallback — and may be _better_ for token-scale examples regardless (a full Storybook docs-page iframe is disproportionate for "Primary intent → button"). Confidence: Medium. **Important catch**: embedding the _internal_ `rei-cedar-tokens` Storybook on the public site would re-invert the exact internal/external boundary this ticket exists to fix — don't do that.
3. **What exists vs. must be built for Reference** — grouping/ordering/per-category nav/syntax-toggle all exist (`TokensCategory.vue`) and should be reused as-is. Search, a deprecated-token toggle (the data path already exists, just hardcoded to exclude), and `docs.description` plumbing into `TokensType*.vue` do not exist and must be built. Confidence: High on build-vs-exists; Medium on where search should live (page-level vs. category-level — resolve after Q1's IA direction, or build it as an IA-agnostic composable). Note: `TokensSorter.vue`/`TokensMixinSorter.vue` are misleadingly named — they're renderer dispatchers, not sorters or filters. Rename or document before anyone builds on top assuming otherwise.
4. **Warning on non-contract tokens** — unlike the other three, this one **is** governed by an existing doc: ADR 0001 (lines 21, 290, 323, 357-359, 377) is explicit that component/palette tokens are not a stable contract. **Recommend**: surface the fact, not the internal Storybook's alarm-toned banner — a neutral info note ("component internals; prefer foundations/semantic tokens") rather than a warning, since the site's own Do-guidance already encourages using component tokens for custom-component building. Confidence: Medium on tone (the fact is settled; the wording needs a real content/design review). Flag: palette exclusion from the default entrypoint is ADR-listed as _Planned, not Done_ — don't warn consumers off something the build still actually ships.

## Phased rollout (each phase independently shippable)

1. **Reference tab**: wire `docs.description` into `TokensTypeColor.vue` and siblings; add search/filter. Highest leverage, lowest risk — purely additive to a page that already works.
2. **Changelog scoping**: filter the existing release-notes data by token category, surface inline.
3. **Code tab refinement**: restructure `content/tokens/index.md`'s existing content per category where it already has enough material (web consumption is well covered; mobile/iOS is thinner per `docs/adr/ADR-0005.md` — don't overpromise there).
4. **Examples tab**: build once `TOKEN_INTENT_ROADMAP.md` Phase 1–2 lands for full intent coverage; the 4 already-shipped intents could start sooner as a pilot.

## Separate, smaller, already-well-scoped finding (don't fold into this ticket)

`CdrFilmstrip`'s actual Nuxt content (`content/components/filmstrip/*.md`) is thorough and well-written — purpose, do/don't, anatomy, best practices, and a complete adapter-pattern implementation guide with real code. The original "users don't understand Filmstrip usage" complaint traces specifically to the disabled live-demo embed (`CdrFilmstrip: null` in `components/docs/DocsDemoLoader.vue`) — not a documentation-content gap. Worth its own narrow ticket: either fix whatever made the Storybook embed unusable for Filmstrip, or add a live inline example directly on the Nuxt page using the existing example source (`rei-cedar/src/components/filmstrip/examples/`) instead of the iframe.

## Reference

- Evidence and screenshots from this session: `rei-cedar-tokens` Storybook `Colors.stories.ts` critique; `atlassian.design/components/tokens/all-tokens` tab structure (All tokens / Code / Examples / Changelog).
- `docs/adr/0001-modular-output-architecture.md` — stable-contract-vs-internal distinction this IA should reflect.
- `docs/adr/0007-ui-intents-manifest.md` + `docs/TOKEN_INTENT_ROADMAP.md` — Intents tab dependency.
- `docs/TOKEN_DESCRIPTION_CONTRACT.md` — where the Reference tab's description text comes from.
- `cedar-site-nuxt/content/tokens/index.md`, `cedar-site-nuxt/components/tokens/Tokens*.vue` — current state of the real target surface.

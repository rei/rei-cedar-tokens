# Token Description & Intents — Implementation Roadmap

Sequenced work plan for making the description contract (ADR 0006 +
`docs/TOKEN_DESCRIPTION_CONTRACT.md`) and the intents model (ADR 0007 +
`metadata/intents.json`) real. Ordered by dependency; each phase is
independently shippable.

## Phase 0 — Manual Figma cleanup (no code, unblock everything)

Owner: design-side, no pipeline changes.

- [ ] Strip residual accessibility strings (`✓`/`△`/`✗`, `AAA:`/`AA:`, ratios)
      from semantic variable descriptions (~3 tokens confirmed in latest
      export; audit all).
- [ ] Restore displaced prose where needed — Appendix C of the contract lists
      the pre-migration descriptions.
- [ ] Leave grammar-conforming `summary`/`usage`/`Legacy:` lines in place.

Exit: no forbidden patterns remain in semantic descriptions.

## Phase 1 — Contract conformance in the parser

- [ ] Add `guidance` to `KNOWN_KEYS` in `parseTokenDescription`
      (`src/normalization/normalize-utils.ts`) and map it into `cedar.docs`.
- [ ] Render `@guidance` in JSDoc output
      (`rei-cedar-token-pipeline-spike/.../build-style-dictionary.ts`,
      `normalizeDocs`, `*.docs.json` artifacts).
- [ ] Migrate existing `design:` content → `guidance:` where it is shared
      nuance; drop pure design-workflow text.
- [ ] Add the zero-summary lint (ADR 0006 decision 5): semantic token whose
      description parses to no `docs.summary` → build failure.
- [ ] Add forbidden-pattern lint: `AAA:`/`AA:`/`✓`/`△`/`✗`/`(N.N:1)` → fail.

Exit: contract grammar fully round-trips through the pipeline; violations
fail CI.

## Phase 2 — Intents manifest → canonical

- [ ] Review/approve `metadata/intents.json` vocabulary + slot mappings
      (incl. the `gaps` block: Disabled, Action states, Control ownership).
- [ ] Write `mergeIntents` in normalization (pattern after `mergeMetadata`):
      `metadata/intents.json` → canonical `UI` section; fail on unresolved
      aliases and unfilled slots.
- [ ] Remove `UI` as hand-edited content in `canonical/tokens.json`; it becomes
      generated from the manifest.
- [ ] Verify `intents-output.ts` emits identical dist artifacts from the
      manifest-sourced section.

Exit: `intents.json` is the sole author of the `UI` section; aliases resolve
in CI.

## Phase 3 — Computed contrast

- [ ] WCAG luminance/contrast computation over resolved token values per mode
      → `$extensions.cedar.accessibility` (replaces `parseTokenAccessibility`).
- [ ] Validate every intent composition's `text`/`icon`/`border` slot against
      its `surface` slot; failing pairs fail the build.
- [ ] Retire `parseTokenAccessibility` once computed data lands.

Exit: intent compositions are contrast-gated in CI; nothing a11y-related is
authored text.

## Phase 4 — Repo → Figma write path

- [ ] `scripts/sync-descriptions.ts` — generate canonical descriptions from
      manifest + curated overrides + deprecation map; `--audit` (diff/CI gate)
      and `--write` (Variables API PUT) modes per contract Appendix B.
- [ ] Push `metadata/intents.json` → Figma `UI intents` collection (one
      variable per slot/state, aliasing semantics; descriptions from
      `summary`/`usage`).

Exit: Figma descriptions and the intents collection are generated output;
hand edits show as audit diffs.

## Phase 5 — Usage evidence (audit only, no telemetry engine)

- [ ] Usage report script: `boundVariables` scan of the published UI toolkit +
      `var(--cdr-*)` consumption scan of rei-cedar → `usage-report.json`.
- [ ] CI check: bindings vs. declared intents — flag contradictions, unbound
      intent slots, tokens bound outside any intent.
- [ ] Optional: "Used by" tables in generated docs from the same artifact.

Exit: drift between declared intent and observed bindings is visible in CI;
manifest stays authored, evidence stays read-only.

## Later / open

- `codeSyntax`: propagate to `cedar.*` or drop (needs a consumer decision).
- `aliases:`: derived-from-`Legacy` generated field vs. manual.
- `intents:` promoted to a grammar key only if a consumer needs it parsed.
- iOS/Android realizations + evidence sources (deferred until a second
  platform exists — see ADR 0007).
- Platform mode handling for intents collection in Figma (modes vs. nested
  paths for `states`).

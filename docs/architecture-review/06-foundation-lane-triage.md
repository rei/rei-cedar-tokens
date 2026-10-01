# Foundation Lane Triage

This doc classifies every current token domain into one of three integration lanes so
the build pipeline knows how to treat it during the color-taxonomy migration described
in `03-future-state-proposal.md` and `04-migration-plan.md`.

## Lanes

| Lane                | Meaning                                                                                  | Build treatment                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Semantic**    | Gets its own right-sized taxonomy and goes through the new canonical/normalization model | New schema, new filters, new module/type generation                                                                                                              |
| **A-deferred**      | A genuine Lane A candidate, but not prioritized yet                                      | Keep generating from **current** source/filters unchanged; consumers see no difference in `dist` until this gets its own dedicated scoping pass (like color got) |
| **B — Deprecating** | Being actively phased out; no further taxonomy investment                                | Soft-deprecate in place (see mechanism decision below); remove after the deprecation window                                                                      |
| **C — Unchanged**   | Not part of this migration at all                                                        | No change of any kind                                                                                                                                            |

---

## Finding: the existing "legacy" filters are not an active mechanism

`style-dictionary/filters/legacy/*` (color-background, color-border, color-icon,
color-text, form, icon, motion, prominence, radius, space, membership palettes,
remove-categories, remove-source) are registered on the Style Dictionary instance in
`build.ts` but **are not referenced by any config** in `style-dictionary/configs/**`
(confirmed by searching `configs/**` for every legacy filter name — no matches). They
appear to be **vestigial/unused** rather than a live dual-output mechanism.

**Recommendation:** do not reuse this legacy filter layer for Lane B. Instead, use the
mechanism that is documented, tested, and already wired into transform ordering:
**soft-deprecation via the `deprecated-YYYY-RX` namespace** (`docs/DEPRECATION.md`).
This:

- keeps deprecated tokens live in normal `dist` output (no separate "legacy" bucket to
  maintain),
- stamps `deprecated: true` / year / release metadata on the token for tooling to
  surface warnings,
- requires no new build infrastructure — the `attribute/deprecated` transform already
  exists and runs first in every platform's transform list,
- matches the existing convention: "Deprecated tokens remain in all dist outputs.
  Removed tokens do not."

Open item: confirm this recommendation with whoever owns `DEPRECATION.md` / decide if
the unused `filters/legacy/*` code should be deleted as cleanup (separate from this
migration).

---

## Radius / Prominence / Motion — "A-deferred"

Decision: skip a Figma pass for now. Consumers must keep getting access to these
tokens exactly as they exist in `dist` today. If fitting these into the canonical
model would compromise the intent of the canonical/normalization layer, use an
interstitial approach rather than forcing it:

- **Preferred:** if the existing hierarchical source for radius/prominence/motion can
  be read into the canonical model losslessly (i.e. normalization can wrap/passthrough
  today's shape without renaming anything or changing output), do that now — it costs
  little and means the canonical model already "knows about" these tokens when
  dedicated scoping work starts later.
- **Fallback:** if that would force premature naming/shape decisions (e.g. inventing an
  Interaction Family or Expression tier that hasn't been validated for radius the way
  it was for color), **do not** do that. Leave radius/prominence/motion generating from
  their current source through their current filters, completely untouched, and mark
  them `A-deferred` in this table. They get their own dedicated scoping pass later,
  same rigor as color, before any renaming happens.

Either way: **no consumer-visible change** to radius, prominence, or motion tokens as
part of this migration. This is a build-internal decision about whether the canonical
model can absorb them now or later, not a decision to change their names or output
shape yet.

---

## Domain Inventory & Lane Assignment

### Color (in progress — see `03-future-state-proposal.md`)

| Domain                               | Lane | Notes                                     |
| ------------------------------------ | ---- | ----------------------------------------- |
| `color-background` / `color-surface` | A    | Already scoped — five-tier color taxonomy |
| `color-text`                         | A    | Already scoped                            |
| `color-border`                       | A    | Already scoped                            |
| `color-icon`                         | A    | Already scoped                            |

### Candidates for semantic treatment (deferred)

| Domain            | Lane       | Notes                                               |
| ----------------- | ---------- | --------------------------------------------------- |
| `radius`          | A-deferred | Skip Figma for now; see interstitial approach above |
| `prominence`      | A-deferred | Same as radius                                      |
| `motion-duration` | A-deferred | Confirmed same treatment as radius                  |
| `motion-timing`   | A-deferred | Confirmed same treatment as radius                  |

### Deprecating

| Domain                                                                                                                                                                                                                                                                                                                                                         | Lane | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `space-inset` (all `cdr-space-inset-*` tokens)                                                                                                                                                                                                                                                                                                                 | B    | Confirmed for deprecation. Apply `deprecated-YYYY-RX` wrapping per `docs/DEPRECATION.md`; do not remove until a full minor-release deprecation window has passed. **Needs**: target release identifier (e.g. `2026-R1`) and a replacement/migration note for consumers.                                                                                                                                                                                                                                                                                                                                                                               |
| **The entire `components` domain family** — `style-dictionary/filters/components/**` and its corresponding `tokens/global/{component}.json` sources: `accordion`, `button`, `chip`, `form`, `icon`, `input`, `link`, `message`, `modal`, `pagination`, `rating`, `slide`, `surface`, `surface-selection`, `switch`, `tab`, `table`, `toggle-button`, `tooltip` | B    | **Decided now, for the whole directory** — not contingent on per-domain semantic-color mapping being confirmed first, and applies to any component domain added to that directory going forward, not just the current 18. Matches Phase 4 of `04-migration-plan.md` ("Component Token Retirement"). The deprecation _classification_ is immediate; the soft-deprecation _wrapping_ can still be applied per-domain as each one's replacement semantic-color mapping is confirmed (see `03-future-state-proposal.md` §4), but no new component tokens should be added to this directory and none should be treated as a stable contract going forward. |

### Unchanged (not part of this migration)

| Domain                                                                                                    | Lane                   | Notes                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `space` / `space-scale` / `space-icon` (non-inset)                                                        | C                      | Only `space-inset` is being deprecated; the rest of the space scale is unaffected                                                                                                                                                                                          |
| `breakpoint`                                                                                              | C                      |                                                                                                                                                                                                                                                                            |
| `font` (family/size/weight/style)                                                                         | C                      |                                                                                                                                                                                                                                                                            |
| `line-height` / `text-line-height`                                                                        | C                      |                                                                                                                                                                                                                                                                            |
| `text-family` / `text-size` / `text-style` / `text-weight` / `text-spacing` / `text` (composite) / `type` | C                      | Typography as a whole is untouched by this migration                                                                                                                                                                                                                       |
| Palettes: `membership-vibrant`, `membership-subtle`                                                       | **Needs confirmation** | Not yet triaged with you — tentatively C (value-layer context overrides, no TypeScript contract per ADR-0001), but since these apply to `color`, worth confirming they don't need to move in lockstep with the color taxonomy work. Flagging as open rather than assuming. |

---

## Open Items From This Triage

1. Confirm/replace the "reuse soft-deprecation mechanism" recommendation for Lane B
   (vs. deleting the unused legacy filter code as separate cleanup).
2. Decide, per radius/prominence/motion, whether the "preferred" lossless-passthrough
   into the canonical model is actually feasible once someone looks at the current
   source shape closely — this needs a short spike, not just a decision here.
3. Assign a deprecation release identifier (`YYYY-RX`) for `space-inset` tokens.
4. The `components` domain family as a whole is confirmed deprecated (Lane B) — the
   remaining decision is only _sequencing_ the soft-deprecation wrapping: all 18 at
   once, or phased as each domain's semantic-color replacement is confirmed
   (recommended: phased, tied to `04-migration-plan.md` Phase 4's per-domain
   checklist). Also confirm no new component-token domains get added to
   `style-dictionary/filters/components/**` in the meantime.
5. Confirm whether `membership-vibrant`/`membership-subtle` palettes are Lane C or need
   their own decision tied to the color taxonomy work.

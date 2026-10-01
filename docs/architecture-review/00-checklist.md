# Merge Checklist (Simple Version)

This page is a short to-do list.

This page does not replace the other documents. It only picks out the actions.
If you need more detail on any item, follow the link to the full document.

**Important rule for everything below: we are only changing `color` tokens.**
We are not changing `radius`, `spacing`, `typography`, `motion`, `size`, or `shape`.
Those stay the same.

**Scope of this checklist: the migration only.** "Done" means: the canonical
model / normalization layer can pull semantic color data from Figma, and the
`dist` output matches what we expect. It does **not** include shipping a release,
building the state (hover/active/etc.) layer, or retiring component tokens — those
are separate, later pieces of work. See the note at the end of Step 3.

---

## FAQ: "Are we only taking the color tokens from Spike?"

Two different things are being taken from Spike, and they have different scope.

1. **The color taxonomy (the actual token names/values)** — **color only**, in terms
   of _which token domain is being renamed_. `radius`, `spacing`, `typography`,
   `motion`, `size`, `shape` are **not** being renamed or reshaped right now. They
   keep their current names and structure. (See Step 2 table below, and
   `06-foundation-lane-triage.md`.)

   **But this does not mean the color work is just a rename of existing values.**
   The real source of truth for the new color values is supposed to be a **Figma
   semantic variable file** — and that file **does not exist yet as an official,
   finished thing**. It is still being created. Mainline needs to be wired up to pull
   semantic colors out of Figma the same way Spike did (a Figma → tokens pull
   mechanism) — **but Spike itself was pulling from an interim/placeholder Figma
   file, not the real official one.** So there are two separate dependencies here,
   not one:
   - Building the _mechanism_ that pulls semantic color variables from Figma into
     the token pipeline (this can be modeled on how Spike did it).
   - Getting the _actual, official_ semantic variable file published in Figma by
     design (this is not done yet, and the mechanism above is not useful without it).

   Do not treat "color taxonomy" as a finished naming exercise. Treat it as blocked
   on a real, external, in-progress design deliverable.

2. **The build machinery Spike uses to produce tokens** — this is **not** limited to
   color. Two specific pieces of Spike's machinery are being adopted as general,
   reusable infrastructure inside mainline, even though only `color` will use them
   at first:
   - **The canonical model / normalization layer** — the intermediate step that takes
     raw token input and turns it into one validated shape before Style Dictionary
     runs. (`02-findings-matrix.md`, row "Source token organization" —
     "Adopt from spike (canonical model), but simplify.")
   - **`$extensions.cedar.platformOverrides`** — the mechanism Spike uses to let one
     token have different values per platform (web/iOS/Android) without duplicating
     the whole token tree. (`02-findings-matrix.md`, row "Platform override
     handling" — "Adopt from spike.")

   These two pieces are being built once, generically, in mainline's pipeline. They
   are not "color-only" code. They are just only _populated_ with color data for now.
   Other foundations (`radius`, `motion`, etc.) are meant to pass through this same
   machinery **unchanged** — see the "Radius / Prominence / Motion — A-deferred"
   section in `06-foundation-lane-triage.md` for the exact plan (read tokens into the
   canonical model losslessly, with no renaming, if that's possible without forcing
   premature decisions).

   If the normalization layer or the platform-override mechanism is built as if it
   only ever needs to handle `color` shapes, that will have to be reworked later when
   radius/motion/etc. get their own semantic pass. This is called out as a
   **decision, not yet resolved** — see Open Item #2 in `06-foundation-lane-triage.md`.
   When building the canonical model schema, it's worth passing at least one
   non-color token (e.g. a `radius` token) through it as a sanity check, even though
   radius isn't being renamed — if that breaks or forces a radius rename, escalate,
   don't silently work around it.

---

## Step 1 — Learn the new color naming rule

The new name pattern for color tokens is:

```
color[.interaction-family].role.identity[.expression]
```

Simple examples:

- `color.surface.brand` → a background color, brand identity, normal (base) look
- `color.action.surface.brand.faint` → a clickable background, brand, light version
- `color.text.trigger` → text color for a link

Full explanation with a table: [`03-future-state-proposal.md`](./03-future-state-proposal.md), section 1 and the taxonomy table near the top.

Rules to remember:

- [ ] Never write the word `base` in a token name. If there is no expression word,
      that means it IS `base`.
- [ ] Never write the word `universal`. If there is no interaction-family word,
      that means it applies everywhere.
- [ ] State words like `hover`, `active`, `disabled`, `focus` do **not** go in the
      token name. State handling itself is a **separate, later** piece of work (not
      part of this migration) — see `03-future-state-proposal.md` section 3 if you
      need the detail, but building it is not a task on this checklist.

---

## Step 2 — Know what changes and what does not

Use this table to plan work. Full detail: [`06-foundation-lane-triage.md`](./06-foundation-lane-triage.md).

| Token group                                                                       | What happens                                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `color-background`, `color-text`, `color-border`, `color-icon`                    | **Changes.** New names, new taxonomy. This is the migration.                                                                                |
| `radius`, `prominence`, `motion-duration`, `motion-timing`                        | **No change right now.** Maybe later, not decided.                                                                                          |
| `space-inset`                                                                     | Will eventually be deprecated. **Not part of this migration** — no action needed now.                                                       |
| All 18+ component tokens (`button`, `chip`, `modal`, `tab`, etc.)                 | Will eventually be deprecated. **Not part of this migration, that's next.** No action needed now — do not start removing or wrapping these. |
| Everything else (`space`, `breakpoint`, `font`, `line-height`, typography tokens) | **No change.**                                                                                                                              |
| `membership-vibrant`, `membership-subtle` palettes                                | **Not decided yet.** Ask before touching.                                                                                                   |

---

## Step 3 — Build order for this migration (do these in order)

This checklist only covers getting the canonical/normalization layer and dist
output working for color. Full plan (including later phases) is in
[`04-migration-plan.md`](./04-migration-plan.md), Phases 1–3.

1. [ ] Reshape the canonical `color` tree to the new grammar:
       `color[.interaction-family].role.identity[.expression]`. Leave every other
       foundation's tree untouched.
2. [ ] Build/port the normalization layer so it can pull semantic color data from
       Figma (see the FAQ above — point it at Spike's placeholder file for now if the
       official one isn't ready, but confirm that's an acceptable interim plan first).
3. [ ] Update the validation rules (`validate-contract.ts` / schema) so they check
       the new color grammar.
4. [ ] Update the build filters (`style-dictionary/filters/foundations/color-*`) to
       select on the new grammar. Leave all other filters as-is.
5. [ ] Update the TypeScript type generator so it understands the new optional name
       parts (interaction-family, expression) and omits `base` correctly.
6. [ ] Build the output and compare it against the expected `dist` trees in
       `07-dist-output-diagrams.md` ("Future" sections, CSS/SCSS). Confirm the token
       names and values match.

**This is the finish line for this checklist.** Once the canonical model pulls Figma
data correctly and `dist` output matches what's expected, this migration piece is
done. The following are explicitly **not** part of this checklist — they come later,
as separate work:

- Component token deprecation/retirement (Phase 4 of `04-migration-plan.md`).
- Building the state (hover/active/disabled/focus) layer (Phase 5).
- Shipping a release and running the consumer deprecation window (Phase 6).

---

## Step 4 — Things to double check before calling this migration "done"

- [ ] Old CSS bug: some colors show up twice in the same file (a hex color, then an
      OKLCH color, for the same variable). Fix this — do not copy the bug into new
      files. (`01-architecture-review.md`, section D)
- [ ] Confirm the `dist` output for `color-surface`/`color-text`/`color-border`/
      `color-icon` matches the "Future" examples in `07-dist-output-diagrams.md`,
      including the renamed file (`cdr-color-background.css` → `cdr-color-surface.css`).

---

## Quick reference: which document do I open?

| I need to...                                                              | Open this file                     |
| ------------------------------------------------------------------------- | ---------------------------------- |
| Compare the two repos in detail                                           | `01-architecture-review.md`        |
| See the "why" behind each decision                                        | `02-findings-matrix.md`            |
| See the full naming rules and examples                                    | `03-future-state-proposal.md`      |
| See the step-by-step build plan (all phases, including later ones)        | `04-migration-plan.md`             |
| See what is still undecided                                               | `05-open-questions.md`             |
| Check if a specific token type is changing                                | `06-foundation-lane-triage.md`     |
| See exact file/folder changes (real examples)                             | `07-dist-output-diagrams.md`       |
| Understand text/background color pairing (later work, not this checklist) | `08-color-metadata-and-pairing.md` |

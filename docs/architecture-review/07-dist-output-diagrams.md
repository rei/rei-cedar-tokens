# Dist Output Diagrams — Current vs. Future

Visual before/after for the four platform outputs (SCSS, CSS, iOS, Android). Scope
matches the rest of this folder: **only `color` is changing.** Everything else in
these trees is shown only for completeness/context and is otherwise unaffected (see
`06-foundation-lane-triage.md` for the full per-domain lane assignment).

## Legend

| Marker         | Meaning                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| _(no marker)_  | Unchanged — file/token stays exactly as-is                                                                      |
| `~ renamed`    | Same concept, new name under the corrected color taxonomy                                                       |
| `⚠ deprecated` | Stays in output during the deprecation window, then removed (Lane B)                                            |
| `+ new`        | Does not exist today                                                                                            |
| `? pending`    | Direction is decided, exact name is not (needs the design mapping workshop from `04-migration-plan.md` Phase 0) |

All current-state trees below were read directly from `dist/rei-dot-com/**` in this
repo, not reconstructed from memory.

---

## CSS

### Current (`dist/rei-dot-com/css/`)

```
css/
├── cdr-tokens.css                        (default entrypoint — aggregate)
├── foundations/
│   ├── cdr-color-background.css
│   ├── cdr-color-border.css
│   ├── cdr-color-icon.css
│   ├── cdr-color-text.css
│   ├── cdr-breakpoint.css
│   ├── cdr-font.css
│   ├── cdr-line-height.css
│   ├── cdr-motion-duration.css
│   ├── cdr-motion-timing.css
│   ├── cdr-prominence.css
│   ├── cdr-radius.css
│   ├── cdr-space.css
│   ├── cdr-space-icon.css
│   ├── cdr-space-inset.css
│   ├── cdr-space-scale.css
│   ├── cdr-text-family.css
│   ├── cdr-text-letter-spacing.css
│   ├── cdr-text-line-height.css
│   ├── cdr-text-size.css
│   ├── cdr-text-style.css
│   ├── cdr-text-weight.css
│   └── cdr-type.css
├── components/
│   ├── cdr-accordion.css
│   ├── cdr-button.css
│   ├── cdr-chip.css
│   ├── cdr-form.css
│   ├── cdr-input.css
│   ├── cdr-link.css
│   ├── cdr-message.css
│   ├── cdr-modal.css
│   ├── cdr-pagination.css
│   ├── cdr-rating.css
│   ├── cdr-slide.css
│   ├── cdr-surface.css
│   ├── cdr-surface-selection.css
│   ├── cdr-switch.css
│   ├── cdr-tab.css
│   ├── cdr-table.css
│   ├── cdr-toggle-button.css
│   └── cdr-tooltip.css
└── palettes/
    ├── cdr-palette-membership-subtle.css
    └── cdr-palette-membership-vibrant.css
```

### Future

```
css/
├── cdr-tokens.css                        (unchanged — default entrypoint)
├── foundations/
│   ├── cdr-color-surface.css             ~ renamed from cdr-color-background.css
│   ├── cdr-color-border.css              (unchanged filename; token names inside change)
│   ├── cdr-color-icon.css                (unchanged filename; token names inside change)
│   ├── cdr-color-text.css                (unchanged filename; token names inside change)
│   ├── cdr-breakpoint.css
│   ├── cdr-font.css
│   ├── cdr-line-height.css
│   ├── cdr-motion-duration.css           (unchanged — A-deferred, see 06)
│   ├── cdr-motion-timing.css             (unchanged — A-deferred, see 06)
│   ├── cdr-prominence.css                (unchanged — A-deferred, see 06)
│   ├── cdr-radius.css                    (unchanged — A-deferred, see 06)
│   ├── cdr-space.css
│   ├── cdr-space-icon.css
│   ├── cdr-space-inset.css               ⚠ deprecated (Lane B, see 06)
│   ├── cdr-space-scale.css
│   ├── cdr-text-family.css
│   ├── cdr-text-letter-spacing.css
│   ├── cdr-text-line-height.css
│   ├── cdr-text-size.css
│   ├── cdr-text-style.css
│   ├── cdr-text-weight.css
│   └── cdr-type.css
├── components/                           ⚠ entire directory deprecated (Lane B, see 06)
│   ├── cdr-accordion.css                 ⚠
│   ├── cdr-button.css                    ⚠
│   ├── cdr-chip.css                      ⚠
│   ├── cdr-form.css                      ⚠
│   ├── cdr-input.css                     ⚠
│   ├── cdr-link.css                      ⚠
│   ├── cdr-message.css                   ⚠
│   ├── cdr-modal.css                     ⚠
│   ├── cdr-pagination.css                ⚠
│   ├── cdr-rating.css                    ⚠
│   ├── cdr-slide.css                     ⚠
│   ├── cdr-surface.css                   ⚠
│   ├── cdr-surface-selection.css         ⚠
│   ├── cdr-switch.css                    ⚠
│   ├── cdr-tab.css                       ⚠
│   ├── cdr-table.css                     ⚠
│   ├── cdr-toggle-button.css             ⚠
│   └── cdr-tooltip.css                   ⚠
└── palettes/
    ├── cdr-palette-membership-subtle.css     ? pending — see 05-open-questions.md #5
    └── cdr-palette-membership-vibrant.css    ? pending — see 05-open-questions.md #5
```

### Token-level diff example (foundations)

`dist/rei-dot-com/css/foundations/cdr-color-background.css` today:

```diff
  :root {
-   --cdr-color-background-transparent: rgba(255, 255, 255, 0);
-   --cdr-color-background-primary: #ffffff;
-   --cdr-color-background-secondary: #f4f2ed;
-   --cdr-color-background-sale: #c7370f;
-   --cdr-color-background-brand-spruce: #1f513f;
-   --cdr-color-background-success: #ecf9e6;
-   --cdr-color-background-info: #e2f4fe;
-   --cdr-color-background-warning: #fdf6e2;
-   --cdr-color-background-error: #fcefe4;
  }
```

`dist/rei-dot-com/css/foundations/cdr-color-surface.css` (proposed):

```diff
  :root {
+   --cdr-color-surface-transparent: rgba(255, 255, 255, 0);
+   --cdr-color-surface-neutral: #ffffff;              /* ? pending identity for "secondary/primary" split */
+   --cdr-color-surface-neutral-faint: #f4f2ed;         /* ? pending */
+   --cdr-color-surface-sale: #c7370f;
+   --cdr-color-surface-brand: #1f513f;
+   --cdr-color-surface-success: #ecf9e6;
+   --cdr-color-surface-info: #e2f4fe;
+   --cdr-color-surface-warning: #fdf6e2;
+   --cdr-color-surface-error: #fcefe4;
  }
```

`identity`/`expression` assignments marked `? pending` are illustrative, not decided —
they require the Phase 0 design mapping workshop (`04-migration-plan.md`), not a
mechanical rename.

### Token-level diff example (component — deprecated)

`dist/rei-dot-com/css/components/cdr-button.css` today:

```css
--cdr-color-background-button-primary-rest: #1f513f;
--cdr-color-background-button-primary-active: #1f513f;
--cdr-color-background-button-primary-hover: #c7dfd1;
```

Future: stays in `cdr-button.css` **unchanged**, wrapped in `deprecated-YYYY-RX` per
`docs/DEPRECATION.md`, until removed. Its eventual replacement lives in the
`color-surface` foundation module instead of a component file:

```diff
- --cdr-color-background-button-primary-rest: #1f513f;
- --cdr-color-background-button-primary-active: #1f513f;
- --cdr-color-background-button-primary-hover: #c7dfd1;
+ --cdr-color-action-surface-brand: #1f513f;             /* rest — no suffix (base) */
+ --cdr-color-action-surface-brand-hover: #c7dfd1;        /* explicit hover, since CSS has no Figma "mode" */
```

Note `active` collapses into the same value as `rest` in the current output
(`#1f513f` both times) — worth flagging to design as a possible existing bug/no-op
state, independent of this migration.

---

## SCSS

Structurally identical to CSS (same filenames, `.scss` extension, `$` variables
instead of `--` custom properties, plus a `utilities/` directory with no color
content).

### Current (`dist/rei-dot-com/scss/`)

```
scss/
├── cdr-tokens.scss                       (default entrypoint)
├── foundations/                          (same 22 files as CSS foundations/, .scss)
├── components/                           (same 18 files as CSS components/, .scss)
├── palettes/                             (same 2 files as CSS palettes/, .scss)
├── utilities/
│   ├── cdr-breakpoint-mixins.scss
│   ├── cdr-display-mixins.scss
│   └── cdr-type-mixins.scss
└── utility-map.scss
```

### Future

Same diff as CSS above, applied 1:1:

- `foundations/cdr-color-background.scss` → `~ renamed` to
  `foundations/cdr-color-surface.scss`, same token renames (`$` instead of `--`).
- `foundations/cdr-color-border.scss`, `cdr-color-icon.scss`, `cdr-color-text.scss` →
  unchanged filenames, token names inside change.
- `foundations/cdr-space-inset.scss` → `⚠ deprecated`.
- `components/**` → `⚠ deprecated` (entire directory, per `06-foundation-lane-triage.md`).
- `palettes/**` → `? pending`.
- `utilities/**` and `utility-map.scss` → unchanged (no color content).

No SCSS-specific divergence from CSS is expected — same module boundary, same naming
rules (§2 of `03-future-state-proposal.md`), just a different value syntax.

---

## iOS

### Current (`dist/rei-dot-com/ios/`)

```
ios/
└── CedarText.swift          (typography only — see style-dictionary/configs/ios.ts)
```

**Important:** mainline's iOS output today only covers `text` (typography). There is
**no color, radius, spacing, or motion Swift output at all** — confirmed by reading
`style-dictionary/configs/ios.ts`, which filters strictly on `token.path[0] === 'text'`.

### Future

```
ios/
└── CedarText.swift          (unchanged — typography is Lane C, not part of this migration)
```

**No change to iOS as part of this migration**, because there is no existing iOS color
output to rename. This is worth flagging explicitly rather than silently:

- If/when iOS color output is added (a new capability, not a rename), it should be
  built directly against the corrected color taxonomy from day one
  (`CdrColorSurfaceBrand`-style naming, see §2 of `03-future-state-proposal.md`) rather
  than shipping with old naming and needing an immediate rename.
- The spike's iOS output (`dist/themes/rei-dot-com/ios/CdrColors.xcassets`,
  `CdrTypography.swift`, `CdrSpacing.swift`) is a reasonable reference for shape, but
  adopting it is a separate scoping decision, not implied by this migration.

---

## Android

### Current

**No Android output exists in either repo.** Confirmed: no `dist/android` (or
equivalent) directory in mainline, and no Android dist output in the spike either —
the spike's `adr-0017-android-distribution-strategy.md` is `Status: Proposed`, describing
an AAR-via-CI/CD strategy that has not been built.

### Future

**Out of scope for this migration.** Do not create Android output as a side effect of
the color taxonomy work. If/when Android distribution is prioritized, it should:

- start from the corrected color taxonomy (avoid inheriting old naming that would need
  an immediate breaking rename shortly after launch), and
- be scoped as its own initiative referencing `adr-0017-android-distribution-strategy.md`
  as prior art, not assumed as a deliverable of this plan.

---

## Summary Table

| Platform | Current color output? | Change from this migration                                                                           | Non-color foundations                                          |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| CSS      | Yes, full             | Rename `color-background`→`color-surface`; internal token renames; component color tokens deprecated | Unchanged (radius/prominence/motion deferred, not renamed yet) |
| SCSS     | Yes, full             | Same as CSS                                                                                          | Same as CSS                                                    |
| iOS      | No (typography only)  | None — nothing to rename                                                                             | Unchanged                                                      |
| Android  | No (doesn't exist)    | None — out of scope                                                                                  | N/A                                                            |

# Ticket: Give Intents a Single CSS Hook (Data Attribute) Instead of Four Separate Variables

## Goal

Right now, applying an "intent" (Primary, Secondary, Brand, link) to an element means wiring up text color, icon color, border color, and surface color as four separate CSS custom properties by hand. We want one hook — e.g. `[data-cdr-intent="primary"]` — that sets the whole coordinated bundle at once, the same way our `cdr-surface` component already drives variants off `data-*` attributes.

## Why this matters

The entire point of intents is that an author picks one semantic choice and gets a coordinated, designer-approved combination of colors — not four independent pickers that can be combined into something that was never designed to go together. If consumers still have to wire four variables by hand to use an intent, we haven't actually delivered that benefit — we've just renamed the four pickers.

## Acceptance Criteria

- [ ] Applying `data-cdr-intent="primary"` (or equivalent) to an element sets all of that intent's coordinated custom properties (text, icon, border, surface where applicable) in one step.
- [ ] Each intent (Primary, Secondary, Brand, link) is supported this way.
- [ ] The pattern follows the attribute-selector convention already used by `cdr-surface` rather than introducing a new styling approach.
- [ ] Documented with a usage example showing before (four manual variables) and after (one attribute).

## Reference

Related to two other tickets: `docs/tickets/intents-export-surface.md` (**done, PR #313** — the TypeScript/JS side shipped as `CdrIntents` + `CdrIntentOrder`; this ticket is the CSS-side half of the same idea) and `docs/tickets/mixin-deprecation-cedar-handoff.md` (both are part of moving CSS consumption patterns into Cedar rather than the token package). Existing convention to follow: `CdrSurface.module.scss`'s `[data-*]` attribute-selector pattern.

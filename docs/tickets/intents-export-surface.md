# Ticket: Ship Intents as Coordinated Bundles, Not Scattered Category Lookups

## Goal

An "intent" (Primary, Secondary, Brand, link) is supposed to be one choice that gives a consumer a coordinated, designer-approved set of colors — text, icon, border, surface — instead of them picking each one separately and risking a combination that was never designed to go together. Today the token output doesn't actually deliver that: intent values are split across separate category modules (one for text, one for border, one for icon, one for surface), so a consumer who wants "everything for Primary" still has to manually reach into four places and assemble it themselves — the exact thing intents were meant to replace. We want intents importable as a single bundle per intent name, reachable from the normal package import.

## Why this matters

If a consumer like our DXP platform wants to offer "pick an intent" instead of "pick a text color and a background color separately," the current output doesn't support that — it would require them to rebuild the same four-field composition logic intents were supposed to eliminate, just with renamed inputs. Separately, we also found the intent values currently aren't reachable from the standard package import at all (only an undocumented deep import path works), and a naming collision between an intent module and a foundation module that would silently break if that import gap were fixed carelessly.

## Acceptance Criteria

- [ ] Each intent (Primary, Secondary, Brand, link) is available as a single object bundling its coordinated values (text, icon, border, surface, as applicable), not spread across separate category lookups a consumer has to reassemble.
- [ ] Intent bundles are reachable from the standard package import, the same way foundation tokens already are — no deep/undocumented import path required.
- [ ] No two exported token groups share the same name with different contents.
- [ ] Our TypeScript usage docs show the correct way to import and use an intent bundle.
- [ ] A test exists that would catch a future naming collision like this automatically.

## Reference

Found while reviewing the new intents output added in this PR, from the perspective of a consumer configuring tokens through a UI (e.g. picking an intent from a dropdown) rather than hand-writing CSS. The matching CSS-side version of this idea (a single class/attribute that sets the whole bundle) is tracked separately in `docs/tickets/intent-css-attribute-selector.md`.

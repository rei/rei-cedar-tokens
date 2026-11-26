# Ticket: Close Out Open Requirements for Mobile Typography, Spacing, Radius, and Shadow

## Goal

Color is the one foundation category where we actually know what both mobile teams need and can build it now. Typography, spacing, radius, and shadow are not at that point yet — there are real open questions nobody's answered. We want those answered before anyone writes an engineering ticket for them, so we don't guess and build the wrong thing.

## Why this matters

The previous production iOS app did ship things like input heights, icon sizes, and shadow values — but spacing values today are hand-coded in the app, not sourced from tokens at all, and nobody's confirmed whether the old shape is even still wanted or whether it should look different in the new system (e.g. delivered as a Swift helper instead of raw constants). Guessing here risks building something that gets thrown away.

## Open Questions to Resolve

**iOS**

- What format should spacing and typography values ship in — the same kind of wrapper used for colors, or something else?
- Do the old size categories (form input heights, icon sizes, shadow/elevation values, corner radii) carry forward as-is, change shape, or get dropped?

**Android**

- Should spacing and font tokens ship as XML resources, Compose code, or both (matching the color decision)?
- Spacing/typography usage hasn't been discussed with the Android team at all yet — needs a first conversation, not just a follow-up.

## Acceptance Criteria

- [ ] Each open question above has a documented answer from the actual consuming team, not an assumption.
- [ ] Once answered, each foundation category (typography, spacing, radius, shadow) gets its own scoped engineering ticket — don't build ahead of the answers.

## Reference

Current status per the mobile team's own readiness assessment: color is ready to build; typography, spacing, radius, and shadow are explicitly marked as needing discovery first. See `docs/mobile-team-discovery-findings.md` and `docs/token-spike-native-platform-gaps.md` (workspace `docs/` level, not in this repo).

# Ticket: Wire Up iOS Color Output (P3) — the Engineering Already Exists

## Status: release blocker (for color). Spacing/typography/radius/shadow are a separate, not-yet-ready track — see below.

## Goal

Ship iOS color tokens — including Display P3, already confirmed as the required color space — by connecting work that has already been built and tested but was never turned on.

## What we found

This isn't "go build iOS color support." It already exists:

- `style-dictionary/configs/ios.ts` reads from the correct, current token source and generates a full `CdrColors.xcassets` Asset Catalog with light/dark appearance variants and real Display P3 conversion (OKLCH → P3), via a fully-written, fully-tested action (`ios-color-action.ts`, with its own test suite).
- The underlying per-platform resolved color data it needs (`$extensions.cedar.ios` light/dark values) is already present on hundreds of tokens in our current canonical token file.
- `rei-cedar-ios` (the Swift package meant to consume this) is already scaffolded and expects exactly this: a `CdrColors.xcassets` catalog with semantic color names, consumed via `Color("cdr-...")`.

**Why it's not shipping:** this config is never actually included in our build, and its token filter is written for an older data shape that no longer matches how our tokens are organized today — so even if it were turned on, it would currently match zero tokens.

## Acceptance Criteria

- [ ] iOS color config is part of the real build, not sitting unused.
- [ ] Its token filter is updated to match our current token structure (verified it currently doesn't).
- [ ] Output is a working `CdrColors.xcassets` catalog with Display P3 + light/dark, covering our full semantic color set.
- [ ] Confirmed working end-to-end in `rei-cedar-ios`, not just "the files generate without errors."
- [ ] Settle the one open product question from mobile team discovery: do we also generate Swift extension wrappers (`Color.cdrTextBase` style, for autocomplete) on top of the asset catalog, or is the asset catalog alone sufficient for now? (Asset catalog is the confirmed requirement either way — this only affects whether we add a convenience layer on top.)
- [ ] Decide whether we also need an Objective-C-compatible enum output for the legacy flagship app pattern (`CdrColor.color(CdrColorName.cdrColorTextPrimary)`), since that's the production app's current access pattern and migration isn't assumed to be immediate.

## What's explicitly NOT in scope here (don't bundle it in)

Spacing, typography, radius, and shadow tokens for iOS are **not ready for an engineering ticket yet** — per the mobile team's own readiness assessment, these are still "discovery needed," not "ready to build." The previous production app did ship size tokens (input heights, icon sizes, shadow offsets, corner radii) — don't assume they carry forward unchanged into the new system; that needs its own requirements conversation, not an engineering guess. Tracked separately.

## Reference

- Existing, unwired implementation: `style-dictionary/configs/ios.ts`, `style-dictionary/actions/ios/ios-color-action.ts`
- Confirmed requirements: `docs/mobile-team-discovery-findings.md`, `docs/ios-android-team-outreach-draft.md` (both at the workspace `docs/` level, not in this repo)
- Related, separate scope: `docs/tickets/mobile-distribution-infrastructure.md` (packaging/publishing), `docs/tickets/mobile-foundation-discovery.md` (spacing/typography/radius/shadow)

# Ticket: Wire Up Android Color Output — Same Situation as iOS

## Goal

Ship Android color tokens (Compose color objects + XML resources, both required) by connecting work that's already been built and tested but was never turned on — the same situation as iOS.

## What we found

- `style-dictionary/configs/android.ts` already defines both outputs required by the Android team: `res/values/colors.xml` (XML, for Views) and `CedarColors.kt` (Compose). Both formats are fully written.
- The color-generation action (`android-color-action.ts`) is fully written and tested, with light/dark handling (`values/` vs `values-night/`).
- The per-platform resolved color data it needs (`$extensions.cedar.android` light/dark values) already exists on hundreds of tokens in our current canonical token file.
- The action is explicitly commented out with a note that it's "disabled until normalization layer generates android extensions" — **that data now exists.** The blocker this comment describes appears to be resolved; it just hasn't been re-checked.

**Why it's not shipping:** same two reasons as iOS — never wired into the real build, and its token filter expects an older data shape that no longer exists in our current canonical token structure.

## Acceptance Criteria

- [ ] Android color config is part of the real build, not commented out.
- [ ] Its token filter is updated to match our current token structure (confirmed it currently doesn't).
- [ ] Both XML resources and Compose color objects are generated, with working light/dark variants.
- [ ] Color space handling matches the confirmed requirement: wide-gamut (OKLCH/Display P3 equivalent) for Compose, with an sRGB fallback for XML since XML resources can't represent wide-gamut color.
- [ ] Confirmed working in a real Android build, not just "files generate without errors" — we don't yet have confirmation of how the Android app currently consumes Cedar tokens (unlike iOS, we couldn't find an existing Cedar color integration in the flagship Android codebase to validate against), so this needs direct validation with the Android team.

## What's explicitly NOT in scope here

- **Automated distribution (AAR packaging, Maven/GitLab Packages publishing, CI/CD pipeline)** is real, confirmed-required infrastructure work, but it's a separate, larger effort from generating the right files — tracked in `docs/tickets/mobile-distribution-infrastructure.md`.
- Spacing, typography, radius, and shadow tokens are not ready for an engineering ticket yet — tracked in `docs/tickets/mobile-foundation-discovery.md`.
- Runtime palette switching (for theming/A-B testing) is an open question, not a confirmed requirement — don't build for it until it's answered.

## Reference

- Existing, unwired implementation: `style-dictionary/configs/android.ts`, `style-dictionary/actions/android/android-color-action.ts`
- Confirmed requirements: `docs/android-token-distribution-requirements.md`, `docs/mobile-team-discovery-findings.md` (both at the workspace `docs/` level, not in this repo)

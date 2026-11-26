# Ticket: Audit Remaining Output Platforms for the Same Legacy-Source Problem

## Goal

When we moved to the new color taxonomy, only the web (CSS/SCSS/TypeScript) output was actually switched over to read from the new token source. Other outputs (iOS, one of our JSON outputs) turned out to still be reading from the old, pre-migration token files — meaning no amount of fixing the new taxonomy will ever reach them until their source is switched. We've confirmed and fixed this for two platforms; we haven't checked the rest.

## Why this matters

This isn't a one-off bug we keep rediscovering — it's one root cause (platform still pointed at old token files) showing up in a new place each time someone looks. Better to check everywhere once than find each one independently over several releases.

## Acceptance Criteria

- [ ] Every output platform we ship (at minimum: Figma output, the two Storybook/site builds, and anything else `getSources()`-equivalent config lists) is checked for whether it reads from the new token source or the old one.
- [ ] Any platform still on the old source is listed with what's missing as a result (same way we documented it for iOS and the JSON output).
- [ ] Each confirmed gap gets its own follow-up ticket rather than being fixed ad hoc inside this one.

## Reference

Already confirmed affected and separately ticketed: iOS (`docs/tickets/ios-canonical-migration.md`) and a legacy JSON output (already fixed on the current PR). This ticket is just "check if anyone else has the same problem," not a fix itself.

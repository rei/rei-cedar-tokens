# Ticket: Require Docs/Migration Notes Before a Token Story Is "Done"

## Goal

A story that changes what consumers get shouldn't be considered finished until it's documented — what changed, why, and what a consumer needs to do about it. Today that documentation is treated as optional extra work, so it regularly doesn't happen.

## Why this matters

This token PR shipped several changes consumers will feel (removed helpers, a new feature, scoped-down platform support) with no migration notes written anywhere. The result is a release that works, but that consumers will have to reverse-engineer by reading diffs or asking us directly.

## Acceptance Criteria

- [ ] Our story/PR template has a required section: "Does this affect consumers? If yes, what do they need to know or do?"
- [ ] A story isn't marked done/approved if that section is blank on a consumer-facing change.
- [ ] Before this release ships, the outstanding undocumented changes on this branch (removed mixins, removed utility output, scoped-down iOS/Android support) are written up in our release notes input, not left for the release-notes tooling to guess at.

## Reference

We already have a documented process for writing release notes (`docs/release-notes-guide.md`) — this ticket is about making sure people actually feed it information as they work, instead of after the fact.

# Ticket: Make Sure Consumer-Facing Changes Actually Show Up in Release Notes

## Goal

Our release notes are generated automatically from commit history and build output diffs. Right now, a change can be fully shipped to consumers and still never appear in the release notes if it's logged the wrong way. We want every breaking or consumer-facing change to reliably show up, every time, without someone having to remember to call it out manually.

## Why this matters

On the current token PR, several changes that consumers will notice (new output removed, a color value corrected, a new feature added) were committed in a way the release-notes system ignores by design — commits labeled as internal cleanup are intentionally excluded. So the notes for this release would look like nothing happened, when several things did.

Separately, some kinds of changes (removing a Sass helper, for example) aren't on the system's radar at all yet, even when logged correctly — so this isn't purely a "label things correctly" problem.

## Acceptance Criteria

- [ ] A written, one-page guideline exists telling contributors how to label a commit so it shows up correctly in release notes (consumer-facing vs. internal), with a couple of concrete good/bad examples.
- [ ] Removing or renaming something a consumer could depend on (a Sass mixin, a helper, a utility — not just CSS variables and token names) is treated as a breaking change by the release-notes system, the same as token/CSS changes already are.
- [ ] Before this release ships, someone has gone back through this PR's commits and confirmed every consumer-facing change is actually reflected in the draft release notes — not assumed.

## Reference

This is about our existing commit-based release-notes pipeline (`docs/release-notes-guide.md` and its config in `scripts/agent-config/`). See that doc for how it currently works; no need to read it to understand this ticket.

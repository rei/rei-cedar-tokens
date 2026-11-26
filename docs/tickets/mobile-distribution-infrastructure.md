# Ticket: Automated Distribution Pipeline for iOS and Android Tokens

## Goal

Both mobile teams have told us the same thing: manually copying token files into their apps is the real pain point, more than the tokens themselves. We want tokens delivered the way their existing dependencies already are — a normal package install, kept up to date automatically — not a file someone has to remember to copy.

## Why this matters

Even once we generate correct output (see the iOS and Android color tickets), if the delivery mechanism is still "someone copies a file," we haven't actually solved the problem either team raised. This is the difference between a one-time proof of concept and something teams will actually keep using.

## Acceptance Criteria

- [ ] iOS: tokens are published as a Swift Package Manager package (confirmed requirement — CocoaPods support is explicitly not needed) that a project can add as a normal dependency and get version updates through.
- [ ] Android: tokens are published as an AAR library through an automated CI/CD pipeline to GitLab Packages, addable as a normal Gradle dependency.
- [ ] Both are versioned with semantic versioning and publish automatically on token changes — no manual publish step.
- [ ] Basic integration documentation exists for both platforms (how to add the dependency, how to update it).

## What's explicitly NOT in scope here

This is purely the packaging/delivery mechanism. It depends on the token _output_ already being correct — see `docs/tickets/ios-canonical-migration.md` and `docs/tickets/android-reenablement.md` for that half of the work.

## Reference

Confirmed requirements: `docs/android-token-distribution-requirements.md`, `docs/mobile-team-discovery-findings.md` (workspace `docs/` level, not in this repo). Android requirements are already written up in detail; an equivalent iOS distribution requirements doc doesn't exist yet and is worth creating alongside this work.

# Cedar Token Architecture Convergence — Deliverables

This folder contains the architecture review comparing the Cedar Token Pipeline Spike
(`rei-cedar-token-pipeline-spike`) against the current mainline package
(`rei-cedar-tokens`), and the resulting convergence plan.

Guiding principle: **the token model is allowed to change; the delivery model should
only change when there is a clear architectural benefit.**

## Contents

1. [`01-architecture-review.md`](./01-architecture-review.md) — side-by-side comparison
   of source organization, build pipeline, Style Dictionary usage, generated artifacts,
   and public API surface for both repos.
2. [`02-findings-matrix.md`](./02-findings-matrix.md) — condensed findings table used to
   drive the future-state decision.
3. [`03-future-state-proposal.md`](./03-future-state-proposal.md) — the proposed hybrid
   architecture, including the corrected five-tier semantic token taxonomy
   (Foundation → Interaction Family → Role → Identity → Expression).
4. [`04-migration-plan.md`](./04-migration-plan.md) — phased plan to converge the two
   codebases and migrate consumers.
5. [`05-open-questions.md`](./05-open-questions.md) — unresolved design/architecture
   questions that block or affect the migration.

## Sources

- Spike ADRs: `rei-cedar-token-pipeline-spike/architecture/ADR/adr-0001` through `adr-0017`
  (see especially `adr-0004-semantic-token-architecture.md`, superseded in part — see
  below).
- Mainline ADRs: `rei-cedar-tokens/docs/adr/0001-modular-output-architecture.md`,
  `ADR-0005.md`.
- Mainline semantic contract generator: `rei-cedar-tokens/style-dictionary/semantic-contract.ts`.
- **Taxonomy correction:** the "Cedar Semantic Taxonomy — Discovery & Alignment" document
  supplied directly by design/architecture stakeholders supersedes ADR-0004's naming
  grammar (`color.<intent>[.<family>][.<variant>]`) and the historical
  `semantic-taxonomy-confluence.md` notes. All taxonomy content in this folder reflects
  the corrected five-tier model, not ADR-0004 as originally written.

---
status: proposed
priority: high
---

# Ticket: Canonical Source-of-Truth Documentation

## Status: proposed - aligns with 30-day priorities from Into Design Systems AI conference

## The problem

Inter-team ambiguity exists about which source is authoritative for different aspects of Cedar:

- Code vs Figma vs Docs for behavior, visual intent, and usage governance
- No explicit documentation of canonical sources
- Agents and teams must infer authority, leading to drift

## Conference evidence

From Into Design Systems AI conference (March 2026):

> "Canonical source-of-truth documentation. Write and publish: code is authoritative for behavior, Figma for visual intent, Cedar docs for usage governance. Circulate to engineering, design, and product partners. This resolves the most common inter-team ambiguity."

## Implementation

Create and publish a canonical source-of-truth document that defines:

| Aspect                           | Canonical Source                  | Notes                                                    |
| -------------------------------- | --------------------------------- | -------------------------------------------------------- |
| Component behavior               | Code (rei-cedar)                  | Props, states, interaction model                         |
| Visual intent                    | Figma                             | Colors, spacing, layout, visual states                   |
| Usage governance                 | Cedar docs                        | When to use, when not to use, accessibility requirements |
| Token values                     | Token pipeline (rei-cedar-tokens) | Canonical tokens.json source                             |
| Token semantics                  | ADRs + metadata                   | Naming conventions, role definitions                     |
| Platform-specific implementation | Platform repos                    | iOS, Android, email, retail implementations              |

## Location

- Create as `docs/canonical-sources.md` in rei-cedar-tokens
- Link from AGENTS.md
- Circulate to engineering, design, and product partners

## Success criteria

- All Cedar teams can answer "what is the source of truth for X?" without ambiguity
- Agents have explicit guidance on which source to trust for each aspect
- Reduced drift between Figma and code
- Clear handoff points between teams

## Effort estimate

Low (days) - documentation only, no pipeline changes

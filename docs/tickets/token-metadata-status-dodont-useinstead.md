---
status: proposed
priority: critical
---

# Ticket: Token Metadata Enhancement - Status, Do/Don't, Use-Instead

## Status: proposed - aligns with 30-day priorities from Into Design Systems AI conference

## The problem

Cedar's token metadata lacks explicit status, do/dont, and use-instead fields. This makes it difficult for agents to understand:

- Which tokens are stable vs deprecated
- When to use a specific token
- What to use instead of a deprecated token
- Negative usage guidance (when NOT to use a token)

## Conference evidence

From Into Design Systems AI conference (March 2026):

> "Token metadata: add status, do, dont, use-instead fields. Target: 100% of stable tokens. This is the single highest-value, lowest-effort change Cedar can make. Deprecated tokens without 'use-instead' semantics are invisible hazards in agent workflows."

## Implementation

Add the following fields to token metadata:

- `status`: stable | beta | deprecated | doNotUse | internalOnly
- `do`: positive usage guidance (when to use this token)
- `dont`: negative usage guidance (when NOT to use this token)
- `useInstead`: for deprecated tokens, the recommended replacement

## Source of truth

- Token metadata should be authored in `canonical/tokens.json` `$description` field per TOKEN_DESCRIPTION_CONTRACT.md
- Emitted to `dist/rei-dot-com/json/web.json` via existing pipeline
- No hand-authoring in dist outputs

## Success criteria

- 100% of stable tokens have status field
- All deprecated tokens have use-instead field
- Do/dont guidance exists for high-usage tokens (primary actions, surfaces, text, borders)
- PDX agents can correctly identify deprecated tokens and their replacements
- No deprecated token is used without an agent warning

## Dependencies

- TOKEN_DESCRIPTION_CONTRACT.md may need update to include new field grammar
- Style Dictionary transforms may need update to emit new fields
- Contract tests should validate new fields are present

## Effort estimate

Low (1-2 weeks) - conservative approach per conference recommendation

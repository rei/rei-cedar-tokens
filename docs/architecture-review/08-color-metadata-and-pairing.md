# Color Metadata & Pairing Strategy

**Status: proposed, not decided.** This addresses the functional gap left by dropping
the `on` vocabulary from the taxonomy (`color.text.on.surface`-style contrast pairing)
and feeds the "Interaction Bundle" proposal in `03-future-state-proposal.md` §7.

## The gap

The old `on` grammar encoded _which foreground is safe/intended on which background_
directly in the token name. The corrected taxonomy has no equivalent — `color.text.*`
and `color.surface.*` are independent atomic tokens with no declared relationship to
each other. Something needs to fill that gap, or consumers (and DXP tooling
specifically) have no way to know which combinations are safe/intended without
guessing or hardcoding.

## Two kinds of information, two different sources

| Kind                                                                                                                             | Source                                        | Can it be automated?                           |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| **Contrast validity** — does this foreground/background pair meet a minimum contrast ratio (e.g. WCAG AA/AAA)?                   | Computable from the two resolved color values | **Yes** — pure math, no design judgment needed |
| **Intent/rationale** — _why_ this pairing exists, or that a pairing is intended even if not the only mathematically valid option | Design judgment                               | **No** — needs a designer-authored description |

These should not be conflated into one field. A pair can be contrast-valid but not
design-intended (e.g., mathematically legible but visually wrong), and a
design-intended pair should still be automatically contrast-checked as a safety net.

## Proposed pipeline

1. **Figma metadata (designer-authored):**
   - Every semantic color token gets an optional description field for pairing intent
     — e.g. on `color.action.text.brand`: "Use with `color.action.surface.brand` or
     `color.action.surface.brand.faint`." This is free text today in Figma; it needs a
     structured convention (see schema below) so it can be parsed rather than only
     read by humans.
   - Designers are the only source for _intent_ — this cannot be inferred.

2. **Normalization layer (automated):**
   - For every declared pair (from step 1) and optionally for every _plausible_ pair
     within the same interaction-family + identity group, compute the actual contrast
     ratio between resolved values.
   - Flag: declared-and-valid, declared-but-failing (a real bug to catch before
     release), or valid-but-undeclared (a candidate the normalization layer found that
     design didn't call out — informational, not authoritative).
   - This is the same place platform-override governance already lives
     (`$extensions.cedar.platformOverrides`, per the spike's ADR-0004) — pairing
     metadata should follow the same `$extensions.cedar.*` convention:

     ```json
     {
       "color": {
         "action": {
           "text": {
             "brand": {
               "$value": "...",
               "$extensions": {
                 "cedar": {
                   "pairsWith": ["color.action.surface.brand", "color.action.surface.brand.faint"],
                   "contrastChecked": true
                 }
               }
             }
           }
         }
       }
     }
     ```

3. **Build output (generated):**
   - Pairing metadata should be emitted somewhere consumers can actually use it, not
     just stay internal. Candidate locations: the JSON contract artifact
     (`dist/<theme>/json/web.json` or a dedicated `dist/<theme>/json/color-pairing.json`),
     and/or JSDoc-style annotations on the generated TypeScript module interfaces so
     editors surface the intent inline.

## Open decision: forward raw metadata, or pre-compute valid pairs?

Two ways to expose this to consumers, not yet decided:

- **Forward raw metadata** — ship the `pairsWith` relationships as data; consumers
  (including DXP tooling) assemble their own valid combinations from it. More
  flexible, more work for every consumer, more chances to get it wrong downstream.
- **Pre-compute valid pairs as a higher-level deliverable** — Cedar itself generates
  the "Interaction Bundle" (§7 of `03-future-state-proposal.md`) already limited to
  validated pairs, so DXP tooling never sees an invalid combination in the first
  place. Less flexible, but centralizes correctness in one place instead of
  re-implementing pairing logic in every consumer.

This is a real open question — see `05-open-questions.md`. My inclination is the
second option (pre-computed), since it directly serves the DXP picker use case that
motivated this whole doc, and a raw-metadata API can still be exposed later without
breaking anything if some consumer genuinely needs it. But this needs design input on
how pairing intent actually gets authored in Figma before commit to either direction.

## Not yet addressed

- Exact structured format for the Figma description field (free text today; needs a
  parseable convention before automation can rely on it).
- Whether `contrastChecked` should block a release (CI gate) or only warn.
- Whether pairing applies only within the same interaction-family + identity, or can
  cross identities (e.g., is `color.text.neutral` on `color.surface.brand` ever a
  declared pair?).

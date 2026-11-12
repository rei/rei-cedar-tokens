---
status: proposed
priority: high
---

# Ticket: PDX Agent Content Discovery

## Status: evidence collection - awaiting llms.txt implementation

## The problem

PDX team (Harmony) reported that agents cannot effectively read and summarize content from cedar.rei.com. When using the `read_url_content` tool:

- Tool returns chunk positions and summaries instead of actual detailed content
- Example: modal documentation returns "[Position: 10] modal / Accessibility / What Cedar provides + Development responsibilities" rather than the actual guidance text
- Agent cannot extract the structured information it needs (API details, accessibility requirements, etc.)

## Why this matters

This is a real consumer (PDX) trying to use agents to understand Cedar. The failure mode demonstrates:

1. **Web pages are built for humans** - navigation, chrome, JavaScript make it hard for agents to extract clean content
2. **No LLM-friendly entry point** - agents must scrape and parse HTML designed for browsers
3. **Context window waste** - scraping entire pages to find a small section of guidance
4. **Unreliable extraction** - chunk-based summaries lose the detail agents need

## The solution

Implement llms.txt following the [llmstxt.org](https://llmstxt.org) specification:

- Single markdown file at cedar.rei.com/llms.txt
- Curated overview of Cedar's knowledge
- Links to canonical sources (ADRs, token contracts, component docs)
- Small enough to fit in context
- Industry-standard solution (OpenAI, Anthropic, Gemini all use it)

This provides agents with a reliable discovery mechanism without requiring Cedar to restructure its entire documentation site.

## Evidence

- PDX team feedback (Harmony, 2026-11-11)
- Tool behavior: `read_url_content` returns summaries, not content
- Industry validation: thousands of sites publish llms.txt; Chrome Lighthouse audits for it
- ADR-0015: AI Catalog Format (proposed)

## Dependencies

- ADR-0015 must be accepted (AI Catalog Format)
- Generation script in `scripts/agent-config/generate-ai-catalog.ts`
- Publishing to cedar.rei.com domain
- Integration with build pipeline

## Success criteria

- PDX agents can successfully discover Cedar guidance via llms.txt
- Agents can follow links to get detailed content when needed
- No scraping of cedar.rei.com HTML required
- Content Design can use the same pattern for their guidance

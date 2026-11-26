# AGENTS.md — rei-cedar-tokens

Token pipeline for REI's Cedar design system. Source token JSON → Style Dictionary → platform assets (JS/CSS/SCSS/iOS/Figma/site JSON) + typed consumer surfaces in `dist/`.

**Package manager: pnpm** (pnpm-lock.yaml, pnpm-workspace.yaml).

## Commands

```bash
pnpm install                 # install deps
pnpm run build               # clean → build:tokens → validate:contract → validate:syntax → validate → release notes
pnpm run build:tokens        # regenerate dist outputs (clean + normalize + style-dictionary)
pnpm test                    # vitest
pnpm run test:contract       # canonical contract suite (flags planned-vs-done gaps in ADR 0001)
pnpm run validate            # export-map + structure validation (tsx ./validate.ts)
pnpm run lint                # oxlint
pnpm run format              # oxfmt
pnpm run storybook           # dev storybook on :6006 (release-notes preview)
pnpm run sync:figma-to-tokens   # Figma → repo variable sync
pnpm run sync:tokens-to-figma   # repo → Figma push
```

Before claiming done: `pnpm run lint` and `pnpm test` pass (prepush hook enforces both). Changes to outputs need `pnpm run validate` clean.

**Agent shells:** `pnpm`/`node` come from nvm and are not on `PATH` in a non-interactive shell unless nvm is sourced — a one-shot `exec` call or a backgrounded subagent will report "command not found" even though the tools are installed. Source nvm first or call the versioned binary directly (e.g. `~/.nvm/versions/node/<version>/bin/pnpm`).

## Repo map

- `canonical/tokens.json` — authored token source (incl. legacy `UI` intent section)
- `tokens/` — token sources; legacy sources consolidated under `tokens/legacy/` (e.g. `tokens/legacy/mobile/text.json`)
- `metadata/` — platform-agnostic authored contract (e.g. `intents.json` per ADR 0007)
- `style-dictionary/` — transforms, filters, formats, configs
- `src/` — normalization, Figma sync, contract tests (`src/contract/`)
- `scripts/` — validation + release-notes generation; `scripts/agent-config/` holds agent pipeline schemas
- `dist/` — generated outputs (do not hand-edit)

## Domain notes

- **Generated files** — `dist/` outputs are generated; change the source/transform and run `build:tokens`, don't hand-edit.
- **ADRs are normative** — if you change contract-level behavior, update the ADR in the same commit (see table below). Check ADR 0001's Implementation Status section first — it describes planned state vs. current state.
- **Token descriptions** — parsed line-by-line into `$extensions.cedar.{docs,deprecation,accessibility}`; unrecognized `key:` lines silently append onto the previous structured field (ADR 0006 parser hazard). `description` is human guidance only — never authored computed metadata.
- **Agent ADR ledger** — `docs/agent-adr/learned-overrides.json` is merged at agent startup. Never edit manually; propose changes as ADR patches.
- **Planning context** — the authoritative planning source map lives in `REI/docs/agent/planning-sources.md` (cedar-ops). Link to it; don't duplicate it.

## Docs index (read before changing contract-level behavior)

| Doc                                                    | Governs                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `docs/ARCHITECTURE.md`                                 | End-to-end pipeline (preprocess → transforms → formats → dist)                                         |
| `docs/adr/0001-modular-output-architecture.md`         | Modular outputs, public entrypoints (`@rei/cdr-tokens/{types,css,scss}`), TokenDictionary contract     |
| `docs/adr/ADR-0005.md`                                 | Mobile token metadata in `$extensions.cedar.docs`; iOS-only mobile outputs                             |
| `docs/adr/0006-figma-variable-description-contract.md` | Figma `description` field contract                                                                     |
| `docs/adr/0007-ui-intents-manifest.md`                 | `metadata/intents.json`; repo originates intents, Figma consumes; evidence never written into manifest |
| `docs/TOKEN_DESCRIPTION_CONTRACT.md`                   | Normative `$description` grammar and `$extensions.cedar.*` rules                                       |
| `docs/DEPRECATION.md`                                  | Deprecation policy                                                                                     |
| `docs/release-notes-guide.md`                          | Agent-driven release-notes pipeline (`scripts/agent-config/`)                                          |
| `docs/tickets/`                                        | Scoped implementation tickets                                                                          |

## Conventions

- Conventional commits enforced via commitlint + commitizen.
- Release notes are generated (`docs:release-notes`); consumer-facing changes need accurate intent in `scripts/agent-config/release-intent.md`.
- **Shared agent skills** live in the cedar-ops repo (`REI/docs/.devin/skills/`, surfaced via `REI/.devin`). Use `docs-drift` before committing changes that intersect an ADR's Governed paths.
- **Subagents** (`qa`, `reviewer`, `detective`) are canonical in the cedar-ops repo (`REI/docs/.devin/agents/`) — `.devin/agents` here is a symlink to it, so they work whether you open the `REI` workspace or this repo alone. They read _this_ file's Commands and Domain notes at runtime, so don't fork a repo-local copy to change their behavior — edit this file instead.

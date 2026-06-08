# Ticket: contract.json Machine-Readable Artifact (Q4)

## Summary

Generate a `contract.json` artifact on every build that serves as the machine-readable contract for downstream consumers to validate against — distinct from the existing full `web.json` data dump.

## Background

Decision recorded in `docs/tickets/semantic-contract-consumer-questions.md` → Q4.

`dist/rei-dot-com/json/web.json` contains full token data but is not shaped for contract validation — it includes internal implementation details, platform-specific fields, and no deprecation or versioning metadata. A dedicated `contract.json` gives consumers (Cedar, downstream CI) a stable, narrow interface to diff against when the token package version changes.

## Planned Shape

### Top-level structure

```json
{
  "version": "14.0.0-alpha.8",
  "generatedAt": "2026-05-08T00:00:00.000Z",
  "modules": {
    "cdr-breakpoint": [
      {
        "tokenName": "CdrBreakpointXs",
        "module": "cdr-breakpoint",
        "responsibility": "breakpoint",
        "semanticKey": "xs",
        "cssVar": "--cdr-breakpoint-xs",
        "resolvedValue": "0px",
        "valueType": "dimension",
        "deprecated": false,
        "replacement": null,
        "sinceVersion": "14.0.0-alpha.1"
      }
    ]
  },
  "flat": [
    { ... }
  ]
}
```

### Required fields per entry

| Field            | Type             | Notes                                                                 |
| ---------------- | ---------------- | --------------------------------------------------------------------- |
| `tokenName`      | `string`         | PascalCase export name, e.g. `CdrBreakpointXs`                        |
| `module`         | `string`         | Foundation module slug, e.g. `cdr-breakpoint`                         |
| `responsibility` | `string`         | e.g. `breakpoint`, `color-background`, `space-scale`                  |
| `semanticKey`    | `string \| null` | The consumer-facing key (e.g. `xs`, `primary`) — null if not semantic |
| `cssVar`         | `string`         | e.g. `--cdr-breakpoint-xs`                                            |
| `resolvedValue`  | `string`         | Final resolved value after all aliases                                |
| `valueType`      | `string`         | W3C DTCG type: `dimension`, `color`, `fontFamily`, etc.               |
| `deprecated`     | `boolean`        |                                                                       |
| `replacement`    | `string \| null` | `tokenName` of the replacement if deprecated                          |
| `sinceVersion`   | `string`         | Package version when this entry was first emitted                     |

## Acceptance Criteria

1. `dist/rei-dot-com/json/contract.json` is generated on every `pnpm build` — not manually maintained.
2. Every token exported from the root entrypoint (`index.d.ts`) has a corresponding entry in `contract.json`.
3. Both `modules` (grouped by module slug) and `flat` (single array) shapes are present.
4. All required fields above are present and non-null unless explicitly nullable.
5. `sinceVersion` is read from `package.json` at build time — not hardcoded.
6. Deprecated entries are **included**, not filtered, with `deprecated: true` and a `replacement` value.
7. A JSON Schema file is added at `schema/contract.schema.json` and validated in CI (`pnpm build` or a dedicated `test:contract-schema` script).
8. `package.json` exports already has `"./json/*": "./dist/rei-dot-com/json/*"` — no new export entry is needed, but verify `./json/contract` resolves correctly through the glob.
9. A note is added to `docs/ARCHITECTURE.md` in the Outputs section describing `contract.json` purpose and structure.

## Implementation Notes

- Source data: derive from the same Style Dictionary result object used to generate `web.json`. Add a new format/action in `style-dictionary/build.ts`.
- `semanticKey` derivation: extract from token name by stripping the module prefix (e.g. `CdrBreakpointXs` → `xs`). For tokens where no clean key exists, emit `null`.
- `cssVar` derivation: already available in Style Dictionary token attributes — use the `name` attribute prefixed with `--`.
- `sinceVersion`: read `process.env.npm_package_version` or import from `package.json` at build time.
- The flat array and modules object must stay in sync — derive `flat` by flattening `modules` after construction, not by building separately.
- The JSON Schema (`schema/contract.schema.json`) should be strict: `additionalProperties: false` on each entry, all required fields listed.

## Scope

- `style-dictionary/build.ts` — add `contract.json` format and action
- `dist/rei-dot-com/json/contract.json` — generated artifact
- `schema/contract.schema.json` — JSON Schema for CI validation
- `package.json` — add `test:contract-schema` script (e.g. `ajv validate ...`)
- `.github/workflows/node.js.yml` — add schema validation step
- `docs/ARCHITECTURE.md` — note on contract.json

## References

- Q4 decision: `docs/tickets/semantic-contract-consumer-questions.md`
- Existing JSON output: `dist/rei-dot-com/json/web.json`
- Current schema: `schema/token.schema.json`
- Package exports: `package.json` → `"./json/*"`
- ADR 0001: `docs/adr/0001-modular-output-architecture.md`

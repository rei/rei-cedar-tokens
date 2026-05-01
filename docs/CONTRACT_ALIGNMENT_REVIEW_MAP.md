# Contract Alignment Review Map

Use this as the reviewer-facing summary for the contract-alignment PR.

Scope:

- Branch: pr/barrel-contract
- Intent: align generated token outputs (JS, CSS, SCSS, Types) to the next contract baseline

## Key Source Changes

| File                                                   | Description                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| style-dictionary/token-modules.ts                      | Defines module families and output responsibilities used by platform configs.                     |
| style-dictionary/configs/types.ts                      | Generates types output from module definitions and runs barrel generation action.                 |
| style-dictionary/configs/js.ts                         | Aligns JS output destinations and declaration file contract (.d.ts).                              |
| style-dictionary/configs/css.ts                        | Aligns CSS foundations output set and theme-specific palette handling.                            |
| style-dictionary/configs/filters/modules.ts            | Normalizes module-name constants used by filter builders and concat action.                       |
| style-dictionary/configs/filters/foundationsFilters.ts | Uses normalized foundations module list for generated filter outputs.                             |
| style-dictionary/configs/filters/typesFilters.ts       | Uses normalized module constants for types file generation paths.                                 |
| style-dictionary/build.ts                              | Registers actions/filters for updated pipeline; duplicate breakpoint filter registration removed. |
| style-dictionary/actions/generate-types-barrel.ts      | Generates dist/_/types/index.mjs and dist/_/types/index.d.ts.                                     |
| style-dictionary/actions/concat-files.ts               | Builds import/forward barrel lines and avoids SCSS breakpoint variable forward conflicts.         |
| package.json                                           | Updates exports/types paths to match aligned output contract, including types entrypoints.        |

## Generated Output Summary (Grouped)

| Output Group                | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| dist/rei-dot-com/types/\*\* | Regenerated type module outputs and root type barrels for rei-dot-com theme.  |
| dist/rei-dot-com/js/\*\*    | Regenerated JS runtime/declaration/CJS outputs aligned with module contract.  |
| dist/rei-dot-com/css/\*\*   | Regenerated CSS variable files for foundations and aggregate outputs.         |
| dist/rei-dot-com/scss/\*\*  | Regenerated SCSS foundation and utility mixin outputs plus cdr-tokens barrel. |
| dist/docsite/types/\*\*     | Regenerated type module outputs and root type barrels for docsite theme.      |
| dist/docsite/js/\*\*        | Regenerated JS runtime/declaration/CJS outputs aligned with module contract.  |
| dist/docsite/css/\*\*       | Regenerated CSS variable files for foundations and aggregate outputs.         |
| dist/docsite/scss/\*\*      | Regenerated SCSS foundation and utility mixin outputs plus cdr-tokens barrel. |

## Reviewer Notes

- Focus first on style-dictionary source files and package exports to validate contract intent.
- Treat dist changes as generated artifacts; review by output-family grouping rather than per-file.
- If output shape concerns arise, verify against validate-structure baseline and consumer entrypoints.

## Optional PR Snippet

Suggested short PR text:

"This PR aligns token output contract shape to next baseline by updating Style Dictionary platform configs/actions and regenerating dist outputs. Source-of-truth review should focus on style-dictionary/** and package.json; dist/** is generated and summarized by output family in docs/CONTRACT_ALIGNMENT_REVIEW_MAP.md."

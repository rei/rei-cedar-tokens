try{
(()=>{var u=__REACT__,{Children:V,Component:Y,Fragment:z,Profiler:X,PureComponent:Z,StrictMode:Q,Suspense:ee,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:te,act:oe,cloneElement:ne,createContext:re,createElement:se,createFactory:ae,createRef:ie,forwardRef:de,isValidElement:pe,lazy:ce,memo:le,startTransition:ue,unstable_act:me,useCallback:he,useContext:fe,useDebugValue:ye,useDeferredValue:ge,useEffect:ke,useId:Se,useImperativeHandle:be,useInsertionEffect:Ce,useLayoutEffect:ve,useMemo:we,useReducer:Te,useRef:xe,useState:_e,useSyncExternalStore:Be,useTransition:Ne,version:Oe}=__REACT__;var $e=__STORYBOOK_COMPONENTS__,{A:Ue,AbstractToolbar:Le,ActionBar:je,ActionList:Ie,AddonPanel:B,Badge:Me,Bar:De,Blockquote:Fe,Button:Ke,Card:Je,ClipboardCode:We,Code:Ge,Collapsible:He,DL:qe,Div:Ve,DocumentWrapper:Ye,EmptyTabContent:ze,ErrorFormatter:Xe,FlexBar:Ze,Form:Qe,H1:et,H2:tt,H3:ot,H4:nt,H5:rt,H6:st,HR:at,IconButton:it,Img:dt,LI:pt,Link:ct,ListItem:lt,Loader:ut,Modal:mt,ModalDecorator:ht,OL:ft,P:yt,Placeholder:gt,Popover:kt,PopoverProvider:St,Pre:bt,ProgressSpinner:Ct,ResetWrapper:vt,ScrollArea:wt,Select:Tt,Separator:xt,Spaced:_t,Span:Bt,StatelessTab:Nt,StatelessTabList:Ot,StatelessTabPanel:Rt,StatelessTabsView:Pt,StorybookIcon:Et,StorybookLogo:At,SyntaxHighlighter:$t,TT:Ut,TabBar:Lt,TabButton:jt,TabList:It,TabPanel:Mt,TabWrapper:Dt,Table:Ft,Tabs:Kt,TabsState:Jt,TabsView:Wt,ToggleButton:Gt,Toolbar:Ht,Tooltip:qt,TooltipLinkList:Vt,TooltipMessage:Yt,TooltipNote:zt,TooltipProvider:Xt,UL:Zt,WithTooltip:Qt,WithTooltipPure:eo,Zoom:to,codeCommon:oo,components:no,convertToReactAriaPlacement:ro,createCopyToClipboardFunction:so,getStoryHref:ao,interleaveSeparators:io,nameSpaceClassNames:po,resetComponents:co,useTabsState:lo,withReset:uo}=__STORYBOOK_COMPONENTS__;var go=__STORYBOOK_API__,{ActiveTabs:ko,Consumer:So,ManagerContext:bo,Provider:Co,RequestResponseError:vo,Tag:wo,addons:g,combineParameters:To,controlOrMetaKey:xo,controlOrMetaSymbol:_o,eventMatchesShortcut:Bo,eventToShortcut:No,experimental_MockUniversalStore:Oo,experimental_UniversalStore:Ro,experimental_getStatusStore:Po,experimental_getTestProviderStore:Eo,experimental_requestResponse:Ao,experimental_useStatusStore:$o,experimental_useTestProviderStore:Uo,experimental_useUniversalStore:Lo,internal_checklistStore:jo,internal_fullStatusStore:Io,internal_fullTestProviderStore:Mo,internal_universalChecklistStore:Do,internal_universalStatusStore:Fo,internal_universalTestProviderStore:Ko,isMacLike:Jo,isShortcutTaken:Wo,keyToSymbol:Go,merge:Ho,mockChannel:qo,optionOrAltSymbol:Vo,shortcutMatchesShortcut:Yo,shortcutToAriaKeyshortcuts:zo,shortcutToHumanString:Xo,types:N,useAddonState:Zo,useArgTypes:Qo,useArgs:en,useChannel:tn,useGlobalTypes:on,useGlobals:nn,useParameter:rn,useSharedState:sn,useStoryPrepared:an,useStorybookApi:dn,useStorybookState:pn}=__STORYBOOK_API__;var hn=__STORYBOOK_THEMING__,{CacheProvider:fn,ClassNames:yn,Global:gn,ThemeProvider:kn,background:Sn,color:bn,convert:Cn,create:O,createCache:vn,createGlobal:wn,createReset:Tn,css:xn,darken:_n,ensure:Bn,getPreferredColorScheme:Nn,ignoreSsrWarning:On,isPropValid:Rn,jsx:Pn,keyframes:En,lighten:An,srOnlyStyles:$n,styled:Un,themes:Ln,tokens:jn,typography:In,useTheme:Mn,withTheme:Dn}=__STORYBOOK_THEMING__;var R=O({base:"light",brandTitle:"Cedar Design System",brandUrl:"https://cedar.rei.com",brandTarget:"_blank",colorPrimary:"#1f513f",colorSecondary:"#406eb5",appBg:"#f7f5f3",appContentBg:"#ffffff",appPreviewBg:"#ffffff",appBorderColor:"#d5cfc3",appBorderRadius:4,textColor:"#4b4a48",textInverseColor:"#fafbf9",textMutedColor:"#736e65",barTextColor:"#736e65",barSelectedColor:"#1f513f",barHoverColor:"#406eb5",barBg:"#ffffff",inputBg:"#ffffff",inputBorder:"#958e83",inputTextColor:"#2e2e2b",inputBorderRadius:4,fontBase:'Graphik, "Graphik fallback", "Helvetica Neue", sans-serif',fontCode:'Pressura, "Courier New", monospace'});var f={selectedFile:"2026-05-20-cedar-tokens-14.md",availableFiles:["2026-05-20-cedar-tokens-14.md","2026-06-10-cedar-tokens-14.0.1.md","2026-07-01-cedar-tokens-node-24.md"],allReleaseNotes:[{fileName:"2026-05-20-cedar-tokens-14.md",version:"14.0.0",markdown:`# Release notes \u2013 v14.0.0

## Overview

Teams can now import only the token categories they use \u2014 \`@rei/cdr-tokens/css/color\`, \`@rei/cdr-tokens/scss/space\` \u2014 instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the \`exports\` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with \`@rei/cedar\` v17 \u2014 the 2 packages are a hard co-release.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Upgrade \`@rei/cedar\` to v17** \u2014 both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR.

- [ ] **Upgrade \`@rei/cdr-component-variables\` to v11** \u2014 this is the aligned release for Cedar 17 and cdr-tokens 14. Upgrade together with Cedar and Tokens.

  \`\`\`
  npm install @rei/cedar@17 @rei/cdr-tokens@14 @rei/cdr-component-variables@11
  \`\`\`

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** CSS imports (if using a single bundle):

  \`\`\`diff
  - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
  + import '@rei/cdr-tokens/css/color'
  + import '@rei/cdr-tokens/css/space'
  + // add only the categories you need
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [CSS Consumer Contract](?path=/docs/consumer-contract-css--docs) for migration guidance.

- [ ] **Updated:** SCSS imports (if importing SCSS variables):

  \`\`\`diff
  - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
  + @use '@rei/cdr-tokens/scss/color' as color;
  + @use '@rei/cdr-tokens/scss/space' as space;
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [SCSS Consumer Contract](?path=/docs/consumer-contract-scss--docs) for migration guidance.

- [ ] **Updated:** Direct \`dist/\` path references (if bypassing \`package.json\` exports):

  \`\`\`diff
  - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
  + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
  \`\`\`

  See the [Consumer Contract](?path=/docs/consumer-contract-overview--docs) for the full path mapping.

- [ ] **Update LESS imports** (if using LESS \u2014 no longer distributed):

  Replace LESS imports with CSS, SCSS, JavaScript, TypeScript, or JSON token outputs.

- [ ] **Update runtime constant imports** (if importing generated JavaScript constants):

  \`\`\`diff
  - import { CdrBreakpointLg } from '@rei/cdr-tokens'
  + import { CdrBreakpointLg } from '@rei/cdr-tokens/tokens'
  \`\`\`

  Use \`@rei/cdr-tokens/tokens\` for generated JavaScript constants. Use \`@rei/cdr-tokens/types\` for semantic foundation objects like \`CdrBreakpointOrder\`.

- [ ] **Update token JSON consumption** (if your build consumes token JSON artifacts):

  Copy the full JSON tree recursively so the new \`foundations/\` and \`components/\` directories are included. Use exported JSON paths like \`@rei/cdr-tokens/json\` or \`@rei/cdr-tokens/json/foundations/cdr-space.json\` instead of direct \`dist/\` paths.

- [ ] **Update SCSS utility imports** (if using short \`@rei/cdr-tokens/scss/*\` paths):

  The short \`@rei/cdr-tokens/scss/*\` path is now only for utility mixins like \`breakpoint-mixins\`, \`display-mixins\`, and \`type-mixins\`. Foundation SCSS partials are exposed through themed paths like \`@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space.scss\`.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Check for updated token values that may improve visual consistency
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** TypeScript type imports \u2014 per-foundation type modules for type-safe token keys:

  \`\`\`typescript
  import type { CdrColorKey } from '@rei/cdr-tokens/types/color';
  import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space';
  \`\`\`

  See the [TypeScript Consumer Contract](?path=/docs/consumer-contract-typescript--docs) for details.

### To get the most out of this update

This release enables the following new capabilities:

- Import only the tokens you use \u2014 smaller bundles for partial Cedar adoption
- Better entrypoints \u2014 per-category imports for CSS, SCSS, and TypeScript instead of monolithic barrels
- Type-safe token keys with editor autocomplete \u2014 kebab-case unions that work directly in code
- Canonical breakpoint ordering that stays synchronized with token source
- DTCG-aligned typography tokens compatible with design tooling
- Per-foundation TypeScript type modules with correct type narrowing and TS 4/5 compatibility

</details>

<details>
<summary>## New features</summary>

- **Import only the tokens you use** \u2014 a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now \`import '@rei/cdr-tokens/css/color'\` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  **Business value:** Smaller bundles \u2192 faster page loads \u2192 better user experience \u2192 higher conversion rates. Partial Cedar adopters no longer pay the bundle cost for features they don't use.
  To get started: replace \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\` with per-category imports for the foundations you need

- **Type-safe token keys** \u2014 every foundation exports kebab-case key unions (\`'one-x' | 'two-x' | ...\`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  **Business value:** Fewer runtime errors from typos, better IDE autocomplete, reduced maintenance overhead for mapping code, faster developer velocity.
  To get started: \`import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'\`

- **Canonical breakpoint ordering** \u2014 \`CdrBreakpointOrder\` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode \`['xs', 'sm', 'md', 'lg']\` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  **Business value:** Consistent responsive behavior across the codebase, reduced bugs from mismatched breakpoint arrays, single source of truth for responsive logic.
  To get started: \`import { CdrBreakpointOrder } from '@rei/cdr-tokens'\`

- **DTCG-aligned typography tokens** \u2014 all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly \u2014 no adapter required.
  **Business value:** Faster design-to-dev handoff, better integration with modern design tooling, reduced maintenance for custom translation layers, design systems stay in sync automatically.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** \u2014 every foundation ships its own \`.d.ts\` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required \`skipLibCheck\` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  **Business value:** Better IDE support, fewer type-related bugs, faster development with accurate autocomplete and refactoring, reduced need for TypeScript configuration workarounds.
  To get started: \`import type { CdrColorKey } from '@rei/cdr-tokens/types/color'\`

</details>

<details>
<summary>## Breaking changes</summary>

- **Package.json \`exports\` map restructured** \u2014 direct \`dist/\` path imports may no longer resolve
  - **Why:** the \`exports\` map uses explicit per-category entry points instead of a catch-all glob
  - **Before:** \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\`
  - **After:** \`import '@rei/cdr-tokens/css/color'\`
  - **Migrate:** replace direct \`dist/\` path imports with per-category entry points. See the migration guide for the full mapping

- **Per-foundation dist outputs relocated** \u2014 foundation outputs moved from flat theme directories to \`dist/*/foundations/\`
  - **Why:** modular architecture requires a consistent per-category directory structure
  - **Before:** \`dist/rei-dot-com/cdr-color.css\`
  - **After:** \`dist/rei-dot-com/foundations/color.css\`
  - **Migrate:** use per-category import paths rather than referencing dist files directly. If you must use dist paths, update to the \`foundations/\` structure

### Token changes

#### Relocated

- All foundation token outputs moved from flat theme directories to \`dist/*/foundations/<category>.*\`

#### Added

- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., \`CdrColorKey\`, \`CdrSpaceKey\`)
- \`CdrBreakpointOrder\` typed const tuple export

#### Format changes

- Typography tokens now use DTCG composite format (\`$value\`, \`$type\`, \`$description\`)

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The per-category import paths use \`package.json\` \`exports\` conditions. Bundlers that don't support \`exports\` (older Webpack 4 configurations, for example) will need to reference \`dist/\` paths directly using the new \`foundations/\` structure
- The kebab-case key unions are strict \u2014 if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (\`map-resolved\`, \`map-vars\`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside \`@rei/cedar\` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

</details>`},{fileName:"2026-06-10-cedar-tokens-14.0.1.md",version:"14.0.1",markdown:"# Release notes \u2013 v14.0.1\n\n## Overview\n\nPatch release that fixes a TypeScript declaration bug in the barrel file generation and restores backward compatibility for v13-style flat token imports from the root entrypoint.\n\n## Bug fixes\n\n- **TypeScript barrel export bug** \u2014 The `generate-types-barrel` action applied `export type *` uniformly to all `.d.ts` file re-exports in `tokens.d.ts`. This stripped runtime `const` exports (grouped objects, key arrays, order arrays) from the `/types` barrel entrypoint, making them unusable as values at runtime.\n  - **Root cause:** The barrel generator did not distinguish between type-only declaration files and files containing `declare const` runtime value exports.\n  - **Files changed:**\n    - `style-dictionary/actions/generate-types-barrel.ts` \u2014 Added logic to identify type-only files (`.names.d.ts`, `base/` directory) and use `export type *` only for those. All other `.d.ts` files now use `export *`. Also strips `.d.ts` extensions from barrel import paths to avoid TS2846 errors.\n    - `style-dictionary/token-keys.test.ts` \u2014 Added regression test to verify the barrel uses the correct export keyword for each file type.\n  - **Before:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` \u2014 TypeScript error: \"cannot be used as a value because it was exported using 'export type'\"\n  - **After:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` \u2014 works as both types and runtime values\n\n- **Backward-compat flat token re-exports** \u2014 The v14.0.0 release moved flat token values (e.g., `CdrBreakpointSm`) from the root `@rei/cdr-tokens` entrypoint to the `/tokens` subpath, breaking existing consumer imports. This patch re-exports all flat token values from the root entrypoint as **deprecated**, so v13-style imports continue to work while consumers migrate.\n  - **Files changed:**\n    - `style-dictionary/semantic-contract.ts` \u2014 Generates `_compat-deprecated.mjs` and `_compat-deprecated.d.ts` with `@deprecated` JSDoc tags on every flat export. These are re-exported from the main `index.mjs` / `index.d.ts`.\n  - **Before:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` \u2014 TypeScript error: module has no exported member\n  - **After:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` \u2014 works (with `@deprecated` warning in IDE)\n\n## Migration guide\n\n### No breaking changes\n\nThis is a drop-in patch. No code changes required for existing consumers.\n\n### v13 flat imports are restored (deprecated)\n\nIf you were using v13-style flat imports from the root entrypoint, they work again:\n\n```typescript\n// Works again \u2014 but deprecated, IDE will show strikethrough\nimport { CdrBreakpointSm, CdrColorBackgroundPrimary } from '@rei/cdr-tokens';\n```\n\nMigrate to grouped objects (recommended) or the `/tokens` subpath:\n\n```typescript\n// Preferred: grouped objects from root entrypoint\nimport { CdrBreakpoint, CdrColorBackground } from '@rei/cdr-tokens';\nconst sm = CdrBreakpoint.CdrBreakpointSm;\n\n// Alternative: flat values from /tokens subpath\nimport { CdrBreakpointSm } from '@rei/cdr-tokens/tokens';\n```\n\n### New capabilities unlocked\n\nThe `/types` entrypoint now correctly exports runtime values:\n\n```typescript\nimport { CdrBreakpoint, CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';\n\nconst keysToVars = (keys: readonly string[], prefix: string) =>\n  Object.fromEntries(keys.map((key) => [key, `var(--${prefix}-${key})`]));\n\nexport default {\n  theme: {\n    screens: {\n      xs: `${CdrBreakpoint.CdrBreakpointXs}px`,\n      sm: `${CdrBreakpoint.CdrBreakpointSm}px`,\n      md: `${CdrBreakpoint.CdrBreakpointMd}px`,\n      lg: `${CdrBreakpoint.CdrBreakpointLg}px`,\n    },\n    extend: {\n      spacing: keysToVars(CdrSpaceScaleKeys, 'cdr-space-scale'),\n      colors: {\n        background: keysToVars(CdrColorBackgroundKeys, 'cdr-color-background'),\n      },\n    },\n  },\n};\n```\n\n## Be Aware Of\n\n### Notices\n\n- The deprecated flat re-exports will be **removed in the next major version** (v15). Consumers should migrate to grouped objects or the `/tokens` subpath.\n- CJS `require('@rei/cdr-tokens')` still resolves to the flat token constants (unchanged).\n- This patch does not change any token values, CSS output, SCSS output, or JSON artifacts.\n- A regression test has been added to `style-dictionary/token-keys.test.ts` to prevent the barrel export bug from recurring."},{fileName:"2026-07-01-cedar-tokens-node-24.md",version:"14.1.0",markdown:`# Release notes \u2013 v14.1.0

## Overview

Minor release that adds official support for Node.js 24 by updating the engines field to allow Node 24 and above.

## Features

- **Node.js 24 support** \u2014 Updated the \`engines.node\` field in \`package.json\` from \`">= 22.12.0 <23"\` to \`">= 24.0.0"\` to officially support Node.js 24.
  - **Files changed:**
    - \`package.json\` \u2014 Updated engines.node field to \`">= 24.0.0"\`
    - \`.nvmrc\` \u2014 Updated to Node 24.0.0
    - \`.github/workflows/*.yml\` \u2014 Updated CI workflows to use Node 24.0.0
  - **Before:** Node 24 was not officially supported, causing EBADENGINE warnings during installation
  - **After:** Node 24 is fully supported with no warnings

## Migration guide

### No breaking changes

This is a backward-compatible update. Existing consumers using Node 22 or later will continue to work without any changes.

### Node.js version requirement

The minimum supported Node.js version is now 24.0.0. If you are using an earlier version, you will need to upgrade Node.js before installing this version.

## Be Aware Of

### Notices

- This release requires Node.js 24.0.0 or later
- CI/CD pipelines should be updated to use Node 24 or later
- The \`.nvmrc\` file has been updated to Node 24.0.0 for local development`}],markdown:`# Release notes \u2013 v14.0.0

## Overview

Teams can now import only the token categories they use \u2014 \`@rei/cdr-tokens/css/color\`, \`@rei/cdr-tokens/scss/space\` \u2014 instead of loading the entire token bundle. Every foundation ships its own TypeScript types, so token keys get editor autocomplete and type checking without workarounds. This is a major version because the \`exports\` map, TypeScript entry point, and dist output paths have changed. **Upgrade together with \`@rei/cedar\` v17 \u2014 the 2 packages are a hard co-release.**

<details>
<summary>## Migration guide</summary>

### Must update

Required breaking changes that must be addressed to continue using this version.

- [ ] **Upgrade \`@rei/cedar\` to v17** \u2014 both packages must be upgraded together. Upgrade tokens first, then Cedar, or both in the same PR.

- [ ] **Upgrade \`@rei/cdr-component-variables\` to v11** \u2014 this is the aligned release for Cedar 17 and cdr-tokens 14. Upgrade together with Cedar and Tokens.

  \`\`\`
  npm install @rei/cedar@17 @rei/cdr-tokens@14 @rei/cdr-component-variables@11
  \`\`\`

### Optional update

Recommended improvements to get the most out of this update.

- [ ] **Updated:** CSS imports (if using a single bundle):

  \`\`\`diff
  - import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'
  + import '@rei/cdr-tokens/css/color'
  + import '@rei/cdr-tokens/css/space'
  + // add only the categories you need
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [CSS Consumer Contract](?path=/docs/consumer-contract-css--docs) for migration guidance.

- [ ] **Updated:** SCSS imports (if importing SCSS variables):

  \`\`\`diff
  - @use '@rei/cdr-tokens/dist/scss/cdr-tokens.scss' as tokens;
  + @use '@rei/cdr-tokens/scss/color' as color;
  + @use '@rei/cdr-tokens/scss/space' as space;
  \`\`\`

  Legacy paths continue to work for backwards compatibility. See the [SCSS Consumer Contract](?path=/docs/consumer-contract-scss--docs) for migration guidance.

- [ ] **Updated:** Direct \`dist/\` path references (if bypassing \`package.json\` exports):

  \`\`\`diff
  - @rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css
  + @rei/cdr-tokens/dist/rei-dot-com/foundations/color.css
  \`\`\`

  See the [Consumer Contract](?path=/docs/consumer-contract-overview--docs) for the full path mapping.

- [ ] **Update LESS imports** (if using LESS \u2014 no longer distributed):

  Replace LESS imports with CSS, SCSS, JavaScript, TypeScript, or JSON token outputs.

- [ ] **Update runtime constant imports** (if importing generated JavaScript constants):

  \`\`\`diff
  - import { CdrBreakpointLg } from '@rei/cdr-tokens'
  + import { CdrBreakpointLg } from '@rei/cdr-tokens/tokens'
  \`\`\`

  Use \`@rei/cdr-tokens/tokens\` for generated JavaScript constants. Use \`@rei/cdr-tokens/types\` for semantic foundation objects like \`CdrBreakpointOrder\`.

- [ ] **Update token JSON consumption** (if your build consumes token JSON artifacts):

  Copy the full JSON tree recursively so the new \`foundations/\` and \`components/\` directories are included. Use exported JSON paths like \`@rei/cdr-tokens/json\` or \`@rei/cdr-tokens/json/foundations/cdr-space.json\` instead of direct \`dist/\` paths.

- [ ] **Update SCSS utility imports** (if using short \`@rei/cdr-tokens/scss/*\` paths):

  The short \`@rei/cdr-tokens/scss/*\` path is now only for utility mixins like \`breakpoint-mixins\`, \`display-mixins\`, and \`type-mixins\`. Foundation SCSS partials are exposed through themed paths like \`@rei/cdr-tokens/rei-dot-com/scss/foundations/cdr-space.scss\`.

- [ ] Review new features for opportunities to enhance your implementation
- [ ] Check for updated token values that may improve visual consistency
- [ ] Run your test suite to confirm compatibility

### New deliverables

Brand new capabilities available in this release.

- [ ] **New:** TypeScript type imports \u2014 per-foundation type modules for type-safe token keys:

  \`\`\`typescript
  import type { CdrColorKey } from '@rei/cdr-tokens/types/color';
  import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space';
  \`\`\`

  See the [TypeScript Consumer Contract](?path=/docs/consumer-contract-typescript--docs) for details.

### To get the most out of this update

This release enables the following new capabilities:

- Import only the tokens you use \u2014 smaller bundles for partial Cedar adoption
- Better entrypoints \u2014 per-category imports for CSS, SCSS, and TypeScript instead of monolithic barrels
- Type-safe token keys with editor autocomplete \u2014 kebab-case unions that work directly in code
- Canonical breakpoint ordering that stays synchronized with token source
- DTCG-aligned typography tokens compatible with design tooling
- Per-foundation TypeScript type modules with correct type narrowing and TS 4/5 compatibility

</details>

<details>
<summary>## New features</summary>

- **Import only the tokens you use** \u2014 a page that needs just color and spacing tokens no longer loads everything. Before this release, every consumer pulled the full token bundle regardless of actual usage. Now \`import '@rei/cdr-tokens/css/color'\` delivers just color tokens. Teams with partial Cedar adoption get meaningfully smaller bundles without changing any component code.
  **Business value:** Smaller bundles \u2192 faster page loads \u2192 better user experience \u2192 higher conversion rates. Partial Cedar adopters no longer pay the bundle cost for features they don't use.
  To get started: replace \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\` with per-category imports for the foundations you need

- **Type-safe token keys** \u2014 every foundation exports kebab-case key unions (\`'one-x' | 'two-x' | ...\`). Before this release, TypeScript consumers had to strip and transform PascalCase constant names or maintain local mapping code. Now token keys work directly in SCSS loops and TypeScript without transformation.
  **Business value:** Fewer runtime errors from typos, better IDE autocomplete, reduced maintenance overhead for mapping code, faster developer velocity.
  To get started: \`import type { CdrSpaceKey } from '@rei/cdr-tokens/types/space'\`

- **Canonical breakpoint ordering** \u2014 \`CdrBreakpointOrder\` is a typed const tuple. Before this release, responsive logic that needed the breakpoint order had to hardcode \`['xs', 'sm', 'md', 'lg']\` locally. Now the order stays synchronized with the token source automatically and gets compile-time type safety.
  **Business value:** Consistent responsive behavior across the codebase, reduced bugs from mismatched breakpoint arrays, single source of truth for responsive logic.
  To get started: \`import { CdrBreakpointOrder } from '@rei/cdr-tokens'\`

- **DTCG-aligned typography tokens** \u2014 all typography tokens follow the W3C Design Token Community Group composite format. Before this release, Tokens Studio, Figma Variables, and DTCG-aware tooling needed a custom translation layer to consume Cedar typography tokens. Now they read them directly \u2014 no adapter required.
  **Business value:** Faster design-to-dev handoff, better integration with modern design tooling, reduced maintenance for custom translation layers, design systems stay in sync automatically.
  To get started: point your design tooling at the published token JSON files. No custom transformer needed

- **Per-foundation TypeScript type modules** \u2014 every foundation ships its own \`.d.ts\` alongside CSS and JS outputs. Before this release, editor autocomplete and rename refactors required \`skipLibCheck\` workarounds to handle the monolithic declaration file. Now type narrowing works correctly out of the box.
  **Business value:** Better IDE support, fewer type-related bugs, faster development with accurate autocomplete and refactoring, reduced need for TypeScript configuration workarounds.
  To get started: \`import type { CdrColorKey } from '@rei/cdr-tokens/types/color'\`

</details>

<details>
<summary>## Breaking changes</summary>

- **Package.json \`exports\` map restructured** \u2014 direct \`dist/\` path imports may no longer resolve
  - **Why:** the \`exports\` map uses explicit per-category entry points instead of a catch-all glob
  - **Before:** \`import '@rei/cdr-tokens/dist/rei-dot-com/cdr-tokens.css'\`
  - **After:** \`import '@rei/cdr-tokens/css/color'\`
  - **Migrate:** replace direct \`dist/\` path imports with per-category entry points. See the migration guide for the full mapping

- **Per-foundation dist outputs relocated** \u2014 foundation outputs moved from flat theme directories to \`dist/*/foundations/\`
  - **Why:** modular architecture requires a consistent per-category directory structure
  - **Before:** \`dist/rei-dot-com/cdr-color.css\`
  - **After:** \`dist/rei-dot-com/foundations/color.css\`
  - **Migrate:** use per-category import paths rather than referencing dist files directly. If you must use dist paths, update to the \`foundations/\` structure

### Token changes

#### Relocated

- All foundation token outputs moved from flat theme directories to \`dist/*/foundations/<category>.*\`

#### Added

- Per-category CSS, SCSS, JS, JSON, and TypeScript outputs for: color, spacing, typography, breakpoint, radius, motion, prominence
- Kebab-case key union types per foundation (e.g., \`CdrColorKey\`, \`CdrSpaceKey\`)
- \`CdrBreakpointOrder\` typed const tuple export

#### Format changes

- Typography tokens now use DTCG composite format (\`$value\`, \`$type\`, \`$description\`)

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The per-category import paths use \`package.json\` \`exports\` conditions. Bundlers that don't support \`exports\` (older Webpack 4 configurations, for example) will need to reference \`dist/\` paths directly using the new \`foundations/\` structure
- The kebab-case key unions are strict \u2014 if you were using camelCase token name strings in TypeScript, you'll get type errors after upgrading. Update to the kebab-case equivalents
- SCSS map entrypoints (\`map-resolved\`, \`map-vars\`) were announced in alpha.2 and reverted before stable. They are not in this release. If you built against the alpha, remove those imports
- **Co-release:** install alongside \`@rei/cedar\` v17. Cedar v17 imports tokens directly from the modular paths introduced here. Installing one without the other will cause build failures at import resolution

</details>

<details>
<summary>## Changes in this branch</summary>

- Updates branch: no file changes detected.

</details>`,changedFiles:[],deletedTickets:[],generatedAt:"2026-09-30T19:14:21.205Z"};function E(r){return r.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function n(r){return E(r).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,"<code>$1</code>")}function I(r){return/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(r)}function P(r){return r.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(a=>a.trim())}function A(r){let a=r.replace(/\r\n/g,`
`).split(`
`),e=[],i=null,m=!1,k=!1,y=!1,o=()=>{i&&(e.push(`</${i}>`),i=null)};for(let d=0;d<a.length;d+=1){let C=a[d]??"",t=C.trimEnd(),v=t.match(/^\s*<\/?(details|summary)(?:\s[^>]*)?>\s*$/);if(v&&!m){o();let s=v[1];s==="details"?t.startsWith("</")?(k&&y&&e.push("</div>"),k=!1,y=!1):(k=!0,y=!1):s==="summary"&&t.startsWith("</")&&(y=!0,e.push('<div class="accordion-content">')),e.push(t);continue}let w=t.match(/^<summary>\s*##\s+(.+)<\/summary>$/);if(w&&!m){o(),e.push(`<summary><h2>${n(w[1]??"")}</h2></summary>`),y=!0,e.push('<div class="accordion-content">');continue}if(t.trimStart().startsWith("```")){if(m)e.push("</code></pre>"),m=!1;else{o();let s=t.trimStart().slice(3).trim(),h=s?` class="language-${s}"`:"";e.push(`<pre${h}><code>`),m=!0}continue}if(m){e.push(`${E(C)}
`);continue}if(!t){o();continue}let U=a[d+1]?.trimEnd()??"";if(t.includes("|")&&I(U)){o();let s=P(t);e.push("<table>"),e.push("<thead><tr>");for(let h of s)e.push(`<th>${n(h)}</th>`);for(e.push("</tr></thead>"),e.push("<tbody>"),d+=2;d<a.length;){let h=a[d]?.trimEnd()??"";if(!h||!h.includes("|")){d-=1;break}let L=P(h);e.push("<tr>");for(let j of L)e.push(`<td>${n(j)}</td>`);e.push("</tr>"),d+=1}e.push("</tbody>"),e.push("</table>");continue}if(t==="Copy"){o(),e.push('<p class="copy-chip">Copy</p>');continue}if(t.startsWith("##### ")){o(),e.push(`<h5>${n(t.slice(6))}</h5>`);continue}if(t.startsWith("#### ")){o(),e.push(`<h4>${n(t.slice(5))}</h4>`);continue}if(t.startsWith("### ")){o(),e.push(`<h3>${n(t.slice(4))}</h3>`);continue}if(t.startsWith("## ")){o(),e.push(`<h2>${n(t.slice(3))}</h2>`);continue}if(t.startsWith("# ")){o(),e.push(`<h1>${n(t.slice(2))}</h1>`);continue}if(t.startsWith("> ")){o(),e.push(`<blockquote>${n(t.slice(2))}</blockquote>`);continue}let T=t.match(/^(\d+)\.\s+(.*)$/);if(T){i!=="ol"&&(o(),e.push("<ol>"),i="ol"),e.push(`<li>${n(T[2]??"")}</li>`);continue}let S=t.match(/^- \[([ xX])\] (.*)$/);if(S){i!=="ul"&&(o(),e.push('<ul class="checklist">'),i="ul");let s=S[1]!==" "?" checked disabled":" disabled";e.push(`<li><input type="checkbox"${s}> ${n(S[2]??"")}</li>`);continue}let b=t.match(/^\s+- \[([ xX])\] (.*)$/);if(b){let s=b[1]!==" "?" checked disabled":" disabled";e.push(`<li class="indent"><input type="checkbox"${s}> ${n(b[2]??"")}</li>`);continue}let x=t.match(/^(\s{2,})- (.*)$/);if(x){e.push(`<li class="indent">${n(x[2]??"")}</li>`);continue}let _=t.match(/^(\s{2,})(.+)$/);if(_&&i){e.push(`<p class="indent">${n(_[2]??"")}</p>`);continue}if(t.startsWith("- ")){i!=="ul"&&(o(),e.push("<ul>"),i="ul"),e.push(`<li>${n(t.slice(2))}</li>`);continue}o(),e.push(`<p>${n(t)}</p>`)}return o(),m&&e.push("</code></pre>"),e.join(`
`)}var M={padding:"16px 20px",fontFamily:'Graphik, "Graphik fallback", "Helvetica Neue", sans-serif',lineHeight:1.5},D={marginTop:"16px",color:"#736e65",fontSize:"12px"},F=`
.release-notes-panel h1,
.release-notes-panel h2,
.release-notes-panel h3,
.release-notes-panel h4,
.release-notes-panel h5 {
  font-family: Stuart, "Stuart fallback", Georgia, serif;
  color: #1f513f;
  line-height: 1.25;
}
.release-notes-panel h2 {
  border-top: 1px solid #edeae3;
  padding-top: 12px;
  margin-top: 24px;
}
.release-notes-panel pre {
  background: #f7f5f3;
  border: 1px solid #edeae3;
  border-radius: 8px;
  padding: 10px;
  overflow-x: auto;
}
.release-notes-panel code {
  background: #f7f5f3;
  border: 1px solid #edeae3;
  border-radius: 4px;
  padding: 0 4px;
  font-family: Pressura, monospace;
}
.release-notes-panel table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}
.release-notes-panel th,
.release-notes-panel td {
  text-align: left;
  border: 1px solid #edeae3;
  padding: 8px;
}
.release-notes-panel th {
  background: #f7f5f3;
}
.release-notes-panel .copy-chip {
  display: inline-block;
  margin: 6px 0 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f4f2ed;
  border: 1px solid #d5cfc3;
  color: #4b4a48;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}
`;function $(){let r=A(f.markdown);return u.createElement("section",{style:M},[u.createElement("style",{key:"panel-style-sheet"},F),u.createElement("div",{key:"content",className:"release-notes-panel",dangerouslySetInnerHTML:{__html:r}}),u.createElement("div",{key:"meta",style:D},[`Selected file: ${f.selectedFile}`,`Available notes: ${f.availableFiles.length}`,`Changed files: ${f.changedFiles.length}`,`Generated: ${f.generatedAt}`].join(" | "))])}g.setConfig({theme:R});g.register("rei/release-notes",()=>{g.add("rei/release-notes/panel",{title:"Release Notes",type:N.PANEL,render:({active:r,key:a})=>u.createElement(B,{active:r,key:a},u.createElement($))})});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }

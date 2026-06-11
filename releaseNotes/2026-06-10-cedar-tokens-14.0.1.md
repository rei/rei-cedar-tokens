---
default: false
version: 14.0.1
date: 2026-06-10
---

# Release notes – v14.0.1

## Overview

Patch release that fixes a TypeScript declaration bug in the barrel file generation. The `@rei/cdr-tokens/types` entrypoint was using `export type *` for all `.d.ts` re-exports, which stripped runtime value exports from grouped objects and key arrays. This prevented consumers from importing and using these values at runtime (e.g., for Tailwind config integration). The fix distinguishes between genuinely type-only files (`.names.d.ts`, `base/` directory) and files with runtime value exports, using `export *` for the latter.

<details>
<summary>## Bug fixes</summary>

- **TypeScript barrel export bug** — The `generate-types-barrel` action applied `export type *` uniformly to all `.d.ts` file re-exports in `tokens.d.ts`. This stripped runtime `const` exports (grouped objects, key arrays, order arrays) from the `/types` barrel entrypoint, making them unusable as values at runtime.
  - **Root cause:** The barrel generator did not distinguish between type-only declaration files and files containing `declare const` runtime value exports.
  - **Files changed:**
    - `style-dictionary/actions/generate-types-barrel.ts` — Added logic to identify type-only files (`.names.d.ts`, `base/` directory) and use `export type *` only for those. All other `.d.ts` files now use `export *`.
    - `style-dictionary/token-keys.test.ts` — Added regression test to verify the barrel uses the correct export keyword for each file type.
  - **Before:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — TypeScript error: "cannot be used as a value because it was exported using 'export type'"
  - **After:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — works as both types and runtime values

</details>

<details>
<summary>## Migration guide</summary>

### No breaking changes

This is a drop-in patch. No code changes required for existing consumers.

### New capabilities unlocked

After upgrading, the `/types` entrypoint now correctly exports runtime values:

```typescript
// Now works — grouped objects + key arrays as runtime values
import { CdrBreakpoint, CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';

// Tailwind config pattern — map key arrays to CSS var references
const keysToVars = (keys: readonly string[], prefix: string) =>
  Object.fromEntries(keys.map((key) => [key, `var(--${prefix}-${key})`]));

export default {
  theme: {
    screens: {
      xs: `${CdrBreakpoint.CdrBreakpointXs}px`,
      sm: `${CdrBreakpoint.CdrBreakpointSm}px`,
      md: `${CdrBreakpoint.CdrBreakpointMd}px`,
      lg: `${CdrBreakpoint.CdrBreakpointLg}px`,
    },
    extend: {
      spacing: keysToVars(CdrSpaceScaleKeys, 'cdr-space-scale'),
      colors: {
        background: keysToVars(CdrColorBackgroundKeys, 'cdr-color-background'),
      },
    },
  },
};
```

</details>

<details>
<summary>## Be Aware Of</summary>

### Notices

- The root `@rei/cdr-tokens` entrypoint is unchanged. CJS `require()` still resolves to the flat token constants. Use `@rei/cdr-tokens/types` for grouped objects and key arrays.
- This patch does not change any token values, CSS output, SCSS output, or JSON artifacts — only the TypeScript declaration barrel file.
- A regression test has been added to `style-dictionary/token-keys.test.ts` to prevent this from recurring.

</details>

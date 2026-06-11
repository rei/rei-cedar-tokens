---
default: false
version: 14.0.1
date: 2026-06-10
---

# Release notes – v14.0.1

## Overview

Patch release that fixes a TypeScript declaration bug preventing runtime key arrays and grouped objects from being used as values through the `@rei/cdr-tokens/types` barrel entrypoint. This unblocks Tailwind config integration and any consumer that imports grouped objects or key arrays from the `/types` subpath.

<details>
<summary>## Bug fixes</summary>

- **`tokens.d.ts` barrel used `export type *` for all re-exports** — grouped objects (`CdrBreakpoint`, `CdrColorText`, etc.), key arrays (`CdrSpaceScaleKeys`, `CdrColorBackgroundKeys`, etc.), and order arrays (`CdrBreakpointOrder`, etc.) were re-exported as type-only from the `/types` barrel. TypeScript consumers could not use them as runtime values.
  - **Root cause:** The `generate-types-barrel` action applied `export type *` uniformly to all `.d.ts` files. Only `.names.d.ts` files (which export type unions) are genuinely type-only. All other `.d.ts` files contain `declare const` runtime value exports.
  - **Fix:** `.names.d.ts` files continue to use `export type *`. All other `.d.ts` files now use `export *`, preserving runtime value exports through the barrel.
  - **Before:** `import { CdrBreakpoint } from '@rei/cdr-tokens/types'` — TypeScript error: "cannot be used as a value because it was exported using 'export type'"
  - **After:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — works as both types and runtime values

</details>

<details>
<summary>## Migration guide</summary>

### No breaking changes

This is a drop-in patch. No code changes required.

### New capabilities unlocked

After upgrading, the `/types` entrypoint works for runtime value imports — not just type annotations:

```typescript
// Now works — grouped objects + key arrays as runtime values
import { CdrBreakpoint, CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';

// Tailwind config pattern — map key arrays to CSS var references
const keysToVars = (keys: readonly string[], prefix: string) =>
  Object.fromEntries(keys.map((key) => [key, `var(--${prefix}-${key})`]));

export default {
  theme: {
    screens: {
      lg: `${CdrBreakpoint.CdrBreakpointLg}px`,
    },
    extend: {
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
- A regression test has been added to prevent this from recurring.

</details>

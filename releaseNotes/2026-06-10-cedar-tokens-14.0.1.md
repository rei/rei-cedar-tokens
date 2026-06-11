---
default: false
version: 14.0.1
date: 2026-06-10
---

# Release notes – v14.0.1

## Overview

Patch release that fixes a TypeScript declaration bug in the barrel file generation and restores backward compatibility for v13-style flat token imports from the root entrypoint.

## Bug fixes

- **TypeScript barrel export bug** — The `generate-types-barrel` action applied `export type *` uniformly to all `.d.ts` file re-exports in `tokens.d.ts`. This stripped runtime `const` exports (grouped objects, key arrays, order arrays) from the `/types` barrel entrypoint, making them unusable as values at runtime.
  - **Root cause:** The barrel generator did not distinguish between type-only declaration files and files containing `declare const` runtime value exports.
  - **Files changed:**
    - `style-dictionary/actions/generate-types-barrel.ts` — Added logic to identify type-only files (`.names.d.ts`, `base/` directory) and use `export type *` only for those. All other `.d.ts` files now use `export *`. Also strips `.d.ts` extensions from barrel import paths to avoid TS2846 errors.
    - `style-dictionary/token-keys.test.ts` — Added regression test to verify the barrel uses the correct export keyword for each file type.
  - **Before:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — TypeScript error: "cannot be used as a value because it was exported using 'export type'"
  - **After:** `import { CdrBreakpoint, CdrSpaceScaleKeys } from '@rei/cdr-tokens/types'` — works as both types and runtime values

- **Backward-compat flat token re-exports** — The v14.0.0 release moved flat token values (e.g., `CdrBreakpointSm`) from the root `@rei/cdr-tokens` entrypoint to the `/tokens` subpath, breaking existing consumer imports. This patch re-exports all flat token values from the root entrypoint as **deprecated**, so v13-style imports continue to work while consumers migrate.
  - **Files changed:**
    - `style-dictionary/semantic-contract.ts` — Generates `_compat-deprecated.mjs` and `_compat-deprecated.d.ts` with `@deprecated` JSDoc tags on every flat export. These are re-exported from the main `index.mjs` / `index.d.ts`.
  - **Before:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` — TypeScript error: module has no exported member
  - **After:** `import { CdrBreakpointSm } from '@rei/cdr-tokens'` — works (with `@deprecated` warning in IDE)

## Migration guide

### No breaking changes

This is a drop-in patch. No code changes required for existing consumers.

### v13 flat imports are restored (deprecated)

If you were using v13-style flat imports from the root entrypoint, they work again:

```typescript
// Works again — but deprecated, IDE will show strikethrough
import { CdrBreakpointSm, CdrColorBackgroundPrimary } from '@rei/cdr-tokens';
```

Migrate to grouped objects (recommended) or the `/tokens` subpath:

```typescript
// Preferred: grouped objects from root entrypoint
import { CdrBreakpoint, CdrColorBackground } from '@rei/cdr-tokens';
const sm = CdrBreakpoint.CdrBreakpointSm;

// Alternative: flat values from /tokens subpath
import { CdrBreakpointSm } from '@rei/cdr-tokens/tokens';
```

### New capabilities unlocked

The `/types` entrypoint now correctly exports runtime values:

```typescript
import { CdrBreakpoint, CdrSpaceScaleKeys, CdrColorBackgroundKeys } from '@rei/cdr-tokens/types';

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

## Be Aware Of

### Notices

- The deprecated flat re-exports will be **removed in the next major version** (v15). Consumers should migrate to grouped objects or the `/tokens` subpath.
- CJS `require('@rei/cdr-tokens')` still resolves to the flat token constants (unchanged).
- This patch does not change any token values, CSS output, SCSS output, or JSON artifacts.
- A regression test has been added to `style-dictionary/token-keys.test.ts` to prevent the barrel export bug from recurring.

---
default: false
version: 14.0.2
date: 2026-06-11
---

# Release notes – v14.0.2

## Overview

Patch release that fixes Webpack 4 compatibility with the package.json exports map. The wildcard pattern (`./types/*`) in exports is not fully supported by Webpack 4, causing module resolution failures for Cedar v17 consumers importing from `@rei/cdr-tokens/types/*` paths. This release adds explicit exports for the type paths used by Cedar while keeping the wildcard as a fallback for modern bundlers.

## Bug fixes

- **Webpack 4 exports map compatibility** — Webpack 4 does not fully support wildcard patterns in package.json exports maps, causing module resolution failures for Cedar v17 consumers importing from `@rei/cdr-tokens/types/*` paths.
  - **Root cause:** The exports map used `"./types/*": { "import": "./dist/rei-dot-com/types/foundations/cdr-*.mjs" }` which Webpack 4 cannot resolve correctly.
  - **Files changed:**
    - `package.json` — Added explicit exports for type paths used by Cedar (breakpoint, color-background, color-border, prominence, radius, space, space-scale and their .keys variants). Kept wildcard as fallback for modern bundlers.
  - **Before:** `import { CdrSpace } from '@rei/cdr-tokens/types/space'` — Webpack 4 error: "Module not found"
  - **After:** `import { CdrSpace } from '@rei/cdr-tokens/types/space'` — Works in Webpack 4 and modern bundlers

## Migration guide

### No breaking changes

This is a drop-in patch. No code changes required for existing consumers.

### Webpack 4 consumers

If you were blocked from upgrading to Cedar v17 due to Webpack 4 compatibility, you can now upgrade:

```bash
npm install @rei/cdr-tokens@14.0.2 @rei/cedar@17.0.1 @rei/cdr-component-variables@11.0.1
```

### Modern bundlers (Vite, Webpack 5, Rollup)

No action required — the wildcard fallback continues to work as before.

## Be Aware Of

### Notices

- This patch does not change any token values, CSS output, SCSS output, or JSON artifacts.
- The explicit exports are placed before the wildcard in the package.json exports map, so they take precedence for exact matches.
- Modern bundlers will continue to work exactly as before — this is a backward-compatible enhancement.

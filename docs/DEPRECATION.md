# Token Deprecation Guide

## Overview

Cedar Tokens supports soft-deprecating tokens — keeping them in the output with their original names while marking them with metadata. This lets consumers adopt replacements on their own schedule before a token is fully removed in a future major release.

## How It Works

### 1. Mark the token in source JSON

Wrap the token in a `deprecated-YYYY-RX` top-level namespace in its source file:

```json
{
  "deprecated-2025-R1": {
    "color": {
      "old-primary": {
        "$value": "{color.blue.600}",
        "$type": "color"
      }
    }
  }
}
```

The convention is:

- `YYYY` — four-digit year of deprecation (e.g. `2025`)
- `RX` — release identifier (e.g. `R1`, `R2`)

### 2. The build pipeline strips the prefix

The `attribute/deprecated` transform runs **first** on every platform. It:

1. Detects `token.path[0].includes('deprecated')`
2. Extracts the year and release from the key
3. Replaces `token.path` with `token.path.slice(1)` — removing the prefix segment
4. Returns deprecation metadata as token attributes

Because the prefix is removed before the `name/kebab` transform runs, the emitted CSS variable name is the same as if the token were not deprecated:

```
source path:  ['deprecated-2025-R1', 'color', 'old-primary']
after strip:  ['color', 'old-primary']
emitted name: --cdr-color-old-primary  ← identical to pre-deprecation
```

### 3. Metadata is stamped on the token

After the transform runs, the token carries:

```typescript
token.attributes = {
  deprecated: true,
  'deprecated-year': '2025',
  'deprecated-release': 'R1',
};
```

This metadata is available to any custom format or action that wants to annotate the output. For example, a future enhancement could emit:

```css
/* @deprecated since 2025-R1 — use --cdr-color-background-primary instead */
--cdr-color-old-primary: #005c97;
```

---

## Transform Ordering

`attribute/deprecated` **must** be the first entry in every platform `transforms` array. All config files enforce this:

```typescript
// style-dictionary/configs/css.ts
transforms: [
  'attribute/deprecated', // ← always first
  'name/kebab',
  'size/space',
  'size/px-to-rem-transitive',
  'value/clamp',
];
```

If it runs after `name/kebab`, the variable name will incorrectly include the full `deprecated-2025-r1-` prefix.

---

## Path Replacement vs. Path Mutation

The transform uses `token.path = token.path.slice(1)` rather than `token.path.shift()`.

Both strip the first segment, but:

|                                | `shift()`             | `slice(1)` |
| ------------------------------ | --------------------- | ---------- |
| Modifies original array        | **yes**               | no         |
| Other references to the array  | see the stripped path | unaffected |
| Behavior if order ever changes | potentially unsafe    | safe       |

`slice(1)` replaces the reference on the token object rather than mutating the backing array, making the transform side-effect-free with respect to anything else that may hold a reference to the original path.

---

## Deprecation vs. Removal

| Action          | When to use                                                           |
| --------------- | --------------------------------------------------------------------- |
| **Deprecation** | Token has a replacement; consumers need migration time                |
| **Removal**     | Token has no replacement, or enough time has passed since deprecation |

Deprecated tokens remain in all dist outputs. Removed tokens do not. Use deprecation for at least one minor release cycle before removing.

---

## Current Status

No tokens are currently deprecated. The mechanism is in place and ready for use.

# Transform Guide

## Overview

Transforms are functions that modify token values or attributes during the Style Dictionary build process. REI Cedar Tokens uses both built-in Style Dictionary transforms and custom transforms.

## Transform Types

### Attribute Transforms

Modify token **metadata** without changing the value. Run once per token.

### Value Transforms

Modify the token **value** itself. Can be transitive (apply through references).

## Transform Ordering

**⚠️ CRITICAL**: Transform order matters! Transforms execute in the order specified in the `transforms` array.

### Why Order Matters

1. **Path Mutations**: `attribute/deprecated` removes path segments - must run first
2. **Value Dependencies**: Some transforms expect certain value formats from previous transforms
3. **Transitive Application**: Transitive transforms resolve references, affecting downstream transforms

### Recommended Transform Order

```typescript
transforms: [
  'attribute/deprecated', // 1. MUST be first (mutates paths)
  'name/kebab', // 2. Name formatting
  'size/space', // 3. Apply spacing modifiers
  'size/px-to-rem-transitive', // 4. Unit conversion
  'value/clamp', // 5. Value transformation
];
```

## Custom Transforms

### `attribute/deprecated`

**Type**: Attribute  
**File**: `transforms/attribute/deprecated.ts`

Extracts deprecation metadata from token paths and removes the deprecation prefix.

**Input Token Path**:

```
['deprecated-2024-R1', 'color', 'old-primary']
```

**Output**:

- Path becomes: `['color', 'old-primary']`
- Attributes added:
  ```typescript
  {
    deprecated: true,
    'deprecated-year': '2024',
    'deprecated-release': 'R1'
  }
  ```

**Usage**: All platforms

**⚠️ Must run first** - Mutates token paths which affects all downstream processing.

---

### `size/px-to-rem-transitive`

**Type**: Value (transitive)  
**File**: `transforms/size/px-to-rem.ts`

Converts pixel values to rem units for accessible, scalable typography and spacing.

**Filter**:

- Includes: `dimension`, `fontSize`, or values containing 'px'
- Excludes: `text-size-root`, `breakpoint` tokens

**Transformation**:

```typescript
// Input
{ $type: 'dimension', $value: '16px' }

// Output (BASE_FONT_SIZE = 10)
'1.6rem'
```

**Multi-value support**:

```typescript
'16px 32px 8px' → '1.6rem 3.2rem 0.8rem'
```

**Configuration**:

```typescript
{
  basePxFontSize: 10; // Override BASE_FONT_SIZE
}
```

**Usage**: Web platforms (CSS, SCSS, JS)

---

### `size/space`

**Type**: Value (transitive)  
**File**: `transforms/size/space.ts`

Applies spacing modifiers to dimension tokens for consistent spacing scales.

**Filter**: Tokens with `spacingModifier` attribute

**Transformation**:

```typescript
// Input
{
  $value: '8',
  spacingModifier: 2
}

// Output
'16.0'
```

**Usage**: CSS, SCSS outputs

---

### `size/space-js`

**Type**: Value (transitive)  
**File**: `transforms/size/space-js.ts`

JavaScript variant of `size/space` - returns integers instead of decimal strings.

**Transformation**:

```typescript
// Input
{
  $value: '8',
  spacingModifier: 2
}

// Output
16  // (integer, not '16.0')
```

**Usage**: JavaScript outputs only

---

### `size/strip-px`

**Type**: Value (transitive)  
**File**: `transforms/size/strip-px.ts`

Removes 'px' suffix from dimension values, with filtering.

**Filter**:

- `dimension` or `fontSize` tokens
- NOT in 'Prominence' category

**Transformation**:

```typescript
'16px' → '16'
'1.5rem' → '1.5rem'  // Non-px values unchanged
```

**Usage**: Mobile platforms where px is implied

---

### `size/strip-all-px`

**Type**: Value (transitive)  
**File**: `transforms/size/strip-all-px.ts`

Removes 'px' suffix from ALL tokens (no filtering).

**Transformation**:

```typescript
'24px' → '24'
```

**Usage**: Specific mobile contexts

---

### `size/strip-all-px-js`

**Type**: Value (transitive)  
**File**: `transforms/size/strip-all-px-js.ts`

JavaScript variant - strips 'px' and ensures numeric output.

**Usage**: Mobile JavaScript outputs

---

### `size/dp-transitive`

**Type**: Value (transitive)  
**File**: `transforms/size/dp-transitive.ts`

Converts dimension values to Android density-independent pixels (dp).

**Filter**:

- `dimension` or `fontSize` tokens
- NOT `text-size-root` or `breakpoint`

**Transformation**:

```typescript
'16px' → '16.00dp'
'24' → '24.00dp'
```

**Usage**: Android platform only

---

### `size/float`

**Type**: Value (transitive)  
**File**: `transforms/size/float.ts`

Converts dimension values to floating-point numbers.

**Filter**:

- `dimension` or `fontSize` tokens
- NOT `text-size-root` or `breakpoint`

**Transformation**:

```typescript
'16px' → '16.00'
'24' → '24.00'
```

**Usage**: iOS platform

---

### `value/clamp`

**Type**: Value (transitive)  
**File**: `transforms/size/clamp.ts`

Generates CSS `clamp()` functions for fluid, responsive values.

**Filter**: Tokens with `$type: 'clamp'`

**Input Format**:

```json
{
  "$type": "clamp",
  "$value": {
    "min": "0.875rem",
    "ideal": "calc(0.875rem + 0.5vw)",
    "max": "1.25rem"
  }
}
```

**Output**:

```css
clamp(0.875rem, calc(0.875rem + 0.5vw), 1.25rem)
```

**Validation**: Throws error if `min`, `ideal`, or `max` is missing.

**Usage**: Web platforms for responsive typography/spacing

---

## Built-in Transforms (Tokens Studio)

Cedar Tokens also uses transforms from [@tokens-studio/sd-transforms](https://www.npmjs.com/package/@tokens-studio/sd-transforms):

- `ts/descriptionToComment` - Convert descriptions to comments
- `ts/size/px` - Handle size tokens
- `ts/opacity` - Handle opacity values
- `ts/size/lineheight` - Line height calculations
- `ts/typography/fontWeight` - Font weight mapping
- `ts/resolveMath` - Resolve math expressions
- `ts/size/css/letterspacing` - Letter spacing conversion
- `ts/color/css/hexrgba` - Color format conversion
- `ts/shadow/css/shorthand` - Shadow shorthand generation
- `name/kebab` - Convert names to kebab-case
- `name/pascal` - Convert names to PascalCase

See the [Tokens Studio documentation](https://tokens.studio/docs/transforms/sd-transforms) for details.

## Platform Transform Patterns

### Web Platforms (CSS, SCSS)

```typescript
transforms: [
  'attribute/deprecated',
  'name/kebab',
  'ts/descriptionToComment',
  'ts/size/px',
  'ts/opacity',
  'ts/size/lineheight',
  'ts/typography/fontWeight',
  'ts/resolveMath',
  'ts/size/css/letterspacing',
  'ts/color/css/hexrgba',
  'ts/shadow/css/shorthand',
  'size/space',
  'size/px-to-rem-transitive',
  'value/clamp',
];
```

### Android

```typescript
transforms: [
  'attribute/deprecated',
  'name/pascal',
  'ts/resolveMath',
  'ts/size/px',
  'ts/color/css/hexrgba',
  'size/strip-px',
  'size/space',
  'size/dp-transitive',
];
```

### iOS

```typescript
transforms: [
  'attribute/deprecated',
  'name/pascal',
  'ts/resolveMath',
  'ts/size/px',
  'ts/color/css/hexrgba',
  'size/strip-px',
  'size/space',
  'size/float',
];
```

### JavaScript

```typescript
transforms: [
  'attribute/deprecated',
  'name/pascal',
  'ts/resolveMath',
  'ts/size/px',
  'size/space-js',
  'size/strip-all-px-js',
];
```

## Transitive Transforms

Transforms with `transitive: true` apply **through token references**.

### Example

```json
{
  "base": { "$value": "16px" },
  "derived": { "$value": "{base}" }
}
```

**Without transitive**: `derived` = `"{base}"` (unresolved)  
**With transitive**: `derived` = `"1.6rem"` (resolved and transformed)

### When to Use Transitive

- ✅ Value conversions (px→rem, px→dp)
- ✅ Unit stripping
- ✅ Math operations
- ❌ Name transforms (already transitive by default)

## Transform Testing

All custom transforms have unit tests in `*.test.ts` files.

### Running Tests

```bash
npm test                          # Run all tests
npm run test:watch                # Watch mode
npm run test:coverage             # Coverage report
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { pxToRem } from '../../utils';

describe('pxToRem', () => {
  it('should convert px to rem', () => {
    expect(pxToRem('16px', 10)).toBe('1.6rem');
  });

  it('should handle multiple values', () => {
    expect(pxToRem('16px 32px', 10)).toBe('1.6rem 3.2rem');
  });
});
```

## Creating a Custom Transform

### 1. Create Transform File

```typescript
// transforms/value/my-transform.ts
import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

export const myTransform = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'value/my-transform',
    type: 'value',
    transitive: true, // Optional
    filter: (token: Token): boolean => {
      return token.$type === 'dimension';
    },
    transform: (token: Token): string => {
      // Your transformation logic
      return transformedValue;
    },
  });
};
```

### 2. Register in build.ts

```typescript
import { myTransform } from './transforms/value/my-transform';

// Register
myTransform(StyleDictionary);
```

### 3. Add to Platform Configs

```typescript
// configs/css.ts
transforms: [
  'attribute/deprecated',
  'name/kebab',
  'value/my-transform', // Add here
  // ... other transforms
];
```

### 4. Write Tests

```typescript
// transforms/value/my-transform.test.ts
import { describe, it, expect } from 'vitest';

describe('my-transform', () => {
  it('should transform values correctly', () => {
    // Test implementation
  });
});
```

## Common Pitfalls

### ❌ Wrong Transform Order

```typescript
// BAD - deprecated not first
transforms: [
  'name/kebab',
  'attribute/deprecated', // Too late! Paths already used
];

// GOOD
transforms: [
  'attribute/deprecated', // First!
  'name/kebab',
];
```

### ❌ Forgetting Transitive Flag

```typescript
// BAD - Won't apply through references
{
  name: 'value/px-to-rem',
  transitive: false  // or omitted
}

// GOOD
{
  name: 'value/px-to-rem',
  transitive: true  // Applies through references
}
```

### ❌ Overly Broad Filters

```typescript
// BAD - Transforms ALL tokens
filter: () => true;

// GOOD - Specific filter
filter: (token) => token.$type === 'dimension';
```

## Debugging Transforms

### Enable Verbose Logging

```typescript
// configs/index.ts
{
  log: {
    verbosity: 'verbose'; // Shows transform application
  }
}
```

### Check Transformed Values

Run build and inspect output files in `dist/[theme]/[platform]/`

### Unit Test Individual Transforms

Isolate transform logic in tests to verify behavior:

```typescript
const result = myTransformFunction(testToken);
expect(result).toBe(expectedValue);
```

## Performance Considerations

- **Transitive transforms** are more expensive (run on referenced tokens)
- **Filters** should be as specific as possible to minimize execution
- **Complex transformations** should be memoized if expensive

## Further Reading

- [Style Dictionary Transforms](https://amzn.github.io/style-dictionary/#/transforms)
- [Tokens Studio Transforms](https://tokens.studio/docs/transforms/sd-transforms)
- [DTCG Specification](https://tr.designtokens.org/format/)

# REI Cedar Tokens - Architecture

## Overview

REI Cedar Tokens is a design token management system built on [Style Dictionary](https://amzn.github.io/style-dictionary/). It transforms design tokens from JSON source files into multiple platform-specific formats (CSS, SCSS, JavaScript, iOS, Android, Figma).

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Source Files                        │
│  tokens/                                                      │
│  ├── _options/       (Internal config, not exported)        │
│  ├── global/         (Cross-platform tokens)                │
│  ├── web/            (Web-specific tokens)                  │
│  ├── mobile/         (Mobile-specific tokens)               │
│  └── themes/         (Theme overrides)                      │
│      ├── rei-dot-com/                                       │
│      └── docsite/                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Style Dictionary                          │
│  Processes tokens through:                                   │
│  1. Preprocessors (tokens-studio)                           │
│  2. Transforms (value & attribute modifications)            │
│  3. Filters (inclusion/exclusion)                           │
│  4. Formats (output generation)                             │
│  5. Actions (post-build file operations)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Build Output                              │
│  dist/                                                       │
│  └── [theme]/        (e.g., rei-dot-com, docsite)          │
│      └── [platform]/ (e.g., web, android, ios)             │
│          ├── CSS files                                      │
│          ├── SCSS files (variables, maps, mixins)           │
│          ├── JavaScript (ES & CommonJS)                     │
│          ├── XML (Android)                                  │
│          ├── Swift (iOS)                                    │
│          └── JSON (Figma, site docs)                        │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### 1. Tokens vs Options

- **Tokens** (`tokens/global/`, `tokens/web/`, etc.): Exported design values (colors, spacing, typography)
- **Options** (`tokens/_options/`): Internal configuration values used to generate other tokens (not exported)

The `remove-source-tokens` filter excludes `options` and `theme` namespaces from outputs.

### 2. Themes

Themes provide overrides for base tokens. The system builds **every theme × platform combination**:

- `rei-dot-com` - REI's primary e-commerce theme
- `docsite` - Documentation site theme

Themes are defined in `tokens/themes/[theme-name]/` and use the `source` field in Style Dictionary to override `include` tokens.

### 3. Platforms

Each platform represents a different output target:

| Platform       | Output Formats | Use Case                         |
| -------------- | -------------- | -------------------------------- |
| `web`          | CSS, SCSS, JS  | Web applications                 |
| `android`      | XML            | Android native apps              |
| `ios`          | Swift          | iOS native apps                  |
| `figma`        | JSON           | Figma design tool                |
| `site/global`  | JSON           | Documentation (all platforms)    |
| `site/web`     | JSON           | Documentation (web-specific)     |
| `site/android` | JSON           | Documentation (Android-specific) |
| `site/ios`     | JSON           | Documentation (iOS-specific)     |

### 4. DTCG Specification

Tokens follow the [Design Tokens Community Group (DTCG)](https://tr.designtokens.org/format/) specification:

- Use `$type` for token type
- Use `$value` for token value
- Use `$description` for documentation
- Enable with `usesDtcg: true` in config

## Build Process

### Build Flow

```typescript
// style-dictionary/build.ts

for (const theme of THEMES) {
  // ['rei-dot-com', 'docsite']
  for (const platform of PLATFORMS) {
    // ['web', 'android', 'ios', ...]
    const config = getConfig(platform, theme);
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();
  }
}
```

### Configuration Assembly

The `getConfig()` function (in `configs/index.ts`) assembles configuration:

```typescript
{
  include: [
    'tokens/_options/**/*.json',     // Base configuration
    'tokens/global/**/*.json',       // Global tokens
    ...platformSpecificSources       // e.g., 'tokens/web/**/*.json'
  ],
  source: [
    `tokens/themes/${theme}/**/*.json` // Theme overrides
  ],
  expand: {
    include: ['typography']            // Expand composite tokens
  },
  preprocessors: ['tokens-studio'],    // Tokens Studio integration
  platforms: { /* platform-specific configs */ },
  usesDtcg: true
}
```

**Key distinction**: `include` provides base tokens, `source` provides overrides. Tokens Studio preprocessor runs first.

## Component Architecture

### Transforms

Located in `style-dictionary/transforms/`, transforms modify token values or attributes:

#### Attribute Transforms

- **`attribute/deprecated`**: Extracts deprecation metadata from token paths

#### Value Transforms (Size)

- **`size/px-to-rem-transitive`**: Converts px → rem (respects basePxFontSize)
- **`size/space`**: Applies spacing modifiers
- **`size/space-js`**: Space transform for JavaScript (integer output)
- **`size/strip-px`**: Removes px suffix (conditional)
- **`size/strip-all-px`**: Removes px suffix (all tokens)
- **`size/strip-all-px-js`**: Strip px for JavaScript
- **`size/float`**: Converts to floating point
- **`size/dp-transitive`**: Converts to Android dp units
- **`value/clamp`**: Generates CSS clamp() functions

**Transform Order Matters**: `attribute/deprecated` must run first (it mutates token paths). See [TRANSFORMS.md](./TRANSFORMS.md) for details.

### Formats

Located in `style-dictionary/formats/`, formats generate output files:

- **`scss/typography`**: SCSS mixins and placeholders for typography tokens
- **`scss/map`**: SCSS maps from utility tokens
- **`site/*`**: JSON for documentation site
- **`figma`**: JSON for Figma integration

### Filters

Located in `style-dictionary/filters/`:

- **`remove-source-tokens`**: Excludes `options` and `theme` tokens from output

### Actions

Located in `style-dictionary/actions/`, actions perform post-build file operations:

- **`include-utility-file`**: Factory for copying utility files (SCSS mixins, etc.) to build output
  - `includeDisplayScss`
  - `includeMediaQueriesScss`
  - `includeContainerQueriesScss`

### Utilities

Located in `style-dictionary/utilities/`, these are static files copied by actions:

- `display.scss` - Display utility mixins
- `media-queries.scss` - Responsive breakpoint mixins
- `container-queries.scss` - Container query mixins

## Directory Structure

```
rei-cedar-tokens/
├── style-dictionary/          # Build system
│   ├── build.ts              # Main build script
│   ├── constants.ts          # Platform/theme definitions
│   ├── utils.ts              # Shared utilities
│   ├── actions/              # Post-build file operations
│   ├── configs/              # Platform configs
│   ├── filters/              # Token filters
│   ├── formats/              # Output formats
│   ├── transforms/           # Token transforms
│   │   ├── attribute/        # Attribute transforms
│   │   └── size/             # Value transforms
│   └── utilities/            # Static utility files
│
├── tokens/                   # Source design tokens
│   ├── _options/            # Internal config (not exported)
│   ├── global/              # Cross-platform tokens
│   ├── web/                 # Web-specific
│   ├── mobile/              # Mobile-specific
│   └── themes/              # Theme overrides
│       ├── rei-dot-com/
│       └── docsite/
│
└── dist/                    # Generated outputs
    └── [theme]/[platform]/  # e.g., dist/rei-dot-com/web/
```

## Key Design Decisions

### 1. Why Themes × Platforms Build Loop?

Each theme may override different tokens, and each platform needs different transforms. Building all combinations ensures complete coverage.

### 2. Why Remove LESS Support?

LESS was removed to reduce maintenance burden. SCSS provides equivalent functionality with better TypeScript tooling and broader adoption.

### 3. Why Generic Utility Action?

Originally, 6+ nearly-identical action files existed for copying utility files. The `createIncludeUtilityAction` factory consolidates this into one reusable function.

### 4. Why Extract `pxToRem`?

The function was duplicated in transforms and formats. Extracting to `utils.ts` ensures consistency and reduces maintenance.

## Configuration Patterns

### Common Config

All platforms use `commonConfig()` for shared settings:

```typescript
{
  prefix: 'cdr',
  buildPath: `dist/${theme}/${platform}/`,
  options: { showFileHeader: false }
}
```

### Transform Groups

While Style Dictionary supports `transformGroup`, Cedar Tokens uses explicit `transforms` arrays for clarity and control.

### Platform-Specific Sources

The `getSources()` function maps platforms to their source token directories:

- Web platforms → `tokens/web/**/*.json`
- Mobile platforms → `tokens/mobile/**/*.json`
- Figma → `tokens/web/**/*.json` (uses web tokens)

## Testing

Tests are written in Vitest (configured in `vitest.config.ts`):

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI
npm run test:coverage # Coverage report
```

Test files are colocated with source: `*.test.ts`

## Extension Points

### Adding a New Transform

1. Create file in `transforms/[category]/[name].ts`
2. Export a registration function
3. Import and register in `build.ts`
4. Add to appropriate platform configs
5. Write tests in `[name].test.ts`

### Adding a New Platform

1. Create config in `configs/[platform].ts`
2. Add platform to `PLATFORMS` in `constants.ts`
3. Import and use in `configs/index.ts`
4. Update `getSources()` if platform-specific sources needed

### Adding a New Theme

1. Create directory: `tokens/themes/[theme-name]/`
2. Add theme to `THEMES` in `constants.ts`
3. Provide token overrides in theme directory

## Common Workflows

### Building Tokens

```bash
npm run build:tokens  # Build all themes × platforms
npm run build         # Build + validate + site-tokens
```

### Development

```bash
npm run lint          # Check code style
npm run format        # Fix code style
npm test              # Run tests
```

### Validation

```bash
npm run validate      # Validate generated token structure
```

## Further Reading

- [TRANSFORMS.md](./TRANSFORMS.md) - Transform ordering and dependencies
- [README.md](../README.md) - User guide and token authoring
- [Style Dictionary Docs](https://amzn.github.io/style-dictionary/) - Framework documentation

import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs-extra';
import path from 'node:path';
import { PLATFORMS, THEMES } from './constants';
import { getConfig } from './configs';
import { getDirname } from './utils';
import { foundationsModulesName } from './configs/filters/modules';

const __dirname = getDirname(import.meta.url);

/**
 * REI Cedar Tokens Build Script
 *
 * This script builds all theme × platform combinations using Style Dictionary.
 *
 * Build Process:
 * 1. Register Tokens Studio preprocessor for composite token expansion
 * 2. Register custom transforms (value & attribute modifications)
 * 3. Register custom formats (output file generation)
 * 4. Register custom actions (post-build file operations)
 * 5. Register custom filters (token inclusion/exclusion)
 * 6. Build all theme × platform combinations
 *
 * Transform Order Matters:
 * - attribute/deprecated MUST be first (mutates token paths)
 * - See docs/TRANSFORMS.md for detailed ordering requirements
 */

// ==== Include custom transforms ====
import { deprecated } from './transforms/attribute/deprecated';
import { textShortNames } from './transforms/attribute/text-short-names';
import { dpTransitive } from './transforms/size/dp-transitive';
import { space } from './transforms/size/space';
import { spaceJs } from './transforms/size/space-js';
import { pxToRemTransitive } from './transforms/size/px-to-rem';
import { stripPx } from './transforms/size/strip-px';
import { stripAllPx } from './transforms/size/strip-all-px';
import { stripAllPxJs } from './transforms/size/strip-all-px-js';
import { float } from './transforms/size/float';
import { cssClamp as clamp } from './transforms/size/clamp';

// ==== Include custom formats ====
import { scssTypography } from './formats/scss-typography';
import { scssMap } from './formats/scss-map';
import { site } from './formats/site';
import { figma as figmaFormat } from './formats/figma';
import { typescriptModuleValues } from './formats/typescript-module-values';
import { typescriptModuleDeclarations } from './formats/typescript-module-declarations';
import { typescriptTokenNameUnion } from './formats/typescript-token-name-union';
import { typescriptTokenKeyUnion } from './formats/typescript-token-key-union';

// ==== Include custom actions ====
import { concatFiles } from './actions/concat-files';
import { includeDisplayScss, includeQueriesFileScss } from './actions/include-utility-file';
import { generateTypesBarrel } from './actions/generate-types-barrel';
// ==== Include custom legacy filters ====
import { colorBackgroundTokens } from './filters/legacy/color-background-tokens';
import { colorBorderTokens } from './filters/legacy/color-border-tokens';
import { colorIconTokens } from './filters/legacy/color-icon-tokens';
import { colorTextTokens } from './filters/legacy/color-text-tokens';
import { formTokens } from './filters/legacy/form-tokens';
import { iconTokens } from './filters/legacy/icon-tokens';
import { membershipSubtleTokens } from './filters/palettes/membership-subtle-tokens';
import { membershipVibrantTokens } from './filters/palettes/membership-vibrant-tokens';
import { motionTokens } from './filters/legacy/motion-tokens';
import { prominenceTokens } from './filters/legacy/prominence-tokens';
import { radiusTokens } from './filters/legacy/radius-tokens';
import { removeCategoriesTokens } from './filters/legacy/remove-categories-tokens';
import { removeSourceTokens } from './filters/legacy/remove-source-tokens';
import { spaceTokens } from './filters/legacy/space-tokens';

// ==== Include custom foundations filters ====
import { foundationsColorBackgroundTokens } from './filters/foundations/color-background-tokens';
import { foundationsColorBorderTokens } from './filters/foundations/color-border-tokens';
import { foundationsColorTextTokens } from './filters/foundations/color-text-tokens';
import { foundationsMotionDurationTokens } from './filters/foundations/motion-duration-tokens';
import { foundationsMotionTimingTokens } from './filters/foundations/motion-timing-tokens';
import { foundationsProminenceTokens } from './filters/foundations/prominence-tokens';
import { foundationsRadiusTokens } from './filters/foundations/radius-tokens';
import { foundationsSpaceTokens } from './filters/foundations/space-tokens';
import { foundationsSpaceIconTokens } from './filters/foundations/space-icon-tokens';
import { foundationsSpaceInsetTokens } from './filters/foundations/space-inset-tokens';
import { foundationsSpaceScaleTokens } from './filters/foundations/space-scale-tokens';
import { foundationsLineHeightTokens } from './filters/foundations/line-height-tokens';
import { foundationsTextTokens } from './filters/foundations/text-tokens';
import { foundationsTypeTokens } from './filters/foundations/type-tokens';
import { foundationsFontTokens } from './filters/foundations/font-tokens';
import { foundationsTextSizeTokens } from './filters/foundations/text-font-size-tokens';
import { foundationsTextWeightTokens } from './filters/foundations/text-font-weight-tokens';
import { foundationsTextLineHeightTokens } from './filters/foundations/text-line-height-tokens';
import { foundationsTextStyleTokens } from './filters/foundations/text-font-style-tokens';
import { foundationsTextFamilyTokens } from './filters/foundations/text-font-family';
import { foundationsTextLetterSpacingTokens } from './filters/foundations/text-letter-spacing-tokens';
import { foundationsBreakpointTokens } from './filters/foundations/breakpoint-tokens';
import { foundationsColorIconsTokens } from './filters/foundations/color-icon';

// ==== Include custom component filters ====
import { componentAccordionTokens } from './filters/components/accordion-tokens';
import { componentButtonTokens } from './filters/components/button-tokens';
import { componentChipTokens } from './filters/components/chip-tokens';
import { componentFormTokens } from './filters/components/form-tokens';
import { componentInputTokens } from './filters/components/input-tokens';
import { componentLinkTokens } from './filters/components/link-tokens';
import { componentMessageTokens } from './filters/components/message-tokens';
import { componentModalTokens } from './filters/components/modal-tokens';
import { componentPaginationTokens } from './filters/components/pagination-tokens';
import { componentRatingTokens } from './filters/components/rating-tokens';
import { componentSlideTokens } from './filters/components/slide-tokens';
import { componentSurfaceSelectionTokens } from './filters/components/surface-selection-tokens';
import { componentSurfaceTokens } from './filters/components/surface-tokens';
import { componentSwitchTokens } from './filters/components/switch-tokens';
import { componentTabTokens } from './filters/components/tab-tokens';
import { componentTableTokens } from './filters/components/table-tokens';
import { componentToggleButtonTokens } from './filters/components/toggle-button-tokens';
import { componentTooltipTokens } from './filters/components/tooltip-tokens';

// ==== Register style dictionary ====
// Tokens Studio provides preprocessors and additional transforms for composite tokens
register(StyleDictionary);

// ==== Register custom transforms ====
// IMPORTANT: Transform order matters! See docs/TRANSFORMS.md
// deprecated MUST be first as it mutates token paths
deprecated(StyleDictionary);
textShortNames(StyleDictionary);
dpTransitive(StyleDictionary);
space(StyleDictionary);
spaceJs(StyleDictionary);
pxToRemTransitive(StyleDictionary);
stripPx(StyleDictionary);
stripAllPx(StyleDictionary);
stripAllPxJs(StyleDictionary);
float(StyleDictionary);
clamp(StyleDictionary);

// ==== Register custom formats ====
scssTypography(StyleDictionary);
scssMap(StyleDictionary);
site(StyleDictionary);
figmaFormat(StyleDictionary);
typescriptModuleValues(StyleDictionary);
typescriptModuleDeclarations(StyleDictionary);
typescriptTokenNameUnion(StyleDictionary);
typescriptTokenKeyUnion(StyleDictionary);
// ==== Register custom actions ====
concatFiles(StyleDictionary);
includeDisplayScss(StyleDictionary);
includeQueriesFileScss(StyleDictionary);
generateTypesBarrel(StyleDictionary);

// ==== Register custom legacy filters ====
colorBackgroundTokens(StyleDictionary);
colorBorderTokens(StyleDictionary);
colorIconTokens(StyleDictionary);
colorTextTokens(StyleDictionary);
formTokens(StyleDictionary);
iconTokens(StyleDictionary);
membershipSubtleTokens(StyleDictionary);
membershipVibrantTokens(StyleDictionary);
motionTokens(StyleDictionary);
prominenceTokens(StyleDictionary);
radiusTokens(StyleDictionary);
removeCategoriesTokens(StyleDictionary);
removeSourceTokens(StyleDictionary);
spaceTokens(StyleDictionary);

// ==== Register custom foundations filters ====
foundationsBreakpointTokens(StyleDictionary);
foundationsColorBackgroundTokens(StyleDictionary);
foundationsColorBorderTokens(StyleDictionary);
foundationsColorTextTokens(StyleDictionary);
foundationsMotionDurationTokens(StyleDictionary);
foundationsMotionTimingTokens(StyleDictionary);
foundationsProminenceTokens(StyleDictionary);
foundationsRadiusTokens(StyleDictionary);
foundationsSpaceTokens(StyleDictionary);
foundationsSpaceIconTokens(StyleDictionary);
foundationsSpaceInsetTokens(StyleDictionary);
foundationsSpaceScaleTokens(StyleDictionary);
foundationsLineHeightTokens(StyleDictionary);
foundationsTextTokens(StyleDictionary);
foundationsTextSizeTokens(StyleDictionary);
foundationsTextWeightTokens(StyleDictionary);
foundationsTextFamilyTokens(StyleDictionary);
foundationsTextLineHeightTokens(StyleDictionary);
foundationsTextStyleTokens(StyleDictionary);
foundationsTextLetterSpacingTokens(StyleDictionary);
foundationsTypeTokens(StyleDictionary);
foundationsFontTokens(StyleDictionary);
foundationsColorIconsTokens(StyleDictionary);

// ==== Register custom component filters ====
componentAccordionTokens(StyleDictionary);
componentButtonTokens(StyleDictionary);
componentChipTokens(StyleDictionary);
componentFormTokens(StyleDictionary);
componentInputTokens(StyleDictionary);
componentLinkTokens(StyleDictionary);
componentMessageTokens(StyleDictionary);
componentModalTokens(StyleDictionary);
componentPaginationTokens(StyleDictionary);
componentRatingTokens(StyleDictionary);
componentSlideTokens(StyleDictionary);
componentSurfaceSelectionTokens(StyleDictionary);
componentSurfaceTokens(StyleDictionary);
componentSwitchTokens(StyleDictionary);
componentTabTokens(StyleDictionary);
componentTableTokens(StyleDictionary);
componentToggleButtonTokens(StyleDictionary);
componentTooltipTokens(StyleDictionary);

/**
 * Convert a module name (e.g. 'color-text', 'space-inset') to PascalCase (e.g. 'ColorText', 'SpaceInset').
 */
function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Convert a PascalCase token name to a kebab-case semantic key by optionally
 * stripping a module prefix first.
 */
function toSemanticKey(tokenName: string, prefix: string): string {
  const withoutPrefix = tokenName.startsWith(prefix) ? tokenName.slice(prefix.length) : tokenName;
  return withoutPrefix
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Extract the first numeric value from a token string value.
 *
 * Examples:
 * - "1232" -> 1232
 * - "clamp(0.2rem, 0.2rem + 0.11cqi, 0.3rem)" -> 0.2
 */
function extractFirstNumeric(value: string): number {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : Number.NaN;
}

type OrderedTokenEntry = {
  tokenName: string;
  semanticKey: string;
  rawValue: string;
  numericValue: number;
};

type OrderModuleSpec = {
  sourceModuleBase: string;
  sourceTokenPrefix: string;
  orderModuleBase: string;
  orderConstName: string;
  orderKeyTypeName: string;
  description: string;
  exampleImport: string;
  numericExtractor: (value: string) => number;
  compareEntries?: (a: OrderedTokenEntry, b: OrderedTokenEntry) => number;
};

/**
 * Converts a space-scale semantic key to a sortable numeric rank.
 *
 * Examples:
 * - "0" -> 0
 * - "01" -> 0.1
 * - "34" -> 3.4
 * - "35" -> 3.5
 */
function spaceScaleRank(semanticKey: string): number {
  if (!/^\d+$/.test(semanticKey)) {
    return Number.POSITIVE_INFINITY;
  }
  if (semanticKey.length === 1) {
    return Number.parseInt(semanticKey, 10);
  }
  if (semanticKey.startsWith('0')) {
    return Number.parseFloat(`0.${semanticKey.slice(1)}`);
  }
  return Number.parseFloat(`${semanticKey[0]}.${semanticKey.slice(1)}`);
}

/**
 * Generate a canonical order module from a foundations token module.
 */
async function generateOrderModule(typesDir: string, spec: OrderModuleSpec): Promise<void> {
  const srcMjsPath = path.join(
    __dirname,
    `../dist/rei-dot-com/js/foundations/${spec.sourceModuleBase}.mjs`,
  );
  const src = await fs.readFile(srcMjsPath, 'utf8');

  const entries: OrderedTokenEntry[] = [];
  for (const match of src.matchAll(/export const (\w+) = "([^"]+)"/g)) {
    const tokenName = match[1];
    const rawValue = match[2];
    entries.push({
      tokenName,
      rawValue,
      semanticKey: toSemanticKey(tokenName, spec.sourceTokenPrefix),
      numericValue: spec.numericExtractor(rawValue),
    });
  }

  if (spec.compareEntries) {
    entries.sort(spec.compareEntries);
  } else {
    entries.sort((a, b) => {
      const numericDiff = a.numericValue - b.numericValue;
      if (!Number.isNaN(numericDiff) && numericDiff !== 0) {
        return numericDiff;
      }
      return a.semanticKey.localeCompare(b.semanticKey);
    });
  }

  const orderKeys = entries.map((entry) => entry.semanticKey);

  const orderMjs = `/**
 * ${spec.description}
 * Use this instead of hardcoding token order in consumer code.
 *
 * @example
 * import { ${spec.orderConstName} } from '@rei/cdr-tokens';
 * ${spec.exampleImport}
 */
export const ${spec.orderConstName} = ${JSON.stringify(orderKeys)};
`;

  const orderDts = `/**
 * ${spec.description}
 */
export declare const ${spec.orderConstName}: readonly ${JSON.stringify(orderKeys)};
export type ${spec.orderKeyTypeName} = (typeof ${spec.orderConstName})[number];
`;

  const foundationsTypesDir = path.join(typesDir, 'foundations');
  await fs.ensureDir(foundationsTypesDir);
  await fs.writeFile(path.join(foundationsTypesDir, `${spec.orderModuleBase}.mjs`), orderMjs);
  await fs.writeFile(path.join(foundationsTypesDir, `${spec.orderModuleBase}.d.ts`), orderDts);
}

/**
 * Generate semantic contract layer
 *
 * Writes dist/rei-dot-com/types/index.mjs and index.d.ts.
 * These are the named exports for @rei/cdr-tokens (root entrypoint):
 *   export { CdrColorText, CdrSpace, CdrType, ... }
 *
 * Export list is derived from foundationsModulesName to prevent drift.
 *
 * NOTE: dist/rei-dot-com/types/tokens.mjs and tokens.d.ts are a SEPARATE file —
 * they are the full export* barrel generated by the generate-types-barrel Style
 * Dictionary action (style-dictionary/actions/generate-types-barrel.ts).
 * Do NOT rename or merge these two outputs — they serve different entrypoints.
 */
async function generateSemanticContract() {
  const typesDir = path.join(__dirname, '../dist/rei-dot-com/types');

  // Ensure directory exists
  await fs.ensureDir(typesDir);

  // Derive exports from module registry to prevent drift
  const mjsExports = foundationsModulesName.map((moduleName) => {
    const pascal = toPascalCase(moduleName);
    return `export { Cdr${pascal} } from './foundations/cdr-${moduleName}.mjs';`;
  });

  const dtsExports = foundationsModulesName.map((moduleName) => {
    const pascal = toPascalCase(moduleName);
    // Use extensionless paths in .d.ts re-exports — explicit .d.ts extensions
    // are not valid module specifiers in declaration files.
    return `export { Cdr${pascal} } from './foundations/cdr-${moduleName}';\nexport type { Cdr${pascal}Tokens } from './foundations/cdr-${moduleName}';`;
  });

  const semanticMjsContent = `/**
 * Cedar Semantic Contract
 *
 * This module exports semantic foundation tokens with version stability guarantees.
 * Consumers can depend on these exports not changing name or being removed within a major version.
 *
 * Use for framework integrations (Tailwind, styled-components, etc).
 * Consumers own mapping these values to their framework.
 */

${mjsExports.join('\n')}
export { CdrBreakpointOrder } from './foundations/cdr-breakpoint-order.mjs';
export { CdrSpaceScaleOrder } from './foundations/cdr-space-scale-order.mjs';
export { CdrTextSizeOrder } from './foundations/cdr-text-size-order.mjs';
`;

  await fs.writeFile(path.join(typesDir, 'index.mjs'), semanticMjsContent);

  const semanticDtsContent = `/**
 * Cedar Semantic Contract - TypeScript Type Definitions
 */

${dtsExports.join('\n')}
export { CdrBreakpointOrder } from './foundations/cdr-breakpoint-order';
export type { CdrBreakpointOrderKey } from './foundations/cdr-breakpoint-order';
export { CdrSpaceScaleOrder } from './foundations/cdr-space-scale-order';
export type { CdrSpaceScaleOrderKey } from './foundations/cdr-space-scale-order';
export { CdrTextSizeOrder } from './foundations/cdr-text-size-order';
export type { CdrTextSizeOrderKey } from './foundations/cdr-text-size-order';
`;

  await fs.writeFile(path.join(typesDir, 'index.d.ts'), semanticDtsContent);

  // Generate canonical order modules for ordered-dimension token families.
  await generateOrderModule(typesDir, {
    sourceModuleBase: 'cdr-breakpoint',
    sourceTokenPrefix: 'CdrBreakpoint',
    orderModuleBase: 'cdr-breakpoint-order',
    orderConstName: 'CdrBreakpointOrder',
    orderKeyTypeName: 'CdrBreakpointOrderKey',
    description: 'Canonical breakpoint order from smallest to largest.',
    exampleImport: 'CdrBreakpointOrder.forEach((bp) => applyBreakpointStyles(bp));',
    numericExtractor: (value) => Number.parseInt(value, 10),
  });

  await generateOrderModule(typesDir, {
    sourceModuleBase: 'cdr-space-scale',
    sourceTokenPrefix: 'CdrSpaceScale',
    orderModuleBase: 'cdr-space-scale-order',
    orderConstName: 'CdrSpaceScaleOrder',
    orderKeyTypeName: 'CdrSpaceScaleOrderKey',
    description: 'Canonical space scale order from smallest to largest.',
    exampleImport: 'CdrSpaceScaleOrder.forEach((step) => applySpaceStep(step));',
    numericExtractor: extractFirstNumeric,
    compareEntries: (a, b) => {
      const rankDiff = spaceScaleRank(a.semanticKey) - spaceScaleRank(b.semanticKey);
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return a.semanticKey.localeCompare(b.semanticKey);
    },
  });

  await generateOrderModule(typesDir, {
    sourceModuleBase: 'cdr-text-size',
    sourceTokenPrefix: 'CdrTextSize',
    orderModuleBase: 'cdr-text-size-order',
    orderConstName: 'CdrTextSizeOrder',
    orderKeyTypeName: 'CdrTextSizeOrderKey',
    description: 'Canonical text size order from smallest to largest.',
    exampleImport: 'CdrTextSizeOrder.forEach((size) => applyTypeScale(size));',
    numericExtractor: (value) => Number.parseInt(value, 10),
  });

  // Append order modules to the tokens.* barrel files.
  // The generate-types-barrel SD action runs before this function, so
  // these order modules don't exist at barrel-generation time.
  // We patch them here so "@rei/cdr-tokens/types" also exposes them.
  const tokensMjsPath = path.join(typesDir, 'tokens.mjs');
  const tokensDtsPath = path.join(typesDir, 'tokens.d.ts');
  await fs.appendFile(tokensMjsPath, `export * from './foundations/cdr-breakpoint-order.mjs';\n`);
  await fs.appendFile(tokensMjsPath, `export * from './foundations/cdr-space-scale-order.mjs';\n`);
  await fs.appendFile(tokensMjsPath, `export * from './foundations/cdr-text-size-order.mjs';\n`);
  await fs.appendFile(
    tokensDtsPath,
    [
      `export { CdrBreakpointOrder } from './foundations/cdr-breakpoint-order';`,
      `export type { CdrBreakpointOrderKey } from './foundations/cdr-breakpoint-order';`,
      `export { CdrSpaceScaleOrder } from './foundations/cdr-space-scale-order';`,
      `export type { CdrSpaceScaleOrderKey } from './foundations/cdr-space-scale-order';`,
      `export { CdrTextSizeOrder } from './foundations/cdr-text-size-order';`,
      `export type { CdrTextSizeOrderKey } from './foundations/cdr-text-size-order';`,
      '',
    ].join('\n'),
  );

  console.log('✓ Generated semantic contract layer');
}

/**
 * Build all theme × platform combinations
 *
 * Iterates through all themes (rei-dot-com, docsite) and platforms
 * (web, android, ios, figma, site/*) to generate complete token sets.
 *
 * Each combination gets its own Style Dictionary instance with:
 * - Base tokens from tokens/global/ and tokens/[platform]/
 * - Theme overrides from tokens/themes/[theme]/
 * - Platform-specific transforms and formats
 *
 * Output: dist/[theme]/[platform]/
 */
async function buildAllThemesAndPlatforms() {
  for (const theme of THEMES) {
    for (const platform of PLATFORMS) {
      console.log('\n==============================================');
      console.log(`\nProcessing: [${platform}] [${theme}]`);

      const config = getConfig(platform, theme);
      const platformConfig = config[platform];
      if (platformConfig?.buildPath) {
        // Ensure removed/renamed outputs from previous builds do not linger in dist.
        fs.removeSync(path.join(__dirname, '../', platformConfig.buildPath));
      }

      const sd = new StyleDictionary(config);
      try {
        await sd.buildAllPlatforms();
      } catch (error) {
        console.error(error);
        throw new Error(`Error building platform: ${platform}`);
      }

      console.log(`\nEnd processing [${platform}] [${theme}]`);
    }
  }

  console.log('\n==============================================');
  console.log('\nBuild completed!');

  // Generate semantic contract layer after all builds complete
  await generateSemanticContract();
}

// Run the function to process all themes and platforms
buildAllThemesAndPlatforms();

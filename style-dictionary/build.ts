import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs-extra';
import path from 'node:path';
import { PLATFORMS, THEMES } from './constants';
import { getConfig } from './configs';
import { getDirname } from './utils';

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
import { foundationsSpaceInsetTokens } from './filters/foundations/space-inset-tokens';
import { foundationsSpaceScaleTokens } from './filters/foundations/space-scale-tokens';
import { foundationsLineHeightTokens } from './filters/foundations/line-height-tokens';
import { foundationsTextTokens } from './filters/foundations/text-tokens';
import { foundationsTypeTokens } from './filters/foundations/type-tokens';
import { foundationsFontTokens } from './filters/foundations/font-tokens';
import { foundationsTextFontSizeTokens } from './filters/foundations/text-font-size-tokens';
import { foundationsTextFontWeightTokens } from './filters/foundations/text-font-weight-tokens';
import { foundationsTextLineHeightTokens } from './filters/foundations/text-line-height-tokens';
import { foundationsTextFontStyleTokens } from './filters/foundations/text-font-style-tokens';
import { foundationsTextFontFamilyTokens } from './filters/foundations/text-font-family';
import { foundationsTextLetterSpacingTokens } from './filters/foundations/text-letter-spacing-tokens';
import { foundationsBreakpointTokens } from './filters/foundations/breakpoint-tokens';
import { foundationsColorIconsTokens } from './filters/foundations/color-icon';

// ==== Include custom component filters ====
import { componentAccordionTokens } from './filters/components/accordion-tokens';
import { componentButtonTokens } from './filters/components/button-tokens';
import { componentChipTokens } from './filters/components/chip-tokens';
import { componentFormTokens } from './filters/components/form-tokens';
import { componentIconTokens } from './filters/components/icon-tokens';
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
foundationsSpaceInsetTokens(StyleDictionary);
foundationsSpaceScaleTokens(StyleDictionary);
foundationsLineHeightTokens(StyleDictionary);
foundationsTextTokens(StyleDictionary);
foundationsTextFontSizeTokens(StyleDictionary);
foundationsTextFontWeightTokens(StyleDictionary);
foundationsTextFontFamilyTokens(StyleDictionary);
foundationsTextLineHeightTokens(StyleDictionary);
foundationsTextFontStyleTokens(StyleDictionary);
foundationsTextLetterSpacingTokens(StyleDictionary);
foundationsTypeTokens(StyleDictionary);
foundationsFontTokens(StyleDictionary);
foundationsColorIconsTokens(StyleDictionary);

// ==== Register custom component filters ====
componentAccordionTokens(StyleDictionary);
componentButtonTokens(StyleDictionary);
componentChipTokens(StyleDictionary);
componentFormTokens(StyleDictionary);
componentIconTokens(StyleDictionary);
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
 * Generate stable-v1 contract layer
 *
 * Creates re-export modules for stable foundation tokens that consumers
 * can depend on with version stability guarantees.
 */
async function generateStableV1Contract() {
  const typesDir = path.join(__dirname, '../dist/rei-dot-com/types');

  // Ensure directory exists
  await fs.ensureDir(typesDir);

  // Generate stable-v1.mjs
  const stableV1MjsContent = `/**
 * CEdar Stable Contract V1
 *
 * This module exports semantic foundation tokens with version stability guarantees.
 * Consumers can depend on these exports not changing name or being removed within a major version.
 *
 * Use for framework integrations (Tailwind, styled-components, etc).
 * Consumers own mapping these values to their framework.
 */

export { CdrColorText } from './foundations/cdr-color-text.mjs';
export { CdrColorBackground } from './foundations/cdr-color-background.mjs';
export { CdrColorBorder } from './foundations/cdr-color-border.mjs';
export { CdrColorIcon } from './foundations/cdr-color-icon.mjs';

export { CdrSpace } from './foundations/cdr-space.mjs';
export { CdrSpaceInset } from './foundations/cdr-space-inset.mjs';
export { CdrSpaceScale } from './foundations/cdr-space-scale.mjs';

export { CdrFont } from './foundations/cdr-font.mjs';
export { CdrTextFontFamily } from './foundations/cdr-text-font-family.mjs';
export { CdrTextFontSize } from './foundations/cdr-text-font-size.mjs';
export { CdrTextFontWeight } from './foundations/cdr-text-font-weight.mjs';
export { CdrTextFontStyle } from './foundations/cdr-text-font-style.mjs';
export { CdrTextLetterSpacing } from './foundations/cdr-text-letter-spacing.mjs';
export { CdrTextLineHeight } from './foundations/cdr-text-line-height.mjs';
export { CdrLineHeight } from './foundations/cdr-line-height.mjs';
export { CdrText } from './foundations/cdr-text.mjs';
export { CdrType } from './foundations/cdr-type.mjs';

export { CdrMotionDuration } from './foundations/cdr-motion-duration.mjs';
export { CdrMotionTiming } from './foundations/cdr-motion-timing.mjs';

export { CdrRadius } from './foundations/cdr-radius.mjs';
export { CdrProminence } from './foundations/cdr-prominence.mjs';
export { CdrBreakpoint } from './foundations/cdr-breakpoint.mjs';
`;

  await fs.writeFile(path.join(typesDir, 'stable-v1.mjs'), stableV1MjsContent);

  // Generate stable-v1.d.ts
  const stableV1DtsContent = `/**
 * Cedar Stable Contract V1 - TypeScript Type Definitions
 */

export type { CdrColorTextTokens } from './foundations/cdr-color-text.d.ts';
export type { CdrColorBackgroundTokens } from './foundations/cdr-color-background.d.ts';
export type { CdrColorBorderTokens } from './foundations/cdr-color-border.d.ts';
export type { CdrColorIconTokens } from './foundations/cdr-color-icon.d.ts';

export type { CdrSpaceTokens } from './foundations/cdr-space.d.ts';
export type { CdrSpaceInsetTokens } from './foundations/cdr-space-inset.d.ts';
export type { CdrSpaceScaleTokens } from './foundations/cdr-space-scale.d.ts';

export type { CdrFontTokens } from './foundations/cdr-font.d.ts';
export type { CdrTextFontFamilyTokens } from './foundations/cdr-text-font-family.d.ts';
export type { CdrTextFontSizeTokens } from './foundations/cdr-text-font-size.d.ts';
export type { CdrTextFontWeightTokens } from './foundations/cdr-text-font-weight.d.ts';
export type { CdrTextFontStyleTokens } from './foundations/cdr-text-font-style.d.ts';
export type { CdrTextLetterSpacingTokens } from './foundations/cdr-text-letter-spacing.d.ts';
export type { CdrTextLineHeightTokens } from './foundations/cdr-text-line-height.d.ts';
export type { CdrLineHeightTokens } from './foundations/cdr-line-height.d.ts';
export type { CdrTextTokens } from './foundations/cdr-text.d.ts';
export type { CdrTypeTokens } from './foundations/cdr-type.d.ts';

export type { CdrMotionDurationTokens } from './foundations/cdr-motion-duration.d.ts';
export type { CdrMotionTimingTokens } from './foundations/cdr-motion-timing.d.ts';

export type { CdrRadiusTokens } from './foundations/cdr-radius.d.ts';
export type { CdrProminenceTokens } from './foundations/cdr-prominence.d.ts';
export type { CdrBreakpointTokens } from './foundations/cdr-breakpoint.d.ts';
`;

  await fs.writeFile(path.join(typesDir, 'stable-v1.d.ts'), stableV1DtsContent);

  console.log('✓ Generated stable-v1 contract layer');
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

  // Generate stable-v1 contract layer after all builds complete
  await generateStableV1Contract();
}

// Run the function to process all themes and platforms
buildAllThemesAndPlatforms();

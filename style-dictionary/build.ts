import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs-extra';
import path from 'node:path';
import { PLATFORMS, THEMES } from './constants';
import { getConfig } from './configs';
import { generateSemanticContract } from './semantic-contract';
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

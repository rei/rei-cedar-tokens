import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";
import { PLATFORMS, THEMES } from "./constants";
import { getConfig } from "./configs";

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
import { deprecated } from "./transforms/attribute/deprecated";
import { dpTransitive } from "./transforms/size/dp-transitive";
import { space } from "./transforms/size/space";
import { spaceJs } from "./transforms/size/space-js";
import { pxToRemTransitive } from "./transforms/size/px-to-rem";
import { stripPx } from "./transforms/size/strip-px";
import { stripAllPx } from "./transforms/size/strip-all-px";
import { stripAllPxJs } from "./transforms/size/strip-all-px-js";
import { float } from "./transforms/size/float";
import { cssClamp as clamp } from "./transforms/size/clamp";

// ==== Include custom formats ====
import { scssTypography } from "./formats/scss-typography";
import { scssMap } from "./formats/scss-map";
import { site } from "./formats/site";
import { figma as figmaFormat } from "./formats/figma";
import { typescriptModuleValues } from "./formats/typescript-module-values";
import { typescriptModuleDeclarations } from "./formats/typescript-module-declarations";
import { typescriptTokenNameUnion } from "./formats/typescript-token-name-union";

// ==== Include custom actions ====
import { concatFiles } from "./actions/concat-files";
import {
  includeDisplayScss,
  includeQueriesFileScss,
} from "./actions/include-utility-file";

// ==== Include custom legacy filters ====
import { colorBackgroundTokens } from "./filters/legacy/color-background-tokens";
import { colorBorderTokens } from "./filters/legacy/color-border-tokens";
import { colorIconTokens } from "./filters/legacy/color-icon-tokens";
import { colorTextTokens } from "./filters/legacy/color-text-tokens";
import { formTokens } from "./filters/legacy/form-tokens";
import { iconTokens } from "./filters/legacy/icon-tokens";
import { membershipSubtleTokens } from "./filters/legacy/membership-subtle-tokens";
import { membershipVibrantTokens } from "./filters/legacy/membership-vibrant-tokens";
import { motionTokens } from "./filters/legacy/motion-tokens";
import { prominenceTokens } from "./filters/legacy/prominence-tokens";
import { radiusTokens } from "./filters/legacy/radius-tokens";
import { removeCategoriesTokens } from "./filters/legacy/remove-categories-tokens";
import { removeSourceTokens } from "./filters/legacy/remove-source-tokens";
import { spaceTokens } from "./filters/legacy/space-tokens";

// ==== Include custom foundations filters ====
import { foundationsColorBackgroundTokens } from "./filters/foundations/color-background-tokens";
import { foundationsColorBorderTokens } from "./filters/foundations/color-border-tokens";
import { foundationsColorTextTokens } from "./filters/foundations/color-text-tokens";
import { foundationsMotionTokens } from "./filters/foundations/motion-tokens";
import { foundationsProminenceTokens } from "./filters/foundations/prominence-tokens";
import { foundationsRadiusTokens } from "./filters/foundations/radius-tokens";
import { foundationsSpaceTokens } from "./filters/foundations/space-tokens";

// ==== Include custom component filters ====
import { componentAccordionTokens } from "./filters/components/accordion-tokens";
import { componentButtonTokens } from "./filters/components/button-tokens";
import { componentChipTokens } from "./filters/components/chip-tokens";
import { componentFormTokens } from "./filters/components/form-tokens";
import { componentIconTokens } from "./filters/components/icon-tokens";
import { componentInputTokens } from "./filters/components/input-tokens";
import { componentLinkTokens } from "./filters/components/link-tokens";
import { componentMessageTokens } from "./filters/components/message-tokens";
import { componentModalTokens } from "./filters/components/modal-tokens";
import { componentPaginationTokens } from "./filters/components/pagination-tokens";
import { componentRatingTokens } from "./filters/components/rating-tokens";
import { componentSlideTokens } from "./filters/components/slide-tokens";
import { componentSurfaceSelectionTokens } from "./filters/components/surface-selection-tokens";
import { componentSurfaceTokens } from "./filters/components/surface-tokens";
import { componentSwitchTokens } from "./filters/components/switch-tokens";
import { componentTabTokens } from "./filters/components/tab-tokens";
import { componentTableTokens } from "./filters/components/table-tokens";
import { componentToggleButtonTokens } from "./filters/components/toggle-button-tokens";
import { componentTooltipTokens } from "./filters/components/tooltip-tokens";

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
foundationsColorBackgroundTokens(StyleDictionary);
foundationsColorBorderTokens(StyleDictionary);
foundationsColorTextTokens(StyleDictionary);
foundationsMotionTokens(StyleDictionary);
foundationsProminenceTokens(StyleDictionary);
foundationsRadiusTokens(StyleDictionary);
foundationsSpaceTokens(StyleDictionary);

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
      console.log("\n==============================================");
      console.log(`\nProcessing: [${platform}] [${theme}]`);

      const sd = new StyleDictionary(getConfig(platform, theme));
      try {
        await sd.buildAllPlatforms();
      } catch (error) {
        console.error(error);
        throw new Error(`Error building platform: ${platform}`);
      }

      console.log(`\nEnd processing [${platform}] [${theme}]`);
    }
  }

  console.log("\n==============================================");
  console.log("\nBuild completed!");
}

// Run the function to process all themes and platforms
buildAllThemesAndPlatforms();

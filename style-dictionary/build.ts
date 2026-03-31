import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";
import { PLATFORMS, THEMES } from "./constants";
import { getConfig } from "./configs";
import { validateTokenSchema } from "./validate-schema";

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

// ==== Include custom actions ====
import { concatFiles } from "./actions/concat-files";
import {
  includeDisplayScss,
  includeQueriesFileScss,
} from "./actions/include-utility-file";

// ==== Include custom filters ====
import { colorBackgroundTokens } from "./filters/color-background-tokens";
import { colorBorderTokens } from "./filters/color-border-tokens";
import { colorIconTokens } from "./filters/color-icon-tokens";
import { colorTextTokens } from "./filters/color-text-tokens";
import { formTokens } from "./filters/form-tokens";
import { iconTokens } from "./filters/icon-tokens";
import { membershipSubtleTokens } from "./filters/membership-subtle-tokens";
import { membershipVibrantTokens } from "./filters/membership-vibrant-tokens";
import { motionTokens } from "./filters/motion-tokens";
import { prominenceTokens } from "./filters/prominence-tokens";
import { radiusTokens } from "./filters/radius-tokens";
import { removeCategoriesTokens } from "./filters/remove-categories-tokens";
import { removeSourceTokens } from "./filters/remove-source-tokens";
import { spaceTokens } from "./filters/space-tokens";

// Must run before Style Dictionary processes any tokens
validateTokenSchema();

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

// ==== Register custom actions ====
concatFiles(StyleDictionary);
includeDisplayScss(StyleDictionary);
includeQueriesFileScss(StyleDictionary);

// ==== Register custom filters ====
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

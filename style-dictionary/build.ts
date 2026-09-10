// build.ts
import fs from 'node:fs';
import StyleDictionary from 'style-dictionary';
import { iosNameTransform } from './transforms/ios/ios-name-transform.js';
import { iosColorsetAction } from './actions/ios/ios-color-action.js';
import { androidNameTransform } from './transforms/android/android-name-transform.js';
import { androidColorTransform } from './transforms/android/android-color-transform.js';
// import { androidColorAction } from './actions/android/android-color-action.js';
import { webCssAction } from './actions/web/web-css-transform.js';
import { webScssAction } from './actions/web/web-scss-transform.js';
import { webConfig, docsiteWebConfig } from './configs/web.js';

// ****** Beggining Legacy Imports ******
import { register } from '@tokens-studio/sd-transforms';
// import path from 'node:path'; Uncomment
import { PLATFORMS, THEMES } from './legacy/constants.js';
import { getConfig } from './legacy/configs/index.js';
import { generateSemanticContract } from './legacy/semantic-contract.js';
import { getDirname } from './legacy/utils.js';

const __dirname = getDirname(import.meta.url);

// Register Legacy Transforms
import { deprecated } from './legacy/transforms/attribute/deprecated.js';
import { surfaceDocs } from './legacy/transforms/attribute/surface-docs.js';
import { textShortNames } from './legacy/transforms/attribute/text-short-names.js';
import { spaceScaleRangeNames } from './legacy/transforms/attribute/space-scale-range-names.js';
import { iosNameTransform as legacyIosNameTransform } from './legacy/transforms/ios/ios-name-transform.js';
import { iosTextValueTransform as legacyIosTextValueTransform } from './legacy/transforms/ios/ios-text-value-transform.js';
import { space } from './legacy/transforms/size/space.js';
import { spaceJs } from './legacy/transforms/size/space-js.js';
import { pxToRemTransitive } from './legacy/transforms/size/px-to-rem.js';
import { stripPx } from './legacy/transforms/size/strip-px.js';
import { stripAllPx } from './legacy/transforms/size/strip-all-px.js';
import { stripAllPxJs } from './legacy/transforms/size/strip-all-px-js.js';
import { float } from './legacy/transforms/size/float.js';
import { cssClamp as clamp } from './legacy/transforms/size/clamp.js';
import { fontFamilyQuotes } from './legacy/transforms/font/font-family-quotes.js';
import { sizeRemOverride } from './legacy/transforms/size/rem-override.js';

// ==== Include custom formats ====
import { scssTypography } from './legacy/formats/scss-typography.js';
import { scssMap } from './legacy/formats/scss-map.js';
import { iosTextFormat } from './legacy/formats/ios/ios-text-format.js';
import { figma as figmaFormat } from './legacy/formats/figma.js';
import { typescriptModuleValues } from './legacy/formats/typescript-module-values.js';
import { typescriptModuleDeclarations } from './legacy/formats/typescript-module-declarations.js';
import { typescriptTokenNameUnion } from './legacy/formats/typescript-token-name-union.js';
import { typescriptTokenKeyUnion } from './legacy/formats/typescript-token-key-union.js';

// ==== Include custom actions ====
import { concatFiles } from './legacy/actions/concat-files.js';
import {
  includeDisplayScss,
  includeQueriesFileScss,
} from './legacy/actions/include-utility-file.js';
import { generateTypesBarrel } from './legacy/actions/generate-types-barrel.js';
import { deprecateComponentFiles } from './legacy/actions/deprecate-component-files.js';
// ==== Include custom legacy filters ====
import { colorBackgroundTokens } from './legacy/filters/legacy/color-background-tokens.js';
import { colorBorderTokens } from './legacy/filters/legacy/color-border-tokens.js';
import { colorIconTokens } from './legacy/filters/legacy/color-icon-tokens.js';
import { colorTextTokens } from './legacy/filters/legacy/color-text-tokens.js';
import { formTokens } from './legacy/filters/legacy/form-tokens.js';
import { iconTokens } from './legacy/filters/legacy/icon-tokens.js';
import { membershipSubtleTokens } from './legacy/filters/palettes/membership-subtle-tokens.js';
import { membershipVibrantTokens } from './legacy/filters/palettes/membership-vibrant-tokens.js';
import { motionTokens } from './legacy/filters/legacy/motion-tokens.js';
import { prominenceTokens } from './legacy/filters/legacy/prominence-tokens.js';
import { radiusTokens } from './legacy/filters/legacy/radius-tokens.js';
import { removeCategoriesTokens } from './legacy/filters/legacy/remove-categories-tokens.js';
import { removeSourceTokens } from './legacy/filters/legacy/remove-source-tokens.js';
import { spaceTokens } from './legacy/filters/legacy/space-tokens.js';

// ==== Include custom foundations filters ====
import { foundationsColorBackgroundTokens } from './legacy/filters/foundations/color-background-tokens.js';
import { foundationsColorBorderTokens } from './legacy/filters/foundations/color-border-tokens.js';
import { foundationsColorTextTokens } from './legacy/filters/foundations/color-text-tokens.js';
import { foundationsMotionDurationTokens } from './legacy/filters/foundations/motion-duration-tokens.js';
import { foundationsMotionTimingTokens } from './legacy/filters/foundations/motion-timing-tokens.js';
import { foundationsProminenceTokens } from './legacy/filters/foundations/prominence-tokens.js';
import { foundationsRadiusTokens } from './legacy/filters/foundations/radius-tokens.js';
import { foundationsSpaceTokens } from './legacy/filters/foundations/space-tokens.js';
import { foundationsSpaceIconTokens } from './legacy/filters/foundations/space-icon-tokens.js';
import { foundationsSpaceInsetTokens } from './legacy/filters/foundations/space-inset-tokens.js';
import { foundationsSpaceScaleTokens } from './legacy/filters/foundations/space-scale-tokens.js';
import { foundationsLineHeightTokens } from './legacy/filters/foundations/line-height-tokens.js';
import { foundationsTextTokens } from './legacy/filters/foundations/text-tokens.js';
import { foundationsTypeTokens } from './legacy/filters/foundations/type-tokens.js';
import { foundationsFontTokens } from './legacy/filters/foundations/font-tokens.js';
import { foundationsTextSizeTokens } from './legacy/filters/foundations/text-font-size-tokens.js';
import { foundationsTextWeightTokens } from './legacy/filters/foundations/text-font-weight-tokens.js';
import { foundationsTextLineHeightTokens } from './legacy/filters/foundations/text-line-height-tokens.js';
import { foundationsTextStyleTokens } from './legacy/filters/foundations/text-font-style-tokens.js';
import { foundationsTextFamilyTokens } from './legacy/filters/foundations/text-font-family.js';
import { foundationsTextLetterSpacingTokens } from './legacy/filters/foundations/text-letter-spacing-tokens.js';
import { foundationsBreakpointTokens } from './legacy/filters/foundations/breakpoint-tokens.js';
import { foundationsColorIconsTokens } from './legacy/filters/foundations/color-icon.js';

// ==== Include custom component filters ====
import { componentAccordionTokens } from './legacy/filters/components/accordion-tokens.js';
import { componentButtonTokens } from './legacy/filters/components/button-tokens.js';
import { componentChipTokens } from './legacy/filters/components/chip-tokens.js';
import { componentFormTokens } from './legacy/filters/components/form-tokens.js';
import { componentInputTokens } from './legacy/filters/components/input-tokens.js';
import { componentLinkTokens } from './legacy/filters/components/link-tokens.js';
import { componentMessageTokens } from './legacy/filters/components/message-tokens.js';
import { componentModalTokens } from './legacy/filters/components/modal-tokens.js';
import { componentPaginationTokens } from './legacy/filters/components/pagination-tokens.js';
import { componentRatingTokens } from './legacy/filters/components/rating-tokens.js';
import { componentSlideTokens } from './legacy/filters/components/slide-tokens.js';
import { componentSurfaceSelectionTokens } from './legacy/filters/components/surface-selection-tokens.js';
import { componentSurfaceTokens } from './legacy/filters/components/surface-tokens.js';
import { componentSwitchTokens } from './legacy/filters/components/switch-tokens.js';
import { componentTabTokens } from './legacy/filters/components/tab-tokens.js';
import { componentTableTokens } from './legacy/filters/components/table-tokens.js';
import { componentToggleButtonTokens } from './legacy/filters/components/toggle-button-tokens.js';
import { componentTooltipTokens } from './legacy/filters/components/tooltip-tokens.js';
// ****** Finished Legacy Imports ******

// ****** Beggining Legacy Register Style Dictionary ******
// ==== Register style dictionary ====
// Tokens Studio provides preprocessors and additional transforms for composite tokens
register(StyleDictionary);

// Override SD v5 built-in size/rem to exclude lineHeight/letterSpacing tokens
sizeRemOverride(StyleDictionary);

// ==== Register custom transforms ====
// IMPORTANT: Transform order matters! See docs/TRANSFORMS.md
// deprecated MUST be first as it mutates token paths
deprecated(StyleDictionary);
surfaceDocs(StyleDictionary);
textShortNames(StyleDictionary);
spaceScaleRangeNames(StyleDictionary);
legacyIosNameTransform(StyleDictionary);
legacyIosTextValueTransform(StyleDictionary);
space(StyleDictionary);
spaceJs(StyleDictionary);
pxToRemTransitive(StyleDictionary);
stripPx(StyleDictionary);
stripAllPx(StyleDictionary);
stripAllPxJs(StyleDictionary);
float(StyleDictionary);
clamp(StyleDictionary);
fontFamilyQuotes(StyleDictionary);

// ==== Register custom formats ====
scssTypography(StyleDictionary);
scssMap(StyleDictionary);
iosTextFormat(StyleDictionary);
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
deprecateComponentFiles(StyleDictionary);

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
// ****** Finished Legacy Register Style Dictionary ******

// Register iOS transforms
StyleDictionary.registerTransform(iosNameTransform);
StyleDictionary.registerAction(iosColorsetAction);

// Register Android transforms
StyleDictionary.registerTransform(androidNameTransform);
StyleDictionary.registerTransform(androidColorTransform);
// Note: Android action disabled until normalization layer generates android extensions
// StyleDictionary.registerAction(androidColorAction);

// Register web action
StyleDictionary.registerAction(webCssAction);
StyleDictionary.registerAction(webScssAction);

// cedar/ios — name transform only; value resolution handled by the action
StyleDictionary.registerTransformGroup({
  name: 'cedar/ios',
  transforms: ['name/ios-camel'],
});

// cedar/android — name and color transforms
StyleDictionary.registerTransformGroup({
  name: 'cedar/android',
  transforms: ['name/android-snake', 'value/android-color'],
});

// cedar/web — name transform only; CSS generation handled by the action
StyleDictionary.registerTransformGroup({
  name: 'cedar/web',
  transforms: ['name/camel'],
});

function toBuildError(message: string, err: unknown) {
  return err instanceof Error
    ? new Error(message, { cause: err })
    : new Error(`${message}: ${String(err)}`);
}

function removeLegacyOutputRoots() {
  const legacyOutputRoots = [
    'dist/css',
    'dist/ios',
    'dist/rei-dot-com/css',
    'dist/rei-dot-com/ios',
  ];
  legacyOutputRoots.forEach((legacyRoot) => {
    if (fs.existsSync(legacyRoot)) {
      fs.rmSync(legacyRoot, { recursive: true, force: true });
    }
  });
}

async function buildAllThemesAndPlatforms() {
  for (const theme of THEMES) {
    for (const platform of PLATFORMS) {
      console.log('\n==============================================');
      console.log(`\nProcessing: [${platform}] [${theme}]`);

      const config = getConfig(platform, theme);
      const platformConfig = config[platform];
      if (platformConfig?.buildPath) {
        // Ensure removed/renamed outputs from previous builds do not linger in dist.
        // fs.removeSync(path.join(__dirname, '../../', platformConfig.buildPath));
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

async function buildAll() {
  console.log('\n==============================================');
  console.log('Building platforms…');

  removeLegacyOutputRoots();

  for (const config of [webConfig, docsiteWebConfig]) {
    const webSd = new StyleDictionary(config);

    try {
      await webSd.buildAllPlatforms();
      console.log('  ✓ Web build complete');
    } catch (err) {
      console.error(err);
      throw toBuildError('Error building Web platform', err);
    }
  }

  await buildAllThemesAndPlatforms();

  console.log('==============================================\n');
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

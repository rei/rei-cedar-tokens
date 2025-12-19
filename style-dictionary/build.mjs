import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { getConfig } from './configs/index.mjs';

// ==== Include custom transforms ====
import { deprecated } from './transforms/attribute/deprecated.mjs';
import { dpTransitive } from './transforms/size/dp-transitive.mjs';
import { space } from './transforms/size/space.mjs';
import { spaceJs } from './transforms/size/space-js.mjs';
import { pxToRemTransitive } from './transforms/size/px-to-rem.mjs';
import { stripPx } from './transforms/size/strip-px.mjs';
import { stripAllPx } from './transforms/size/strip-all-px.mjs';
import { stripAllPxJs } from './transforms/size/strip-all-px-js.mjs';
import { float } from './transforms/size/float.mjs';

// ==== Include custom formats ====
import { scssMixin } from './formats/scss-mixin.mjs';
import { scssMap } from './formats/scss-map.mjs';
import { less as lessFormat } from './formats/less.mjs';
import { site } from './formats/site.mjs';
import { figma as figmaFormat } from './formats/figma.mjs';
import { cssClamp as clamp } from './transforms/size/clamp.mjs';

// ==== Include custom formats ====
import { concatFiles } from './actions/concat-files.mjs';
import { includeDisplayLess } from './actions/include-display-less.mjs';
import { includeDisplayScss } from './actions/include-display-scss.mjs';
import { includeMediaQueriesLess } from './actions/include-media-queries-less.mjs';
import { includeContainerQueriesLess } from './actions/include-container-queries-less.mjs';
import { includeQueriesFileScss } from './actions/include-queries-file-scss.mjs';

// ==== Include custom filters ====
import { removeSourceTokens } from './filters/remove-source-tokens.mjs';
import { removeCategoriesTokens } from './filters/remove-categories-tokens.mjs';
import { colorBackgroundTokens } from './filters/color-background-tokens.mjs';
import { colorTextTokens } from './filters/color-text-tokens.mjs';
import { colorBorderTokens } from './filters/color-border-tokens.mjs';
import { colorIconTokens } from './filters/color-icon-tokens.mjs';
import { prominenceTokens } from './filters/prominence-tokens.mjs';
import { formTokens } from './filters/form-tokens.mjs';
import { iconTokens } from './filters/icon-tokens.mjs';
import { radiusTokens } from './filters/radius-tokens.mjs';
import { motionTokens } from './filters/motion-tokens.mjs';
import { spaceTokens } from './filters/space-tokens.mjs';

// ==== Register style dictionary ====
register(StyleDictionary);

// ==== Register custom transforms ====
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
scssMixin(StyleDictionary);
scssMap(StyleDictionary);
lessFormat(StyleDictionary);
site(StyleDictionary);
figmaFormat(StyleDictionary);

// ==== Register custom actions ====
concatFiles(StyleDictionary);
includeDisplayLess(StyleDictionary);
includeDisplayScss(StyleDictionary);
includeMediaQueriesLess(StyleDictionary);
includeContainerQueriesLess(StyleDictionary);
includeQueriesFileScss(StyleDictionary);

// ==== Register custom filters ====
removeSourceTokens(StyleDictionary);
removeCategoriesTokens(StyleDictionary);
colorBackgroundTokens(StyleDictionary);
colorTextTokens(StyleDictionary);
colorBorderTokens(StyleDictionary);
colorIconTokens(StyleDictionary);
motionTokens(StyleDictionary);
prominenceTokens(StyleDictionary);
formTokens(StyleDictionary);
iconTokens(StyleDictionary);
radiusTokens(StyleDictionary);
spaceTokens(StyleDictionary);

const themes = ['rei-dot-com', 'docsite'];

const platforms = [
  'site/global',
  'site/web',
  'site/android',
  'site/ios',
  'web',
  'android',
  'ios',
  'figma',
];

async function buildAllThemesAndPlatforms() {
  for (const theme of themes) {
    for (const platform of platforms) {
      console.log('\n==============================================');
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

  console.log('\n==============================================');
  console.log('\nBuild completed!');
}

// Run the function to process all themes and platforms
buildAllThemesAndPlatforms();

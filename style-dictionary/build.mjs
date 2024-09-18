import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'
import { getConfig } from './configs/index.mjs'

// ==== Include custom transforms ====
import { deprecated } from './transforms/attribute/deprecated.mjs'
import { dpTransitive } from './transforms/size/dp-transitive.mjs'
import { space } from './transforms/size/space.mjs'
import { spaceJs } from './transforms/size/space-js.mjs'
import { pxToRemTransitive } from './transforms/size/px-to-rem.mjs'
import { stripPx } from './transforms/size/strip-px.mjs'
import { stripAllPx } from './transforms/size/strip-all-px.mjs'
import { stripAllPxJs } from './transforms/size/strip-all-px-js.mjs'
import { float } from './transforms/size/float.mjs'
import { alpha } from './transforms/color/alpha.mjs'
import { colorCssTransitive } from './transforms/color/color-css-transitive.mjs'
import { hex8AndroidTransitive } from './transforms/color/hex8-android-transitive.mjs'
import { uiColorTransitive } from './transforms/color/uicolor-transitive.mjs'

// ==== Include custom formats ====
import { scssMixin } from './formats/scss-mixin.mjs'
import { scssMap } from './formats/scss-map.mjs'
import { less as lessFormat } from './formats/less.mjs'
import { site } from './formats/site.mjs'
import { figma as figmaFormat } from './formats/figma.mjs'

// ==== Include custom formats ====
import { concatFiles } from './actions/concat-files.mjs'
import { includeDeprecateScss } from './actions/include-deprecate-scss.mjs'
import { includeDisplayLess } from './actions/include-display-less.mjs'
import { includeDisplayScss } from './actions/include-display-scss.mjs'
import { includeMediaQueriesLess } from './actions/include-media-queries-less.mjs'
import { includeMediaQueriesScss } from './actions/include-media-queries-scss.mjs'

// ==== Include custom filters ====
import { removeSourceTokens } from './filters/remove-source-tokens.mjs'
import { iosSize } from './filters/ios-size.mjs'

// ==== Register style dictionary ====
register(StyleDictionary)

// ==== Register custom transforms ====
deprecated(StyleDictionary)
dpTransitive(StyleDictionary)
space(StyleDictionary)
spaceJs(StyleDictionary)
pxToRemTransitive(StyleDictionary)
stripPx(StyleDictionary)
stripAllPx(StyleDictionary)
stripAllPxJs(StyleDictionary)
float(StyleDictionary)
alpha(StyleDictionary)
colorCssTransitive(StyleDictionary)
hex8AndroidTransitive(StyleDictionary)
uiColorTransitive(StyleDictionary)

// ==== Register custom formats ====
scssMixin(StyleDictionary)
scssMap(StyleDictionary)
lessFormat(StyleDictionary)
site(StyleDictionary)
figmaFormat(StyleDictionary)

// ==== Register custom actions ====
concatFiles(StyleDictionary)
includeDeprecateScss(StyleDictionary)
includeDisplayLess(StyleDictionary)
includeDisplayScss(StyleDictionary)
includeMediaQueriesLess(StyleDictionary)
includeMediaQueriesScss(StyleDictionary)

// ==== Register custom filters ====
removeSourceTokens(StyleDictionary)
iosSize(StyleDictionary)

const themes = [
  'rei-dot-com',
  'docsite'
]

const platforms = [
  'site/global',
  'site/web',
  'site/android',
  'site/ios',
  'web',
  'android',
  'ios',
  'figma'
]

async function buildAllThemesAndPlatforms () {
  for (const theme of themes) {
    for (const platform of platforms) {
      console.log('\n==============================================')
      console.log(`\nProcessing: [${platform}] [${theme}]`)

      const sd = new StyleDictionary(getConfig(platform, theme))
      try {
        await sd.buildAllPlatforms()
      } catch (error) {
        console.error(error)
        throw new Error(`Error building platform: ${platform}`)
      }

      console.log(`\nEnd processing [${platform}] [${theme}]`)
    }
  }

  console.log('\n==============================================')
  console.log('\nBuild completed!')
}

// Run the function to process all themes and platforms
buildAllThemesAndPlatforms()

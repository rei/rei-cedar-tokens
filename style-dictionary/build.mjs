import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'
import { getConfig } from './configs/index.mjs'

// ==== Include custom transforms ====
import { options } from './transforms/attribute/options.mjs'
import { deprecated } from './transforms/attribute/deprecated.mjs'
import { cdrCti } from './transforms/attribute/cdr-cti.mjs'
import { dpTransitive } from './transforms/size/dp-transitive.mjs'
import { space } from './transforms/size/space.mjs'
import { spaceJs } from './transforms/size/space-js.mjs'
import { pxToRem } from './transforms/size/px-to-rem.mjs'
import { stripPx } from './transforms/size/strip-px.mjs'
import { stripAllPx } from './transforms/size/strip-all-px.mjs'
import { stripAllPxJs } from './transforms/size/strip-all-px-js.mjs'
import { float } from './transforms/size/float.mjs'
import { alpha } from './transforms/color/alpha.mjs'
import { colorCssTransitive } from './transforms/color/color-css-transitive.mjs'
import { hex8AndroidTransitive } from './transforms/color/hex8-android-transitive.mjs'
import { uiColorTransitive } from './transforms/color/uicolor-transitive.mjs'
import { spTransitive } from './transforms/size/sp-transitive.mjs'
import { timeSeconds } from './transforms/value/time-seconds.mjs'

// ==== Include custom formats ====
import { scssMixin } from './formats/scss-mixin.mjs'
import { scssMap } from './formats/scss-map.mjs'
import { less as lessFormat } from './formats/less.mjs'
import { js as jsFormat } from './formats/js.mjs'
import { site } from './formats/site.mjs'
import { figma as figmaFormat } from './formats/figma.mjs'
import { androidColors, androidDimens, androidFontDimens } from './formats/android.mjs'

// ==== Include custom formats ====
import { concatFiles } from './actions/concat-files.mjs'
import { includeMediaQueriesScss } from './actions/include-media-queries-scss.mjs'
import { includeMediaQueriesLess } from './actions/include-media-queries-less.mjs'
import { includeDisplayScss } from './actions/include-display-scss.mjs'
import { includeDisplayLess } from './actions/include-display-less.mjs'
import { includeDeprecateScss } from './actions/include-deprecate-scss.mjs'

// ==== Include custom filters ====
import { iosColor } from './filters/ios-color.mjs'
import { iosSize } from './filters/ios-size.mjs'
import { removeSourceTokens } from './filters/remove-source-tokens.mjs'

// ==== Register style dictionary ====
register(StyleDictionary)

// ==== Register custom transforms ====
options(StyleDictionary)
deprecated(StyleDictionary)
cdrCti(StyleDictionary)
dpTransitive(StyleDictionary)
space(StyleDictionary)
spaceJs(StyleDictionary)
pxToRem(StyleDictionary)
stripPx(StyleDictionary)
stripAllPx(StyleDictionary)
stripAllPxJs(StyleDictionary)
float(StyleDictionary)
alpha(StyleDictionary)
colorCssTransitive(StyleDictionary)
hex8AndroidTransitive(StyleDictionary)
uiColorTransitive(StyleDictionary)
spTransitive(StyleDictionary)
timeSeconds(StyleDictionary)

// ==== Register custom formats ====
scssMixin(StyleDictionary)
scssMap(StyleDictionary)
lessFormat(StyleDictionary)
jsFormat(StyleDictionary)
site(StyleDictionary)
figmaFormat(StyleDictionary)
androidColors(StyleDictionary)
androidDimens(StyleDictionary)
androidFontDimens(StyleDictionary)

// ==== Register custom actions ====
concatFiles(StyleDictionary)
includeMediaQueriesScss(StyleDictionary)
includeMediaQueriesLess(StyleDictionary)
includeDisplayScss(StyleDictionary)
includeDisplayLess(StyleDictionary)
includeDeprecateScss(StyleDictionary)

// ==== Register custom filters ====
removeSourceTokens(StyleDictionary)
iosColor(StyleDictionary)
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

themes.forEach((theme) => {
  platforms.map(async (platform) => {
    console.log('\n==============================================')
    console.log(`\nProcessing: [${platform}] [${theme}]`)

    const sd = new StyleDictionary(getConfig(platform, theme))
    await sd.buildAllPlatforms()

    console.log(`\nEnd processing [${platform}] [${theme}]`)
  })
})

console.log('\n==============================================')
console.log('\nBuild completed!')

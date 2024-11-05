// Import platform configs and add them below
import { css as cssConfig } from './css.mjs'
import { scss as scssConfig } from './scss.mjs'
import { less as lessConfig } from './less.mjs'
import { js as jsConfig } from './js.mjs'
import { android as androidConfig } from './android.mjs'
import { ios as iosConfig } from './ios.mjs'
import { siteGlobal as siteGlobalConfig } from './site.global.mjs'
import { siteWeb as siteWebConfig } from './site.web.mjs'
import { siteAndroid as siteAndroidConfig } from './site.android.mjs'
import { siteIos as siteIosConfig } from './site.ios.mjs'
import { figma as figmaConfig } from './figma.mjs'

const getSources = (platform) => {
  const sources = {
    'site/global': [],
    'site/web': ['tokens/web/**/*.json5'],
    'site/android': ['tokens/mobile/**/*.json5'],
    'site/ios': ['tokens/mobile/**/*.json5'],
    web: ['tokens/web/**/*.json5'],
    android: ['tokens/mobile/**/*.json5'],
    ios: ['tokens/mobile/**/*.json5'],
    figma: ['tokens/web/**/*.json5']
  }

  return sources[platform]
}

const allPlatforms = (platform, theme) => {
  const platforms = {
    web: { ...cssConfig(theme), ...scssConfig(theme), ...lessConfig(theme), ...jsConfig(theme) },
    android: { ...androidConfig(theme) },
    'site/global': { ...siteGlobalConfig(theme) },
    'site/web': { ...siteWebConfig(theme) },
    'site/android': { ...siteAndroidConfig(theme) },
    'site/ios': { ...siteIosConfig(theme) },
    ios: { ...iosConfig(theme) },
    figma: { ...figmaConfig(theme) }
  }

  return platforms[platform]
}

export const getConfig = (platform, theme) => {
  const defaultTokens = [
    'tokens/_options/**/*.json5',
    'tokens/global/**/*.json5',
    ...getSources(platform)
  ]

  const themeOverrides = [`tokens/themes/${theme}/**/*.json5`]

  return {
    include: defaultTokens,
    source: themeOverrides,
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
      exclude: (token) => filePathsToExcludeFromExpand.includes(token.filePath),
    },
    platforms: allPlatforms(platform, theme),
    usesDtcg: true,
    log: {
      verbosity: 'verbose'
    }
  }
}

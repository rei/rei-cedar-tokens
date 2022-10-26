const _ = require('lodash');

// Import platform configs and add them below
const scssConfig = require('./scss');
const lessConfig = require('./less');
const jsConfig = require('./js');
const androidConfig = require('./android');
const iosConfig = require('./ios');
const siteGlobalConfig = require('./site.global');
const siteWebConfig = require('./site.web');
const siteAndroidConfig = require('./site.android');
const siteIosConfig = require('./site.ios');
const sketchConfig = require('./sketch');
const figmaConfig = require('./figma');

function getSources(platform) {
  const sources = {
    'site/global': [],
    'site/web': ['tokens/web/**/*.json5'],
    'site/android': ['tokens/mobile/**/*.json5'],
    'site/ios': ['tokens/mobile/**/*.json5'],
    'web': ['tokens/web/**/*.json5'],
    'android': ['tokens/mobile/**/*.json5'],
    'ios': ['tokens/mobile/**/*.json5'],
    'figma': [`tokens/web/**/*.json5`],
    'sketch': [`tokens/web/**/*.json5`],
  }
  return sources[platform];
}

const allPlatforms = (platform, theme) => {
  let platforms = {
    'web': { ...scssConfig(theme), ...lessConfig(theme), ...jsConfig(theme) },
    'android': { ...androidConfig(theme) },
    'site/global': { ...siteGlobalConfig(theme) },
    'site/web': { ...siteWebConfig(theme) },
    'site/android': { ...siteAndroidConfig(theme) },
    'site/ios': { ...siteIosConfig(theme) },
    'ios': { ...iosConfig(theme) },
    'figma': { ...figmaConfig(theme) },
    'sketch': { ...sketchConfig(theme) }
  }

  return platforms[platform];
}

module.exports = (platform, theme) => {
  const sources = [
    'tokens/_options/**/*.json5',
    `tokens/themes/${theme}/**/*.json5`,
    'tokens/global/**/*.json5',
    ...getSources(platform)
  ];
  return {
    source: sources,
    platforms: allPlatforms(platform, theme),
  };
};

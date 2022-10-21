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

const allPlatforms = {
  'web':  {...scssConfig, ...lessConfig, ...jsConfig},
  'android': {...androidConfig},
  'figma': {...figmaConfig},
  'ios': {...iosConfig},
  'site/global': {...siteGlobalConfig},
  'site/web': {...siteWebConfig},
  'site/android': {...siteAndroidConfig},
  'site/ios': {...siteIosConfig},
  'sketch': {...sketchConfig},
 }
 
function getSources(platform) {
  if (platform === 'site/global') {
    return [];
  }
  if (platform === 'web' || platform === 'site/web') {
    // eslint-disable-next-line quotes
    return [`tokens/web/**/*.json5`];
  }
  if (platform === 'android' || platform === 'site/android') {
    // eslint-disable-next-line quotes
    return [`tokens/mobile/**/*.json5`];
  }
  if (platform === 'ios' || platform === 'site/ios') {
    // eslint-disable-next-line quotes
    return [`tokens/mobile/**/*.json5`];
  }
  if (platform === 'sketch') {
    // eslint-disable-next-line quotes
    return [`tokens/web/**/*.json5`];
  }
  if (platform === 'figma') {
    // eslint-disable-next-line quotes
    return [`tokens/web/**/*.json5`];
  }
}

module.exports = (platform) => {
  const sources = [
    'tokens/_options/**/*.json5',
    'tokens/global/**/*.json5',
    ...getSources(platform),
  ];
  return {
    source: sources,
    platforms: allPlatforms[platform],
  };
};

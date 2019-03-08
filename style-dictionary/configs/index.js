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

// this is the filter for excluding "option" tokens
// and works in concert with transforms/attribute/option.js
const filterObj = {
  options: {
    showFileHeader: false,
  },
  filter: {
    attributes: {
      option: false,
    },
  },
};

// adds filter for "options" to all file outputs
function filterOptions(platforms) {
  const platformObj = {};
  platforms.map(p => Object.assign(platformObj, p));
  Object.keys(platformObj).forEach((p) => {
    platformObj[p].files.map(f => _.merge(f, filterObj));
  });
  return platformObj;
}

function getSources(platform) {
  if (platform === 'site/global') {
    return [];
  }
  if (platform === 'web' || platform === 'site/web') {
    return [`tokens/web/**/*.json5`];
  }
  if (platform === 'android' || platform === 'site/android') {
    return [`tokens/android/**/*.json5`];
  }
  if (platform === 'ios' || platform === 'site/ios') {
    return [`tokens/ios/**/*.json5`];
  }
}

function getConfigs(platform) {
  if(platform === 'web') {
    return filterOptions([scssConfig, lessConfig, jsConfig]);
  }
  if (platform === 'android') {
    return filterOptions([androidConfig])
  }
  if (platform === 'ios') {
    return filterOptions([iosConfig])
  }
  if (platform === 'site/global') {
    return filterOptions([siteGlobalConfig])
  }
  if (platform === 'site/web') {
    return filterOptions([siteWebConfig])
  }
  if (platform === 'site/android') {
    return filterOptions([siteAndroidConfig])
  }
  if (platform === 'site/ios') {
    return filterOptions([siteIosConfig])
  }
}

module.exports = (platform) => {
  const sources = [
    'tokens/_options/**/*.json5',
    'tokens/global/**/*.json5',
    ...getSources(platform),
  ]
  return {
    source: sources,
    platforms: getConfigs(platform)
  };
};

const _ = require('lodash');

// Import platform configs and add them below
const scssConfig = require('./scss');
const lessConfig = require('./less');
const jsConfig = require('./js');
const androidConfig = require('./android');

// this is the filter for excluding "option" tokens
// and works in concert with transforms/attribute/option.js
const filterObj = {
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

module.exports = {
  source: ['tokens/**/*.json5', 'tokens/**/*.json'],
  // add platform configs to array below
  platforms: filterOptions([scssConfig, lessConfig, jsConfig, androidConfig]),
};

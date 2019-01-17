const _ = require('lodash');

// Import platform configs and add them below
const scssConfig = require('./scss');
const lessConfig = require('./less');
const jsConfig = require('./js');
const androidConfig = require('./android');

// this is the filter for excluding "foundation" tokens
const filterObj = {
  filter: {
    attributes: {
      foundation: false,
    },
  },
};

// adds filter for "foundations" to all file outputs
function filterFoundations(platforms) {
  const platformObj = {};
  platforms.map(p => Object.assign(platformObj, p));
  Object.keys(platformObj).forEach((p) => {
    platformObj[p].files.map(f => _.merge(f, filterObj));
  });
  return platformObj;
}

// console.log(filterFoundations([scssConfig, lessConfig, jsConfig]));

module.exports = {
  source: ['tokens/**/*.json5', 'tokens/**/*.json'],
  // add platform configs to array below
  platforms: filterFoundations([scssConfig, lessConfig, jsConfig, androidConfig]),
};

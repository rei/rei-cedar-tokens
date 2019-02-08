const StyleDictionary = require('style-dictionary');
const path = require('path');
const getPlatformConfig = require('./configs')
// const _ = require('lodash');

// ==== Include custom transforms ====
require('./transforms/attribute/options')(StyleDictionary);
require('./transforms/attribute/cdr-cti')(StyleDictionary);
require('./transforms/size/px-to-rem')(StyleDictionary);
require('./transforms/size/strip-px')(StyleDictionary);

// ==== Include custom transform groups ====
require('./transformGroups/scss')(StyleDictionary);
require('./transformGroups/less')(StyleDictionary);
require('./transformGroups/js')(StyleDictionary);
require('./transformGroups/android')(StyleDictionary);
require('./transformGroups/ios')(StyleDictionary);

// ==== Include custom formats ====
require('./formats/scss')(StyleDictionary);
require('./formats/less')(StyleDictionary);
require('./formats/js')(StyleDictionary);

// ==== Include custom actions
require('./actions/concat_files')(StyleDictionary);

// --------------------------------------------------------------------

// ==== Run build ====
console.log('Build started...'); // eslint-disable-line no-console
console.log('\n=============================================='); // eslint-disable-line no-console

['web', 'android', 'ios'].map(platform => {

  // APPLY THE CONFIGURATION
  // Very important: the registration of custom transforms
  // needs to be done _before_ applying the configuration
  const StyleDictionaryExtended = StyleDictionary.extend(getPlatformConfig(platform));


  // FINALLY, BUILD ALL THE PLATFORMS
  StyleDictionaryExtended.buildAllPlatforms();

});


console.log('\n=============================================='); // eslint-disable-line no-console
console.log('\nBuild completed!'); // eslint-disable-line no-console

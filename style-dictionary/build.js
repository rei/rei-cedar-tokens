const StyleDictionary = require('style-dictionary');
const getPlatformConfig = require('./configs');

// ==== Include custom transforms ====
require('./transforms/attribute/options')(StyleDictionary);
require('./transforms/attribute/deprecated')(StyleDictionary);
require('./transforms/attribute/cdr-cti')(StyleDictionary);
require('./transforms/size/dp-transitive')(StyleDictionary);
require('./transforms/size/space')(StyleDictionary);
require('./transforms/size/space-js')(StyleDictionary);
require('./transforms/size/px-to-rem')(StyleDictionary);
require('./transforms/size/strip-px')(StyleDictionary);
require('./transforms/size/strip-all-px')(StyleDictionary);
require('./transforms/size/strip-all-px-js')(StyleDictionary);
require('./transforms/size/float')(StyleDictionary);
require('./transforms/color/sketch')(StyleDictionary);

// ==== Include custom transform groups ====
require('./transformGroups/scss')(StyleDictionary);
require('./transformGroups/less')(StyleDictionary);
require('./transformGroups/js')(StyleDictionary);
require('./transformGroups/android')(StyleDictionary);
require('./transformGroups/ios')(StyleDictionary);
require('./transformGroups/sketch')(StyleDictionary);

// ==== Include custom formats ====
require('./formats/scss-mixin')(StyleDictionary);
require('./formats/scss-map')(StyleDictionary);
// require('./formats/scss-deprecated')(StyleDictionary);
require('./formats/less')(StyleDictionary);
require('./formats/js')(StyleDictionary);
require('./formats/site')(StyleDictionary);
require('./formats/sketch')(StyleDictionary);

// ==== Include custom actions ====
require('./actions/concat_files')(StyleDictionary);
require('./actions/include_deprecate_scss')(StyleDictionary);
require('./actions/include_media_queries_scss')(StyleDictionary);
require('./actions/include_media_queries_less')(StyleDictionary);
require('./actions/include_display_scss')(StyleDictionary);
require('./actions/include_display_less')(StyleDictionary);

// --------------------------------------------------------------------

// ==== Run build ====
console.log('Build started...'); // eslint-disable-line no-console
console.log('\n=============================================='); // eslint-disable-line no-console

[
  'web',
  'android',
  'ios',
  'site/global',
  'site/web',
  'site/android',
  'site/ios',
  'sketch',
].map((platform) => {
  // APPLY THE CONFIGURATION
  // Very important: the registration of custom transforms
  // needs to be done _before_ applying the configuration
  const StyleDictionaryExtended = StyleDictionary.extend(getPlatformConfig(platform));


  // FINALLY, BUILD ALL THE PLATFORMS
  StyleDictionaryExtended.buildAllPlatforms();
});


console.log('\n=============================================='); // eslint-disable-line no-console
console.log('\nBuild completed!'); // eslint-disable-line no-console

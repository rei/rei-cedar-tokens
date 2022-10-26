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
require('./transformGroups/figma')(StyleDictionary);

// ==== Include custom formats ====
require('./formats/scss-mixin')(StyleDictionary);
require('./formats/scss-map')(StyleDictionary);
// require('./formats/scss-deprecated')(StyleDictionary);
require('./formats/less')(StyleDictionary);
require('./formats/js')(StyleDictionary);
require('./formats/site')(StyleDictionary);
require('./formats/figma')(StyleDictionary);
require('./formats/sketch')(StyleDictionary);

// ==== Include custom actions ====
require('./actions/concat_files')(StyleDictionary);
require('./actions/include_media_queries_scss')(StyleDictionary);
require('./actions/include_media_queries_less')(StyleDictionary);
require('./actions/include_display_scss')(StyleDictionary);
require('./actions/include_display_less')(StyleDictionary);
require('./actions/include_deprecate_scss')(StyleDictionary);

// ==== Include custom filters ====
require('./filters/options')(StyleDictionary);
require('./filters/ios-color')(StyleDictionary);
require('./filters/ios-size')(StyleDictionary);

const getConfig = require('./configs');

const themes = [
  'rei-brand', 
  'docsite',
];
const platforms = [
  'site/global',
  'site/web',
  'site/android',
  'site/ios',
  'web',
  'android',
  'ios',
  'figma',
  'sketch'
]

themes.map(function (theme) {
  platforms.map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${theme}]`);

    const foo = StyleDictionary.extend(getConfig(platform, theme));

    foo.buildAllPlatforms();

    console.log('\nEnd processing');

  })
})


console.log('\n=============================================='); // eslint-disable-line no-console
console.log('\nBuild completed!'); // eslint-disable-line no-console

const StyleDictionary = require('style-dictionary');
const path = require('path');
// const _ = require('lodash');

// ==== Include custom transforms ====
require('./transforms/attribute/foundation')(StyleDictionary);
require('./transforms/attribute/cdr-cti')(StyleDictionary);
require('./transforms/size/px-to-rem')(StyleDictionary);

// ==== Include custom transform groups ====
require('./transformGroups/scss')(StyleDictionary);
require('./transformGroups/less')(StyleDictionary);
require('./transformGroups/android')(StyleDictionary);
require('./transformGroups/js')(StyleDictionary);

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

// APPLY THE CONFIGURATION
// Very important: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(path.join(__dirname, './configs/_index.js'));


// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();


console.log('\n=============================================='); // eslint-disable-line no-console
console.log('\nBuild completed!'); // eslint-disable-line no-console

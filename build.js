const StyleDictionary = require('style-dictionary');
const _ = require('lodash');

console.log('Build started...');
console.log('\n==============================================');

// REGISTER FORMATS

/* scss mixin */
StyleDictionary.registerFormat({
  name: 'scss/mixin',
  formatter: function(dictionary, config) {
    const mixins = [];
    const mixinProperties = _.filter(dictionary.allProperties, (o) => _.has(o, 'mixin'));
    const mixinNames = _.uniq(mixinProperties.map((o) => o.mixin));

    mixinNames.forEach((name) => {
      const singleMixinProps = _.filter(mixinProperties, (o) => o.mixin === name);
      const declarations = [];
      let mixin = '';

      singleMixinProps.forEach((o) => {
        console.log(o);
        declarations.push(`${_.kebabCase(o.property)}: ${o.value};`)
      });

      mixin = `@mixin ${_.kebabCase(name)}() {
  ${declarations.join('\n  ')}
}`

      mixins.push(mixin)
    });

    return `${mixins.join('\n\n')}\n`;;
  }
});

/* less mixin */
StyleDictionary.registerFormat({
  name: 'less/mixin',
  formatter: function (dictionary, config) {
    const mixins = [];
    const mixinProperties = _.filter(dictionary.allProperties, (o) => _.has(o, 'mixin'));
    const mixinNames = _.uniq(mixinProperties.map((o) => o.mixin));

    mixinNames.forEach((name) => {
      const singleMixinProps = _.filter(mixinProperties, (o) => o.mixin === name);
      const declarations = [];
      let mixin = '';

      singleMixinProps.forEach((o) => {
        declarations.push(`${_.kebabCase(o.property)}: ${o.value};`)
      });

      mixin = `.${_.kebabCase(name)}() {
  ${declarations.join('\n  ')}
}`

      mixins.push(mixin)
    });

    return `${mixins.join('\n\n')}\n`;;
  }
});

// APPLY THE CONFIGURATION
// Very important: the registration of custom transforms
// needs to be done _before_ applying the configuration
StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json5');


// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();


console.log('\n==============================================');
console.log('\nBuild completed!');
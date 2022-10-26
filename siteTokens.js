const _ = require('lodash');
const fs = require('fs-extra');

['docsite', 'rei-brand'].forEach((theme)=>{
  const rawGlobal = require(`./dist/${theme}/json/global.json`);
  const rawWeb = require(`./dist/${theme}/json/web.json`);
  const rawAndroid = require(`./dist/${theme}/json/android.json`);
  const rawIos = require(`./dist/${theme}/json/ios.json`);
  const utilities = require('./style-dictionary/utilities/utilities.json');
  
  // get keys for each category per platform
  const globalKeyArr = Object.keys(rawGlobal);
  const webKeyArr = Object.keys(rawWeb);
  const androidKeyArr = Object.keys(rawAndroid);
  const iosKeyArr = Object.keys(rawIos);
  
  // diffing function
  function hasSameName(arrVal, otherVal) {
    const kebab1 = _.kebabCase(arrVal.name);
    const kebab2 = _.kebabCase(otherVal.name);
    return _.isEqual(kebab1, kebab2);
  };
  
  // get unique list of all keys
  const allKeys = _.union(globalKeyArr, webKeyArr, androidKeyArr, iosKeyArr);
  
  const dataByPlatform = {
    global: {},
    web: utilities,
    android: {},
    ios: {},
  };
  
  allKeys.forEach((key) => {
    // keep global tokens
    dataByPlatform.global[key] = rawGlobal[key];
  
    // find unique tokens by platform
    dataByPlatform.web[key] = _.differenceWith(rawWeb[key], rawGlobal[key], hasSameName);
    dataByPlatform.android[key] = _.differenceWith(rawAndroid[key], rawGlobal[key], hasSameName);
    dataByPlatform.ios[key] = _.differenceWith(rawIos[key], rawGlobal[key], hasSameName);
  });
  
  fs.outputFileSync(`./dist/${theme}/json/platform-tokens.json`, JSON.stringify(dataByPlatform, null, 2));
})


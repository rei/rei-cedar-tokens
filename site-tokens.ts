import _ from "lodash";
import fs from "fs-extra";
import { createRequire } from "node:module";
import type { TransformedToken } from "style-dictionary/types";

const require = createRequire(import.meta.url);

const themes = ["docsite", "rei-dot-com"];

interface TokensByCategory {
  [category: string]: TransformedToken[];
}

interface DataByPlatform {
  global: TokensByCategory;
  web: TokensByCategory;
  android: TokensByCategory;
  ios: TokensByCategory;
}

themes.forEach((theme) => {
  const rawGlobal: TokensByCategory = require(
    `./dist/${theme}/json/global.json`,
  );
  const rawWeb: TokensByCategory = require(`./dist/${theme}/json/web.json`);
  const rawAndroid: TokensByCategory = require(
    `./dist/${theme}/json/android.json`,
  );
  const rawIos: TokensByCategory = require(`./dist/${theme}/json/ios.json`);
  const utilities: TokensByCategory = require("./style-dictionary/utilities/utilities.json");

  // get keys for each category per platform
  const globalKeyArr = Object.keys(rawGlobal);
  const webKeyArr = Object.keys(rawWeb);
  const androidKeyArr = Object.keys(rawAndroid);
  const iosKeyArr = Object.keys(rawIos);

  // diffing function
  function hasSameName(
    arrVal: TransformedToken,
    otherVal: TransformedToken,
  ): boolean {
    const kebab1 = _.kebabCase(arrVal.name);
    const kebab2 = _.kebabCase(otherVal.name);

    return _.isEqual(kebab1, kebab2);
  }

  // get unique list of all keys
  const allKeys = _.union(globalKeyArr, webKeyArr, androidKeyArr, iosKeyArr);

  const dataByPlatform: DataByPlatform = {
    global: {},
    web: utilities,
    android: {},
    ios: {},
  };

  allKeys.forEach((key) => {
    // keep global tokens
    dataByPlatform.global[key] = rawGlobal[key];

    // find unique tokens by platform
    dataByPlatform.web[key] = _.differenceWith(
      rawWeb[key],
      rawGlobal[key],
      hasSameName,
    );
    dataByPlatform.android[key] = _.differenceWith(
      rawAndroid[key],
      rawGlobal[key],
      hasSameName,
    );
    dataByPlatform.ios[key] = _.differenceWith(
      rawIos[key],
      rawGlobal[key],
      hasSameName,
    );
  });

  fs.outputFileSync(
    `./dist/${theme}/json/platform-tokens.json`,
    JSON.stringify(dataByPlatform, null, 2),
  );
});

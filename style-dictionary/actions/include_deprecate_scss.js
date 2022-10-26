const fs = require('fs-extra');
const path = require('path');

module.exports = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include_deprecate_scss',
    do(dictionary, config) {
      const deprecateScss = path.join(__dirname, '../utilities/deprecate.scss');
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'deprecate.scss');
      fs.copySync(deprecateScss, outputDir);
    },
    undo(dictionary, config) {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath));
    },
  });
};

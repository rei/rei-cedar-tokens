const fs = require('fs-extra');
const path = require('path');

module.exports = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include_media_queries_scss',
    do(dictionary, config) {
      const scss = path.join(__dirname, '../utilities/media-queries.scss');
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'media-queries.scss');
      fs.copyFileSync(scss, outputDir);
    },
    undo(dictionary, config) {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath));
    },
  });
};

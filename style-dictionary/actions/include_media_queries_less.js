const fs = require('fs-extra');
const path = require('path');

module.exports = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'include_media_queries_less',
    do(dictionary, config) {
      const less = path.join(__dirname, '../utilities/media-queries.less');
      const outputDir = path.join(__dirname, '../../', config.buildPath, 'media-queries.less');
      fs.copyFileSync(less, outputDir);
    },
    undo(dictionary, config) {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath));
    },
  });
};

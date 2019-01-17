const fs = require('fs-extra');
const concat = require('concat');
const path = require('path');

module.exports = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'concat_files',
    do(dictionary, config) {
      fs.readdir(config.buildPath, (err, files) => {
        if (err) { throw err; }
        const extension = path.extname(files[0]);
        const filePaths = files.map(f => path.join(__dirname, '../../', config.buildPath, f));
        const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`);
        // concat(filePaths, outFile);
        concat(filePaths).then((r) => {
          fs.removeSync(path.join(__dirname, '../../', config.buildPath));
          fs.outputFileSync(outFile, r);
        });
      });
    },
    undo(dictionary, config) {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath));
    },
  });
};

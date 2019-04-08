const fs = require('fs-extra');
const concat = require('concat');
const path = require('path');
const _ = require('lodash');

module.exports = (StyleDictionary) => {
  // concat all files in buildPath to a given filename
  StyleDictionary.registerAction({
    name: 'concat_files',
    do(dictionary, config) {
      fs.readdir(config.buildPath, (err, files) => {
        if (err) { throw err; }
        const extension = path.extname(files[0]);
        const concatPaths = files.map(f => path.join(__dirname, '../../', config.buildPath, f));
        _.pullAllWith(concatPaths, '.', (v1, v2) => {
          if (v1.includes('.no_concat')) {
            const newPath = v1.replace('.no_concat', '');
            // rename file that won't be concated to remove the .no_concat
            fs.renameSync(v1, newPath);
            return true;
          }
          return false
        });

        
        // output concat paths
        concat(concatPaths).then((r) => {
          const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`);
          fs.outputFileSync(outFile, r);
        });
        
        // remove concated files
        concatPaths.forEach(p => {
          fs.removeSync(p);
        });
      });
    },
    undo(dictionary, config) {
      fs.removeSync(path.join(__dirname, '../../', config.buildPath));
    },
  });
};

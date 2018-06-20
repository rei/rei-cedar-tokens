const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = (theo) => {
  let tokens = '';
  try {
    tokens = theo.convertSync({
      transform: {
        type: 'cedar-web',
        file: path.join(__dirname, '../..', 'tokens/_index.yml'),
      },
      format: {
        type: 'common.js',
      },
    });
  } catch (error) {
    console.log(`Something went wrong creating foundations output: ${error}`); // eslint-disable-line no-console
  }


  fs.outputFile('dist/cdr-tokens.common.js', `${tokens}`, 'utf8', (err) => {
    if (err) throw err;
    console.log(chalk.green('dist/cdr-tokens.common.js successfully created'));
  });
};

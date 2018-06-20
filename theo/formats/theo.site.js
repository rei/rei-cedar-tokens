const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const groupBy = require('lodash/groupBy');

module.exports = (theo) => {
  theo.registerFormat('styleguide', (result) => {
    const r = result.toJS();

    return groupBy(r.props, 'category');
  });


  let tokens = '';
  try {
    tokens = theo.convertSync({
      transform: {
        type: 'cedar-web',
        file: path.join(__dirname, '../..', 'tokens/_index.yml'),
      },
      format: {
        type: 'styleguide',
      },
    });
  } catch (error) {
    console.log(`Something went wrong creating mixin output: ${error}`);
  }


  fs.outputFile('static/data.json', JSON.stringify(tokens, null, '  '), 'utf8', (err) => {
    if (err) throw err;
    console.log(chalk.green('static/data.json successfully created'));
  });

  fs.outputFile('dist/raw-tokens.json', JSON.stringify(tokens, null, '  '), 'utf8', (err) => {
    if (err) throw err;
    console.log(chalk.green('dist/raw-tokens.json successfully created'));
  });
};

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = (theo) => {
  // SCSS MIXIN FORMATTER
  theo.registerFormat('mixin', (result) => {
    const mixins = [];

    result.get('props').forEach((prop) => {
      if (prop.get('category') === 'foundations') {
        return;
      }
      const name = prop.get('name');
      const value = prop.get('value');
      const declarations = [];
      let mixin = '';

      value.forEach((val, key) => {
        declarations.push(`${key}: ${val};`);
      });

      mixin = `@mixin ${name}() {
  ${declarations.join('\n  ')}
}`;

      mixins.push(mixin);
    });

    return `${mixins.join('\n\n')}\n`;
  });


  // MIXINS
  let mixins = '';
  try {
    mixins = theo.convertSync({
      transform: {
        type: 'cedar-web',
        file: path.join(__dirname, '../..', 'tokens/m_index.yml'),
      },
      format: {
        type: 'mixin',
      },
    });
  } catch (error) {
    console.log(`Something went wrong creating mixin output: ${error}`); // eslint-disable-line no-console
  }

  // VARIABLES (REMOVE LATER)
  let variables = '';
  try {
    variables = theo.convertSync({
      transform: {
        type: 'cedar-web',
        file: path.join(__dirname, '../..', 'tokens/v_index.yml'),
      },
      format: {
        type: 'scss',
      },
    });
  } catch (error) {
    console.log(`Something went wrong creating variable output: ${error}`); // eslint-disable-line no-console
  }

  // FOUNDATIONS
  let foundations = '';
  try {
    foundations = theo.convertSync({
      transform: {
        type: 'cedar-web',
        file: path.join(__dirname, '../..', 'tokens/foundations/_index.yml'),
      },
      format: {
        type: 'scss',
      },
    });
  } catch (error) {
    console.log(`Something went wrong creating foundations output: ${error}`); // eslint-disable-line no-console
  }


  fs.outputFile('dist/cdr-tokens.scss', `${mixins}${foundations}${variables}`, 'utf8', (err) => {
    if (err) throw err;
    console.log(chalk.green('dist/cdr-tokens.scss successfully created'));
  });
};

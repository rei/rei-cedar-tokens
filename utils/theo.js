#!/usr/bin/env/ node

const theo = require('theo');
const path = require('path');
const fs = require('fs-extra');
const groupBy = require('lodash/groupBy');

theo.registerTransform('cedar-web', ['color/hex']);

theo.registerFormat('styleguide', (result) => {
  const r = result.toJS();

  return groupBy(r.props, 'category');
});

// VARIABLES
let variables = '';
try {
  variables = theo.convertSync({
    transform: {
      type: 'cedar-web',
      file: path.join(__dirname, '..', 'tokens/v_index.yml'),
    },
    format: {
      type: 'styleguide',
    },
  });
} catch (error) {
  console.log(`Something went wrong creating variable output: ${error}`); // eslint-disable-line no-console
}

// MIXINS
let mixins = '';
try {
  mixins = theo.convertSync({
    transform: {
      type: 'cedar-web',
      file: path.join(__dirname, '..', 'tokens/m_index.yml'),
    },
    format: {
      type: 'styleguide',
    },
  });
} catch (error) {
  console.log(`Something went wrong creating mixin output: ${error}`); // eslint-disable-line no-console
}

const result = Object.assign(variables, mixins);

// console.log(result);
fs.writeFileSync('static/data.json', JSON.stringify(result, null, '  '));

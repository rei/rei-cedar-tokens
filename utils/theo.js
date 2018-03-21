#!/usr/bin/env/ node

const theo = require('theo');
const path = require('path');
const fs = require('fs-extra');
const groupBy = require('lodash/groupBy');
const tinycolor = require('tinycolor2');


theo.registerValueTransform(
  'prominence/web',
  prop => prop.get('type') === 'prominence',
  (prop) => {
    const [x, y, blur, spread, color, opacity] = prop.get('value').split(' ');
    const rgbColor = tinycolor(color);
    rgbColor.toRgbString();
    rgbColor.setAlpha(opacity);
    const str = rgbColor.toRgbString();

    return `${x} ${y} ${blur} ${spread} ${str}`;
  },
);

theo.registerTransform('cedar-web', ['color/hex', 'prominence/web']);

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

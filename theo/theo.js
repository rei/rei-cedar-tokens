#!/usr/bin/env/ node

const theo = require('theo');
const tinycolor = require('tinycolor2');

// Output functions
const siteData = require('./formats/theo.site');
const scss = require('./formats/theo.scss');
const common = require('./formats/theo.common');


/**
 * =================================
 * VALUE TRANSFORMS
 * =================================
 */

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

/**
 * =================================
 * FORMATS
 * =================================
 */

/**
 * =================================
 * TRANSFORMS
 * =================================
 */

theo.registerTransform('cedar-web', ['color/hex', 'prominence/web']);


/**
 * =================================
 * OUTPUT
 * =================================
 */

siteData(theo);
scss(theo);
common(theo);

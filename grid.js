const fs = require('fs');
const queryString = require('query-string');
const JSON5 = require('json5');

const colorTokensString = fs.readFileSync('./tokens/_options/color.json5');
const colorTokens = JSON5.parse(colorTokensString);
const tokens = colorTokens.options.color;

const formattedTokens = Object.keys(tokens).map(name => {
  return `${tokens[name].value}, ${name}`;
}).join("\n");

const urlData = {
  'foreground-colors': formattedTokens,
  'background-colors': formattedTokens
}
console.log(`https://contrast-grid.eightshapes.com/?${queryString.stringify(urlData)}`);

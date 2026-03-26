import fs from 'fs';
import queryString from 'query-string';
import type { DesignToken } from 'style-dictionary/types';

interface ColorTokens {
  options: {
    color: Record<string, DesignToken>;
  };
}

const colorTokensString = fs.readFileSync('./tokens/_options/color.json', 'utf-8');
const colorTokens: ColorTokens = JSON.parse(colorTokensString);
const tokens = colorTokens.options.color;

const formattedTokens = Object.keys(tokens)
  .map((name) => `${tokens[name].$value}, ${name}`)
  .join('\n');

const urlData = {
  'foreground-colors': formattedTokens,
  'background-colors': formattedTokens
};

console.log(`https://contrast-grid.eightshapes.com/?${queryString.stringify(urlData)}`);

import fs from 'fs'
import queryString from 'query-string'
import JSON5 from 'json5'

const colorTokensString = fs.readFileSync('./tokens/_options/color.json5')
const colorTokens = JSON5.parse(colorTokensString)
const tokens = colorTokens.options.color

const formattedTokens = Object.keys(tokens).map(name => `${tokens[name]}, ${name}`).join('\n')

const urlData = {
  'foreground-colors': formattedTokens,
  'background-colors': formattedTokens
}

console.log(`https://contrast-grid.eightshapes.com/?${queryString.stringify(urlData)}`)

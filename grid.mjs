import fs from 'fs-extra'
import JSON5 from 'json5'
import { ContrastRatioChecker } from 'contrast-ratio-checker'

const colorTokensString = fs.readFileSync('./tokens/_options/color.json5')
const colorTokens = JSON5.parse(colorTokensString)
const tokens = colorTokens.options.color
const filteredTokens = Object.keys(tokens).filter(name => name !== 'transparent').map(name => [name, tokens[name]])
const colors = filteredTokens.map(([key, value]) => `${value}, ${key}`).join('\n')
const file = './grid/index.html'

const crc = new ContrastRatioChecker()

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REI - Cedar Tokens - Contrast Grid</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-stone-100 grid grid-cols-[320px,1fr] min-h-dvh">
  <div class="px-6 py-4 flex flex-col h-full">
    <h1 class="text-2xl font-bold">REI - Cedar Tokens</h1>
    <h2 class="text-lg font-bold">Contrast Grid</h2>
    <label for="colors" class="block mt-6 font-bold text-xs uppercase">Colors</label>
    <textarea class="border border-stone-300 rounded p-4 font-mono text-xs w-full mt-2 min-h-96" id="colors" readonly>${colors}</textarea>
  </div>
  <div class="bg-white py-4 px-6">
    <table class="border-collapse border border-stone-300 text-center w-full table-fixed">
      <thead>
        <tr>
          <th class="font-bold text-xs border border-stone-300 w-[140px] h-[140px]">
            <div class="relative w-full h-full" style="background: linear-gradient(to top right, #ffffff 0%, #ffffff calc(50% - 1px), rgb(214 211 209) 50%, #ffffff calc(50% + 1px), #ffffff 100%)">
              <span class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2">text</span>
              <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-2">background</span>
            </div>
          </th>
          ${filteredTokens
            .map(([key, value]) => `<th class="font-bold text-xs border border-stone-300 w-[140px] h-[140px]">
            <div class="grid place-content-center p-2">
              <span>${key}</span>
              <span>${value}</span>
            </div>
          </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${filteredTokens.map(([key, value]) => `<tr>
          <td class="font-bold text-xs border border-stone-300 w-[140px] h-[140px]">
            <div class="grid place-content-center p-2">
              <span>${key}</span>
              <span>${value}</span>
            </div>
          </td>
          ${filteredTokens.map(([key2, value2]) => {
            const ratio = crc.getContrastRatioByHex(value, value2)
            const level = (ratio >= 7) ? 'AAA' : (ratio >= 4.5) ? 'AA' : (ratio >= 3) ? 'AA18' : 'DNP'
            const color = level === 'AA' ? 'neutral-200' : level === 'AAA' ? 'neutral-200' : level === 'AA18' ? 'amber-300' : 'red-600'
            const textColor = level === 'DNP' ? 'white' : 'neutral-900'

            if (key === key2) {
              return `<td class="font-bold text-xs border border-stone-300 w-[140px] h-[140px]"></td>`
            }

            return `<td class="font-bold text-xs border border-stone-300 w-[140px] h-[140px] relative" style="background-color: ${value}; color: ${value2}">
            <div class="grid place
            -content-center p-2">
              <span>${key2}</span>
              <span class="absolute left-4 bottom-4 bg-${color} text-${textColor} p-1 text-xs rounded" title="${level}">
                ${level}
              </span>
            </div>
          </td>`
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
`

fs.mkdirpSync('./grid')
fs.writeFileSync(file, template)

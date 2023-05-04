import fs from 'fs-extra';
import data from './dist/docsite/json/web.json' assert { type: 'json' };

const palettesList = ['knockout', 'sandstone', 'midnight', 'obsidian']; // Add your palette names here
const customComponentNames = []; // Add your custom component names here
const scssMap = generateScssMap(data, palettesList, customComponentNames);
fs.writeFileSync('UIsettings.scss', scssMap);

function generateScssMap(data, palettesList, customComponentNames) {
  const palettes = {};

  for (const category in data) {
    data[category].forEach((property) => {
      let nameParts;
      if (hasPaletteName(property.name.split('-'), palettesList)) {
        nameParts = property.name.split('-').slice(1);
      } else {
        nameParts = property.name.split('-').slice(2);
      }
      const { paletteName, paletteKeyword } = findPaletteKeyword(nameParts, palettesList);
      const componentName = getComponentName(property, nameParts, customComponentNames);

      // Remove the palette and componentName from the nameParts
      const propertyNameParts = nameParts.filter(
        (part) => !palettesList.includes(part) && part !== componentName.slice(4)
      );
      const variantName = findVariantKeyword(propertyNameParts);

      // Remove the variant from the nameParts
      const finalNameParts = propertyNameParts.filter((part) => part !== variantName);

      // Move the last keyword to the end if it's a state and remove it
      const state = swapStateKeywordToEnd(finalNameParts);

      // Add componentName to the beginning
      finalNameParts.unshift(componentName.slice(4));

      let propertyName = finalNameParts.join('-');

      if (!palettes[paletteKeyword]) {
        palettes[paletteKeyword] = {};
      }

      if (!palettes[paletteKeyword][componentName]) {
        palettes[paletteKeyword][componentName] = {};
      }

      if (!palettes[paletteKeyword][componentName][variantName]) {
        palettes[paletteKeyword][componentName][variantName] = {};
      }

      if (state) {
        propertyName = `${propertyName}-${state}`;
      }

      palettes[paletteKeyword][componentName][variantName][propertyName] = `--${property.name}`;
    });
  }
  let scssMap = '$cdr-UI-settings: (\n';

  for (const [paletteName, componentMap] of Object.entries(palettes)) {
    scssMap += `  ${paletteName}: (\n`;
    for (const [componentName, variantMap] of Object.entries(componentMap)) {
      scssMap += `    ${componentName}: (\n`;
      for (const [variantName, properties] of Object.entries(variantMap)) {
        scssMap += `      ${variantName}: (\n`;
        for (const [propertyName, value] of Object.entries(properties)) {
          scssMap += `        ${propertyName}: ${value},\n`;
        }
        scssMap += '      ),\n';
      }
      scssMap += '    ),\n';
    }
    scssMap += '  ),\n';
  }

  scssMap += ');';

  return scssMap;
}

function getComponentName(property) {
  if (property.docs && property.docs.type) {
    return 'cdr-' + property.docs.type;
  }

  // if (property.docs && property.docs.category) {
  //   return 'cdr-' + property.docs.category;
  // } 

  return 'unknown-component';
}

function hasPaletteName(nameParts, palettesList) {
  return nameParts.some((part) => palettesList.includes(part));
}


function swapStateKeywordToEnd(nameParts) {
  const stateIndex = nameParts.findIndex(isStateKeyword);
  if (stateIndex !== -1) {
    const state = nameParts[stateIndex];
    nameParts.splice(stateIndex, 1);
    return state;
  }
  return null;
}


function findPaletteKeyword(nameParts, palettesList) {
  for (const part of nameParts) {
    if (palettesList.includes(part)) {
      const paletteName = part;
      const paletteKeyword = `cdr-palette--${part}`;
      return { paletteName, paletteKeyword };
    }
  }

  const paletteName = 'default';
  const paletteKeyword = 'cdr-palette--default';
  return { paletteName, paletteKeyword };
}


// Find the variant keyword in the token name
function findVariantKeyword(nameParts) {
  const variants = ['primary', 'secondary'];
  const variantKeyword = nameParts.find((part) => variants.includes(part));
  return variantKeyword || 'default';
}

// Check if the keyword is a state
function isStateKeyword(keyword) {
  const states = ['hover', 'active', 'disabled', 'rest', 'focus', 'visited', 'checked', 'indeterminate'];
  return states.includes(keyword);
}
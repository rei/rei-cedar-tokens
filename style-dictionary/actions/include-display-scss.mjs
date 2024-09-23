import fs from 'fs-extra';
import path from 'path';
import { getDirname } from '../utils.mjs';

const __dirname = getDirname(import.meta.url);

export const includeDisplayScss = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'include-display-scss',
    do: (dictionary, config) => {
      try {
        const scssFile = path.join(__dirname, '../utilities/display.scss');
        const outputDir = path.join(__dirname, '../../', config.buildPath);
        const outputFile = path.join(outputDir, 'display.scss');

        // Ensure the output directory exists
        fs.ensureDirSync(outputDir);

        // Copy the SCSS file to the output directory
        fs.copyFileSync(scssFile, outputFile);
        console.log(`Successfully copied ${scssFile} to ${outputFile}`);
      } catch (error) {
        console.error('Error including display SCSS file:', error);
      }
    },
    undo: (dictionary, config) => {
      try {
        const outputDir = path.join(__dirname, '../../', config.buildPath);

        // Remove the output directory and its contents
        fs.removeSync(outputDir);
        console.log(`Successfully removed ${outputDir}`);
      } catch (error) {
        console.error('Error removing display SCSS file directory:', error);
      }
    }
  });
};

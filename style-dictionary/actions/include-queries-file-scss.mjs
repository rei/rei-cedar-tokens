import fs from 'fs-extra';
import path from 'path';
import { getDirname } from '../utils.mjs';

const __dirname = getDirname(import.meta.url);

export const includeQueriesFileScss = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: 'include-queries-file-scss',
    do: (dictionary, config) => {
      try {
        const mediaQueriesFile = path.join(__dirname, '../utilities/media-queries.scss');
        const containerQueriesFile = path.join(__dirname, '../utilities/container-queries.scss');
        const outputDir = path.join(__dirname, '../../', config.buildPath + '/utilities');
        const outputFile = path.join(outputDir, 'cdr-breakpoint-mixins.scss');

        // Ensure the output directory exists
        fs.ensureDirSync(outputDir);

        // Copy the SCSS file to the output directory
        fs.copyFileSync(mediaQueriesFile, outputFile);
        console.log(`Successfully copied MQ: ${mediaQueriesFile} to ${outputFile}`);

        // Read file content to append Container queries
        const content = fs.readFileSync(containerQueriesFile, 'utf8');
        fs.appendFileSync(outputFile, content);
        console.log(`Successfully copied CQ: ${containerQueriesFile} to ${outputFile}`);
      } catch (error) {
        console.error('Error including media queries SCSS file:', error);
      }
    },
    undo: (dictionary, config) => {
      try {
        const outputDir = path.join(__dirname, '../../', config.buildPath);

        // Remove the output directory and its contents
        fs.removeSync(outputDir);
        console.log(`Successfully removed ${outputDir}`);
      } catch (error) {
        console.error('Error removing media queries SCSS file directory:', error);
      }
    },
  });
};

import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import path from 'path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

/**
 * Registers a custom Style Dictionary action that copies the deprecation utilities SCSS file
 * to the build output directory.
 *
 * This action copies the deprecate.scss utility file from the utilities directory
 * to the configured build path, making it available for consumption.
 *
 * @param sd - The Style Dictionary instance to register the action with
 */
export const includeDeprecateScss = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'include-deprecate-scss',
    do: (_, config): void => {
      try {
        if (!config.buildPath) {
          console.warn('No buildPath specified in the configuration.');
          return;
        }

        const deprecateScss = path.join(__dirname, '../utilities/deprecate.scss');
        const outputDir = path.join(__dirname, '../../', config.buildPath);
        const outputFile = path.join(outputDir, 'deprecate.scss');

        // Ensure the output directory exists
        fs.ensureDirSync(outputDir);

        // Copy the SCSS file to the output directory
        fs.copyFileSync(deprecateScss, outputFile);
        console.log(`Successfully copied to ${outputFile}`);
      } catch (error) {
        console.error('Error including deprecate SCSS:', error);
        throw error;
      }
    },
    undo: (_, config): void => {
      try {
        if (!config.buildPath) {
          console.warn('No buildPath specified in the configuration.');
          return;
        }

        const outputDir = path.join(__dirname, '../../', config.buildPath);

        // Remove the output directory and its contents
        fs.removeSync(outputDir);
        console.log(`Successfully removed ${outputDir}`);
      } catch (error) {
        console.error('Error removing deprecate SCSS directory:', error);
        throw error;
      }
    }
  });
};

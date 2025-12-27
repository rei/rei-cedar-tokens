import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import path from 'path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

/**
 * Creates a custom Style Dictionary action factory that copies utility files
 * to the build output directory.
 *
 * This factory function generates actions that copy specific utility files from the
 * utilities directory to the configured build path, making them available for consumption.
 *
 * @param actionName - The unique name for the registered action
 * @param sourceFileName - The filename to copy from the utilities directory
 * @param description - Optional description of what utility is being copied
 * @returns A function that registers the action with Style Dictionary
 */
export const createIncludeUtilityAction = (
  actionName: string,
  sourceFileName: string,
  description = 'utility file'
) => {
  return (sd: typeof StyleDictionary): void => {
    sd.registerAction({
      name: actionName,
      do: (_, config): void => {
        try {
          if (!config.buildPath) {
            console.warn('No buildPath specified in the configuration.');
            return;
          }

          const sourceFile = path.join(__dirname, '../utilities', sourceFileName);
          const outputDir = path.join(__dirname, '../../', config.buildPath);
          const outputFile = path.join(outputDir, sourceFileName);

          // Ensure the output directory exists
          fs.ensureDirSync(outputDir);

          // Copy the file to the output directory
          fs.copyFileSync(sourceFile, outputFile);
          console.log(`Successfully copied ${description}: ${sourceFile} to ${outputFile}`);
        } catch (error) {
          console.error(`Error including ${description}:`, error);
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
          fs.removeSync(outputDir);
          console.log(`Successfully removed ${outputDir}`);
        } catch (error) {
          console.error(`Error removing ${description} directory:`, error);
          throw error;
        }
      }
    });
  };
};

/**
 * Pre-configured action for including display.scss utilities
 */
export const includeDisplayScss = createIncludeUtilityAction(
  'include-display-scss',
  'display.scss',
  'display utilities SCSS'
);

/**
 * Pre-configured action for including media-queries.scss utilities
 */
export const includeMediaQueriesScss = createIncludeUtilityAction(
  'include-media-queries-scss',
  'media-queries.scss',
  'media queries SCSS'
);

/**
 * Pre-configured action for including container-queries.scss utilities
 */
export const includeContainerQueriesScss = createIncludeUtilityAction(
  'include-container-queries-scss',
  'container-queries.scss',
  'container queries SCSS'
);

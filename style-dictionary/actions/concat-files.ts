import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import concat from 'concat';
import path from 'path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

/**
 * Registers a custom Style Dictionary action that concatenates generated files.
 *
 * This action:
 * 1. Reads all files from the build path
 * 2. Renames files with 'no_concat' in their name (removes the suffix)
 * 3. Concatenates remaining files into a single cdr-tokens file
 * 4. Removes the individual files after concatenation
 *
 * @param sd - The Style Dictionary instance to register the action with
 */
export const concatFiles = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'concat-files',
    do: (_, config): void => {
      try {
        if (!config.buildPath) {
          console.warn('No buildPath specified in the configuration.');
          return;
        }

        // Read files from the specified build path
        const buildPath = path.join(__dirname, '../../', config.buildPath);
        const files = fs.readdirSync(buildPath);

        if (files.length === 0) {
          console.warn('No files found in the build path.');
          return;
        }

        // Determine the file extension from the first file
        const extension = path.extname(files[0]);
        const allPaths = files.map((f) => path.join(buildPath, f));
        const concatPaths = allPaths.filter((p) => !path.basename(p).includes('no_concat'));
        const noConcatPaths = allPaths.filter((p) => path.basename(p).includes('no_concat'));

        // Rename files with 'no_concat' in their name
        noConcatPaths.forEach((p) => {
          const newPath = p.replace('.no_concat', '');
          fs.renameSync(p, newPath);
        });

        // Concatenate files
        concat(concatPaths)
          .then((result) => {
            const outFile = path.join(
              __dirname,
              '../../',
              config.buildPath!,
              `cdr-tokens${extension}`
            );
            fs.outputFileSync(outFile, result as string);

            // Remove concatenated files after successful concatenation
            concatPaths.forEach((p) => {
              fs.removeSync(p);
            });

            console.log('Successfully removed concatenated files');
          })
          .catch((error) => {
            console.error('Error during file concatenation:', error);
          });
      } catch (error) {
        console.error('Error during file concatenation process:', error);
      }
    },
    undo: (_, config): void => {
      try {
        if (!config.buildPath) {
          console.warn('No buildPath specified in the configuration.');
          return;
        }
        const buildPath = path.join(__dirname, '../../', config.buildPath);
        fs.removeSync(buildPath);
        console.log(`Successfully removed ${buildPath}`);
      } catch (error) {
        console.error('Error removing build path:', error);
      }
    }
  });
};

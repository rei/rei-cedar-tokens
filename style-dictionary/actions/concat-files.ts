import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import concat from 'concat';
import path from 'path';
import { getDirname } from '../utils';
import { foundationsMoudulesName, componentModulesName } from '../configs/filters/modules';

const __dirname = getDirname(import.meta.url);

const createImportLine = (fileExtension: string, filePath: string): string => {
  const isScss = fileExtension.includes('scss');
  const importStatement = isScss ? '@forward' : '@import';
  const imports = foundationsMoudulesName.map((name) => `./foundations/cdr-${name}`);
  imports.unshift(isScss ? './cdr-variables' : './cdr-variables');
  imports.push(...componentModulesName.map((name) => `./components/cdr-${name}`));
  const extensionImports: string[] = [];

  if (isScss) {
    imports.push(
      './utilities/cdr-breakpoint-mixins',
      './utilities/cdr-display-mixins',
      './utilities/cdr-type-mixins',
    );
  }

  if (!isScss && filePath.includes('rei-dot-com')) {
    imports.push(
      './palettes/cdr-palette-membership-subtle',
      './palettes/cdr-palette-membership-vibrant',
    );
  }

  const importsExtension = imports.map((importLine) => {
    return isScss ? importLine : importLine + fileExtension;
  });

  importsExtension.forEach((importFile) => {
    extensionImports.push(`${importStatement} "${importFile}";`);
  });

  return extensionImports.join('\n');
};

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
    do: async (_, config): Promise<void> => {
      try {
        if (!config.buildPath) {
          console.warn('No buildPath specified in the configuration.');
          return;
        }

        // Read files from the specified build path
        const buildPath = path.join(__dirname, '../../', config.buildPath);
        const entries = fs.readdirSync(buildPath, { withFileTypes: true });
        const files = entries.filter((e) => e.isFile()).map((e) => e.name);

        const sampleFile = files.find(
          (f) => f.endsWith('.scss') || f.endsWith('.css') || f.endsWith('.less'),
        );

        if (!sampleFile) {
          console.log('No .scss/.css/.less files found in the build path.');
          return;
        }

        // Determine the file extension from the first file
        console.log('Sample file: ', sampleFile);
        const extension = path.extname(sampleFile);
        const allPaths = files.map((f) => path.join(buildPath, f));
        const rootTokenFile =
          extension === '.scss'
            ? 'cdr-variables.scss'
            : extension === '.css'
              ? 'cdr-variables.css'
              : undefined;
        const preservedFiles = new Set(
          [`cdr-tokens${extension}`, rootTokenFile].filter((file): file is string => Boolean(file)),
        );
        const concatPaths = allPaths.filter(
          (p) => !path.basename(p).includes('no_concat') && !preservedFiles.has(path.basename(p)),
        );
        const noConcatPaths = allPaths.filter((p) => path.basename(p).includes('no_concat'));

        // Rename files with 'no_concat' in their name
        noConcatPaths.forEach((p) => {
          const newPath = p.replace('.no_concat', '');
          fs.renameSync(p, newPath);
        });

        // Concatenate files before removing source files
        const concatenatedOutput =
          concatPaths.length > 0 ? ((await concat(concatPaths)) as string) : '';
        const outFile = path.join(__dirname, '../../', config.buildPath, `cdr-tokens${extension}`);

        const importLines = createImportLine(extension, outFile);
        const compatibilityLines = extension === '.scss' ? '\n\n@use "./cdr-variables" as *;' : '';
        const finalOuput = extension.includes('less')
          ? concatenatedOutput
          : `${importLines}${compatibilityLines}${
              concatenatedOutput ? `\n\n${concatenatedOutput}` : ''
            }`;

        fs.outputFileSync(outFile, finalOuput);

        // Remove concatenated files
        concatPaths.forEach((p) => {
          fs.removeSync(p);
        });

        console.log('Successfully removed concatenated files');
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
    },
  });
};

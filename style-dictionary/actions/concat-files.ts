import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import concat from 'concat';
import path from 'path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

const createImportLine = (fileExtension: string, filePath: string): string => {
  const imports = [
    './foundations/cdr-color-background',
    './foundations/cdr-color-border',
    './foundations/cdr-color-icon',
    './foundations/cdr-color-text',
    './foundations/cdr-form',
    './foundations/cdr-icon',
    './foundations/cdr-motion',
    './foundations/cdr-prominence',
    './foundations/cdr-radius',
    './foundations/cdr-space'
  ];
  const extensionImports: string[] = [];
  const isScss = fileExtension.includes('scss');

  if (isScss) {
    imports.push(
      './utilities/cdr-breakpoint-mixins',
      './utilities/cdr-display-mixins',
      './utilities/cdr-type-mixins'
    );
  }

  if (filePath.includes('rei-dot-com')) {
    imports.push(
      './palettes/cdr-palette-membership-subtle',
      './palettes/cdr-palette-membership-vibrant'
    );
  }

  const importsExtension = imports.map((importLine) => {
    return importLine + fileExtension;
  });

  importsExtension.forEach((importFile) => {
    const importStatement = isScss ? '@use' : ' @import';
    extensionImports.push(`${importStatement} "${importFile}"${isScss ? ' as *' : ''};`);
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
    do: (_, config): void => {
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
          (f) => f.endsWith('.scss') || f.endsWith('.css') || f.endsWith('.less')
        );

        if (!sampleFile) {
          console.log('No .scss/.css/.less files found in the build path.');
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
        concat(concatPaths).then((r: unknown) => {
          const outFile = path.join(
            __dirname,
            '../../',
            config.buildPath!,
            `cdr-tokens${extension}`
          );

          const importLines = createImportLine(extension, outFile);
          const finalOuput = extension.includes('less')
            ? (r as string)
            : `${importLines}\n\n${r as string}`;

          fs.outputFileSync(outFile, finalOuput);
        });

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
    }
  });
};

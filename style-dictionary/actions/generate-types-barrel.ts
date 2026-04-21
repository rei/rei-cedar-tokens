import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import path from 'node:path';
import { globSync } from 'glob';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

const toPosixPath = (value: string): string => value.split(path.sep).join('/');

const toExportPath = (relativePath: string): string => `./${toPosixPath(relativePath)}`;

/**
 * Generates index barrel files for TypeScript token module outputs.
 *
 * Output files:
 * - index.mjs  (runtime values from module .mjs files)
 * - index.d.ts (interfaces and name unions from .d.ts files)
 */
export const generateTypesBarrel = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'generate-types-barrel',
    do: (_, config): void => {
      if (!config.buildPath) {
        console.warn('No buildPath specified in the configuration.');
        return;
      }

      const buildPath = path.join(__dirname, '../../', config.buildPath);

      const mjsFiles = globSync('**/*.mjs', {
        cwd: buildPath,
        nodir: true,
        ignore: ['index.mjs'],
      }).sort();

      const declarationFiles = globSync('**/*.d.ts', {
        cwd: buildPath,
        nodir: true,
        ignore: ['index.d.ts'],
      }).sort();

      const mjsExports = mjsFiles.map((file) => `export * from '${toExportPath(file)}';`);
      const declarationExports = declarationFiles.map(
        (file) => `export type * from '${toExportPath(file)}';`,
      );

      const indexMjsContent = `${mjsExports.join('\n')}\n`;
      const indexDtsContent = `${declarationExports.join('\n')}\n`;

      fs.outputFileSync(path.join(buildPath, 'index.mjs'), indexMjsContent);
      fs.outputFileSync(path.join(buildPath, 'index.d.ts'), indexDtsContent);

      console.log(`Generated TypeScript barrel files in ${buildPath}`);
    },
    undo: (_, config): void => {
      if (!config.buildPath) {
        return;
      }

      const buildPath = path.join(__dirname, '../../', config.buildPath);
      fs.removeSync(path.join(buildPath, 'index.mjs'));
      fs.removeSync(path.join(buildPath, 'index.d.ts'));
    },
  });
};

import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'node:path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

const DEPRECATION_MESSAGE =
  'Component tokens are deprecated and will be removed in a future release.';

const getDeprecationHeader = (fileExtension: string): string => {
  if (fileExtension === '.css' || fileExtension === '.scss') {
    return `/* @deprecated ${DEPRECATION_MESSAGE} */\n`;
  }
  return `// @deprecated ${DEPRECATION_MESSAGE}\n`;
};

/**
 * Registers a Style Dictionary action that prepends a deprecation notice to
 * every generated file in the `components/` output directory.
 *
 * This applies to CSS, SCSS, JS, and TS component outputs without changing
 * token names or removing the files from the build.
 */
export const deprecateComponentFiles = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'deprecate-component-files',
    do: (_, config): void => {
      if (!config.buildPath) {
        return;
      }

      const buildPath = path.join(__dirname, '../../../', config.buildPath);
      const componentFiles = globSync('components/**/*.{css,scss,mjs,cjs,d.ts}', {
        cwd: buildPath,
        nodir: true,
      });

      for (const relativePath of componentFiles) {
        const filePath = path.join(buildPath, relativePath);
        const fileExtension = path.extname(relativePath);
        const header = getDeprecationHeader(fileExtension);
        const content = fs.readFileSync(filePath, 'utf8');

        if (!content.startsWith(header)) {
          fs.writeFileSync(filePath, `${header}${content}`);
        }
      }

      if (componentFiles.length > 0) {
        console.log(
          `    ✓ Marked ${componentFiles.length} component files as deprecated in ${config.buildPath}`,
        );
      }
    },
    undo: (): void => {
      // No-op: files are regenerated from scratch on each build.
    },
  });
};

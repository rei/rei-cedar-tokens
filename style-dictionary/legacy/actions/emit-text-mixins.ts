import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import path from 'node:path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

/**
 * Registers a Style Dictionary action that copies the text and display mixins
 * from assets/foundations/ into the dist foundations folder.
 * This allows the mixins to be safely forwarded through the SCSS entry point.
 */
export const emitTextMixins = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'emit-text-mixins',
    do: (_, config): void => {
      if (!config.buildPath) {
        return;
      }

      const assetsDir = path.join(__dirname, '../assets/foundations');
      const buildPath = path.join(__dirname, '../../../', config.buildPath);
      const outDir = path.join(buildPath, 'foundations');
      fs.ensureDirSync(outDir);

      const files = [
        'cdr-text-mixins.scss',
        'cdr-display-mixins.scss',
        'cdr-breakpoint-mixins.scss',
      ];
      for (const fileName of files) {
        const sourceFile = path.join(assetsDir, fileName);
        if (!fs.existsSync(sourceFile)) {
          continue;
        }
        const content = fs.readFileSync(sourceFile, 'utf8');
        const dest = path.join(outDir, fileName);
        fs.writeFileSync(dest, content);
      }

      console.log(`    ✓ Emitted text/display mixins files in ${config.buildPath}`);
    },
    undo: (): void => {
      // No-op: files are regenerated from scratch on each build.
    },
  });
};

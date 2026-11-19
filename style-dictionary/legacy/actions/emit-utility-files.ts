import type StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'node:path';
import { getDirname } from '../utils';

const __dirname = getDirname(import.meta.url);

/**
 * Registers a Style Dictionary action that copies the SCSS utility
 * mixins (breakpoint, display, type) into `scss/utilities/` so the
 * `@rei/cdr-tokens/scss/*` export paths shipped in v14 keep resolving.
 */
export const emitUtilityFiles = (sd: typeof StyleDictionary): void => {
  sd.registerAction({
    name: 'emit-utility-files',
    do: (_, config): void => {
      if (!config.buildPath) {
        return;
      }

      const assetsDir = path.join(__dirname, '../assets/utilities');
      const buildPath = path.join(__dirname, '../../../', config.buildPath);
      const outDir = path.join(buildPath, 'utilities');
      fs.ensureDirSync(outDir);

      const utilityFiles = globSync('*.scss', { cwd: assetsDir });
      for (const fileName of utilityFiles) {
        const content = fs.readFileSync(path.join(assetsDir, fileName), 'utf8');
        const dest = path.join(outDir, fileName);
        fs.writeFileSync(dest, content);
      }

      if (utilityFiles.length > 0) {
        console.log(`    ✓ Emitted ${utilityFiles.length} utility files in ${config.buildPath}`);
      }
    },
    undo: (): void => {
      // No-op: files are regenerated from scratch on each build.
    },
  });
};

import fs from "fs-extra";
import concat from "concat";
import path from "path";
import { getDirname } from "../utils.mjs";

const __dirname = getDirname(import.meta.url);

const createImportLine = (fileExtension, filePath) => {
  const imports = [
    "./foundations/cdr-color-background",
    "./foundations/cdr-color-border",
    "./foundations/cdr-color-icon",
    "./foundations/cdr-color-text",
    "./foundations/cdr-form",
    "./foundations/cdr-icon",
    "./foundations/cdr-motion",
    "./foundations/cdr-prominence",
    "./foundations/cdr-radius",
    "./foundations/cdr-space",
  ];
  const extensionImports = [];
  const isScss = fileExtension.includes("scss");

  if (isScss) {
    imports.push(
      "./utilities/cdr-breakpoint-mixins",
      "./utilities/cdr-display-mixins",
      "./utilities/cdr-type-mixins"
    );
  }

  if (filePath.includes("rei-dot-com")) {
    imports.push(
      "./palettes/cdr-palette-membership-subtle",
      "./palettes/cdr-palette-membership-vibrant"
    );
  }

  const importsExtension = imports.map((importLine) => {
    return importLine + fileExtension;
  });

  importsExtension.forEach((importFile) => {
    const importStatement = isScss ? "@use" : " @import";
    extensionImports.push(
      `${importStatement} "${importFile}"${isScss ? " as *" : ""};`
    );
  });

  return extensionImports.join("\n");
};

export const concatFiles = (StyleDictionary) => {
  StyleDictionary.registerAction({
    name: "concat-files",
    do: (dictionary, config) => {
      try {
        // Read files from the specified build path
        const buildPath = path.join(__dirname, "../../", config.buildPath);
        const entries = fs.readdirSync(buildPath, { withFileTypes: true });
        const files = entries.filter((e) => e.isFile()).map((e) => e.name);
        const sampleFile = files.find(
          (f) =>
            f.endsWith(".scss") || f.endsWith(".css") || f.endsWith(".less")
        );

        if (!sampleFile) {
          console.log("No .scss/.css/.less files found in the build path.");
          return;
        }

        // Determine the file extension from the first file
        const extension = path.extname(files[0]);
        const allPaths = files.map((f) => path.join(buildPath, f));
        const concatPaths = allPaths.filter(
          (p) => !path.basename(p).includes("no_concat")
        );
        const noConcatPaths = allPaths.filter((p) =>
          path.basename(p).includes("no_concat")
        );

        // Rename files with 'no_concat' in their name
        noConcatPaths.forEach((p) => {
          const newPath = p.replace(".no_concat", "");
          fs.renameSync(p, newPath);
        });

        // Concatenate files
        concat(concatPaths).then((r) => {
          const outFile = path.join(
            __dirname,
            "../../",
            config.buildPath,
            `cdr-tokens${extension}`
          );

          const importLines = createImportLine(extension, outFile);
          const finalOuput = extension.includes("less")
            ? r
            : `${importLines}\n\n${r}`;

          fs.outputFileSync(outFile, finalOuput);
        });

        // Remove concatenated files
        concatPaths.forEach((p) => {
          fs.removeSync(p);
        });

        console.log("Successfully removed concatenated files");
      } catch (error) {
        console.error("Error during file concatenation process:", error);
      }
    },
    undo: (dictionary, config) => {
      try {
        const buildPath = path.join(__dirname, "../../", config.buildPath);
        fs.removeSync(buildPath);
        console.log(`Successfully removed ${buildPath}`);
      } catch (error) {
        console.error("Error removing build path:", error);
      }
    },
  });
};

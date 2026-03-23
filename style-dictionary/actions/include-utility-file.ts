import type StyleDictionary from "style-dictionary";
import fs from "fs-extra";
import path from "path";
import { getDirname } from "../utils";

const __dirname = getDirname(import.meta.url);

interface UtilityActionOptions {
  /** The unique name for the registered action */
  actionName: string;
  /** The filename(s) to copy from the utilities directory. Can be a single file or array of files to concatenate */
  sourceFiles: string | string[];
  /** Optional output filename. If not provided, uses the first source filename */
  outputFileName?: string;
  /** Optional subdirectory within the build path for output */
  outputSubDir?: string;
  /** Optional description of what utility is being copied */
  description?: string;
}

/**
 * Creates a custom Style Dictionary action factory that copies utility files
 * to the build output directory.
 *
 * This factory function generates actions that copy specific utility files from the
 * utilities directory to the configured build path, making them available for consumption.
 * Supports both single files and multiple files that get concatenated into one output.
 *
 * @param options - Configuration options for the utility action
 * @returns A function that registers the action with Style Dictionary
 */
export const createIncludeUtilityAction = (
  options: UtilityActionOptions | string,
  sourceFileName?: string,
  description = "utility file",
) => {
  // Support both new options object and legacy positional arguments
  const config: UtilityActionOptions =
    typeof options === "string"
      ? {
          actionName: options,
          sourceFiles: sourceFileName!,
          description,
        }
      : options;

  const {
    actionName,
    sourceFiles,
    outputFileName,
    outputSubDir = "",
    description: desc = "utility file",
  } = config;

  const files = Array.isArray(sourceFiles) ? sourceFiles : [sourceFiles];
  const finalOutputFileName = outputFileName || files[0];

  return (sd: typeof StyleDictionary): void => {
    sd.registerAction({
      name: actionName,
      do: (_, sdConfig): void => {
        try {
          if (!sdConfig.buildPath) {
            console.warn("No buildPath specified in the configuration.");
            return;
          }

          const outputDir = path.join(
            __dirname,
            "../../",
            sdConfig.buildPath,
            outputSubDir,
          );
          const outputFile = path.join(outputDir, finalOutputFileName);

          // Ensure the output directory exists
          fs.ensureDirSync(outputDir);

          // Process files - copy first, then append rest if multiple
          files.forEach((file, index) => {
            const sourceFile = path.join(__dirname, "../utilities", file);

            if (index === 0) {
              fs.copyFileSync(sourceFile, outputFile);
              console.log(
                `Successfully copied ${desc}: ${sourceFile} to ${outputFile}`,
              );
            } else {
              const content = fs.readFileSync(sourceFile, "utf8");
              fs.appendFileSync(outputFile, content);
              console.log(
                `Successfully appended ${desc}: ${sourceFile} to ${outputFile}`,
              );
            }
          });
        } catch (error) {
          console.error(`Error including ${desc}:`, error);
          throw error;
        }
      },
      undo: (_, sdConfig): void => {
        try {
          if (!sdConfig.buildPath) {
            console.warn("No buildPath specified in the configuration.");
            return;
          }

          const outputDir = path.join(__dirname, "../../", sdConfig.buildPath);
          fs.removeSync(outputDir);
          console.log(`Successfully removed ${outputDir}`);
        } catch (error) {
          console.error(`Error removing ${desc} directory:`, error);
          throw error;
        }
      },
    });
  };
};

/**
 * Pre-configured action for including display.scss utilities
 */
export const includeDisplayScss = createIncludeUtilityAction({
  actionName: "include-display-scss",
  sourceFiles: "display.scss",
  outputFileName: "cdr-display-mixins.scss",
  outputSubDir: "utilities",
  description: "display utilities SCSS",
});

/**
 * Pre-configured action for including deprecate.scss utilities
 */
export const includeDeprecateScss = createIncludeUtilityAction(
  "include-deprecate-scss",
  "deprecate.scss",
  "deprecation utilities SCSS",
);

/**
 * Pre-configured action for including media-queries.scss and container-queries.scss
 * concatenated into a single cdr-breakpoint-mixins.scss file
 */
export const includeQueriesFileScss = createIncludeUtilityAction({
  actionName: "include-queries-file-scss",
  sourceFiles: ["media-queries.scss", "container-queries.scss"],
  outputFileName: "cdr-breakpoint-mixins.scss",
  outputSubDir: "utilities",
  description: "breakpoint mixins SCSS",
});

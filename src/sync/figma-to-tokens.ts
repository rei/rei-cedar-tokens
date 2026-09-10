// TODO: Uncomment when ready to use
// /**
//  * sync-figma-to-tokens.ts
//  *
//  * Syncs both Figma Variables and Figma Text Styles into design token JSON files
//  * following the W3C Design Tokens specification.
//  */

// import * as fs from "node:fs";
// import FigmaApi from "../figma/api";
// import { green } from "../utils";
// import { tokenFilesFromLocalVariables } from "../tokens-export";
// import { TokensFile } from "../types";

// // --- VALIDATION -------------------------------------------------------------

// /**
//  * Validates that a tokens file has the correct structure.
//  */
// function validateTokensFile(tokensFile: TokensFile): void {
//   if (!tokensFile || typeof tokensFile !== "object") {
//     throw new Error("Invalid tokens file: must be an object");
//   }

//   if (Object.keys(tokensFile).length === 0) {
//     throw new Error("Invalid tokens file: cannot be empty");
//   }

//   const hasValidTokens = Object.values(tokensFile).some((value) => {
//     return value && typeof value === "object";
//   });

//   if (!hasValidTokens) {
//     throw new Error("Invalid tokens file: no valid tokens found");
//   }
// }

// // --- SYNC VARIABLES ---------------------------------------------------------

// /**
//  * Syncs Figma Local Variables to design token files.
//  */
// async function syncVariablesToTokens(
//   api: FigmaApi,
//   fileKey: string,
//   outputDir: string,
// ): Promise<number> {
//   console.log(`\nFetching variables from Figma file: ${fileKey}...`);
//   const localVariables = await api.getLocalVariables(fileKey);

//   if (!localVariables.meta?.variables || Object.keys(localVariables.meta.variables).length === 0) {
//     console.log(`No local variables found in Figma file: ${fileKey}`);
//     return 0;
//   }

//   console.log(`Found ${Object.keys(localVariables.meta.variables).length} variables in ${fileKey}`);

//   const tokensFiles = tokenFilesFromLocalVariables(localVariables);

//   if (Object.keys(tokensFiles).length === 0) {
//     console.log(`No token files generated from variables in Figma file: ${fileKey}`);
//     return 0;
//   }

//   let filesWritten = 0;
//   for (const [fileName, fileContent] of Object.entries(tokensFiles)) {
//     try {
//       validateTokensFile(fileContent);

//       const filePath = `${outputDir}/${fileName}`;
//       const jsonContent = JSON.stringify(fileContent, null, 2);
//       fs.writeFileSync(filePath, jsonContent, "utf-8");

//       console.log(`✓ Wrote ${fileName} (Variables)`);
//       filesWritten++;
//     } catch (error) {
//       console.error(
//         `✗ Failed to write ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
//       );
//       throw error;
//     }
//   }

//   return filesWritten;
// }

// // --- SYNC TEXT STYLES -------------------------------------------------------

// /**
//  * Resolves a variable ID to its name or value if the variables map is provided.
//  */
// function resolveVariable(value: any, boundVariableId: string | undefined, variablesMap: any): any {
//   if (!boundVariableId || !variablesMap) return value;

//   // Normalize key searches to prevent missing references due to prefix differences
//   const cleanId = boundVariableId.replace("VariableID:", "");
//   let variable = variablesMap[boundVariableId] || variablesMap[cleanId];

//   if (!variable) {
//     // Perform fuzzy scanning as fallback in case key naming formats diverge
//     const matchKey = Object.keys(variablesMap).find(
//       (key) =>
//         key === boundVariableId ||
//         key.replace("VariableID:", "") === cleanId ||
//         variablesMap[key].id === boundVariableId ||
//         variablesMap[key].id?.replace("VariableID:", "") === cleanId,
//     );
//     if (matchKey) {
//       variable = variablesMap[matchKey];
//     }
//   }

//   if (variable && variable.name) {
//     // Return a reference string formatted as a design token alias (e.g., "{typography.sans}")
//     return `{${variable.name.replace(/\//g, ".")}}`;
//   }

//   return value;
// }

// /**
//  * Safely searches for and extracts a bound variable ID from a node's potential structures.
//  */
// function getBoundVariableId(node: any, field: string): string | undefined {
//   if (!node) return undefined;

//   let bv = node.boundVariables?.[field];

//   if (!bv && node.style?.boundVariables) {
//     bv = node.style.boundVariables[field];
//   }

//   if (!bv && node.document?.boundVariables) {
//     bv = node.document.boundVariables[field];
//   }

//   if (!bv && node.document?.style?.boundVariables) {
//     bv = node.document.style.boundVariables[field];
//   }

//   if (!bv) return undefined;

//   if (typeof bv === "string") return bv;
//   if (typeof bv === "object") {
//     if (bv.id) return bv.id;
//     if (Array.isArray(bv) && bv.length > 0) {
//       if (typeof bv[0] === "string") return bv[0];
//       if (bv[0] && bv[0].id) return bv[0].id;
//     }
//   }
//   return undefined;
// }

// /**
//  * Transforms Figma node style data into W3C Design Tokens (composite typography format)
//  */
// function tokenFilesFromTextStyles(
//   stylesMeta: any[],
//   nodesData: any,
//   variablesMap?: any,
// ): Record<string, TokensFile> {
//   const typographyTokens: Record<string, any> = {};

//   for (const style of stylesMeta) {
//     if (style.style_type !== "TEXT") continue;

//     const nodeId = style.node_id;
//     const node = nodesData[nodeId]?.document;

//     if (!node || !node.style) continue;

//     const figmaStyle = node.style;

//     // Handle nested styles like "Display / Large / Bold"
//     const namePath = style.name.split("/").map((part: string) => part.trim());

//     let currentLevel = typographyTokens;
//     for (let i = 0; i < namePath.length - 1; i++) {
//       const part = namePath[i];
//       if (!currentLevel[part]) currentLevel[part] = {};
//       currentLevel = currentLevel[part];
//     }

//     const tokenName = namePath[namePath.length - 1];

//     // Compute W3C Typography composite token, checking for bound variables
//     const fontSizeVal = figmaStyle.fontSize;
//     const fontSizeVarId =
//       getBoundVariableId(nodesData[nodeId], "fontSize") || getBoundVariableId(node, "fontSize");
//     const resolvedFontSize = resolveVariable(`${fontSizeVal}px`, fontSizeVarId, variablesMap);

//     const fontFamilyVal = figmaStyle.fontFamily;
//     const fontFamilyVarId =
//       getBoundVariableId(nodesData[nodeId], "fontFamily") || getBoundVariableId(node, "fontFamily");
//     const resolvedFontFamily = resolveVariable(fontFamilyVal, fontFamilyVarId, variablesMap);

//     const fontWeightVal = figmaStyle.fontWeight;
//     const fontWeightVarId =
//       getBoundVariableId(nodesData[nodeId], "fontWeight") || getBoundVariableId(node, "fontWeight");
//     const resolvedFontWeight = resolveVariable(fontWeightVal, fontWeightVarId, variablesMap);

//     const letterSpacingVal = figmaStyle.letterSpacing
//       ? `${Math.round(figmaStyle.letterSpacing * 100) / 100}px`
//       : "0px";
//     const letterSpacingVarId =
//       getBoundVariableId(nodesData[nodeId], "letterSpacing") ||
//       getBoundVariableId(node, "letterSpacing");
//     const resolvedLetterSpacing = resolveVariable(
//       letterSpacingVal,
//       letterSpacingVarId,
//       variablesMap,
//     );

//     let lineHeightVal = "normal";
//     if (figmaStyle.lineHeightPx) {
//       lineHeightVal = `${Math.round(figmaStyle.lineHeightPx * 100) / 100}px`;
//     } else if (figmaStyle.lineHeightPercent) {
//       lineHeightVal = `${figmaStyle.lineHeightPercent}%`;
//     }
//     const lineHeightVarId =
//       getBoundVariableId(nodesData[nodeId], "lineHeight") || getBoundVariableId(node, "lineHeight");
//     const resolvedLineHeight = resolveVariable(lineHeightVal, lineHeightVarId, variablesMap);

//     currentLevel[tokenName] = {
//       $type: "typography",
//       $description: style.description || "",
//       $value: {
//         fontFamily: resolvedFontFamily,
//         fontWeight: resolvedFontWeight,
//         fontSize: resolvedFontSize,
//         letterSpacing: resolvedLetterSpacing,
//         lineHeight: resolvedLineHeight,
//       },
//     };
//   }

//   // Only return a file if tokens actually exist
//   if (Object.keys(typographyTokens).length === 0) return {};

//   return {
//     "alias.text.styles.json": {
//       ...typographyTokens,
//     },
//   };
// }

// /**
//  * Helper to fetch file styles directly using native fetch
//  */
// async function fetchFigmaStyles(fileKey: string, token: string) {
//   const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/styles`, {
//     headers: { "X-Figma-Token": token },
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to fetch styles: ${response.status} ${response.statusText}`);
//   }
//   return response.json();
// }

// /**
//  * Helper to fetch specific file nodes directly using native fetch
//  */
// async function fetchFigmaNodes(fileKey: string, nodeIds: string, token: string) {
//   const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds}`, {
//     headers: { "X-Figma-Token": token },
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to fetch nodes: ${response.status} ${response.statusText}`);
//   }
//   return response.json();
// }

// /**
//  * Syncs Figma Text Styles to design token files via a 2-step fetch.
//  * Uses native fetch instead of FigmaApi to avoid missing method errors.
//  */
// async function syncTextStylesToTokens(
//   token: string,
//   fileKey: string,
//   outputDir: string,
//   variablesMap?: any,
// ): Promise<number> {
//   console.log(`\nFetching text styles from Figma file: ${fileKey}...`);

//   // Step 1: Fetch style metadata to get node_ids
//   const stylesResponse = await fetchFigmaStyles(fileKey, token);

//   if (!stylesResponse?.meta?.styles) {
//     console.log(`No styles found in Figma file: ${fileKey}`);
//     return 0;
//   }

//   const textStyles = stylesResponse.meta.styles.filter((s: any) => s.style_type === "TEXT");

//   if (textStyles.length === 0) {
//     console.log(`No TEXT styles found in Figma file: ${fileKey}`);
//     return 0;
//   }

//   console.log(`Found ${textStyles.length} text styles. Fetching properties...`);

//   // Step 2: Fetch node properties to get font family, size, line-height, etc.
//   const nodeIds = textStyles.map((s: any) => s.node_id).join(",");
//   const nodesResponse = await fetchFigmaNodes(fileKey, nodeIds, token);

//   if (!nodesResponse?.nodes) {
//     throw new Error(`Failed to fetch node properties for text styles in ${fileKey}`);
//   }

//   const tokensFiles = tokenFilesFromTextStyles(textStyles, nodesResponse.nodes, variablesMap);

//   if (Object.keys(tokensFiles).length === 0) {
//     return 0;
//   }

//   let filesWritten = 0;
//   for (const [fileName, fileContent] of Object.entries(tokensFiles)) {
//     try {
//       validateTokensFile(fileContent);

//       const filePath = `${outputDir}/${fileName}`;
//       const jsonContent = JSON.stringify(fileContent, null, 2);
//       fs.writeFileSync(filePath, jsonContent, "utf-8");

//       console.log(`✓ Wrote ${fileName} (Text Styles)`);
//       filesWritten++;
//     } catch (error) {
//       console.error(
//         `✗ Failed to write ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
//       );
//       throw error;
//     }
//   }

//   return filesWritten;
// }

// // --- MAIN CLI ---------------------------------------------------------------

// function getCliArg(index: number): string | undefined {
//   return process.argv[index];
// }

// async function main() {
//   try {
//     const tokenArgIdx = process.argv.indexOf("--token");
//     const token =
//       tokenArgIdx !== -1 ? getCliArg(tokenArgIdx + 1) : process.env.PERSONAL_ACCESS_TOKEN;
//     if (!token) {
//       throw new Error("PERSONAL_ACCESS_TOKEN env var or --token <token> CLI flag is required");
//     }

//     const fileKeysArgIdx = process.argv.indexOf("--file-keys");
//     const fileKeysArgIdxLegacy = process.argv.indexOf("--file-key");
//     let rawKeys: string | undefined;

//     if (fileKeysArgIdx !== -1) {
//       rawKeys = getCliArg(fileKeysArgIdx + 1);
//     } else if (fileKeysArgIdxLegacy !== -1) {
//       rawKeys = getCliArg(fileKeysArgIdxLegacy + 1);
//     } else {
//       rawKeys = process.env.FILE_KEYS || process.env.FILE_KEY;
//     }

//     if (!rawKeys) {
//       throw new Error("FILE_KEYS/FILE_KEY env var or --file-key <key> CLI flag is required");
//     }

//     const fileKeys = rawKeys
//       .split(",")
//       .map((k) => k.trim())
//       .filter(Boolean);

//     if (fileKeys.length === 0) {
//       throw new Error("No valid file keys provided");
//     }

//     let baseOutputDir = "tokens_new";
//     const outputArgIdx = process.argv.indexOf("--output");
//     if (outputArgIdx !== -1) {
//       const providedDir = process.argv[outputArgIdx + 1];
//       if (!providedDir) {
//         throw new Error("--output flag requires a directory path");
//       }
//       baseOutputDir = providedDir;
//     }

//     const api = new FigmaApi(token);
//     let totalFilesWritten = 0;

//     try {
//       if (fs.existsSync(baseOutputDir)) {
//         fs.rmSync(baseOutputDir, { recursive: true });
//         console.log(`Cleared output directory: ${baseOutputDir}`);
//       }
//       fs.mkdirSync(baseOutputDir, { recursive: true });
//       console.log(`Created output directory: ${baseOutputDir}`);
//     } catch (error) {
//       throw new Error(
//         `Failed to reset output directory "${baseOutputDir}": ${
//           error instanceof Error ? error.message : String(error)
//         }`,
//       );
//     }

//     // Process all files for both Variables AND Text Styles
//     for (const fileKey of fileKeys) {
//       // 1. Fetch Variables first so we can use them as a dictionary for styles
//       const localVariables = await api.getLocalVariables(fileKey);
//       let variablesMap: any = null;
//       let varsWritten = 0;

//       if (localVariables.meta?.variables && Object.keys(localVariables.meta.variables).length > 0) {
//         variablesMap = localVariables.meta.variables;

//         console.log(`Found ${Object.keys(variablesMap).length} variables in ${fileKey}`);
//         const tokensFiles = tokenFilesFromLocalVariables(localVariables);

//         for (const [fileName, fileContent] of Object.entries(tokensFiles)) {
//           try {
//             validateTokensFile(fileContent);
//             const filePath = `${baseOutputDir}/${fileName}`;
//             fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
//             console.log(`✓ Wrote ${fileName} (Variables)`);
//             varsWritten++;
//           } catch (error) {
//             console.error(`✗ Failed to write ${fileName}`);
//           }
//         }
//       } else {
//         console.log(`No local variables found in Figma file: ${fileKey}`);
//       }

//       // 2. Pass the variables dictionary down to resolve text styles
//       const stylesWritten = await syncTextStylesToTokens(
//         token,
//         fileKey,
//         baseOutputDir,
//         variablesMap,
//       );

//       totalFilesWritten += varsWritten + stylesWritten;
//     }

//     console.log(
//       green(
//         `\n✅ Successfully wrote ${totalFilesWritten} token file(s) from ${fileKeys.length} Figma file(s) to the ${baseOutputDir} directory`,
//       ),
//     );
//   } catch (error) {
//     console.error("\n❌ Error:", error instanceof Error ? error.message : String(error));
//     process.exit(1);
//   }
// }

// main();

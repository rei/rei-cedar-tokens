/**
 * normalize.ts
 *
 * Reads every *.json file from tokens/, normalizes them into a canonical tree,
 * and writes the result to canonical/tokens.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import {
  buildCollectionToSection,
  clean,
  nestUnderSections,
  deepMerge,
  extractColorMode,
  extractPrimitiveMode,
  buildSpacingClamp,
  applyTokenMapping,
  buildOptionTree,
  expandHyphenatedTokens,
  fixStaticReferencePaths,
  buildTextSizeClamp,
  type TokenMapping,
  type ParsedFile,
} from './normalize-utils.js';
import { mergeColorVariants } from './color-variants.js';
import { reportValidationIssues, validateFigmaInputs } from './normalize-validation.js';
import { mergeMetadata } from './merge-metadata.js';
import type { TokenMetadataManifest } from '../types/token-metadata.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(__dirname, '../../tokens');
const outFile = path.resolve(__dirname, '../../canonical/tokens.json');
const schemaFile = path.resolve(__dirname, '../../src/schema/token-schema.json');
const metadataFile = path.resolve(__dirname, '../../metadata/tokens.json');

const SPACING_BP_RE = /^options.spacing.scale\.(\d+)\.json$/;
const TEXT_SIZE_FLUID_BP_RE = /^options.text.size.fluid\.(\d+)\.json$/;

// ─── Pipeline steps ──────────────────────────────────────────────────────────

function loadSchema(): TokenMapping {
  if (!fs.existsSync(schemaFile)) {
    throw new Error(
      `Token schema not found at ${schemaFile}. ` +
        `This file is required — see ADR-0003 (Figma Input Contract).`,
    );
  }
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf-8'));
  const figmaInputs = schema?.inputs?.figma;
  if (
    typeof figmaInputs !== 'object' ||
    figmaInputs === null ||
    typeof figmaInputs.collections !== 'object' ||
    figmaInputs.collections === null
  ) {
    throw new Error(
      `Invalid Figma input contract in ${schemaFile}. ` +
        `Expected inputs.figma.collections to be an object. ` +
        `Fix src/schema/token-schema.json to match ADR-0003.`,
    );
  }
  return figmaInputs as TokenMapping;
}

function readTokenFiles(): ParsedFile[] {
  const files = fs
    .readdirSync(tokensDir)
    .filter((f) => f.endsWith('.json') && f !== 'canonical.json')
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    throw new Error(`No JSON files found in ${tokensDir}. Run the Figma sync first.`);
  }

  return files.map((file) => ({
    file,
    data: JSON.parse(fs.readFileSync(path.join(tokensDir, file), 'utf-8')) as Record<
      string,
      unknown
    >,
  }));
}

function partitionFiles(parsed: ParsedFile[]) {
  const isSpacingStatic = (file: string) => file.includes('spacing') && file.includes('static');

  return {
    spacingBpFiles: parsed.filter(({ file }) => SPACING_BP_RE.test(file)),
    spacingStaticFiles: parsed.filter(({ file }) => isSpacingStatic(file)),
    optionColorFiles: parsed.filter(
      ({ file }) => extractPrimitiveMode(file) !== null && !isSpacingStatic(file),
    ),
    spacingPlatformFiles: parsed.filter(
      ({ file }) => file.includes('spacing') && file.startsWith('alias.spacing.'),
    ),
    typographyBpFiles: parsed.filter(({ file }) => TEXT_SIZE_FLUID_BP_RE.test(file)),
    typographyFiles: parsed.filter(
      ({ file }) => file.startsWith('options.text.') && !TEXT_SIZE_FLUID_BP_RE.test(file),
    ),
    otherFiles: parsed.filter(
      ({ file }) =>
        !SPACING_BP_RE.test(file) &&
        extractPrimitiveMode(file) === null &&
        !file.includes('spacing') &&
        !file.startsWith('options.text.'),
    ),
  };
}

function processSpacing(
  canonical: Record<string, unknown>,
  spacingBpFiles: ParsedFile[],
  spacingStaticFiles: ParsedFile[],
  spacingPlatformFiles: ParsedFile[],
) {
  if (spacingBpFiles.length > 0) {
    const parsedBps = spacingBpFiles.map(({ file, data }) => ({
      breakpoint: parseInt(SPACING_BP_RE.exec(file)![1], 10),
      data,
    }));
    const fluidSpacing = buildSpacingClamp(parsedBps);
    deepMerge(canonical, fluidSpacing);
    const bpList = parsedBps
      .map((p) => p.breakpoint)
      .sort((a, b) => a - b)
      .join(', ');
    console.log(
      `  ✓ spacing.[${bpList}].json → fluid clamp() values (${spacingBpFiles.length} breakpoints)`,
    );
  }

  if (spacingStaticFiles.length > 0) {
    if (!canonical.spacing) canonical.spacing = {};
    const collectionToSection = buildCollectionToSection(spacingStaticFiles);

    for (const { data } of spacingStaticFiles) {
      const cleanedData = clean(data, collectionToSection);
      deepMerge(canonical, expandHyphenatedTokens(cleanedData as Record<string, any>));
    }
  }

  if (spacingPlatformFiles.length > 0) {
    if (!canonical.spacing) canonical.spacing = {};
    const spacingTarget = canonical.spacing as Record<string, any>;

    for (const { file, data } of spacingPlatformFiles) {
      let platformName = file.split('.')[2];
      platformName = platformName.includes('web') ? 'web' : 'ios';
      const spaceSource = data as Record<string, any>;

      for (const [tokenGroupKey, tokenData] of Object.entries(spaceSource.spacing)) {
        const rawTokenGroup = tokenData as Record<string, any>;

        for (const [tokenKey, tokenData] of Object.entries(rawTokenGroup)) {
          if (!spacingTarget[tokenGroupKey]) spacingTarget[tokenGroupKey] = {};

          if (!spacingTarget[tokenGroupKey][tokenKey]) {
            spacingTarget[tokenGroupKey][tokenKey] = {
              $type: tokenData.$type || 'number',
              $value: fixStaticReferencePaths(tokenData.$value),
              $description: tokenData.$description || '',
              $extensions: {
                cedar: {
                  ios: {
                    dark: fixStaticReferencePaths(tokenData.$value),
                    light: fixStaticReferencePaths(tokenData.$value),
                  },
                  web: {
                    dark: fixStaticReferencePaths(tokenData.$value),
                    light: fixStaticReferencePaths(tokenData.$value),
                  },
                },
              },
            };
          }

          if (platformName === 'web') {
            spacingTarget[tokenGroupKey][tokenKey].$value = fixStaticReferencePaths(
              tokenData.$value,
            );
          }

          spacingTarget[tokenGroupKey][tokenKey].$extensions.cedar[platformName] = {
            dark: fixStaticReferencePaths(tokenData.$value),
            light: fixStaticReferencePaths(tokenData.$value),
          };
        }
      }
    }
    console.log(`  ✓ Normalized platform files into canonical spacing`);
  }
}

function processOptionColors(
  canonical: Record<string, unknown>,
  optionColorFiles: ParsedFile[],
  tokenMapping: TokenMapping,
): Map<string, Record<string, string>> {
  const platformLookup = new Map<string, Record<string, string>>();
  const canonicalFallbackEntries: Array<{
    canonicalPath: string;
    token: { $type: string; $value: string };
  }> = [];

  const canonicalFallbackMode = optionColorFiles.find(
    ({ file }) => extractPrimitiveMode(file) === 'web-light',
  )
    ? 'web-light'
    : (extractPrimitiveMode(optionColorFiles[0]?.file) ?? null);

  for (const { file, data } of optionColorFiles) {
    const primitiveMode = extractPrimitiveMode(file)!;
    const lookup: Record<string, string> = {};

    for (const [collectionName, collectionData] of Object.entries(data)) {
      const entry = tokenMapping.collections[collectionName];
      if (!entry) {
        throw new Error(
          `[normalize] Figma collection "${collectionName}" (from ${file}) has no entry ` +
            `in src/schema/token-schema.json (inputs.figma.collections). ` +
            `Add an "inputs.figma.collections.${collectionName}" entry.`,
        );
      }

      const mapped = applyTokenMapping(
        collectionName,
        collectionData as Record<string, unknown>,
        entry,
        primitiveMode,
      );

      for (const { canonicalPath, token } of mapped) {
        // Convert lookup keys to dot notation so variant resolution matches dot alias references
        const dotPath = canonicalPath.replace(/-/g, '.');
        lookup[dotPath] = token.$value;
      }

      if (primitiveMode === canonicalFallbackMode) {
        canonicalFallbackEntries.push(...mapped);
      }
    }

    platformLookup.set(primitiveMode, lookup);
    console.log(`  ✓ ${file} [primitives: ${primitiveMode}] (${Object.keys(data).join(', ')})`);
  }

  if (canonicalFallbackEntries.length > 0) {
    deepMerge(canonical, expandHyphenatedTokens(buildOptionTree(canonicalFallbackEntries)));
  }

  return platformLookup;
}

function processAliasFiles(
  canonical: Record<string, unknown>,
  otherFiles: ParsedFile[],
  tokenMapping: TokenMapping,
) {
  const collectionToSection = buildCollectionToSection(otherFiles);

  for (const { file, data } of otherFiles) {
    const cleaned = clean(data, collectionToSection, tokenMapping);
    const colorMode = extractColorMode(file);

    const nested = nestUnderSections(
      cleaned as Record<string, unknown>,
      collectionToSection,
      colorMode,
    );

    const modeLabel = colorMode ? ` [mode: ${colorMode}]` : '';
    console.log(`  ✓ ${file}${modeLabel} (${Object.keys(data).join(', ')})`);
    deepMerge(canonical, expandHyphenatedTokens(nested));
  }
}

function processMetadata(canonical: Record<string, unknown>) {
  if (fs.existsSync(metadataFile)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8')) as TokenMetadataManifest;
    const count = mergeMetadata(canonical, metadata);
    console.log(`  ✓ metadata/tokens.json [governance: ${count} token(s)]`);
  } else {
    console.log(
      `  ⊘ metadata/tokens.json not found (optional). All tokens will be unmarked/unreviewed.`,
    );
  }
}

function processTypography(
  canonical: Record<string, unknown>,
  typographyFiles: ParsedFile[],
  typographyBpFiles: ParsedFile[],
) {
  if (typographyFiles.length === 0 && typographyBpFiles.length === 0) return;

  const typographyTree: Record<string, any> = { text: {} };

  if (typographyBpFiles.length > 0) {
    const parsedBps = typographyBpFiles.map(({ file, data }) => ({
      breakpoint: parseInt(TEXT_SIZE_FLUID_BP_RE.exec(file)![1], 10),
      data,
    }));

    const fluidTextSize = buildTextSizeClamp(parsedBps);
    deepMerge(typographyTree, fluidTextSize);
  }

  for (const { file, data } of typographyFiles) {
    const match = file.match(/options\.text\.([\w.-]+)\.(\w+?)(?:_\d+)?\.json$/);
    if (!match) continue;

    const [_, subPropertyPath, variantName] = match;
    const pathSegments = subPropertyPath.split(/[.-]/);

    let propertyData: any = (data as Record<string, any>).text;
    for (const seg of pathSegments) {
      propertyData = propertyData?.[seg];
    }

    if (!propertyData) continue;

    let currentLevel = typographyTree.text;
    for (let i = 0; i < pathSegments.length; i++) {
      const seg = pathSegments[i];
      if (!currentLevel[seg]) {
        currentLevel[seg] = {};
      }

      if (i === pathSegments.length - 1) {
        for (const [tokenKey, tokenLeaf] of Object.entries(propertyData)) {
          const leaf = tokenLeaf as Record<string, any>;

          if (!currentLevel[seg][tokenKey]) {
            currentLevel[seg][tokenKey] = {
              $type: leaf.$type || 'string',
              $value: '',
              $extensions: { cedar: {} },
            };
          }

          const targetToken = currentLevel[seg][tokenKey];

          if (variantName === 'default') {
            targetToken.$value = fixStaticReferencePaths(leaf.$value);
            if (leaf.$type) targetToken.$type = leaf.$type;
          } else {
            targetToken.$extensions.cedar[variantName] = fixStaticReferencePaths(leaf.$value);
          }

          if (leaf.$description && !targetToken.$description) {
            targetToken.$description = leaf.$description;
          }
        }
      } else {
        currentLevel = currentLevel[seg];
      }
    }
  }

  deepMerge(canonical, expandHyphenatedTokens(typographyTree));
  console.log(
    `  ✓ Normalized ${typographyFiles.length} typography file(s) and fluid clamps into canonical text tree`,
  );
}

function writeCanonical(canonical: Record<string, unknown>, fileCount: number) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(canonical, null, 2), 'utf-8');

  console.log(`\nSuccessfully created: ${outFile}`);
  console.log(
    `  ${fileCount} file(s) merged, ${
      Object.keys(canonical).length
    } top-level section(s): ${Object.keys(canonical).join(', ')}`,
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

try {
  const tokenMapping = loadSchema();
  const parsed = readTokenFiles();
  const {
    spacingBpFiles,
    spacingStaticFiles,
    spacingPlatformFiles,
    optionColorFiles,
    typographyFiles,
    typographyBpFiles,
    otherFiles,
  } = partitionFiles(parsed);

  const validationIssues = validateFigmaInputs({
    parsedFiles: parsed,
    optionsFiles: [
      ...optionColorFiles,
      ...spacingStaticFiles,
      ...spacingBpFiles,
      ...typographyBpFiles,
      ...typographyFiles,
    ],
    otherFiles,
    tokenMapping,
  });
  reportValidationIssues(validationIssues);

  const canonical: Record<string, unknown> = {};

  processSpacing(canonical, spacingBpFiles, spacingStaticFiles, spacingPlatformFiles);
  const platformLookup = processOptionColors(canonical, optionColorFiles, tokenMapping);
  processAliasFiles(canonical, otherFiles, tokenMapping);
  mergeColorVariants(canonical, platformLookup);
  processTypography(canonical, typographyFiles, typographyBpFiles);
  processMetadata(canonical);
  writeCanonical(canonical, parsed.length);
} catch (error) {
  console.error('Error creating canonical/tokens.json:', error);
  process.exit(1);
}

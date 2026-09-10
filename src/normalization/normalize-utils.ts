/**
 * normalize-utils.ts
 *
 * Pure functions extracted from normalize.ts so they can be unit-tested
 * without hitting the filesystem.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type TokenNode =
  | { [key: string]: TokenNode }
  | { $value: string | number | boolean; $type: string };

export type ParsedFile = { file: string; data: Record<string, unknown> };

/**
 * Extract the semantic color mode name from a token filename.
 */
export function extractColorMode(file: string): string | null {
  const parts = file.replace(/\.json$/, '').split('.');
  if (parts[0] === 'alias' && parts[1] === 'color' && parts.length >= 3) {
    return parts[2];
  }
  return null;
}

/**
 * Extract the primitive platform mode from a token filename.
 */
export function extractPrimitiveMode(file: string): string | null {
  const parts = file.replace(/\.json$/, '').split('.');
  if (parts[0] === 'options' && parts[1] === 'color' && parts.length >= 3) {
    return parts[2];
  }
  return null;
}

// ─── isLeaf ───────────────────────────────────────────────────────────────────

export function isLeaf(node: unknown): node is {
  $value: string | number | boolean;
  $type: string;
  [k: string]: unknown;
} {
  return typeof node === 'object' && node !== null && '$value' in node;
}

// ─── TokenMapping ─────────────────────────────────────────────────────────────

export type TokenMappingEntry = {
  canonicalPrefix: string;
  colorFamily?: string;
  tokens: Record<string, string> | 'auto';
};

export type TokenMapping = {
  collections: Record<string, TokenMappingEntry>;
};

// ─── parseTokenDescription ──────────────────────────────────────────────────

export function parseTokenDescription(
  raw: string,
): { summary?: string; design?: string; usage?: string; aliases?: string[] } | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const KNOWN_KEYS = new Set(['usage', 'design', 'aliases']);
  const lines = trimmed.split('\n');

  const summaryLines: string[] = [];
  const fields: Record<string, string> = {};
  let currentKey: string | null = null;

  for (const line of lines) {
    const keyMatch = line.match(/^([a-z]+):\s*(.*)$/i);
    if (keyMatch && KNOWN_KEYS.has(keyMatch[1].toLowerCase())) {
      currentKey = keyMatch[1].toLowerCase();
      fields[currentKey] = keyMatch[2].trim();
    } else if (currentKey) {
      fields[currentKey] += ' ' + line.trim();
    } else {
      summaryLines.push(line.trim());
    }
  }

  const result: {
    summary?: string;
    design?: string;
    usage?: string;
    aliases?: string[];
  } = {};

  const summary = summaryLines.join(' ').trim();
  if (summary) result.summary = summary;
  if (fields.design) result.design = fields.design.trim();
  if (fields.usage) result.usage = fields.usage.trim();
  if (fields.aliases) {
    const parts = fields.aliases
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) result.aliases = parts;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

// ─── applyTokenMapping ────────────────────────────────────────────────────────

export function applyTokenMapping(
  collectionName: string,
  collectionData: Record<string, unknown>,
  entry: TokenMappingEntry,
  platformKey: string,
): Array<{
  canonicalPath: string;
  token: {
    $type: string;
    $value: string;
    docs?: ReturnType<typeof parseTokenDescription>;
    colorFamily?: string;
  };
}> {
  const results: Array<{
    canonicalPath: string;
    token: {
      $type: string;
      $value: string;
      docs?: ReturnType<typeof parseTokenDescription>;
      colorFamily?: string;
    };
  }> = [];

  function walkCollection(node: Record<string, unknown>, figmaPath: string[]) {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      const currentFigmaPath = [...figmaPath, key];
      const figmaPathStr = currentFigmaPath.join('.');

      if (isLeaf(value)) {
        const canonicalSub = entry.tokens === 'auto' ? figmaPathStr : entry.tokens[figmaPathStr];
        if (canonicalSub === undefined) {
          throw new Error(
            `[token-mapping] Unknown Figma token path "${collectionName}.${figmaPathStr}" ` +
              `(from platform "${platformKey}"). ` +
              `Add an entry to src/schema/token-schema.json (inputs.figma.collections) or rename the Figma variable to match an existing entry.`,
          );
        }
        const canonicalPath = `${entry.canonicalPrefix}.${canonicalSub}`;
        const token: {
          $type: string;
          $value: string;
          docs?: ReturnType<typeof parseTokenDescription>;
          colorFamily?: string;
        } = {
          $type: (value as any).$type,
          $value: String((value as any).$value),
          colorFamily: entry.colorFamily,
        };

        const rawDescription = (value as any).$description;
        if (rawDescription && typeof rawDescription === 'string') {
          const docs = parseTokenDescription(rawDescription);
          if (docs) token.docs = docs;
        }
        results.push({
          canonicalPath,
          token,
        });
      } else if (value && typeof value === 'object') {
        walkCollection(value as Record<string, unknown>, currentFigmaPath);
      }
    }
  }

  walkCollection(collectionData, []);
  return results;
}

// ─── buildOptionTree ──────────────────────────────────────────────────────────

export function buildOptionTree(
  entries: Array<{
    canonicalPath: string;
    token: {
      $type: string;
      $value: string;
      docs?: ReturnType<typeof parseTokenDescription>;
      colorFamily?: string;
    };
  }>,
): Record<string, unknown> {
  const root: Record<string, unknown> = {};

  for (const { canonicalPath, token } of entries) {
    const segments = canonicalPath.split('.');
    let cursor = root as Record<string, unknown>;
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      if (!cursor[seg]) cursor[seg] = {};
      cursor = cursor[seg] as Record<string, unknown>;
    }
    const leaf = segments[segments.length - 1];

    const tokenNode: any = {
      $type: token.$type,
      $value: token.$value,
    };

    if (token.docs || token.colorFamily) {
      tokenNode.$extensions = {
        cedar: {
          ...(token.docs && { docs: token.docs }),
          ...(token.colorFamily && { colorFamily: token.colorFamily }),
        },
      };
    }

    cursor[leaf] = tokenNode;
  }

  return root;
}

// ─── buildCollectionToSection ─────────────────────────────────────────────────

export function buildCollectionToSection(parsed: ParsedFile[]): Map<string, string> {
  const map = new Map<string, string>();
  const CANONICAL_SECTIONS = new Set(['spacing', 'color', 'text']);

  for (const { file, data } of parsed) {
    const parts = file.replace(/\.json$/, '').split('.');
    const sectionFromFilename = parts.length >= 2 ? parts[1] : parts[0];

    for (const topKey of Object.keys(data)) {
      const value = data[topKey];
      if (typeof value !== 'object' || value === null) continue;

      const isWrapper = parts.includes(topKey);

      if (isWrapper) {
        map.set(topKey, topKey);
        for (const childKey of Object.keys(value as object)) {
          map.set(childKey, topKey);
        }
      } else {
        if (CANONICAL_SECTIONS.has(topKey)) {
          map.set(topKey, topKey);
        } else {
          map.set(topKey, sectionFromFilename);
        }
      }
    }
  }

  return map;
}

function buildTextSemanticExtensions(baseValue: Record<string, unknown>, variableName: string) {
  const iosValue: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(baseValue)) {
    if (typeof v === 'string') {
      iosValue[k] = v.replace('.fluid.', '.static.');
    } else {
      iosValue[k] = v;
    }
  }

  return {
    ios: {
      light: iosValue,
      dark: iosValue,
    },
    web: {
      light: baseValue,
      dark: baseValue,
    },
    governance: {
      figma: {
        collection: 'Type / Semantic',
        variable: variableName,
      },
    },
  };
}

// ─── clean ────────────────────────────────────────────────────────────────────

export function clean(
  node: Record<string, unknown>,
  collectionToSection: Map<string, string>,
  tokenMapping?: TokenMapping | null,
  currentPath: string[] = [],
): TokenNode {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === '$extensions' || key === '$description') continue;

    if (
      isLeaf(value) &&
      typeof value === 'object' &&
      value !== null &&
      Object.keys(value).some(
        (k) => !k.startsWith('$') && typeof (value as Record<string, unknown>)[k] === 'object',
      )
    ) {
      out[key] = clean(value as Record<string, unknown>, collectionToSection, tokenMapping, [
        ...currentPath,
        key,
      ]);
      continue;
    }

    if (isLeaf(value)) {
      const rawValue = value.$value;
      let finalValue: unknown = rawValue;

      const rewriteAlias = (valStr: string, objPropKey?: string) => {
        if (valStr.startsWith('{') && valStr.endsWith('}')) {
          const inner = valStr.slice(1, -1);
          const segments = inner.split('.');
          const firstSegment = segments[0];
          const mappingEntry = tokenMapping?.collections[firstSegment];

          let resolvedPath = inner;

          if (mappingEntry) {
            const figmaSubPath = segments.slice(1).join('.');
            const canonicalSub =
              mappingEntry.tokens === 'auto' ? figmaSubPath : mappingEntry.tokens[figmaSubPath];
            if (canonicalSub !== undefined) {
              resolvedPath = `${mappingEntry.canonicalPrefix ?? firstSegment}.${canonicalSub}`;
            } else {
              throw new Error(
                `[clean] Alias reference "{${inner}}" has no entry in src/schema/token-schema.json (inputs.figma.collections) ` +
                  `for collection "${firstSegment}", path "${figmaSubPath}". ` +
                  `Add the mapping entry or update the Figma alias reference.`,
              );
            }
          } else {
            let section = collectionToSection.get(firstSegment);

            const isTypographyRef =
              firstSegment === 'text' &&
              (currentPath[0] === 'text' ||
                value.$type === 'typography' ||
                ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].includes(
                  value.$type || '',
                ) ||
                ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].includes(
                  objPropKey || '',
                ) ||
                segments.some((seg) =>
                  [
                    'family',
                    'fontFamily',
                    'font-family',
                    'size',
                    'fontSize',
                    'font-size',
                    'weight',
                    'fontWeight',
                    'font-weight',
                    'lineHeight',
                    'line-height',
                    'letterSpacing',
                    'letter-spacing',
                    'styles',
                    'semantic',
                  ].includes(seg),
                ));

            if (isTypographyRef) {
              section = 'text';
            }

            if (section && section !== firstSegment) {
              resolvedPath = `${section}.${inner}`;
            }
          }

          // Ensure ALL hyphens inside the token reference path are rewritten to dots
          return `{${resolvedPath.replace(/-/g, '.')}}`;
        }
        return valStr;
      };

      if (typeof rawValue === 'string') {
        finalValue = rewriteAlias(rawValue);
      } else if (typeof rawValue === 'object' && rawValue !== null) {
        finalValue = {};
        for (const [objKey, objVal] of Object.entries(rawValue)) {
          if (typeof objVal === 'string') {
            (finalValue as Record<string, unknown>)[objKey] = rewriteAlias(objVal, objKey);
          } else {
            (finalValue as Record<string, unknown>)[objKey] = objVal;
          }
        }
      }

      const tokenNode: Record<string, unknown> = {
        $value: finalValue,
        $type: value.$type,
      };
      const cedarExtensions: Record<string, unknown> = {};

      const rawDescription = value.$description;
      if (typeof rawDescription === 'string') {
        const docs = parseTokenDescription(rawDescription);
        if (docs) {
          cedarExtensions.docs = docs;
        }
      }

      if (
        currentPath[0] === 'text' &&
        currentPath[1] === 'semantic' &&
        value.$type === 'typography' &&
        typeof finalValue === 'object' &&
        finalValue !== null
      ) {
        const variableName = [...currentPath.slice(2), key].join('.');

        Object.assign(
          cedarExtensions,
          buildTextSemanticExtensions(finalValue as Record<string, unknown>, variableName),
        );
      }

      if (Object.keys(cedarExtensions).length > 0) {
        tokenNode.$extensions = { cedar: cedarExtensions };
      }

      out[key] = tokenNode;
    } else if (typeof value === 'object' && value !== null) {
      out[key] = clean(value as Record<string, unknown>, collectionToSection, tokenMapping, [
        ...currentPath,
        key,
      ]);
    }
  }

  return out as TokenNode;
}

function hasTypographyTokens(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  if ('$type' in obj && (obj as Record<string, unknown>).$type === 'typography') {
    return true;
  }
  for (const val of Object.values(obj)) {
    if (hasTypographyTokens(val)) {
      return true;
    }
  }
  return false;
}

// ─── nestUnderSections ────────────────────────────────────────────────────────

export function nestUnderSections(
  cleaned: Record<string, unknown>,
  collectionToSection: Map<string, string>,
  colorMode?: string | null,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const CANONICAL_SECTIONS = new Set(['spacing', 'color', 'text']);

  for (const [key, value] of Object.entries(cleaned)) {
    let section = collectionToSection.get(key);

    if (CANONICAL_SECTIONS.has(key)) {
      section = key;
    } else if (hasTypographyTokens(value)) {
      section = 'text';
    }

    if (!section || section === key) {
      if (colorMode && key === 'color') {
        if (!out['color']) out['color'] = {};
        deepMerge(out['color'] as Record<string, unknown>, {
          modes: { [colorMode]: value },
        });
        continue;
      }

      if (!out[key]) out[key] = {};
      deepMerge(out[key] as Record<string, unknown>, value as Record<string, unknown>);
      continue;
    }

    if (!out[section]) out[section] = {};
    (out[section] as Record<string, unknown>)[key] = value;
  }

  return out;
}

// ─── buildSpacingClamp ────────────────────────────────────────────────────────

export function buildSpacingClamp(
  parsedSpacingFiles: Array<{
    breakpoint: number;
    data: Record<string, unknown>;
  }>,
): Record<string, unknown> {
  if (parsedSpacingFiles.length === 0) return {};

  const sorted = [...parsedSpacingFiles].sort((a, b) => a.breakpoint - b.breakpoint);
  const minBp = sorted[0].breakpoint;

  const scaleKeys = new Set<string>();
  for (const { data } of sorted) {
    const scale = getScale(data);
    if (scale) Object.keys(scale).forEach((k) => scaleKeys.add(k));
  }

  const scaleOut: Record<string, unknown> = {};

  for (const tokenKey of scaleKeys) {
    const pairs: Array<{ bp: number; val: number }> = [];
    for (const { breakpoint, data } of sorted) {
      const scale = getScale(data);
      if (!scale) continue;
      const leaf = scale[tokenKey];
      if (isLeaf(leaf) && typeof leaf.$value === 'number') {
        pairs.push({ bp: breakpoint, val: leaf.$value });
      } else if (isLeaf(leaf) && typeof leaf.$value === 'string') {
        const n = parseFloat(leaf.$value);
        if (!isNaN(n)) pairs.push({ bp: breakpoint, val: n });
      }
    }

    if (pairs.length < 2) {
      const v = pairs[0]?.val ?? 0;
      scaleOut[tokenKey] = { $value: `${roundPx(v)}px`, $type: 'dimension' };
      continue;
    }

    const vMin = pairs[0].val;
    const vMax = Math.max(...pairs.map((p) => p.val));

    const satPair = pairs.find((p) => Math.abs(p.val - vMax) < 0.05);
    const maxBp = satPair?.bp ?? sorted[sorted.length - 1].breakpoint;

    const bpMinVw = minBp / 100;
    const bpMaxVw = maxBp / 100;
    const slope = (vMax - vMin) / (bpMaxVw - bpMinVw);
    const intercept = vMin - slope * bpMinVw;

    const clampValue = `clamp(${roundPx(vMin)}px, ${roundSlope(
      slope,
    )}vw + ${roundPx(intercept)}px, ${roundPx(vMax)}px)`;
    scaleOut[tokenKey] = { $value: clampValue, $type: 'dimension' };
  }

  return { spacing: { scale: scaleOut } };
}

export function buildTextSizeClamp(
  parsedFiles: Array<{ breakpoint: number; data: Record<string, unknown> }>,
): Record<string, unknown> {
  if (parsedFiles.length === 0) return {};

  const sorted = [...parsedFiles].sort((a, b) => a.breakpoint - b.breakpoint);
  const scaleKeys = new Set<string>();

  for (const { data } of sorted) {
    const fluidGroup = (data as any)?.text?.size?.fluid;
    if (fluidGroup) Object.keys(fluidGroup).forEach((k) => scaleKeys.add(k));
  }

  const scaleOut: Record<string, unknown> = {};

  const roundPx = (num: number) => Math.round(num * 100) / 100;
  const roundSlope = (num: number) => Math.round(num * 1000) / 1000;

  for (const tokenKey of scaleKeys) {
    const pairs: Array<{ bp: number; val: number }> = [];

    for (const { breakpoint, data } of sorted) {
      const leaf = (data as any)?.text?.size?.fluid?.[tokenKey];
      if (leaf && typeof leaf === 'object' && '$value' in leaf) {
        const val = typeof leaf.$value === 'string' ? parseFloat(leaf.$value) : leaf.$value;
        if (!isNaN(val)) pairs.push({ bp: breakpoint, val });
      }
    }

    if (pairs.length === 0) continue;

    const vMin = Math.min(...pairs.map((p) => p.val));
    const vMax = Math.max(...pairs.map((p) => p.val));

    if (vMin === vMax) {
      scaleOut[tokenKey] = { $type: 'dimension', $value: `${vMin}px` };
      continue;
    }

    const vwCoef = vMin * 0.05;
    const intercept = vMin - vwCoef * 4;

    scaleOut[tokenKey] = {
      $type: 'dimension',
      $value: `clamp(${vMin}px, ${roundSlope(vwCoef)}vw + ${roundPx(intercept)}px, ${vMax}px)`,
    };
  }

  return { text: { size: { fluid: scaleOut } } };
}

function getScale(data: Record<string, unknown>): Record<string, unknown> | null {
  const spacingSection = data['spacing'];
  if (typeof spacingSection !== 'object' || spacingSection === null) return null;
  const scale = (spacingSection as Record<string, unknown>)['scale'];
  if (typeof scale !== 'object' || scale === null) return null;
  return scale as Record<string, unknown>;
}

function roundPx(v: number): string {
  return parseFloat(v.toFixed(4)).toString();
}

function roundSlope(v: number): string {
  return parseFloat(v.toFixed(4)).toString();
}

function mergeExtensions(
  destExt?: Record<string, unknown>,
  srcExt?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!destExt && !srcExt) return undefined;
  if (!destExt) return srcExt;
  if (!srcExt) return destExt;

  const result: Record<string, unknown> = { ...destExt };

  for (const [k, v] of Object.entries(srcExt)) {
    if (
      typeof v === 'object' &&
      v !== null &&
      typeof result[k] === 'object' &&
      result[k] !== null
    ) {
      result[k] = mergeExtensions(
        result[k] as Record<string, unknown>,
        v as Record<string, unknown>,
      );
    } else {
      result[k] = v;
    }
  }

  return result;
}

export function deepMerge(dest: Record<string, unknown>, src: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(src)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      !isLeaf(value) &&
      typeof dest[key] === 'object' &&
      dest[key] !== null &&
      !isLeaf(dest[key])
    ) {
      deepMerge(dest[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else if (isLeaf(value) && isLeaf(dest[key])) {
      const destLeaf = dest[key] as Record<string, unknown>;
      const srcLeaf = value as Record<string, unknown>;

      const mergedExtensions = mergeExtensions(
        destLeaf.$extensions as Record<string, unknown> | undefined,
        srcLeaf.$extensions as Record<string, unknown> | undefined,
      );

      dest[key] = {
        ...destLeaf,
        ...srcLeaf,
      };

      if (mergedExtensions && Object.keys(mergedExtensions).length > 0) {
        (dest[key] as Record<string, unknown>).$extensions = mergedExtensions;
      } else {
        delete (dest[key] as Record<string, unknown>).$extensions;
      }
    } else {
      dest[key] = value;
    }
  }
}

export function expandHyphenatedTokens(obj: Record<string, any>): TokenNode {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if ('$value' in obj) {
    return obj as unknown as TokenNode;
  }

  const root: TokenNode = {};

  for (const [key, value] of Object.entries(obj)) {
    const processedValue = expandHyphenatedTokens(value);
    const segments = key.split('-');
    let currentLevel = root;

    segments.forEach((segment, index) => {
      const isLastSegment = index === segments.length - 1;

      if (isLastSegment) {
        currentLevel[segment] = processedValue;
      } else {
        if (
          !currentLevel[segment] ||
          typeof currentLevel[segment] !== 'object' ||
          '$value' in currentLevel[segment]
        ) {
          currentLevel[segment] = {};
        }
        currentLevel = currentLevel[segment];
      }
    });
  }

  return root;
}

/**
 * Rewrite hyphens inside any `{...}` reference to dots.
 */
export function fixStaticReferencePaths(value: unknown): any {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('{') || !value.endsWith('}')) return value;

  const inner = value.slice(1, -1);
  return `{${inner.replace(/-/g, '.')}}`;
}

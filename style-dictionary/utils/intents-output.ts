import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTokenAtPath, resolveOptionHex } from './option-resolver.js';
import { isRecord, isTokenLeaf } from '../../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const canonicalTokensPath = path.join(rootDir, 'canonical/tokens.json');

const THEMES = ['rei-dot-com', 'docsite'];
const KNOWN_CATEGORIES = ['surface', 'text', 'icon', 'border'];

export type IntentToken = {
  path: string[];
  name: string;
  cssName: string;
  jsName: string;
  category: string;
  value: string;
};

function toKebab(value: string): string {
  return value.replace(/\s+/g, '-').toLowerCase();
}

function toPascalName(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join('');
}

function resolveColorValue(value: string, tokens: unknown): string {
  if (typeof value !== 'string') {
    return String(value ?? '');
  }

  if (value.startsWith('#')) {
    return value;
  }

  if (value.startsWith('{') && value.endsWith('}')) {
    const refPath = value.slice(1, -1);
    const token = getTokenAtPath(tokens, refPath);

    if (!token) {
      return value;
    }

    const resolved = token.$extensions?.cedar?.resolved?.web?.light;
    if (typeof resolved === 'string') {
      return resolved;
    }

    const webCedar = token.$extensions?.cedar?.web;
    if (typeof webCedar?.light === 'string') {
      const optionToken = getTokenAtPath(tokens, webCedar.light);
      if (optionToken) {
        return resolveOptionHex(optionToken, 'web', 'light') ?? value;
      }
    }

    if (typeof token.$value === 'string') {
      return resolveColorValue(token.$value, tokens);
    }

    return value;
  }

  return value;
}

export function getCategory(tokenPath: string[]): string {
  const leaf = tokenPath[tokenPath.length - 1];
  const leafKebab = toKebab(leaf);

  if (KNOWN_CATEGORIES.includes(leafKebab)) {
    return leafKebab;
  }

  if (leafKebab === 'border' || leafKebab.startsWith('border-')) {
    return 'border';
  }

  const parent = tokenPath[tokenPath.length - 2];
  if (parent === 'link') {
    return 'text';
  }

  return leafKebab;
}

export function collectUiTokens(tokens: unknown): IntentToken[] {
  const ui = (tokens as Record<string, unknown>)?.['UI'];
  if (!isRecord(ui)) {
    return [];
  }

  const result: IntentToken[] = [];

  const walk = (node: unknown, currentPath: string[]) => {
    if (isTokenLeaf(node)) {
      const value = resolveColorValue(node.$value as string, tokens);
      const basePath = toKebab(currentPath.slice(1).join(' '));
      const cssName = `cdr-color-${basePath}`;
      const jsName = `CdrColor${toPascalName(basePath)}`;
      result.push({
        path: currentPath,
        name: currentPath.join('.'),
        cssName,
        jsName,
        category: getCategory(currentPath),
        value,
      });
      return;
    }

    if (!isRecord(node)) {
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      walk(child, [...currentPath, key]);
    }
  };

  for (const [key, child] of Object.entries(ui)) {
    walk(child, ['UI', key]);
  }

  return result;
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function renderCss(values: IntentToken[]): string {
  const lines = values.map((token) => `  --${token.cssName}: ${token.value};`);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

function renderScss(values: IntentToken[]): string {
  return values.map((token) => `$${token.cssName}: ${token.value};`).join('\n') + '\n';
}

function renderMjs(values: IntentToken[]): string {
  return (
    values
      .map((token) => `export const ${token.jsName} = ${JSON.stringify(token.value)};`)
      .join('\n') + '\n'
  );
}

function renderCjs(values: IntentToken[]): string {
  return (
    values.map((token) => `exports.${token.jsName} = ${JSON.stringify(token.value)};`).join('\n') +
    '\n'
  );
}

function renderDts(values: IntentToken[]): string {
  const lines = values.map((token) => `export declare const ${token.jsName}: string;`);
  return ['/* This file is auto-generated. Do not edit manually. */', '', ...lines, ''].join('\n');
}

type IntentBundle = Record<string, unknown>;

function renderJson(values: IntentToken[]): string {
  const obj: Record<string, string> = {};
  for (const token of values) {
    obj[token.jsName] = token.value;
  }
  return JSON.stringify(obj, null, 2) + '\n';
}

function renderFigma(values: IntentToken[]): string {
  const obj: Record<string, Record<string, unknown>> = {};
  for (const token of values) {
    obj[token.cssName] = {
      $value: token.value,
      $type: 'color',
      filePath: 'canonical/tokens.json',
    };
  }
  return JSON.stringify(obj, null, 2) + '\n';
}

function toCamelKey(value: string): string {
  const kebab = toKebab(value);
  return kebab.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function buildIntentsBundle(uiTokens: IntentToken[]): IntentBundle {
  const bundle: IntentBundle = {};

  for (const token of uiTokens) {
    const [, intentName, ...rest] = token.path;
    if (!intentName || rest.length === 0) continue;
    const intent = toPascalName(intentName);
    const entry = (bundle[intent] ??= {});
    const leaf = rest[0];

    if (KNOWN_CATEGORIES.includes(toKebab(leaf)) || toKebab(leaf) === 'text-emphasis') {
      (entry as Record<string, string>)[toCamelKey(leaf)] = token.value;
    } else if (toKebab(leaf).startsWith('border')) {
      const state = toCamelKey(leaf.replace(/^border[\s-]*/i, ''));
      const borders = (entry['border'] ??= {});
      (borders as Record<string, string>)[state] = token.value;
    } else {
      const texts = (entry['text'] ??= {});
      (texts as Record<string, string>)[toCamelKey(leaf)] = token.value;
    }
  }

  return bundle;
}

function renderJsValue(node: unknown, indent: string): string {
  if (typeof node === 'string') {
    return JSON.stringify(node);
  }
  const lines = Object.entries(node as Record<string, unknown>).map(
    ([key, val]) => `${indent}  ${key}: ${renderJsValue(val, indent + '  ')},`,
  );
  return `{\n${lines.join('\n')}\n${indent}}`;
}

export function renderBundleMjs(bundle: IntentBundle): string {
  const order = Object.keys(bundle)
    .map((k) => `  "${k}",`)
    .join('\n');
  return `export const CdrIntents = ${renderJsValue(bundle, '')};\n\nexport const CdrIntentOrder = [\n${order}\n];\n\nexport default CdrIntents;\n`;
}

function renderTsType(node: unknown, indent: string): string {
  if (typeof node === 'string') {
    return 'string';
  }
  const lines = Object.entries(node as Record<string, unknown>).map(
    ([key, val]) => `${indent}  readonly ${key}: ${renderTsType(val, indent + '  ')};`,
  );
  return `{\n${lines.join('\n')}\n${indent}}`;
}

export function renderBundleDts(bundle: IntentBundle): string {
  return [
    '/* This file is auto-generated. Do not edit manually. */',
    '',
    `export type CdrIntentsType = ${renderTsType(bundle, '')};`,
    '',
    'export type CdrIntentKey = keyof CdrIntentsType;',
    '',
    'export declare const CdrIntents: CdrIntentsType;',
    'export default CdrIntents;',
    '',
    `export declare const CdrIntentOrder: readonly CdrIntentKey[];`,
    '',
  ].join('\n');
}

function writePlatformFiles(themeRoot: string, category: string, values: IntentToken[]): void {
  const cssDir = path.join(themeRoot, 'css', 'intents');
  const scssDir = path.join(themeRoot, 'scss', 'intents');
  const jsDir = path.join(themeRoot, 'js', 'intents');
  const jsonDir = path.join(themeRoot, 'json', 'intents');
  const figmaDir = path.join(themeRoot, 'figma', 'intents');

  writeFile(path.join(cssDir, `cdr-${category}.css`), renderCss(values));
  writeFile(path.join(scssDir, `cdr-${category}.scss`), renderScss(values));
  writeFile(path.join(jsDir, `cdr-${category}.mjs`), renderMjs(values));
  writeFile(path.join(jsDir, `cdr-${category}.cjs`), renderCjs(values));
  writeFile(path.join(jsDir, `cdr-${category}.d.ts`), renderDts(values));
  writeFile(path.join(jsonDir, `cdr-${category}.json`), renderJson(values));
  writeFile(path.join(figmaDir, `cdr-${category}.json`), renderFigma(values));
}

function appendToFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, fs.readFileSync(filePath, 'utf8') + content);
}

function insertAfterFoundations(filePath: string, content: string): void {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');
  let lastFoundations = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('./foundations/')) {
      lastFoundations = i;
      break;
    }
  }

  if (lastFoundations === -1) {
    fs.writeFileSync(filePath, original + content);
    return;
  }

  lines.splice(lastFoundations + 1, 0, content);
  fs.writeFileSync(filePath, lines.join('\n'));
}

function updateJsAggregate(themeRoot: string, values: IntentToken[], categories: string[]): void {
  const jsDir = path.join(themeRoot, 'js');
  const cjsPath = path.join(jsDir, 'cdr-tokens.cjs');
  const mjsPath = path.join(jsDir, 'cdr-tokens.mjs');
  const dtsPath = path.join(jsDir, 'cdr-tokens.d.ts');

  const mjsLines =
    categories.map((cat) => `export * from './intents/cdr-${cat}.mjs';`).join('\n') + '\n';
  const dtsLines =
    categories.map((cat) => `export * from './intents/cdr-${cat}';`).join('\n') + '\n';

  if (fs.existsSync(mjsPath)) {
    appendToFile(mjsPath, mjsLines);
  }
  if (fs.existsSync(dtsPath)) {
    appendToFile(dtsPath, dtsLines);
  }

  if (fs.existsSync(cjsPath)) {
    const cjsProps =
      '\n' + values.map((t) => `  ${t.jsName}: ${JSON.stringify(t.value)},`).join('\n') + '\n';
    let cjs = fs.readFileSync(cjsPath, 'utf8');
    cjs = cjs.replace(/\n};\n?$/, `${cjsProps}};\n`);
    fs.writeFileSync(cjsPath, cjs);
  }
}

function updateTypesBarrels(themeRoot: string, _categories: string[]): void {
  const typesDir = path.join(themeRoot, 'types');
  const files = ['index.d.ts', 'index.mjs', 'tokens.d.ts', 'tokens.mjs'];
  for (const file of files) {
    const filePath = path.join(typesDir, file);
    if (!fs.existsSync(filePath)) continue;
    const isMjs = file.endsWith('.mjs');
    const lines = isMjs
      ? `export { CdrIntents, CdrIntentOrder } from './intents/cdr-intents.mjs';\n`
      : `export { CdrIntents, CdrIntentOrder } from './intents/cdr-intents';\nexport type { CdrIntentsType, CdrIntentKey } from './intents/cdr-intents';\n`;
    insertAfterFoundations(filePath, lines);
  }
}

function updateCssBarrels(themeRoot: string, categories: string[]): void {
  const cssPath = path.join(themeRoot, 'css', 'cdr-tokens.css');
  if (!fs.existsSync(cssPath)) return;
  const lines = categories.map((cat) => `@import "./intents/cdr-${cat}.css";`).join('\n') + '\n';
  insertAfterFoundations(cssPath, lines);
}

function updateScssBarrels(themeRoot: string, categories: string[]): void {
  const scssPath = path.join(themeRoot, 'scss', 'cdr-tokens.scss');
  if (!fs.existsSync(scssPath)) return;
  const lines = categories.map((cat) => `@forward "./intents/cdr-${cat}";`).join('\n') + '\n';
  insertAfterFoundations(scssPath, lines);
}

export function generateIntentOutputs(): void {
  const tokens = JSON.parse(fs.readFileSync(canonicalTokensPath, 'utf8')) as unknown;
  const uiTokens = collectUiTokens(tokens);

  if (uiTokens.length === 0) {
    console.log('[intents] No UI tokens found; skipping intent output generation.');
    return;
  }

  const byCategory: Record<string, IntentToken[]> = {};
  for (const token of uiTokens) {
    if (!byCategory[token.category]) {
      byCategory[token.category] = [];
    }
    byCategory[token.category].push(token);
  }

  const categories = Object.keys(byCategory).sort();

  for (const theme of THEMES) {
    const themeRoot = path.join(rootDir, 'dist', theme);
    const allValues: IntentToken[] = [];

    for (const category of categories) {
      const values = byCategory[category].sort((left, right) =>
        left.cssName.localeCompare(right.cssName),
      );
      writePlatformFiles(themeRoot, category, values);
      allValues.push(...values);
      console.log(`  ✓ dist/${theme}/.../intents/cdr-${category}.* (${values.length} tokens)`);
    }

    const bundle = buildIntentsBundle(uiTokens);
    const typesDir = path.join(themeRoot, 'types', 'intents');
    writeFile(path.join(typesDir, 'cdr-intents.mjs'), renderBundleMjs(bundle));
    writeFile(path.join(typesDir, 'cdr-intents.d.ts'), renderBundleDts(bundle));
    console.log(`  ✓ dist/${theme}/.../intents/cdr-intents.* (bundle)`);

    updateJsAggregate(themeRoot, allValues, categories);
    updateTypesBarrels(themeRoot, categories);
    updateCssBarrels(themeRoot, categories);
    updateScssBarrels(themeRoot, categories);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateIntentOutputs();
}

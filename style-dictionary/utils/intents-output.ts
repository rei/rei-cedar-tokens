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

type IntentToken = {
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

function getCategory(tokenPath: string[]): string {
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

function collectUiTokens(tokens: unknown): IntentToken[] {
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

function pascalCategory(category: string): string {
  return toPascalName(category);
}

function renderTypesMjs(values: IntentToken[], category: string): string {
  const pascal = pascalCategory(category);
  const objName = `CdrColor${pascal}`;
  const props = values
    .map((token) => `  ${token.jsName}: ${JSON.stringify(token.value)},`)
    .join('\n');
  return `export const ${objName} = {\n${props}\n};\n\nexport default ${objName};\n`;
}

function renderTypesDts(values: IntentToken[], category: string): string {
  const pascal = pascalCategory(category);
  const objName = `CdrColor${pascal}`;

  const props = values
    .map((token) => {
      const cssVar = `--${token.cssName}`;
      return `  /**\n   * @value ${token.value}\n   * @cssvar ${cssVar}\n   */\n  readonly ${token.jsName}: string;`;
    })
    .join('\n');

  return `export interface ${objName} {\n${props}\n}\n\nexport declare const ${objName}: ${objName};\nexport default ${objName};\n`;
}

function renderOrderMjs(values: IntentToken[], category: string): string {
  const pascal = pascalCategory(category);
  const keys = values.map((token) => token.cssName.replace('cdr-color-', ''));
  const objName = `CdrColor${pascal}Order`;
  return `export const ${objName} = [\n${keys.map((k) => `  "${k}",`).join('\n')}\n];\n`;
}

function renderOrderDts(values: IntentToken[], category: string): string {
  const pascal = pascalCategory(category);
  const keys = values.map((token) => token.cssName.replace('cdr-color-', ''));
  const objName = `CdrColor${pascal}Order`;
  return `export declare const ${objName}: readonly [\n${keys.map((k) => `  "${k}",`).join('\n')}\n];\nexport type ${objName}Key = (typeof ${objName})[number];\n`;
}

function renderNamesDts(values: IntentToken[], category: string): string {
  const pascal = pascalCategory(category);
  const names = values.map((token) => `  | "${token.jsName}"`).join('\n');
  return `export type CdrColor${pascal}TokenName =\n${names};\n`;
}

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

function writePlatformFiles(themeRoot: string, category: string, values: IntentToken[]): void {
  const cssDir = path.join(themeRoot, 'css', 'intents');
  const scssDir = path.join(themeRoot, 'scss', 'intents');
  const jsDir = path.join(themeRoot, 'js', 'intents');
  const typesDir = path.join(themeRoot, 'types', 'intents');
  const jsonDir = path.join(themeRoot, 'json', 'intents');
  const figmaDir = path.join(themeRoot, 'figma', 'intents');

  writeFile(path.join(cssDir, `cdr-${category}.css`), renderCss(values));
  writeFile(path.join(scssDir, `cdr-${category}.scss`), renderScss(values));
  writeFile(path.join(jsDir, `cdr-${category}.mjs`), renderMjs(values));
  writeFile(path.join(jsDir, `cdr-${category}.cjs`), renderCjs(values));
  writeFile(path.join(jsDir, `cdr-${category}.d.ts`), renderDts(values));
  writeFile(path.join(typesDir, `cdr-${category}.mjs`), renderTypesMjs(values, category));
  writeFile(path.join(typesDir, `cdr-${category}.d.ts`), renderTypesDts(values, category));
  writeFile(path.join(typesDir, `cdr-${category}.order.mjs`), renderOrderMjs(values, category));
  writeFile(path.join(typesDir, `cdr-${category}.order.d.ts`), renderOrderDts(values, category));
  writeFile(path.join(typesDir, `cdr-${category}.names.d.ts`), renderNamesDts(values, category));
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

function updateTypesBarrels(themeRoot: string, categories: string[]): void {
  const typesDir = path.join(themeRoot, 'types');
  const files = ['index.d.ts', 'index.mjs', 'tokens.d.ts', 'tokens.mjs'];
  for (const file of files) {
    const filePath = path.join(typesDir, file);
    if (!fs.existsSync(filePath)) continue;
    const isMjs = file.endsWith('.mjs');
    const lines =
      categories
        .map((cat) => {
          const pascal = pascalCategory(cat);
          const base = `CdrColor${pascal}`;
          if (isMjs) {
            return `export { ${base}Order } from './intents/cdr-${cat}.order.mjs';`;
          }
          return [
            `export { ${base}Order } from './intents/cdr-${cat}.order';`,
            `export type { ${base}OrderKey } from './intents/cdr-${cat}.order';`,
          ].join('\n');
        })
        .join('\n') + '\n';
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

    updateJsAggregate(themeRoot, allValues, categories);
    updateTypesBarrels(themeRoot, categories);
    updateCssBarrels(themeRoot, categories);
    updateScssBarrels(themeRoot, categories);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateIntentOutputs();
}

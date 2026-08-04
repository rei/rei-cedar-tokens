import fs from 'fs-extra';
import path from 'node:path';
import _ from 'lodash';
import { THEMES } from './constants';
import { getDirname } from './utils';

const __dirname = getDirname(import.meta.url);

type Token = Record<string, unknown> & {
  $value?: unknown;
  name?: string;
  docs?: { category?: string };
  category?: string;
  attributes?: { deprecated?: boolean };
};

type TokensByCategory = Record<string, Token[]>;

type CanonicalData = {
  global: TokensByCategory;
  web: TokensByCategory;
  ios: TokensByCategory;
};

function flattenTokens(obj: unknown): Token[] {
  const tokens: Token[] = [];

  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }

    const token = node as Token;
    if (token.$value !== undefined) {
      tokens.push(token);
      return;
    }

    for (const value of Object.values(token)) {
      walk(value);
    }
  }

  walk(obj);
  return tokens;
}

function groupByCategory(tokens: Token[]): TokensByCategory {
  return tokens.reduce((acc, token) => {
    const category = token.docs?.category ?? token.category ?? 'misc';
    if (!acc[category]) acc[category] = [];
    acc[category].push(token);
    return acc;
  }, {} as TokensByCategory);
}

function toKebab(name: string): string {
  return _.kebabCase(name);
}

export async function generateCanonical(): Promise<void> {
  const distRoot = path.join(__dirname, '../dist');

  for (const theme of THEMES) {
    const jsonDir = path.join(distRoot, theme, 'json');

    const [globalJson, webJson, iosJson] = await Promise.all([
      fs.readJson(path.join(jsonDir, 'global.json')) as Promise<unknown>,
      fs.readJson(path.join(jsonDir, 'web.json')) as Promise<unknown>,
      fs.readJson(path.join(jsonDir, 'ios.json')) as Promise<unknown>,
    ]);

    const globalTokens = flattenTokens(globalJson);
    const globalByCategory = groupByCategory(globalTokens);
    const globalNames = new Set(globalTokens.map((t) => t.name ?? ''));
    const globalKebabs = new Set(globalTokens.map((t) => toKebab(t.name ?? '')));

    const webTokens = flattenTokens(webJson).filter((token) => !globalNames.has(token.name ?? ''));
    const webByCategory = groupByCategory(webTokens);

    const iosTokens = flattenTokens(iosJson).filter(
      (token) => !globalKebabs.has(toKebab(token.name ?? '')),
    );
    const iosByCategory = groupByCategory(iosTokens);

    const data: CanonicalData = {
      global: globalByCategory,
      web: webByCategory,
      ios: iosByCategory,
    };

    await fs.writeFile(path.join(jsonDir, 'canonical.json'), JSON.stringify(data, null, 2));

    console.log(`✓ Generated ${theme}/json/canonical.json`);
  }
}

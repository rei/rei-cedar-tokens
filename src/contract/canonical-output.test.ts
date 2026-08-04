import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import _ from 'lodash';

type Token = Record<string, unknown> & {
  $value?: unknown;
  name?: string;
  $type?: string;
};

type TokensByCategory = Record<string, Token[]>;

type CanonicalData = {
  global: TokensByCategory;
  web: TokensByCategory;
  ios: TokensByCategory;
};

function readJson(relPath: string): unknown {
  const fullPath = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
}

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

function allTokens(data: TokensByCategory): Token[] {
  return Object.values(data).flat();
}

const THEMES = ['rei-dot-com', 'docsite'];

describe('canonical.json output', () => {
  for (const theme of THEMES) {
    it(`${theme}: canonical.json exists and has global, web, and ios platforms`, () => {
      const canonical = readJson(`dist/${theme}/json/canonical.json`) as CanonicalData;

      expect(canonical).toHaveProperty('global');
      expect(canonical).toHaveProperty('web');
      expect(canonical).toHaveProperty('ios');

      for (const platform of ['global', 'web', 'ios'] as const) {
        expect(typeof canonical[platform]).toBe('object');
        const categories = Object.values(canonical[platform]);
        expect(categories.length).toBeGreaterThan(0);

        for (const tokens of categories) {
          expect(Array.isArray(tokens)).toBe(true);
          for (const token of tokens) {
            expect(typeof token.name).toBe('string');
            expect(token.$value).toBeDefined();
          }
        }
      }
    });

    it(`${theme}: web tokens do not duplicate global token names`, () => {
      const canonical = readJson(`dist/${theme}/json/canonical.json`) as CanonicalData;
      const globalNames = new Set(allTokens(canonical.global).map((t) => t.name));

      for (const token of allTokens(canonical.web)) {
        expect(globalNames.has(token.name)).toBe(false);
      }
    });

    it(`${theme}: iOS tokens do not duplicate global names by kebab-case`, () => {
      const canonical = readJson(`dist/${theme}/json/canonical.json`) as CanonicalData;
      const globalKebabs = new Set(
        allTokens(canonical.global).map((t) => _.kebabCase(String(t.name ?? ''))),
      );

      for (const token of allTokens(canonical.ios)) {
        expect(globalKebabs.has(_.kebabCase(String(token.name ?? '')))).toBe(false);
      }
    });

    it(`${theme}: canonical web count matches web.json minus global duplicates`, () => {
      const canonical = readJson(`dist/${theme}/json/canonical.json`) as CanonicalData;
      const webJson = readJson(`dist/${theme}/json/web.json`) as unknown;
      const globalJson = readJson(`dist/${theme}/json/global.json`) as unknown;

      const globalNames = new Set(flattenTokens(globalJson).map((t) => t.name));
      const expectedWeb = flattenTokens(webJson).filter((t) => !globalNames.has(t.name));

      expect(allTokens(canonical.web).length).toBe(expectedWeb.length);
    });

    it(`${theme}: canonical ios count matches ios.json minus global duplicates`, () => {
      const canonical = readJson(`dist/${theme}/json/canonical.json`) as CanonicalData;
      const iosJson = readJson(`dist/${theme}/json/ios.json`) as unknown;
      const globalJson = readJson(`dist/${theme}/json/global.json`) as unknown;

      const globalKebabs = new Set(
        flattenTokens(globalJson).map((t) => _.kebabCase(String(t.name ?? ''))),
      );
      const expectedIos = flattenTokens(iosJson).filter(
        (t) => !globalKebabs.has(_.kebabCase(String(t.name ?? ''))),
      );

      expect(allTokens(canonical.ios).length).toBe(expectedIos.length);
    });
  }
});

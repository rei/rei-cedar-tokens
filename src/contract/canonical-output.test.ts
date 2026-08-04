import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type TokenLeaf = Record<string, unknown> & {
  $value?: unknown;
  $type?: string;
  $extensions?: unknown;
  docs?: unknown;
};

function isLeaf(node: unknown): node is TokenLeaf {
  return typeof node === 'object' && node !== null && '$value' in node;
}

function readJson(relPath: string): unknown {
  const fullPath = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
}

function walk(
  node: unknown,
  callback: (leaf: TokenLeaf, segments: string[]) => void,
  segments: string[] = [],
) {
  if (isLeaf(node)) {
    callback(node, segments);
    return;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      walk(node[i], callback, [...segments, String(i)]);
    }
    return;
  }

  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      walk(value, callback, [...segments, key]);
    }
  }
}

const THEMES = ['rei-dot-com', 'docsite'];

describe('canonical output', () => {
  for (const theme of THEMES) {
    it(`${theme}: canonical/${theme}/tokens.json is a nested DTCG tree with $value, docs, and $extensions`, () => {
      const canonical = readJson(`canonical/${theme}/tokens.json`) as Record<string, unknown>;

      expect(canonical).toBeTruthy();
      expect(typeof canonical).toBe('object');
      expect(Array.isArray(canonical)).toBe(false);

      let leafCount = 0;
      let withDocs = 0;
      let withType = 0;
      let withExtensions = 0;

      walk(canonical, (leaf) => {
        leafCount += 1;
        expect(leaf.$value).toBeDefined();

        if (leaf.$type) withType += 1;
        if (leaf.docs) withDocs += 1;
        if (leaf.$extensions) withExtensions += 1;
      });

      expect(leafCount).toBeGreaterThan(100);
      expect(withDocs).toBeGreaterThan(0);
      expect(withType).toBeGreaterThan(0);
      // Mobile text tokens still carry $extensions.cedar.docs in the canonical output.
      expect(withExtensions).toBeGreaterThan(0);
    });

    it(`${theme}: canonical includes source primitive and semantic sections`, () => {
      const canonical = readJson(`canonical/${theme}/tokens.json`) as Record<string, unknown>;

      expect(Object.keys(canonical).length).toBeGreaterThan(0);
      expect(canonical).toHaveProperty('options');
      expect(canonical).toHaveProperty('color');
      expect(canonical).toHaveProperty('space');
    });
  }
});

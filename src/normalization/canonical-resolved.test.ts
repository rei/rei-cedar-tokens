import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type JsonRecord = Record<string, unknown>;

const canonicalPath = path.resolve(process.cwd(), 'canonical/tokens.json');
const HEX_RE = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function getAtPath(root: JsonRecord, dotPath: string): JsonRecord | undefined {
  const node = dotPath
    .split('.')
    .reduce<unknown>((acc, seg) => (acc as JsonRecord | undefined)?.[seg], root);

  if (!node || typeof node !== 'object') return undefined;
  return node as JsonRecord;
}

function walkSemanticLeaves(node: JsonRecord, cb: (leaf: JsonRecord) => void) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in (value as JsonRecord)) {
      cb(value as JsonRecord);
      continue;
    }
    if (value && typeof value === 'object') {
      walkSemanticLeaves(value as JsonRecord, cb);
    }
  }
}

function walkColorSemanticLeaves(color: JsonRecord, cb: (leaf: JsonRecord) => void) {
  for (const [intent, tree] of Object.entries(color)) {
    if (intent === 'option' || intent === 'modes') continue;
    if (!tree || typeof tree !== 'object') continue;
    walkSemanticLeaves(tree as JsonRecord, cb);
  }
}

describe('canonical color alias hybrid model', () => {
  it('keeps alias refs and also emits cedar.resolved platform values', () => {
    const root = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonRecord;
    const color = root.color as JsonRecord;

    expect(color).toBeTruthy();

    let checked = 0;

    walkColorSemanticLeaves(color, (leaf) => {
      const value = leaf.$value;
      if (typeof value !== 'string' || !value.startsWith('{color.option.')) return;

      const cedar = (leaf.$extensions as JsonRecord | undefined)?.cedar as JsonRecord | undefined;
      expect(cedar).toBeTruthy();

      const resolved = cedar?.resolved as JsonRecord | undefined;
      expect(resolved).toBeTruthy();

      const web = resolved?.web as JsonRecord | undefined;
      const ios = resolved?.ios as JsonRecord | undefined;

      expect(typeof web?.light).toBe('string');
      expect(typeof web?.dark).toBe('string');
      expect(typeof ios?.light).toBe('string');
      expect(typeof ios?.dark).toBe('string');

      checked += 1;
    });

    expect(checked).toBeGreaterThan(0);
  });

  it('resolved values are valid hex colors for all platforms', () => {
    const root = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonRecord;
    const color = root.color as JsonRecord;
    let checked = 0;

    walkColorSemanticLeaves(color, (leaf) => {
      const cedar = (leaf.$extensions as JsonRecord | undefined)?.cedar as JsonRecord | undefined;
      const resolved = cedar?.resolved as JsonRecord | undefined;
      if (!resolved) return;

      for (const [platform, appearances] of Object.entries(resolved)) {
        if (!appearances || typeof appearances !== 'object') continue;
        for (const [appearance, hex] of Object.entries(appearances as JsonRecord)) {
          expect(hex, `resolved.${platform}.${appearance}`).toMatch(HEX_RE);
          checked++;
        }
      }
    });

    expect(checked).toBeGreaterThan(0);
  });

  it('resolved light value matches the referenced option token $value for web', () => {
    const root = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonRecord;
    const color = root.color as JsonRecord;
    let checked = 0;

    walkColorSemanticLeaves(color, (leaf) => {
      const cedar = (leaf.$extensions as JsonRecord | undefined)?.cedar as JsonRecord | undefined;
      if (!cedar) return;

      const webRefs = cedar.web as JsonRecord | undefined;
      const resolved = (cedar.resolved as JsonRecord | undefined)?.web as JsonRecord | undefined;
      if (!webRefs || !resolved) return;

      // The resolved light value should equal the $value of the option token it references
      const lightRef = webRefs.light;
      if (typeof lightRef !== 'string') return;
      const optionToken = getAtPath(root, lightRef);
      if (!optionToken) return;

      const optionValue = optionToken.$value;
      if (typeof optionValue === 'string') {
        expect(resolved.light, `resolved.web.light for ref "${lightRef}"`).toBe(optionValue);
        checked++;
      }
    });

    expect(checked).toBeGreaterThan(0);
  });

  it('platform refs point to paths that exist in color.option', () => {
    const root = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonRecord;
    const color = root.color as JsonRecord;
    let checked = 0;

    walkColorSemanticLeaves(color, (leaf) => {
      const cedar = (leaf.$extensions as JsonRecord | undefined)?.cedar as JsonRecord | undefined;
      if (!cedar) return;

      for (const platform of ['web', 'ios']) {
        const refs = cedar[platform] as JsonRecord | undefined;
        if (!refs) continue;
        for (const appearance of ['light', 'dark']) {
          const refPath = refs[appearance];
          if (typeof refPath !== 'string') continue;
          const target = getAtPath(root, refPath);
          expect(target, `${platform}.${appearance} ref "${refPath}" should resolve`).toBeDefined();
          checked++;
        }
      }
    });

    expect(checked).toBeGreaterThan(0);
  });
});

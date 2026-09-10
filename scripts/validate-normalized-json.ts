// validate-normalized-json.ts
// Validates that dist/normalized/current.json matches the expected Storybook token shape

import fs from 'node:fs';
import path from 'node:path';

type TokenLeaf = {
  $value: string;
  $type: string;
};

type JsonRecord = Record<string, unknown>;

const file = path.resolve('dist/normalized/current.json');

function isLeaf(node: unknown): node is TokenLeaf {
  return typeof node === 'object' && node !== null && '$value' in node && '$type' in node;
}

function checkColorModes(color: JsonRecord): void {
  const modes = color.modes;
  if (typeof modes !== 'object' || modes === null) {
    throw new Error('Missing color.modes');
  }

  for (const [mode, modeTokens] of Object.entries(modes as JsonRecord)) {
    if (typeof modeTokens !== 'object' || modeTokens === null) {
      throw new Error(`Invalid mode object at color.modes.${mode}`);
    }

    for (const category of ['surface', 'text', 'border'] as const) {
      const categoryTokens = (modeTokens as JsonRecord)[category];
      if (typeof categoryTokens !== 'object' || categoryTokens === null) {
        throw new Error(`Missing color.modes.${mode}.${category}`);
      }

      for (const [key, value] of Object.entries(categoryTokens as JsonRecord)) {
        if (!isLeaf(value)) {
          throw new Error(`color.modes.${mode}.${category}.${key} is not a leaf`);
        }
      }
    }
  }
}

function checkSpacing(spacing: JsonRecord): void {
  const scale = spacing.scale;
  if (typeof scale !== 'object' || scale === null) {
    throw new Error('Missing spacing.scale');
  }

  for (const [key, value] of Object.entries(scale as JsonRecord)) {
    if (!isLeaf(value)) {
      throw new Error(`spacing.scale.${key} is not a leaf`);
    }
  }

  for (const group of ['component', 'layout'] as const) {
    const groupTokens = spacing[group];
    if (typeof groupTokens !== 'object' || groupTokens === null) {
      throw new Error(`Missing spacing.${group}`);
    }

    for (const [key, value] of Object.entries(groupTokens as JsonRecord)) {
      if (!isLeaf(value)) {
        throw new Error(`spacing.${group}.${key} is not a leaf`);
      }
    }
  }
}

function main(): void {
  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as JsonRecord;

  if (typeof data.color !== 'object' || data.color === null) {
    throw new Error('Missing color root');
  }

  if (typeof data.spacing !== 'object' || data.spacing === null) {
    throw new Error('Missing spacing root');
  }

  checkColorModes(data.color as JsonRecord);
  checkSpacing(data.spacing as JsonRecord);

  console.log('dist/normalized/current.json is valid and matches expected shape.');
}

main();

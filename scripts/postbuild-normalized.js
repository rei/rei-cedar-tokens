// postbuild-normalized.js
// Copies canonical/tokens.json to dist/normalized/current.json and baseline.json for Storybook compatibility

import fs from 'node:fs';
import path from 'node:path';

const canonical = path.resolve('canonical/tokens.json');
const normalizedDir = path.resolve('dist/normalized');
const current = path.join(normalizedDir, 'current.json');
const baseline = path.join(normalizedDir, 'baseline.json');

if (!fs.existsSync(normalizedDir)) {
  fs.mkdirSync(normalizedDir, { recursive: true });
}

fs.copyFileSync(canonical, current);
fs.copyFileSync(canonical, baseline);

console.log('Copied canonical/tokens.json to dist/normalized/current.json and baseline.json');

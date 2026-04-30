import { dirname } from 'node:path';
import { globSync } from 'glob';
import { mkdirSync } from 'node:fs';
import fs from 'fs';

// Retrieve the output path from CLI arguments, or default to baseline.json
const OUTPUT_PATH = './data/baseline.json';

const tokens = new Set<string>();

function extractTokenPaths(obj: any, currentPath: string[]) {
  if (obj && typeof obj === 'object' && '$value' in obj) {
    // Join the path with dots (e.g., 'color.background.primary')
    tokens.add(currentPath.join('.'));
    return;
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      extractTokenPaths(obj[key], [...currentPath, key]);
    }
  }
}

function run() {
  console.log('********** Generating token baseline from current branch **********');

  // Ignore deprecation files for the baseline
  const files = globSync('tokens/global/*.json', { ignore: 'tokens/global/deprecated*.json' });

  files.forEach((file) => {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    extractTokenPaths(content, []);
  });

  // Write the Set to a JSON file
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(Array.from(tokens), null, 2));
  console.log(
    `********** Baseline generated with ${tokens.size} active tokens at: ${OUTPUT_PATH} **********`,
  );
}

run();

#!/usr/bin/env node

/**
 * Storybook story status checker for rei-cedar-tokens
 *
 * Reports existing token documentation stories.
 * Token stories are manually authored — this script checks coverage,
 * not generates content. Actual story scaffolding for component repos
 * is handled by the Cedar docs agent (Cascade).
 *
 * Exits 0 always (informational only).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const STORIES_DIR = path.join(ROOT, 'stories');
const REPO = 'rei-cedar-tokens';

function main() {
  console.log(`[generate-stories] Checking story coverage for ${REPO}...`);

  const existingStories = fs.existsSync(STORIES_DIR)
    ? fs
        .readdirSync(STORIES_DIR)
        .filter((f) => f.endsWith('.stories.ts') || f.endsWith('.stories.tsx'))
    : [];

  console.log(`[generate-stories] Existing stories: ${existingStories.length}`);
  if (existingStories.length > 0) {
    existingStories.forEach((s) => console.log(`  - ${s}`));
  }

  console.log('[generate-stories] Done. (Token stories are manually authored in this repo.)');
}

main();

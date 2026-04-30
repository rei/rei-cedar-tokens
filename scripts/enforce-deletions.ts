import fs from 'fs';
import { globSync } from 'glob';

const BASELINE_PATH = 'data/baseline.json';

if (!BASELINE_PATH || !fs.existsSync(BASELINE_PATH)) {
  console.error(`Baseline file not found at: ${BASELINE_PATH}`);
  console.error('Ensure you ran generate-baseline.ts first.');
  process.exit(1);
}

const baselineTokens = new Set<string>(JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8')));
const currentTokens = new Set<string>();
const documentedDeletions = new Set<string>();

// Extract tokens from current branch
function extractTokenPaths(obj: any, currentPath: string[]) {
  if (obj && typeof obj === 'object' && '$value' in obj) {
    currentTokens.add(currentPath.join('.'));
    return;
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      extractTokenPaths(obj[key], [...currentPath, key]);
    }
  }
}

// Deep search for any object containing an 'oldName' key
function extractDeprecations(obj: any) {
  if (obj && typeof obj === 'object') {
    if ('oldName' in obj && typeof obj.oldName === 'string') {
      // Add the documented old name to our ledger
      documentedDeletions.add(obj.oldName);
    }
    for (const key in obj) {
      extractDeprecations(obj[key]);
    }
  }
}

function run() {
  console.log('********** Comparing PR against main branch baseline **********');

  const files = globSync('tokens/global/*.json');

  files.forEach((file) => {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (file.includes('deprecated')) {
      extractDeprecations(content);
    } else {
      extractTokenPaths(content, []);
    }
  });

  const illegalDeletions: string[] = [];

  baselineTokens.forEach((token) => {
    // If a token was in the baseline, but is missing from the PR branch
    if (!currentTokens.has(token)) {
      // It MUST be documented in the deprecation files
      if (!documentedDeletions.has(token)) {
        illegalDeletions.push(token);
      }
    }
  });

  if (illegalDeletions.length > 0) {
    console.error(
      '\n[Rename Governance Failed]: The following tokens were renamed or deleted without a deprecation entry:',
    );
    illegalDeletions.forEach((token) => console.error(`   - ${token}`));
    console.error(
      '\nFix: Add these to a deprecated-<year>-<release>.json file with an oldName, newName, and migrationNote.',
    );
    process.exit(1);
  }

  console.log('********** No undocumented renames or deletions detected. **********');
}

run();

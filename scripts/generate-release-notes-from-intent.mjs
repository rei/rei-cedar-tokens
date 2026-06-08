#!/usr/bin/env node

/**
 * Standalone release notes generator that reads release-intent.md
 * and generates release notes with the new v2.0.0 structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REPO = 'rei-cedar-tokens';

async function main() {
  console.log(`[generate] Generating release notes for ${REPO}...`);

  // Read release intent
  const intentPath = path.join(ROOT, 'scripts', 'agent-config', 'release-intent.md');
  const intentContent = fs.readFileSync(intentPath, 'utf-8');

  // Parse intent sections
  const sections = parseReleaseIntent(intentContent);

  // Get package version
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const version = pkg.version;

  // Build release notes from intent content
  const humanNotes = generateReleaseNotesFromIntent(sections, version, REPO);

  // Write outputs
  const DIST = path.join(ROOT, 'dist');

  // Ensure dist directory exists
  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true });
  }

  // Write human draft
  fs.writeFileSync(path.join(DIST, 'release-notes.draft.md'), humanNotes);
  console.log(`[generate] Wrote release-notes.draft.md (${humanNotes.length} chars)`);

  console.log('[generate] Done. Review the generated files in dist/');
}

function parseReleaseIntent(content) {
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line
        .slice(3)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

function generateReleaseNotesFromIntent(sections, version, _repo) {
  const lines = [];

  // Header
  lines.push(`# Release notes – v${version}\n`);

  // Overview
  if (sections['what-this-release-is-about']) {
    lines.push('## Overview\n');
    lines.push(sections['what-this-release-is-about'] + '\n');
  }

  // Breaking changes (with accordion)
  if (sections['known-breaking-changes'] && sections['known-breaking-changes'] !== 'None.') {
    lines.push('<details>\n<summary>## Breaking changes</summary>\n');
    lines.push(sections['known-breaking-changes'] + '\n');
    lines.push('</details>\n');
  }

  // New features
  if (sections['what-consumers-will-care-about-most']) {
    lines.push('## New features\n');
    lines.push(sections['what-consumers-will-care-about-most'] + '\n');
  }

  // BOLO / Be Aware Of (with accordion)
  if (
    sections['bolo-things-consumers-should-watch-for'] &&
    sections['bolo-things-consumers-should-watch-for'] !== 'None.'
  ) {
    lines.push('<details>\n<summary>## Be Aware Of</summary>\n');
    lines.push(sections['bolo-things-consumers-should-watch-for'] + '\n');
    lines.push('</details>\n');
  }

  // Migration guide (with checkbox format and accordion)
  if (sections['known-breaking-changes'] && sections['known-breaking-changes'] !== 'None.') {
    lines.push('<details>\n<summary>## Migration guide</summary>\n');

    // Must update section
    lines.push('### Must update');
    lines.push(
      'Required breaking changes that must be addressed to continue using this version.\n',
    );
    lines.push('- [ ] Review breaking changes section above');
    lines.push('- [ ] Update import paths as specified in breaking changes');
    lines.push('- [ ] Update TypeScript type imports if affected');
    lines.push('');

    // Optional update section
    lines.push('### Optional update');
    lines.push('Recommended improvements to get the most out of this update.\n');
    lines.push('- [ ] Review new features for opportunities to enhance your implementation');
    lines.push('- [ ] Check for updated token values that may improve visual consistency');
    lines.push('- [ ] Run your test suite to confirm compatibility');
    lines.push('');

    // To get the most out of this update
    lines.push('### To get the most out of this update');
    lines.push('This release enables the following new capabilities:');
    if (sections['what-consumers-will-care-about-most']) {
      lines.push('- Review the new features section for specific capability improvements');
    }
    lines.push('');

    lines.push('</details>\n');
  }

  // Cross-repo notes
  if (sections['cross-repo-notes'] && sections['cross-repo-notes'] !== 'None known.') {
    lines.push('## Cross-repo notes\n');
    lines.push(sections['cross-repo-notes'] + '\n');
  }

  return lines.join('\n');
}

main().catch(console.error);

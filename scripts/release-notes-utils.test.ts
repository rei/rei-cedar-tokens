import { describe, expect, it } from 'vitest';
import { parseFrontMatter, selectReleaseNote } from './release-notes-utils';

describe('release notes utilities', () => {
  it('prefers file with default: true when present', () => {
    const selected = selectReleaseNote([
      {
        fileName: '2026-05-16-release.md',
        frontMatter: {},
        body: 'Older note',
      },
      {
        fileName: '2026-05-15-default.md',
        frontMatter: { default: true },
        body: 'Default note',
      },
      {
        fileName: '2026-05-18-release.md',
        frontMatter: {},
        body: 'Newest by date',
      },
    ]);

    expect(selected.fileName).toBe('2026-05-15-default.md');
    expect(selected.body).toBe('Default note');
  });

  it('falls back to newest timestamp in filename when no default exists', () => {
    const selected = selectReleaseNote([
      {
        fileName: '2026-04-18-release.md',
        frontMatter: {},
        body: 'April note',
      },
      {
        fileName: '2026-05-17-release.md',
        frontMatter: {},
        body: 'May note',
      },
      {
        fileName: '2026-05-18T131530-release.md',
        frontMatter: {},
        body: 'Newest note',
      },
    ]);

    expect(selected.fileName).toBe('2026-05-18T131530-release.md');
    expect(selected.body).toBe('Newest note');
  });

  it('parses front matter and strips it from markdown body', () => {
    const parsed = parseFrontMatter(
      `---\ndefault: true\nstatus: done\n---\n\n# Notes\n\nBody text`,
    );

    expect(parsed.frontMatter.default).toBe(true);
    expect(parsed.frontMatter.status).toBe('done');
    expect(parsed.body).toBe('# Notes\n\nBody text');
  });
});

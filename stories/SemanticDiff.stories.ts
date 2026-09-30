import type { Meta, StoryObj } from '@storybook/html-vite';

// Snapshots are produced by `pnpm tokens:snapshot <baseline|current>`.
// They live in .storybook/generated (gitignored) so they survive `pnpm build`.
import baseline from '../.storybook/generated/snapshots/baseline.json';
import current from '../.storybook/generated/snapshots/current.json';

const meta: Meta = {
  title: 'Cedar Tokens/Semantic Diff',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

type TokenNode = Record<string, unknown>;
type DiffRow = {
  path: string;
  oldValue: string;
  newValue: string;
  type: 'changed' | 'added' | 'removed';
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function flatten(node: unknown, prefix: string, out: Record<string, string>) {
  if (node === null || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    node.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return;
  }

  const record = node as TokenNode;

  if ('$value' in record) {
    out[prefix] = formatValue(record.$value);
    return;
  }

  for (const [key, value] of Object.entries(record)) {
    const path = prefix ? `${prefix}.${key}` : key;
    flatten(value, path, out);
  }
}

function computeDiff(b: unknown, c: unknown): DiffRow[] {
  const base: Record<string, string> = {};
  const curr: Record<string, string> = {};
  flatten(b, '', base);
  flatten(c, '', curr);

  const rows: DiffRow[] = [];
  const allPaths = new Set([...Object.keys(base), ...Object.keys(curr)]);

  for (const p of allPaths) {
    if (p in base && !(p in curr)) {
      rows.push({ path: p, oldValue: base[p], newValue: '', type: 'removed' });
    } else if (p in curr && !(p in base)) {
      rows.push({ path: p, oldValue: '', newValue: curr[p], type: 'added' });
    } else if (base[p] !== curr[p]) {
      rows.push({ path: p, oldValue: base[p], newValue: curr[p], type: 'changed' });
    }
  }

  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

const diff = computeDiff(baseline, current);
const changed = diff.filter((r) => r.type === 'changed');
const added = diff.filter((r) => r.type === 'added');
const removed = diff.filter((r) => r.type === 'removed');

const styles = `
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    .diff-page {
      padding: 24px;
      font-family: Graphik, 'Graphik fallback', sans-serif;
      color: var(--cedar-warm-900, #1a1a1a);
      background: var(--cedar-warm-50, #f9f9f9);
      min-height: 100vh;
    }
    .diff-header {
      margin-bottom: 20px;
    }
    .diff-title {
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 8px;
    }
    .diff-summary {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: var(--cedar-warm-700, #4a4a4a);
    }
    .diff-count { font-weight: 600; }
    .diff-count--changed { color: #b27b00; }
    .diff-count--added { color: #0f5d33; }
    .diff-count--removed { color: #b52b2b; }
    .diff-table-wrap { overflow-x: auto; }
    .diff-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      background: #fff;
    }
    .diff-table th, .diff-table td {
      padding: 8px 10px;
      text-align: left;
      border-bottom: 1px solid var(--cedar-warm-100, #e6e6e6);
      vertical-align: top;
    }
    .diff-table th {
      font-weight: 600;
      color: var(--cedar-warm-600, #6a6a6a);
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.05em;
      background: #fafafa;
    }
    .diff-path {
      font-family: Pressura, monospace;
      white-space: nowrap;
    }
    .diff-value {
      font-family: Pressura, monospace;
      word-break: break-all;
      max-width: 300px;
    }
    .diff-type {
      font-weight: 600;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .diff-type--changed { color: #b27b00; }
    .diff-type--added { color: #0f5d33; }
    .diff-type--removed { color: #b52b2b; }
    .diff-empty {
      padding: 40px;
      text-align: center;
      color: var(--cedar-warm-600, #6a6a6a);
      font-size: 14px;
    }
  </style>
`;

export const LiveDiff: Story = {
  name: 'Live Diff',
  render: () => {
    const summary = `
      <div class="diff-header">
        <h1 class="diff-title">Semantic token diff</h1>
        <div class="diff-summary">
          <span class="diff-count diff-count--changed">${changed.length} changed</span>
          <span class="diff-count diff-count--added">${added.length} added</span>
          <span class="diff-count diff-count--removed">${removed.length} removed</span>
        </div>
      </div>
    `;

    if (diff.length === 0) {
      return `${styles}<div class="diff-page">${summary}<div class="diff-empty">No changes between baseline and current snapshots.</div></div>`;
    }

    const rows = diff
      .map(
        (row) => `
        <tr>
          <td class="diff-path">${row.path}</td>
          <td class="diff-type diff-type--${row.type}">${row.type}</td>
          <td class="diff-value">${row.oldValue}</td>
          <td class="diff-value">${row.newValue}</td>
        </tr>
      `,
      )
      .join('');

    const table = `
      <div class="diff-table-wrap">
        <table class="diff-table">
          <thead>
            <tr>
              <th>Token path</th>
              <th>Change</th>
              <th>Baseline</th>
              <th>Current</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    return `${styles}<div class="diff-page">${summary}${table}</div>`;
  },
};

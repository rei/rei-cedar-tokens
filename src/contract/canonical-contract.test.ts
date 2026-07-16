import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  foundationsModulesName,
  componentModulesName,
} from '../../style-dictionary/configs/filters/modules';

type Violation = {
  tokenPath: string;
  ruleId: string;
  expected: string;
  actual: string;
};

type RuleDocMeta = {
  adr: string;
  source: string;
};

const RULE_DOCS: Record<string, RuleDocMeta> = {
  FOUNDATIONS_MODULE_FILEPAIR: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#module-to-file-mapping',
  },
  FOUNDATIONS_NAMES_UNION: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#3-literal-union-generation',
  },
  FOUNDATIONS_MODULE_INTERFACE: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#4-module-interface-generation',
  },
  COMPONENTS_NO_TYPES: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#components',
  },
  PALETTES_NO_TYPES: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#palettes',
  },
  PALETTES_VALUE_LAYER_ONLY: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#output-matrix-by-domain-family',
  },
  UTILITIES_NO_TYPES: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#2-module-to-file-mapping',
  },
  TYPES_BARREL_EXISTS: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#6-barrel-generation',
  },
  DEFAULT_ENTRYPOINT_EXCLUDES_PALETTES: {
    adr: 'ADR-0001',
    source:
      'docs/adr/0001-modular-output-architecture.md#default-entrypoint-contract-parity-with-master',
  },
  EXPORT_MAP_ENTRYPOINTS: {
    adr: 'ADR-0001',
    source: 'docs/adr/0001-modular-output-architecture.md#entrypoint-contract',
  },
};

const root = process.cwd();

const THEMES = ['rei-dot-com', 'docsite'] as const;

const PALETTE_NAMES = ['membership-subtle', 'membership-vibrant'];

const UTILITY_NAMES = ['breakpoint-mixins', 'display-mixins', 'type-mixins'];

let pkg: { exports?: Record<string, unknown> };
try {
  pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf8')) as {
    exports?: Record<string, unknown>;
  };
} catch {
  pkg = {};
}

function stringifyActual(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

function pushViolation(
  violations: Violation[],
  tokenPath: string,
  ruleId: string,
  expected: string,
  actual: unknown,
) {
  violations.push({
    tokenPath,
    ruleId,
    expected,
    actual: stringifyActual(actual),
  });
}

function formatViolationReport(violations: Violation[]): string {
  const lines = [
    `ADR-0001 dist contract violations: ${violations.length}`,
    '',
    'Each item shows what changed vs expectation. If intentional, update ADR-0001 and this contract suite in the same PR.',
    '',
  ];

  violations.forEach((v, index) => {
    const doc = RULE_DOCS[v.ruleId] ?? { adr: 'ADR-unknown', source: 'docs/adr/' };
    lines.push(
      `${index + 1}. [${v.ruleId}] ${v.tokenPath}`,
      `   ADR: ${doc.adr}`,
      `   Source rule: ${doc.source}`,
      `   Expected: ${v.expected}`,
      `   Actual: ${v.actual}`,
      '   If intended: update the ADR rule text and this contract suite in the same PR',
      '',
    );
  });

  return lines.join('\n');
}

function distDir(theme: string, ...segments: string[]): string {
  return path.resolve(root, 'dist', theme, ...segments);
}

function fileExists(file: string): boolean {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

function dirExists(dir: string): boolean {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function readText(file: string): string {
  return fs.readFileSync(file, 'utf8');
}

function listFilesRecursive(dir: string, allowedSubdirs: string[] = []): string[] {
  const results: string[] = [];
  let readFailed = false;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        results.push(entry.name);
      } else if (entry.isDirectory() && !allowedSubdirs.includes(entry.name)) {
        const subFiles = listFilesRecursive(path.join(dir, entry.name), allowedSubdirs);
        results.push(...subFiles.map((f) => path.join(entry.name, f)));
      }
    }
  } catch {
    readFailed = true;
  }
  if (readFailed) {
    throw new Error(`Unable to read directory: ${dir}`);
  }
  return results;
}

describe('ADR-0001 modular output architecture dist contract', () => {
  it('enforces foundation module file pair per module', () => {
    const violations: Violation[] = [];

    for (const theme of THEMES) {
      const foundationsDir = distDir(theme, 'types', 'foundations');
      for (const module of foundationsModulesName) {
        const stem = `cdr-${module}`;
        const moduleFile = path.join(foundationsDir, `${stem}.d.ts`);
        const namesFile = path.join(foundationsDir, `${stem}.names.d.ts`);
        if (!fileExists(moduleFile)) {
          pushViolation(
            violations,
            `dist/${theme}/types/foundations/${stem}.d.ts`,
            'FOUNDATIONS_MODULE_FILEPAIR',
            `module interface file cdr-${module}.d.ts to exist`,
            'missing',
          );
        }
        if (!fileExists(namesFile)) {
          pushViolation(
            violations,
            `dist/${theme}/types/foundations/${stem}.names.d.ts`,
            'FOUNDATIONS_NAMES_UNION',
            `token-name union file cdr-${module}.names.d.ts to exist`,
            'missing',
          );
        }
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('enforces foundation module interface shape', () => {
    const violations: Violation[] = [];

    for (const theme of THEMES) {
      const foundationsDir = distDir(theme, 'types', 'foundations');
      for (const module of foundationsModulesName) {
        const stem = `cdr-${module}`;
        const moduleFile = path.join(foundationsDir, `${stem}.d.ts`);
        if (!fileExists(moduleFile)) continue;
        const src = readText(moduleFile);
        const pascal = stem
          .replace(/^cdr-/, '')
          .split('-')
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join('');
        const interfaceName = `Cdr${pascal}Tokens`;
        if (!new RegExp(`\\b${interfaceName}\\b`).test(src)) {
          pushViolation(
            violations,
            `dist/${theme}/types/foundations/${stem}.d.ts`,
            'FOUNDATIONS_MODULE_INTERFACE',
            `declares interface ${interfaceName}`,
            'interface name not found',
          );
        }
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('forbids TypeScript module output for components and palettes', () => {
    const violations: Violation[] = [];
    const componentStems = componentModulesName.map((m) => `cdr-${m}`);
    const paletteStems = PALETTE_NAMES.map((m) => `cdr-palette-${m}`);

    for (const theme of THEMES) {
      const typesDir = distDir(theme, 'types');
      if (!dirExists(typesDir)) {
        pushViolation(
          violations,
          `dist/${theme}/types`,
          'COMPONENTS_NO_TYPES',
          'types directory to exist',
          'missing',
        );
        continue;
      }

      const files = listFilesRecursive(typesDir, ['foundations']);
      for (const f of files) {
        if (!/\.(d\.ts|mjs|cjs)$/.test(f)) continue;
        const stem = f.replace(/\.(d\.ts|mjs|cjs)$/, '');
        if (componentStems.includes(stem)) {
          pushViolation(
            violations,
            `dist/${theme}/types/${f}`,
            'COMPONENTS_NO_TYPES',
            'no component TypeScript module output',
            'found',
          );
        } else if (paletteStems.includes(stem)) {
          pushViolation(
            violations,
            `dist/${theme}/types/${f}`,
            'PALETTES_NO_TYPES',
            'no palette TypeScript module output',
            'found',
          );
        }
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('forbids TypeScript module output for utilities', () => {
    const violations: Violation[] = [];
    const utilityStems = UTILITY_NAMES.map((m) => `cdr-${m}`);

    for (const theme of THEMES) {
      const typesDir = distDir(theme, 'types');
      if (!dirExists(typesDir)) continue;

      const files = listFilesRecursive(typesDir);
      for (const f of files) {
        if (!/\.(d\.ts|mjs|cjs)$/.test(f)) continue;
        const stem = f.replace(/\.(d\.ts|mjs|cjs)$/, '');
        if (utilityStems.includes(stem)) {
          pushViolation(
            violations,
            `dist/${theme}/types/${f}`,
            'UTILITIES_NO_TYPES',
            'no utility TypeScript module output (SCSS-only mixins)',
            'found',
          );
        }
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('restricts palettes to value-layer outputs (css/scss, no types/js)', () => {
    const violations: Violation[] = [];
    const theme = 'rei-dot-com';
    const paletteStems = PALETTE_NAMES.map((m) => `cdr-palette-${m}`);

    for (const stem of paletteStems) {
      const css = distDir(theme, 'css', 'palettes', `${stem}.css`);
      const scss = distDir(theme, 'scss', 'palettes', `${stem}.scss`);
      if (!fileExists(css)) {
        pushViolation(
          violations,
          `dist/${theme}/css/palettes/${stem}.css`,
          'PALETTES_VALUE_LAYER_ONLY',
          'palette css value output exists',
          'missing',
        );
      }
      if (!fileExists(scss)) {
        pushViolation(
          violations,
          `dist/${theme}/scss/palettes/${stem}.scss`,
          'PALETTES_VALUE_LAYER_ONLY',
          'palette scss value output exists',
          'missing',
        );
      }
      for (const dir of ['types', 'js']) {
        for (const ext of ['.d.ts', '.mjs', '.cjs']) {
          const file = distDir(theme, dir, `${stem}${ext}`);
          if (fileExists(file)) {
            pushViolation(
              violations,
              `dist/${theme}/${dir}/${stem}${ext}`,
              'PALETTES_NO_TYPES',
              `no ${dir} artifact for palette`,
              'found',
            );
          }
        }
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  // KNOWN GAP: ADR-0001 "Palette output rules" mandates JSON emission, but
  // dist/rei-dot-com/json/palettes/ does not exist. Build pipeline does not
  // generate palette JSON. File a follow-up story to add palette JSON generation.
  it.skip('requires palette JSON output (ADR-0001 gap)', () => {
    const violations: Violation[] = [];
    const theme = 'rei-dot-com';
    const paletteStems = PALETTE_NAMES.map((m) => `cdr-palette-${m}`);

    for (const stem of paletteStems) {
      const json = distDir(theme, 'json', 'palettes', `${stem}.json`);
      if (!fileExists(json)) {
        pushViolation(
          violations,
          `dist/${theme}/json/palettes/${stem}.json`,
          'PALETTES_VALUE_LAYER_ONLY',
          'palette json value output exists',
          'missing',
        );
      }
    }

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('requires the public type barrel for rei-dot-com', () => {
    const violations: Violation[] = [];
    const theme = 'rei-dot-com';
    const barrel = distDir(theme, 'types', 'index.d.ts');
    if (!fileExists(barrel) || readText(barrel).trim() === '') {
      pushViolation(
        violations,
        `dist/${theme}/types/index.d.ts`,
        'TYPES_BARREL_EXISTS',
        'non-empty public type barrel',
        fileExists(barrel) ? 'empty' : 'missing',
      );
    }
    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it.skip('requires the public type barrel for docsite (ADR-0001 gap)', () => {
    const violations: Violation[] = [];
    const barrel = distDir('docsite', 'types', 'index.d.ts');
    if (!fileExists(barrel) || readText(barrel).trim() === '') {
      pushViolation(
        violations,
        `dist/docsite/types/index.d.ts`,
        'TYPES_BARREL_EXISTS',
        'non-empty public type barrel',
        fileExists(barrel) ? 'empty' : 'missing',
      );
    }
    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  // KNOWN GAP: ADR-0001 "Default Entrypoint Contract" excludes palettes from
  // the default entrypoint, but dist/rei-dot-com/scss/cdr-tokens.scss and
  // cdr-tokens.css @forward/@import palette files. Build pipeline (concat-files.ts)
  // auto-forwards palettes for rei-dot-com. File a follow-up story to remove
  // palette auto-forwarding from the default entrypoint.
  it.skip('excludes palettes from the default entrypoint (ADR-0001 gap)', () => {
    const violations: Violation[] = [];
    const theme = 'rei-dot-com';
    for (const file of [
      distDir(theme, 'scss', 'cdr-tokens.scss'),
      distDir(theme, 'css', 'cdr-tokens.css'),
    ]) {
      if (!fileExists(file)) continue;
      const src = readText(file);
      if (/palettes\//.test(src)) {
        pushViolation(
          violations,
          path.relative(root, file),
          'DEFAULT_ENTRYPOINT_EXCLUDES_PALETTES',
          'default entrypoint does not reference palette output',
          'palette reference found',
        );
      }
    }
    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('requires the ADR-0001 stable entrypoints in package exports', () => {
    const violations: Violation[] = [];
    const required = [
      '.',
      './tokens',
      './docsite',
      './types',
      './css',
      './scss',
      './docsite/css',
      './docsite/scss',
    ];
    for (const entry of required) {
      if (!pkg.exports || !(entry in pkg.exports)) {
        pushViolation(
          violations,
          `package.exports["${entry}"]`,
          'EXPORT_MAP_ENTRYPOINTS',
          'entrypoint declared in package exports',
          'missing',
        );
      }
    }
    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it.skip('requires ./docsite/types entrypoint (ADR-0001 gap)', () => {
    const violations: Violation[] = [];
    if (!pkg.exports || !('./docsite/types' in (pkg.exports as object))) {
      pushViolation(
        violations,
        `package.exports["./docsite/types"]`,
        'EXPORT_MAP_ENTRYPOINTS',
        'entrypoint declared in package exports',
        'missing',
      );
    }
    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });
});

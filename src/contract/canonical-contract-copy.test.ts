import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type JsonObject = Record<string, unknown>;
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
  ROOT_COLOR_OBJECT: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#canonical-json-structure',
  },
  FORBID_COLOR_PRIMITIVES: {
    adr: 'ADR-0001/ADR-0002',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#canonical-json-structure',
  },
  MISSING_COLOR_OPTION: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#canonical-json-structure',
  },
  MISSING_COLOR_MODES: {
    adr: 'ADR-0001/ADR-0002',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#canonical-json-structure',
  },
  OPTION_TYPE_COLOR: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#validation-requirements',
  },
  OPTION_VALUE_HEX: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#validation-requirements',
  },
  NO_TOP_LEVEL_RESOLVED: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#metadata-rules',
  },
  APPEARANCE_HEX: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#option-token-platform-data',
  },
  PLATFORM_OVERRIDES_OBJECT: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#option-token-platform-data',
  },
  PLATFORM_OVERRIDE_HEX: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#option-token-platform-data',
  },
  ALIAS_TYPE_COLOR: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#validation-requirements',
  },
  ALIAS_REFERENCE_FORMAT: {
    adr: 'ADR-0001/ADR-0002',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#alias-rules',
  },
  ALIAS_CEDAR_REQUIRED: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#alias-token-platform-references',
  },
  ALIAS_PLATFORM_REQUIRED: {
    adr: 'ADR-0001/ADR-0005',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#alias-token-platform-references',
  },
  ALIAS_PLATFORM_PATH_PLAIN: {
    adr: 'ADR-0005',
    source:
      'architecture/ADR/adr-0005-transform-layer-and-platform-outputs.md#sd-v5-pipeline-constraints-normative',
  },
  RESOLVED_PLATFORM_OBJECT: {
    adr: 'ADR-0012',
    source: 'architecture/ADR/adr-0012-hybrid-alias-resolution.md#decision',
  },
  RESOLVED_HEX: {
    adr: 'ADR-0012',
    source: 'architecture/ADR/adr-0012-hybrid-alias-resolution.md#decision',
  },
  SPACING_ROOT_OBJECT: {
    adr: 'ADR-0001',
    source: 'architecture/ADR/adr-0001-token-canonical-model.md#canonical-json-structure',
  },
  SPACING_SCALE_TYPE: {
    adr: 'ADR-0008',
    source: 'architecture/ADR/adr-0008-responsive-adaptive-tokens.md#fluid-spacing-tokens',
  },
  SPACING_STATIC_TYPE: {
    adr: 'ADR-0008',
    source: 'architecture/ADR/adr-0008-responsive-adaptive-tokens.md#fluid-spacing-tokens',
  },
  FLUID_SPACING_STRUCTURE: {
    adr: 'ADR-0008',
    source: 'architecture/ADR/adr-0008-responsive-adaptive-tokens.md#canonical-representation',
  },
  COLOR_FAMILY_IN_EXTENSIONS: {
    adr: 'ADR-0005',
    source:
      'architecture/ADR/adr-0005-transform-layer-and-platform-outputs.md#oklch-color-conversion',
  },
};

const canonicalPath = path.resolve(process.cwd(), 'canonical/tokens.json');

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

function isColorOptionAlias(value: unknown): value is string {
  return typeof value === 'string' && /^\{color\.option\.[^}]+\}$/.test(value);
}

function isPlainPathString(value: unknown): value is string {
  return typeof value === 'string' && !value.includes('{') && !value.includes('}');
}

function isDimension(value: unknown): value is string {
  return typeof value === 'string' && /^\d+(\.\d+)?(px|rem|em|vh|vw|%)$/.test(value);
}

function isFluid(value: unknown): value is string {
  return typeof value === 'string' && value.includes('clamp(');
}

function walkTokenLeaves(
  node: unknown,
  pathParts: string[],
  visit: (leaf: JsonObject, path: string[]) => void,
) {
  if (!isObject(node)) return;

  if ('$value' in node && '$type' in node) {
    visit(node, pathParts);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    walkTokenLeaves(value, [...pathParts, key], visit);
  }
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
    `Canonical contract violations: ${violations.length}`,
    '',
    'Each item shows what changed vs expectation. If intentional, update the referenced ADR(s) and this contract suite in the same PR.',
    '',
  ];

  violations.forEach((v, index) => {
    const doc = RULE_DOCS[v.ruleId] ?? {
      adr: 'ADR-unknown',
      source: 'architecture/README.md',
    };

    lines.push(
      `${index + 1}. [${v.ruleId}] ${v.tokenPath}`,
      `   ADR: ${doc.adr}`,
      `   Source rule: ${doc.source}`,
      `   Expected: ${v.expected}`,
      `   Actual: ${v.actual}`,
      '   If intended: update ADR rule text, file dictionary, and all cross-referenced docs/tests in the same PR',
      '',
    );
  });

  return lines.join('\n');
}

describe('canonical contract invariants', () => {
  it('matches ADR-0001/0002 canonical structure and color token rules', () => {
    const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonObject;
    const violations: Violation[] = [];

    if (!isObject(canonical.color)) {
      pushViolation(
        violations,
        'color',
        'ROOT_COLOR_OBJECT',
        'canonical root contains a color object',
        canonical.color,
      );
    }

    const color = (canonical.color as JsonObject | undefined) ?? {};

    if ('primitives' in color) {
      pushViolation(
        violations,
        'color.primitives',
        'FORBID_COLOR_PRIMITIVES',
        'color.primitives is absent in canonical output',
        color.primitives,
      );
    }

    if (!isObject(color.option)) {
      pushViolation(
        violations,
        'color.option',
        'MISSING_COLOR_OPTION',
        'color.option exists as object',
        color.option,
      );
    }

    // INTERSTITIAL (parked pending ADR-0016 D3): the Figma color export has
    // migrated from palette-modes (`color.modes.{default,sale}`) to a semantic
    // intents-x-states model (`semantics.color.<state>.json` -> `color.<intent>`).
    // The canonical representation of interaction state is NOT finalized — it
    // depends on ADR-0016 open decision D3 (state-transform set), so `color.modes`
    // is temporarily absent by design. Do NOT build normalize state-handling to
    // this shape yet. Re-enable this assertion once D3 is ratified and the
    // canonical state structure is defined.
    // See: architecture/ADR/adr-0016-semantic-color-and-state-architecture.md
    //
    // if (!isObject(color.modes)) {
    //   pushViolation(
    //     violations,
    //     "color.modes",
    //     "MISSING_COLOR_MODES",
    //     "color.modes exists as object",
    //     color.modes,
    //   );
    // }

    // Guard today's real shape: semantic intents live directly under `color`.
    const SEMANTIC_INTENTS = [
      'surface',
      'action',
      'selection',
      'navigation',
      'feedback',
      'text',
      'icon',
      'overlay',
    ];
    const hasAnySemanticIntent = SEMANTIC_INTENTS.some((intent) => isObject(color[intent]));
    if (!hasAnySemanticIntent) {
      pushViolation(
        violations,
        'color.<intent>',
        'MISSING_COLOR_OPTION',
        'at least one semantic intent (surface/action/...) exists under color',
        Object.keys(color),
      );
    }

    walkTokenLeaves(color.option, ['color', 'option'], (leaf, pathParts) => {
      const tokenPath = pathParts.join('.');

      if (leaf.$type !== 'color') {
        pushViolation(violations, tokenPath, 'OPTION_TYPE_COLOR', '$type is "color"', leaf.$type);
      }

      if (!isHexColor(leaf.$value)) {
        pushViolation(
          violations,
          tokenPath,
          'OPTION_VALUE_HEX',
          '$value is hex color (#RRGGBB or #RRGGBBAA)',
          leaf.$value,
        );
      }

      if ('$resolved' in leaf) {
        pushViolation(
          violations,
          tokenPath,
          'NO_TOP_LEVEL_RESOLVED',
          'no top-level $resolved field',
          leaf.$resolved,
        );
      }

      const cedar = (leaf.$extensions as JsonObject | undefined)?.cedar;
      if (!isObject(cedar)) return;

      const appearances = cedar.appearances;
      if (isObject(appearances)) {
        for (const [appearance, value] of Object.entries(appearances)) {
          if (!isHexColor(value)) {
            pushViolation(
              violations,
              `${tokenPath}.$extensions.cedar.appearances.${appearance}`,
              'APPEARANCE_HEX',
              'appearance override is hex color',
              value,
            );
          }
        }
      }

      const platformOverrides = cedar.platformOverrides;
      if (isObject(platformOverrides)) {
        for (const [platform, overrides] of Object.entries(platformOverrides)) {
          if (!isObject(overrides)) {
            pushViolation(
              violations,
              `${tokenPath}.$extensions.cedar.platformOverrides.${platform}`,
              'PLATFORM_OVERRIDES_OBJECT',
              'platformOverrides.<platform> is object',
              overrides,
            );
          }

          if (!isObject(overrides)) continue;
          for (const [appearance, value] of Object.entries(overrides)) {
            if (!isHexColor(value)) {
              pushViolation(
                violations,
                `${tokenPath}.$extensions.cedar.platformOverrides.${platform}.${appearance}`,
                'PLATFORM_OVERRIDE_HEX',
                'platform override is hex color',
                value,
              );
            }
          }
        }
      }
    });

    walkTokenLeaves(color.modes, ['color', 'modes'], (leaf, pathParts) => {
      const tokenPath = pathParts.join('.');

      if (leaf.$type !== 'color') {
        pushViolation(violations, tokenPath, 'ALIAS_TYPE_COLOR', '$type is "color"', leaf.$type);
      }

      if (!isColorOptionAlias(leaf.$value)) {
        pushViolation(
          violations,
          tokenPath,
          'ALIAS_REFERENCE_FORMAT',
          '$value references {color.option.*}',
          leaf.$value,
        );
      }

      const cedar = (leaf.$extensions as JsonObject | undefined)?.cedar;
      if (!isObject(cedar)) {
        pushViolation(
          violations,
          `${tokenPath}.$extensions.cedar`,
          'ALIAS_CEDAR_REQUIRED',
          '$extensions.cedar exists',
          cedar,
        );
      }
      if (!isObject(cedar)) return;

      for (const platform of ['ios', 'web']) {
        const platformValue = cedar[platform];
        if (!isObject(platformValue)) {
          pushViolation(
            violations,
            `${tokenPath}.$extensions.cedar.${platform}`,
            'ALIAS_PLATFORM_REQUIRED',
            `${platform} object with light and dark keys`,
            platformValue,
          );
        }

        if (!isObject(platformValue)) continue;
        for (const appearance of ['light', 'dark']) {
          const pathValue = platformValue[appearance];
          if (!isPlainPathString(pathValue)) {
            pushViolation(
              violations,
              `${tokenPath}.$extensions.cedar.${platform}.${appearance}`,
              'ALIAS_PLATFORM_PATH_PLAIN',
              'plain dot-path string without brace syntax',
              pathValue,
            );
          }
        }
      }

      const resolved = cedar.resolved;
      if (isObject(resolved)) {
        for (const [platform, appearances] of Object.entries(resolved)) {
          if (!isObject(appearances)) {
            pushViolation(
              violations,
              `${tokenPath}.$extensions.cedar.resolved.${platform}`,
              'RESOLVED_PLATFORM_OBJECT',
              'resolved.<platform> is object',
              appearances,
            );
          }
          if (!isObject(appearances)) continue;

          for (const [appearance, value] of Object.entries(appearances)) {
            if (!isHexColor(value)) {
              pushViolation(
                violations,
                `${tokenPath}.$extensions.cedar.resolved.${platform}.${appearance}`,
                'RESOLVED_HEX',
                'resolved value is hex color',
                value,
              );
            }
          }
        }
      }
    });

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('matches ADR-0008 spacing token structure', () => {
    const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonObject;
    const violations: Violation[] = [];

    if (!isObject(canonical.spacing)) {
      pushViolation(
        violations,
        'spacing',
        'SPACING_ROOT_OBJECT',
        'canonical root contains a spacing object',
        canonical.spacing,
      );
    }

    const spacing = (canonical.spacing as JsonObject | undefined) ?? {};

    walkTokenLeaves(spacing, ['spacing'], (leaf, pathParts) => {
      const tokenPath = pathParts.join('.');
      const category = pathParts[1]; // scale, component, layout, static, fluid

      if (category === 'scale') {
        if (leaf.$type !== 'dimension') {
          pushViolation(
            violations,
            tokenPath,
            'SPACING_SCALE_TYPE',
            '$type is "dimension"',
            leaf.$type,
          );
        }
        if (!isDimension(leaf.$value) && !isFluid(leaf.$value)) {
          pushViolation(
            violations,
            tokenPath,
            'SPACING_SCALE_TYPE',
            '$value is dimension or fluid clamp()',
            leaf.$value,
          );
        }
      }

      if (category === 'static') {
        if (leaf.$type !== 'dimension' && leaf.$type !== 'number') {
          pushViolation(
            violations,
            tokenPath,
            'SPACING_STATIC_TYPE',
            '$type is "dimension" or "number"',
            leaf.$type,
          );
        }
        // Static spacing can be either dimension strings (px/rem), raw numbers, or number strings
        const isValidValue =
          isDimension(leaf.$value) ||
          typeof leaf.$value === 'number' ||
          (typeof leaf.$value === 'string' && !isNaN(Number(leaf.$value)));
        if (!isValidValue) {
          pushViolation(
            violations,
            tokenPath,
            'SPACING_STATIC_TYPE',
            '$value is dimension (px/rem) or number',
            leaf.$value,
          );
        }
      }

      if (category === 'fluid') {
        if (leaf.$type !== 'dimension') {
          pushViolation(
            violations,
            tokenPath,
            'FLUID_SPACING_STRUCTURE',
            '$type is "dimension"',
            leaf.$type,
          );
        }
        if (!isFluid(leaf.$value)) {
          pushViolation(
            violations,
            tokenPath,
            'FLUID_SPACING_STRUCTURE',
            '$value is fluid clamp() expression',
            leaf.$value,
          );
        }
        const cedar = (leaf.$extensions as JsonObject | undefined)?.cedar;
        if (!isObject(cedar?.fluid)) {
          pushViolation(
            violations,
            tokenPath,
            'FLUID_SPACING_STRUCTURE',
            '$extensions.cedar.fluid contains min/ideal/max structure',
            cedar?.fluid,
          );
        }
      }
    });

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });

  it('validates color family in option token extensions', () => {
    const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as JsonObject;
    const violations: Violation[] = [];

    const color = (canonical.color as JsonObject | undefined) ?? {};
    const colorOption = (color.option as JsonObject | undefined) ?? {};

    walkTokenLeaves(colorOption, ['color', 'option'], (leaf, pathParts) => {
      const tokenPath = pathParts.join('.');
      const cedar = (leaf.$extensions as JsonObject | undefined)?.cedar;

      // colorFamily is optional - only validate if present
      if (isObject(cedar) && 'colorFamily' in cedar) {
        const colorFamily = cedar.colorFamily;
        if (typeof colorFamily !== 'string') {
          pushViolation(
            violations,
            `${tokenPath}.$extensions.cedar.colorFamily`,
            'COLOR_FAMILY_IN_EXTENSIONS',
            'colorFamily is string',
            colorFamily,
          );
        }
      }
    });

    expect(violations, formatViolationReport(violations)).toHaveLength(0);
  });
});

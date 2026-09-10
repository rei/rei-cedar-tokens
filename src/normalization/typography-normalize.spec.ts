import { describe, expect, it } from 'vitest';

/**
 * Pure function replicating the typography processing loop inside src/normalization/normalize.ts
 * isolated specifically for normalization unit testing.
 */
function processTypographyFiles(typographyFiles: Array<{ file: string; data: any }>) {
  const typographyTree: Record<string, any> = { text: {} };

  for (const { file, data } of typographyFiles) {
    const match = file.match(/options\.text\.([\w-]+)\.(\w+?)(?:_\d+)?\.json$/);
    if (!match) continue;

    const [_, subProperty, variantName] = match;
    const propertyData = data.text?.[subProperty];
    if (!propertyData) continue;

    if (!typographyTree.text[subProperty]) {
      typographyTree.text[subProperty] = {};
    }

    for (const [tokenKey, tokenLeaf] of Object.entries(propertyData)) {
      const leaf = tokenLeaf as Record<string, any>;

      if (!typographyTree.text[subProperty][tokenKey]) {
        typographyTree.text[subProperty][tokenKey] = {
          $type: leaf.$type || 'string',
          $value: '',
          $extensions: { cedar: {} },
        };
      }

      const targetToken = typographyTree.text[subProperty][tokenKey];

      if (variantName === 'default') {
        targetToken.$value = leaf.$value;
        if (leaf.$type) targetToken.$type = leaf.$type;
      } else {
        targetToken.$extensions.cedar[variantName] = leaf.$value;
      }

      if (leaf.$description && !targetToken.$description) {
        targetToken.$description = leaf.$description;
      }
    }
  }

  return typographyTree;
}

describe('Typography Token Normalization Layer', () => {
  it("should output tokens directly under sub-properties and verify the 'option' key is omitted", () => {
    const mockInput = [
      {
        file: 'options.text.family.default.json',
        data: {
          text: {
            family: {
              graphik: { $type: 'string', $value: 'Graphik' },
            },
          },
        },
      },
    ];

    const result = processTypographyFiles(mockInput);

    expect(result.text.option).toBeUndefined();

    expect(result.text.family.graphik).toBeDefined();
    expect(result.text.family.graphik.$value).toBe('Graphik');
    expect(result.text.family.graphik.$type).toBe('string');
  });

  it("should strip out filename suffix additions like '_2' and accurately merge variant datasets onto the same keys", () => {
    const mockInputWithSuffixes = [
      {
        file: 'options.text.family.default_2.json',
        data: {
          text: {
            family: {
              graphik: {
                $type: 'string',
                $value: 'Graphik',
                $description: 'Cedar heading font family',
              },
              stuart: { $type: 'string', $value: 'Stuart' },
            },
          },
        },
      },
      {
        file: 'options.text.family.fallback_2.json',
        data: {
          text: {
            family: {
              graphik: { $value: ' sans-serif' },
              stuart: { $value: 'Georgia' },
            },
          },
        },
      },
    ];

    const result = processTypographyFiles(mockInputWithSuffixes);

    expect(result.text.family.graphik.$value).toBe('Graphik');
    expect(result.text.family.graphik.$description).toBe('Cedar heading font family');

    expect(result.text.family.graphik.$extensions.cedar.fallback).toBe(' sans-serif');
    expect(result.text.family.stuart.$value).toBe('Stuart');
    expect(result.text.family.stuart.$extensions.cedar.fallback).toBe('Georgia');
  });

  it('should map numeric types across multiple concurrent typography groups cleanly', () => {
    const mockNumericInputs = [
      {
        file: 'options.text.size.default_2.json',
        data: {
          text: {
            size: {
              '100': { $type: 'number', $value: 12 },
              '200': { $type: 'number', $value: 14 },
            },
          },
        },
      },
      {
        file: 'options.text.line-height.default.json',
        data: {
          text: {
            'line-height': {
              '100': { $type: 'number', $value: 16 },
            },
          },
        },
      },
    ];

    const result = processTypographyFiles(mockNumericInputs);

    expect(result.text.size['100'].$value).toBe(12);
    expect(result.text.size['100'].$type).toBe('number');
    expect(result.text.size['200'].$value).toBe(14);

    expect(result.text['line-height']['100'].$value).toBe(16);
    expect(result.text['line-height']['100'].$type).toBe('number');
  });

  it('should ignore processing on files that violate naming conventions', () => {
    const nonTypographyPayload = [
      {
        file: 'options.color.brand.default.json', // fails completely out of the typography name parsing group
        data: { text: { family: { graphik: { $value: 'Color' } } } },
      },
    ];

    const result = processTypographyFiles(nonTypographyPayload);
    expect(result.text).toEqual({});
  });
});

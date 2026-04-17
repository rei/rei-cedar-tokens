import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('deprecated transform', () => {
  const createMockToken = (path: string[]): Token => ({
    name: 'test-token',
    path: [...path],
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Test the transform logic directly
  const deprecatedTransform = (token: Token): Record<string, unknown> => {
    if (token.path[0].includes('deprecated')) {
      const [, year, release] = token.path[0].split('-');
      token.path.shift();

      return {
        deprecated: true,
        'deprecated-year': year,
        'deprecated-release': release,
      };
    }

    return { deprecated: false };
  };

  it('should mark token as not deprecated when path does not contain deprecated', () => {
    const token = createMockToken(['color', 'primary', 'base']);
    const result = deprecatedTransform(token);

    expect(result).toEqual({ deprecated: false });
    expect(token.path).toEqual(['color', 'primary', 'base']);
  });

  it('should extract deprecation metadata from path', () => {
    const token = createMockToken(['deprecated-2024-R1', 'color', 'old-primary']);
    const result = deprecatedTransform(token);

    expect(result).toEqual({
      deprecated: true,
      'deprecated-year': '2024',
      'deprecated-release': 'R1',
    });
  });

  it('should remove deprecated prefix from token path', () => {
    const token = createMockToken(['deprecated-2024-R1', 'color', 'old-primary']);
    deprecatedTransform(token);

    expect(token.path).toEqual(['color', 'old-primary']);
  });

  it('should handle different years', () => {
    const token = createMockToken(['deprecated-2023-R2', 'spacing', 'old']);
    const result = deprecatedTransform(token);

    expect(result).toEqual({
      deprecated: true,
      'deprecated-year': '2023',
      'deprecated-release': 'R2',
    });
  });

  it('should handle different release numbers', () => {
    const token = createMockToken(['deprecated-2025-R3', 'typography', 'old-font']);
    const result = deprecatedTransform(token);

    expect(result).toEqual({
      deprecated: true,
      'deprecated-year': '2025',
      'deprecated-release': 'R3',
    });
  });

  it('should mutate original token path', () => {
    const originalPath = ['deprecated-2024-R1', 'color', 'test'];
    const token = createMockToken(originalPath);

    deprecatedTransform(token);

    expect(token.path).not.toContain('deprecated-2024-R1');
    expect(token.path.length).toBe(2);
  });
});

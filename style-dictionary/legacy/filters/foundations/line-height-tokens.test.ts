import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-line-height-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '1.5',
    original: { $value: '1.5' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsLineHeightTokens
  const foundationsLineHeightTokensFilter = (token: Token): boolean => {
    return (
      (token.path[0] !== 'options' && token.path.includes('line-height')) ||
      token.path.includes('lineHeight')
    );
  };

  it('should include tokens containing "line-height" not in options', () => {
    const token = createToken(['font', 'line-height', 'large']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(true);
  });

  it('should include tokens containing camelCase "lineHeight"', () => {
    const token = createToken(['typography', 'lineHeight', 'base']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(true);
  });

  it('should filter out "line-height" tokens in the options namespace', () => {
    const token = createToken(['options', 'font', 'line-height']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });

  it('should INCLUDE "lineHeight" tokens even in the options namespace', () => {
    /** * Based on the logic: (false && true) || true
     * Because the options check is only grouped with "line-height"
     */
    const token = createToken(['options', 'font', 'lineHeight']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens that do not contain either version of the string', () => {
    const token = createToken(['font', 'size', 'medium']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });

  it('should include tokens where the string is the root', () => {
    expect(foundationsLineHeightTokensFilter(createToken(['line-height']))).toBe(true);
    expect(foundationsLineHeightTokensFilter(createToken(['lineHeight']))).toBe(true);
  });

  it('should filter out unrelated namespaces', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });
});

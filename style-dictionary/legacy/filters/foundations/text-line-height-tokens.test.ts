import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-line-height-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '1.5',
    original: { $value: '1.5' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsTextLineHeightTokens
  const foundationsTextLineHeightTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    token.path.includes('lineHeight');

  it('should include tokens where path[0] includes "text" and path contains "lineHeight"', () => {
    const token = createToken(['text', 'lineHeight', 'base']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., "text-styles")', () => {
    const token = createToken(['text-styles', 'lineHeight', 'heading']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "lineHeight" is deeply nested', () => {
    const token = createToken(['text', 'body', 'paragraph', 'lineHeight']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'lineHeight']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not contain "text"', () => {
    // Rejects even if it has lineHeight if root is e.g., "typography"
    const token = createToken(['typography', 'lineHeight', 'base']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that use "line-height" (kebab-case) instead of "lineHeight"', () => {
    // JavaScript .includes() is case-sensitive
    const token = createToken(['text', 'line-height', 'base']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain "lineHeight" anywhere in the path', () => {
    const token = createToken(['text', 'fontSize', 'medium']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(false);
  });

  it('should handle short paths that meet the criteria', () => {
    const token = createToken(['text', 'lineHeight']);
    expect(foundationsTextLineHeightTokensFilter(token)).toBe(true);
  });
});

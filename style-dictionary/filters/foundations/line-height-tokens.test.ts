import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-line-height-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'lineHeights',
    $value: '1.5',
    original: { $value: '1.5' },
    filePath: 'test.json',
    isSource: true,
  });

  // Matches the exact logic in your Definition File
  const foundationsLineHeightTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'line-height';

  it('should include tokens where the root namespace is exactly "line-height"', () => {
    const token = createToken(['line-height', 'body', 'default']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens where "line-height" is NOT at the root (path[0])', () => {
    // Because the logic specifically checks token.path[0] === "line-height"
    const token = createToken(['typography', 'line-height', 'heading']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'line-height', 'base']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that only partially match the string', () => {
    // === requires an exact match, so "line-height-large" will fail
    const token = createToken(['line-height-large', 'value']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });

  it('should filter out completely unrelated tokens', () => {
    const token = createToken(['font-size', 'medium']);
    expect(foundationsLineHeightTokensFilter(token)).toBe(false);
  });
});

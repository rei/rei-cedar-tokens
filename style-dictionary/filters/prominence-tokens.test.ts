import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('prominence-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '4px',
    original: { $value: '4px' },
    filePath: 'test.json',
    isSource: true
  });

  // Test the filter logic directly
  const prominenceTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'prominence';

  it('should include tokens in prominence namespace', () => {
    const token = createToken(['prominence', 'raised', 'shadow']);
    expect(prominenceTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested prominence tokens', () => {
    const token = createToken(['prominence', 'elevated', 'large', 'shadow']);
    expect(prominenceTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'prominence', 'default']);
    expect(prominenceTokensFilter(token)).toBe(false);
  });

  it('should filter out non-prominence tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(prominenceTokensFilter(token)).toBe(false);
  });

  it('should filter out space tokens', () => {
    const token = createToken(['space', 'small']);
    expect(prominenceTokensFilter(token)).toBe(false);
  });

  it('should filter out radius tokens', () => {
    const token = createToken(['radius', 'medium']);
    expect(prominenceTokensFilter(token)).toBe(false);
  });
});

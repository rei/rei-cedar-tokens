import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('space-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  // Test the filter logic directly
  const spaceTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'space';

  it('should include tokens in space namespace', () => {
    const token = createToken(['space', 'small']);
    expect(spaceTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested space tokens', () => {
    const token = createToken(['space', 'inset', 'medium']);
    expect(spaceTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'space', 'base']);
    expect(spaceTokensFilter(token)).toBe(false);
  });

  it('should filter out non-space tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(spaceTokensFilter(token)).toBe(false);
  });

  it('should filter out radius tokens', () => {
    const token = createToken(['radius', 'medium']);
    expect(spaceTokensFilter(token)).toBe(false);
  });

  it('should filter out icon tokens', () => {
    const token = createToken(['icon', 'size', 'medium']);
    expect(spaceTokensFilter(token)).toBe(false);
  });

  it('should filter out form tokens', () => {
    const token = createToken(['form', 'input', 'height']);
    expect(spaceTokensFilter(token)).toBe(false);
  });
});

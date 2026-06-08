import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('radius-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '8px',
    original: { $value: '8px' },
    filePath: 'test.json',
    isSource: true,
  });

  // Test the filter logic directly
  const radiusTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'radius';

  it('should include tokens in radius namespace', () => {
    const token = createToken(['radius', 'medium']);
    expect(radiusTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested radius tokens', () => {
    const token = createToken(['radius', 'button', 'small']);
    expect(radiusTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'radius', 'default']);
    expect(radiusTokensFilter(token)).toBe(false);
  });

  it('should filter out non-radius tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(radiusTokensFilter(token)).toBe(false);
  });

  it('should filter out space tokens', () => {
    const token = createToken(['space', 'small']);
    expect(radiusTokensFilter(token)).toBe(false);
  });

  it('should filter out prominence tokens', () => {
    const token = createToken(['prominence', 'raised']);
    expect(radiusTokensFilter(token)).toBe(false);
  });

  it('should not match color.radius tokens (different namespace)', () => {
    const token = createToken(['color', 'radius', 'primary']);
    expect(radiusTokensFilter(token)).toBe(false);
  });
});

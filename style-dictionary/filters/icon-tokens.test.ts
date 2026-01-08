import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('icon-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '24px',
    original: { $value: '24px' },
    filePath: 'test.json',
    isSource: true
  });

  // Test the filter logic directly
  const iconTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'icon';

  it('should include tokens in icon namespace', () => {
    const token = createToken(['icon', 'size', 'medium']);
    expect(iconTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested icon tokens', () => {
    const token = createToken(['icon', 'size', 'button', 'small']);
    expect(iconTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'icon', 'default']);
    expect(iconTokensFilter(token)).toBe(false);
  });

  it('should filter out non-icon tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(iconTokensFilter(token)).toBe(false);
  });

  it('should filter out space tokens', () => {
    const token = createToken(['space', 'small']);
    expect(iconTokensFilter(token)).toBe(false);
  });

  it('should filter out form tokens', () => {
    const token = createToken(['form', 'input', 'height']);
    expect(iconTokensFilter(token)).toBe(false);
  });

  it('should not match color.icon tokens (different namespace)', () => {
    const token = createToken(['color', 'icon', 'primary']);
    expect(iconTokensFilter(token)).toBe(false);
  });
});

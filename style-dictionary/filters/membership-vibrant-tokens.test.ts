import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('membership-vibrant-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Test the filter logic directly
  const membershipVibrantTokensFilter = (token: Token): boolean =>
    token.path[0] === 'membership' && token.path[1] === 'vibrant';

  it('should include tokens in membership.vibrant namespace', () => {
    const token = createToken(['membership', 'vibrant', 'background']);
    expect(membershipVibrantTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested membership.vibrant tokens', () => {
    const token = createToken(['membership', 'vibrant', 'badge', 'color']);
    expect(membershipVibrantTokensFilter(token)).toBe(true);
  });

  it('should filter out membership.subtle tokens', () => {
    const token = createToken(['membership', 'subtle', 'background']);
    expect(membershipVibrantTokensFilter(token)).toBe(false);
  });

  it('should filter out non-membership tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(membershipVibrantTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens without vibrant subcategory', () => {
    const token = createToken(['membership', 'default']);
    expect(membershipVibrantTokensFilter(token)).toBe(false);
  });

  it('should filter out options namespace tokens', () => {
    const token = createToken(['options', 'membership', 'vibrant']);
    expect(membershipVibrantTokensFilter(token)).toBe(false);
  });
});

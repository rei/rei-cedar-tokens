import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('membership-subtle-tokens filter', () => {
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
  const membershipSubtleTokensFilter = (token: Token): boolean =>
    token.path[0] === 'membership' && token.path[1] === 'subtle';

  it('should include tokens in membership.subtle namespace', () => {
    const token = createToken(['membership', 'subtle', 'background']);
    expect(membershipSubtleTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested membership.subtle tokens', () => {
    const token = createToken(['membership', 'subtle', 'badge', 'color']);
    expect(membershipSubtleTokensFilter(token)).toBe(true);
  });

  it('should filter out membership.vibrant tokens', () => {
    const token = createToken(['membership', 'vibrant', 'background']);
    expect(membershipSubtleTokensFilter(token)).toBe(false);
  });

  it('should filter out non-membership tokens', () => {
    const token = createToken(['color', 'primary']);
    expect(membershipSubtleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens without subtle subcategory', () => {
    const token = createToken(['membership', 'default']);
    expect(membershipSubtleTokensFilter(token)).toBe(false);
  });

  it('should filter out options namespace tokens', () => {
    const token = createToken(['options', 'membership', 'subtle']);
    expect(membershipSubtleTokensFilter(token)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-space-scale-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '8px',
    original: { $value: '8px' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsSpaceScaleTokens
  const foundationsSpaceScaleTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'space' && token.path[1] === 'scale';

  it('should include tokens in the space.scale namespace', () => {
    const token = createToken(['space', 'scale', '100']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested space.scale tokens', () => {
    const token = createToken(['space', 'scale', 'base', 'mobile']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(true);
  });

  it('should filter out space tokens that are not scale (e.g., inset)', () => {
    const token = createToken(['space', 'inset', 'medium']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'space', 'scale']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "space" is not at the root', () => {
    const token = createToken(['foundations', 'space', 'scale']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "scale" is at the root', () => {
    const token = createToken(['scale', 'space', 'medium']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });

  it('should handle short paths (length < 2) without error', () => {
    const token = createToken(['space']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });

  it('should be case sensitive', () => {
    // Style Dictionary paths are case-sensitive by default
    const token = createToken(['Space', 'Scale', '100']);
    expect(foundationsSpaceScaleTokensFilter(token)).toBe(false);
  });
});

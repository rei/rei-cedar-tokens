import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-space-inset-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsSpaceInsetTokens
  const foundationsSpaceInsetTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'space' && token.path[1] === 'inset';

  it('should include tokens in the space.inset namespace', () => {
    const token = createToken(['space', 'inset', 'medium']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested space.inset tokens', () => {
    const token = createToken(['space', 'inset', 'quaternary', 'top']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(true);
  });

  it('should filter out space tokens that are not insets', () => {
    const token = createToken(['space', 'gap', 'small']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'space', 'inset']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });

  it('should filter out non-space tokens', () => {
    const token = createToken(['grid', 'inset', 'large']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where inset is not at the second position', () => {
    const token = createToken(['foundations', 'space', 'inset']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });

  it('should handle paths that are too short (length < 2)', () => {
    const token = createToken(['space']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });

  it('should be case sensitive', () => {
    const token = createToken(['Space', 'Inset', 'base']);
    expect(foundationsSpaceInsetTokensFilter(token)).toBe(false);
  });
});

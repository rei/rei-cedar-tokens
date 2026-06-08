import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-space-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '12px',
    original: { $value: '12px' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsSpaceTokens
  const foundationsSpaceTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] === 'space' &&
    token.path[1] !== 'inset' &&
    token.path[1] !== 'scale';

  it('should include generic space tokens', () => {
    const token = createToken(['space', 'gap', 'large']);
    expect(foundationsSpaceTokensFilter(token)).toBe(true);
  });

  it('should include space tokens with no sub-category', () => {
    const token = createToken(['space', 'padding-base']);
    expect(foundationsSpaceTokensFilter(token)).toBe(true);
  });

  it('should filter out space.inset tokens', () => {
    const token = createToken(['space', 'inset', 'medium']);
    expect(foundationsSpaceTokensFilter(token)).toBe(false);
  });

  it('should filter out space.scale tokens', () => {
    const token = createToken(['space', 'scale', '100']);
    expect(foundationsSpaceTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'space', 'margin']);
    expect(foundationsSpaceTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens from non-space namespaces', () => {
    const token = createToken(['color', 'space', 'primary']);
    expect(foundationsSpaceTokensFilter(token)).toBe(false);
  });

  it('should include deeply nested space tokens that are not inset or scale', () => {
    const token = createToken(['space', 'layout', 'stack', 'small']);
    expect(foundationsSpaceTokensFilter(token)).toBe(true);
  });

  it('should handle single-segment paths correctly', () => {
    // path[1] is undefined, which is !== "inset" and !== "scale"
    const token = createToken(['space']);
    expect(foundationsSpaceTokensFilter(token)).toBe(true);
  });
});

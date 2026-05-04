import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-space-icon-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '2.4rem',
    original: { $value: '2.4rem' },
    filePath: 'test.json',
    isSource: true,
  });

  const foundationsSpaceIconTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'icon';

  it('should include icon.size-sm tokens', () => {
    const token = createToken(['icon', 'size-sm']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should include icon.size tokens', () => {
    const token = createToken(['icon', 'size']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should include icon.size-lg tokens', () => {
    const token = createToken(['icon', 'size-lg']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'icon', 'size']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens from non-icon namespaces', () => {
    const token = createToken(['space', 'icon', 'size']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(false);
  });
});

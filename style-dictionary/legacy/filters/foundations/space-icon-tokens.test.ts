import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-space-icon-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  const foundationsSpaceIconTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'icon';

  it('should include icon.size token', () => {
    const token = createToken(['icon', 'size']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should include icon.size-sm token', () => {
    const token = createToken(['icon', 'size-sm']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should include icon.size-lg token', () => {
    const token = createToken(['icon', 'size-lg']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(true);
  });

  it('should exclude tokens in the options namespace', () => {
    const token = createToken(['options', 'icon', 'size']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(false);
  });

  it('should exclude space tokens', () => {
    const token = createToken(['space', 'one-x']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(false);
  });

  it('should exclude color tokens', () => {
    const token = createToken(['color', 'icon', 'primary']);
    expect(foundationsSpaceIconTokensFilter(token)).toBe(false);
  });
});

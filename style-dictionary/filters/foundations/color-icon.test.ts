import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-color-icon-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsColorIconsTokens
  const foundationsColorIconTokensFilter = (token: Token): boolean => {
    const iconTokens = ['default', 'emphasis', 'link', 'disabled'];

    return (
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'icon' &&
      iconTokens.includes(token.path[2])
    );
  };

  it('should include valid icon tokens', () => {
    const validPaths = [
      ['color', 'icon', 'default'],
      ['color', 'icon', 'emphasis'],
      ['color', 'icon', 'link'],
      ['color', 'icon', 'disabled'],
    ];

    validPaths.forEach((path) => {
      const token = createToken(path);
      expect(foundationsColorIconTokensFilter(token)).toBe(true);
    });
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'color', 'icon', 'default']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in theme namespace', () => {
    const token = createToken(['theme', 'color', 'icon', 'default']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should filter out color tokens that are not icons', () => {
    const token = createToken(['color', 'background', 'default']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should filter out icon tokens not in the allowed list', () => {
    // "hover" is not in ["default", "emphasis", "link", "disabled"]
    const token = createToken(['color', 'icon', 'hover']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where path[0] is not color', () => {
    const token = createToken(['brand', 'icon', 'default']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should return true for deeply nested tokens if the first three segments match', () => {
    // Current logic does not check path length, only specific indices
    const token = createToken(['color', 'icon', 'default', 'active']);
    expect(foundationsColorIconTokensFilter(token)).toBe(true);
  });
});

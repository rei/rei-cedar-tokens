import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

const universalIconTokens = [
  // Legacy foundations
  'default',
  'emphasis',
  'link',
  'disabled',
  // Universal semantic foundations
  'accent',
  'brand',
  'membership',
  'natural',
  'sale',
];

describe('foundations-color-icon-tokens filter', () => {
  const createToken = (path: string[], filePath = 'tokens/global/color.json'): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath,
    isSource: true,
  });

  const foundationsColorIconTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    token.path[0] === 'color' &&
    token.path[1] === 'icon' &&
    universalIconTokens.includes(token.path[2]);

  it('should include legacy color.icon tokens', () => {
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

  it('should include universal semantic color.icon tokens', () => {
    const validPaths = [
      ['color', 'icon', 'accent', 'bold'],
      ['color', 'icon', 'accent', 'faint'],
      ['color', 'icon', 'brand'],
      ['color', 'icon', 'membership'],
      ['color', 'icon', 'natural'],
      ['color', 'icon', 'sale'],
    ];

    validPaths.forEach((path) => {
      const token = createToken(path, 'tokens/semantics.color.value.json');
      expect(foundationsColorIconTokensFilter(token)).toBe(true);
    });
  });

  it('should filter out icon tokens outside the foundation allowlist', () => {
    const token = createToken(['color', 'icon', 'switch'], 'tokens/global/switch.json');
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
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

  it('should filter out tokens where path[0] is not color', () => {
    const token = createToken(['brand', 'icon', 'default']);
    expect(foundationsColorIconTokensFilter(token)).toBe(false);
  });

  it('should include deeply nested universal icon tokens', () => {
    const token = createToken(['color', 'icon', 'accent', 'hover']);
    expect(foundationsColorIconTokensFilter(token)).toBe(true);
  });
});

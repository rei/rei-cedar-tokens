import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

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
    (token.filePath as string).endsWith('color.json');

  it('should include color.icon tokens from color.json', () => {
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

  it('should include any color.icon token from color.json', () => {
    const token = createToken(['color', 'icon', 'new-semantic-state']);
    expect(foundationsColorIconTokensFilter(token)).toBe(true);
  });

  it('should include tokens from theme-level color.json files', () => {
    const token = createToken(['color', 'icon', 'default'], 'tokens/themes/docsite/color.json');
    expect(foundationsColorIconTokensFilter(token)).toBe(true);
  });

  it('should filter out color.icon tokens from component token files', () => {
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

  it('should include deeply nested tokens from color.json', () => {
    const token = createToken(['color', 'icon', 'default', 'active']);
    expect(foundationsColorIconTokensFilter(token)).toBe(true);
  });
});

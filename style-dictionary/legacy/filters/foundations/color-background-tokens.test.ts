import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('color-background-tokens filter', () => {
  const createToken = (path: string[], filePath = 'tokens/global/color.json'): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath,
    isSource: true,
  });

  const colorBackgroundTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    token.path[0] === 'color' &&
    token.path[1] === 'background' &&
    (token.filePath as string).endsWith('color.json');

  it('should include tokens from color.json in color.background namespace', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should include any color.background token from color.json', () => {
    const token = createToken(['color', 'background', 'new-semantic-color']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested color.background tokens from color.json', () => {
    const token = createToken(['color', 'background', 'success', 'hover']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should include tokens from theme-level color.json files', () => {
    const token = createToken(
      ['color', 'background', 'primary'],
      'tokens/themes/docsite/color.json',
    );
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should filter out color.background tokens from component token files', () => {
    const token = createToken(['color', 'background', 'button'], 'tokens/global/button.json');
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'color', 'background', 'primary']);
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in theme namespace', () => {
    const token = createToken(['theme', 'color', 'background', 'primary']);
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });

  it('should filter out color.text tokens', () => {
    const token = createToken(['color', 'text', 'primary']);
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });

  it('should filter out non-color tokens', () => {
    const token = createToken(['space', 'small']);
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });
});

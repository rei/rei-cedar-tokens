import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('button tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Matches the logic in your provided Definition File
  const buttonTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('button');

  it('should include tokens where "button" is the root namespace', () => {
    const token = createToken(['button', 'size', 'large']);
    expect(buttonTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "button" appears later in the path', () => {
    const token = createToken(['color', 'background', 'button', 'primary']);
    expect(buttonTokensFilter(token)).toBe(true);
  });

  it('should include tokens for specific button states', () => {
    const token = createToken(['button', 'border', 'hover', 'color']);
    expect(buttonTokensFilter(token)).toBe(true);
  });

  it('should filter out "button" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'button', 'padding']);
    expect(buttonTokensFilter(token)).toBe(false);
  });

  it('should filter out "button" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'button', 'border-radius']);
    expect(buttonTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "button"', () => {
    const token = createToken(['accordion', 'item', 'header']);
    expect(buttonTokensFilter(token)).toBe(false);
  });

  it('should filter out general color tokens without "button" in the path', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(buttonTokensFilter(token)).toBe(false);
  });
});

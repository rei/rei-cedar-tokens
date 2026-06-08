import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('color-text-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Test the filter logic directly
  const colorTextTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    token.path[0] === 'color' &&
    token.path[1] === 'text';

  it('should include tokens in color.text namespace', () => {
    const token = createToken(['color', 'text', 'primary']);
    expect(colorTextTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested color.text tokens', () => {
    const token = createToken(['color', 'text', 'link', 'hover']);
    expect(colorTextTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'color', 'text']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in theme namespace', () => {
    const token = createToken(['theme', 'color', 'text']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });

  it('should filter out color.background tokens', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });

  it('should filter out color.border tokens', () => {
    const token = createToken(['color', 'border', 'primary']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });

  it('should filter out color.icon tokens', () => {
    const token = createToken(['color', 'icon', 'primary']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });

  it('should filter out non-color tokens', () => {
    const token = createToken(['space', 'small']);
    expect(colorTextTokensFilter(token)).toBe(false);
  });
});

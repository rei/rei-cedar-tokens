import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('color-background-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Updated to match the Definition File logic
  const colorBackgroundTokensFilter = (token: Token): boolean => {
    const colorTokens = [
      'transparent',
      'primary',
      'secondary',
      'sale',
      'brand-spruce',
      'success',
      'info',
      'warning',
      'error',
    ];

    return (
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[1] === 'background' &&
      colorTokens.includes(token.path[2])
    );
  };

  it('should include allowed tokens in color.background namespace', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should include "brand-spruce" as a valid background token', () => {
    const token = createToken(['color', 'background', 'brand-spruce']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested allowed color.background tokens', () => {
    // Note: This still passes because path[2] is 'success'
    const token = createToken(['color', 'background', 'success', 'hover']);
    expect(colorBackgroundTokensFilter(token)).toBe(true);
  });

  it('should filter out color.background tokens NOT in the allowed list', () => {
    const token = createToken(['color', 'background', 'random-custom-color']);
    expect(colorBackgroundTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where the background name is missing (too short)', () => {
    const token = createToken(['color', 'background']);
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

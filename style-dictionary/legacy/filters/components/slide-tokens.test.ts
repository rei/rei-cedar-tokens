import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('slide-tokens filter', () => {
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
  const slideTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('slide');

  it('should include tokens where "slide" is the root namespace', () => {
    const token = createToken(['slide', 'background', 'color']);
    expect(slideTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "slide" appears later in the path', () => {
    const token = createToken(['component', 'carousel', 'slide', 'padding']);
    expect(slideTokensFilter(token)).toBe(true);
  });

  it('should include specific slide state tokens (e.g., active, transition)', () => {
    const token = createToken(['slide', 'active', 'border', 'width']);
    expect(slideTokensFilter(token)).toBe(true);
  });

  it('should filter out "slide" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'slide', 'duration']);
    expect(slideTokensFilter(token)).toBe(false);
  });

  it('should filter out "slide" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'slide', 'easing']);
    expect(slideTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "slide"', () => {
    const token = createToken(['gallery', 'item', 'spacing']);
    expect(slideTokensFilter(token)).toBe(false);
  });

  it('should filter out general carousel tokens without the "slide" keyword', () => {
    const token = createToken(['carousel', 'navigation', 'color']);
    expect(slideTokensFilter(token)).toBe(false);
  });
});

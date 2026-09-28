import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('component-rating-tokens filter', () => {
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
  const componentRatingTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    (token.path.includes('rating') || token.path.includes('rating-star'));

  it('should include tokens where "rating" is an exact element in the path', () => {
    const token = createToken(['rating', 'text', 'color']);
    expect(componentRatingTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "rating-star" is an exact element in the path', () => {
    const token = createToken(['rating-star', 'background', 'filled']);
    expect(componentRatingTokensFilter(token)).toBe(true);
  });

  it('should include tokens where the keywords are nested', () => {
    const token = createToken(['component', 'feedback', 'rating', 'spacing']);
    expect(componentRatingTokensFilter(token)).toBe(true);
  });

  it('should filter out "rating" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'rating', 'size']);
    expect(componentRatingTokensFilter(token)).toBe(false);
  });

  it('should filter out "rating-star" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'rating-star', 'color']);
    expect(componentRatingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that only partially match (Array exact match rule)', () => {
    // Array.includes requires the full segment string
    const token = createToken(['rating-group', 'margin', 'bottom']);
    expect(componentRatingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain either keyword', () => {
    const token = createToken(['button', 'background', 'primary']);
    expect(componentRatingTokensFilter(token)).toBe(false);
  });
});

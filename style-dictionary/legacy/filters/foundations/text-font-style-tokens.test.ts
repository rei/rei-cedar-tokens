import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-style-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'string',
    $value: 'italic',
    original: { $value: 'italic' },
    filePath: 'test.json',
    isSource: true,
  });

  const foundationsTextStyleTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    (token.path.includes('style') ||
      token.path.includes('variation') ||
      token.path.includes('transform'));

  it('should include tokens where path[0] includes "text" and path contains "style"', () => {
    const token = createToken(['text', 'style', 'italic']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., text-styles)', () => {
    const token = createToken(['text-styles', 'style', 'normal']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "style" is nested deeply in the object tree', () => {
    const token = createToken(['text', 'body', 'emphasis', 'style']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'style']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not contain the word "text"', () => {
    const token = createToken(['typography', 'style', 'italic']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens using kebab-case "font-style"', () => {
    const token = createToken(['text', 'font-style', 'italic']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens missing "style" entirely', () => {
    const token = createToken(['text', 'size', 'medium']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(false);
  });

  it('should handle short paths that contain the required segments', () => {
    const token = createToken(['text', 'style']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should include text-italic variation tokens', () => {
    const token = createToken(['text-italic', 'variation']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should include text-eyebrow textTransform tokens (path segment is "transform" after text-short-names transform)', () => {
    const token = createToken(['text-eyebrow', '100', 'transform']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(true);
  });

  it('should filter out non-text variation tokens', () => {
    const token = createToken(['icon', 'variation']);
    expect(foundationsTextStyleTokensFilter(token)).toBe(false);
  });
});

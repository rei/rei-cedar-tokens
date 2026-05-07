import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-size-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  const foundationsTextSizeTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    (token.path[0] === 'text-size-root' ||
      (token.path[0].includes('text') && token.path.includes('size')));

  it('should include tokens where path[0] includes "text" and path contains "size"', () => {
    const token = createToken(['text', 'size', 'medium']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(true);
  });

  it('should include tokens with variations of "text" at the root', () => {
    const token = createToken(['text-styles', 'size', 'base']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "size" is deeply nested', () => {
    const token = createToken(['text', 'desktop', 'heading', 'size']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'size']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if path[0] does not include "text"', () => {
    const token = createToken(['font', 'size']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain "size" anywhere', () => {
    const token = createToken(['text', 'lineHeight', 'base']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "text" is not at the root', () => {
    const token = createToken(['foundations', 'text', 'size']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(false);
  });

  it('should include the text-size-root token', () => {
    const token = createToken(['text-size-root']);
    expect(foundationsTextSizeTokensFilter(token)).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-font-size-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsFontSizeTokens
  const foundationsFontSizeTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    token.path.includes('fontSize');

  it('should include tokens where path[0] includes "text" and path contains "fontSize"', () => {
    const token = createToken(['text', 'fontSize', 'medium']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(true);
  });

  it('should include tokens with variations of "text" at the root', () => {
    // Matches because 'text-styles' includes 'text'
    const token = createToken(['text-styles', 'fontSize', 'base']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "fontSize" is deeply nested', () => {
    const token = createToken(['text', 'desktop', 'heading', 'fontSize']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'fontSize']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if path[0] does not include "text"', () => {
    // Even if it contains fontSize, the root must match the "text" criteria
    const token = createToken(['font', 'fontSize']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain "fontSize" anywhere', () => {
    const token = createToken(['text', 'lineHeight', 'base']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(false);
  });

  it('should be case sensitive for "fontSize"', () => {
    // JavaScript .includes() is case sensitive
    const token = createToken(['text', 'fontsize']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "text" is not at the root', () => {
    // Only path[0] is checked for "text"
    const token = createToken(['foundations', 'text', 'fontSize']);
    expect(foundationsFontSizeTokensFilter(token)).toBe(false);
  });
});

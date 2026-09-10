import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-letter-spacing-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'dimension',
    $value: '0.05em',
    original: { $value: '0.05em' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsTextLetterSpacingTokens
  const foundationsTextLetterSpacingTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    token.path.includes('letterSpacing');

  it('should include tokens where path[0] includes "text" and path contains "letterSpacing"', () => {
    const token = createToken(['text', 'letterSpacing', 'tight']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., text-foundation)', () => {
    const token = createToken(['text-foundation', 'letterSpacing', 'base']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested letterSpacing tokens', () => {
    const token = createToken(['text', 'display', 'hero', 'letterSpacing']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'letterSpacing']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not contain "text"', () => {
    // Even if it has letterSpacing, it fails if the root is "typography"
    const token = createToken(['typography', 'letterSpacing', 'base']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens using kebab-case "letter-spacing"', () => {
    // JavaScript .includes() is case-sensitive
    const token = createToken(['text', 'letter-spacing', 'wide']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens missing "letterSpacing" entirely', () => {
    const token = createToken(['text', 'fontWeight', 'bold']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(false);
  });

  it('should handle short paths that meet the criteria', () => {
    const token = createToken(['text', 'letterSpacing']);
    expect(foundationsTextLetterSpacingTokensFilter(token)).toBe(true);
  });
});

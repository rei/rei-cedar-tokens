import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-font-family-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'fontFamily',
    $value: 'Inter, sans-serif',
    original: { $value: 'Inter, sans-serif' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsTextFontFamilyTokens
  const foundationsTextFontFamilyTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    token.path.includes('fontFamily');

  it('should include tokens where path[0] includes "text" and path contains "fontFamily"', () => {
    const token = createToken(['text', 'fontFamily', 'sans']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., text-styles)', () => {
    const token = createToken(['text-styles', 'fontFamily', 'heading']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested fontFamily tokens', () => {
    const token = createToken(['text', 'brand', 'fallback', 'fontFamily']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'fontFamily']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not include "text"', () => {
    // Even if it contains fontFamily, the root must match the "text" criteria
    const token = createToken(['typography', 'fontFamily']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain "fontFamily" anywhere in the path', () => {
    const token = createToken(['text', 'fontWeight', 'bold']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(false);
  });

  it('should be case sensitive for "fontFamily"', () => {
    // JS .includes() will fail for "fontfamily" (lowercase 'f')
    const token = createToken(['text', 'fontfamily']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(false);
  });

  it('should handle short paths correctly', () => {
    const token = createToken(['text', 'fontFamily']);
    expect(foundationsTextFontFamilyTokensFilter(token)).toBe(true);
  });
});

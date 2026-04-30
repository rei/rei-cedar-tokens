import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-font-style-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'string',
    $value: 'italic',
    original: { $value: 'italic' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsTextFontStyleTokens
  const foundationsTextFontStyleTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0].includes('text') &&
    token.path.includes('fontStyle');

  it('should include tokens where path[0] includes "text" and path contains "fontStyle"', () => {
    const token = createToken(['text', 'fontStyle', 'italic']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., text-styles)', () => {
    const token = createToken(['text-styles', 'fontStyle', 'normal']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "fontStyle" is nested deeply in the object tree', () => {
    const token = createToken(['text', 'body', 'emphasis', 'fontStyle']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'fontStyle']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not contain the word "text"', () => {
    // Even if it has fontStyle, it's rejected if the root is "typography"
    const token = createToken(['typography', 'fontStyle', 'italic']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens using kebab-case "font-style"', () => {
    // JavaScript .includes() is case-sensitive and literal
    const token = createToken(['text', 'font-style', 'italic']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens missing "fontStyle" entirely', () => {
    const token = createToken(['text', 'fontSize', 'medium']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(false);
  });

  it('should handle short paths that contain the required segments', () => {
    const token = createToken(['text', 'fontStyle']);
    expect(foundationsTextFontStyleTokensFilter(token)).toBe(true);
  });
});

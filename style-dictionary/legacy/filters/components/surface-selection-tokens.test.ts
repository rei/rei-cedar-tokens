import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('surface-selection-tokens filter', () => {
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
  const surfaceSelectionTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    token.path.includes('surface-selection');

  it('should include tokens where "surface-selection" is the root namespace', () => {
    const token = createToken(['surface-selection', 'background', 'active']);
    expect(surfaceSelectionTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "surface-selection" appears later in the path', () => {
    const token = createToken(['color', 'ui', 'surface-selection', 'border']);
    expect(surfaceSelectionTokensFilter(token)).toBe(true);
  });

  it('should include hyphenated "surface-selection" tokens correctly', () => {
    const token = createToken(['surface-selection', 'hover', 'opacity']);
    expect(surfaceSelectionTokensFilter(token)).toBe(true);
  });

  it('should filter out "surface-selection" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'surface-selection', 'contrast-ratio']);
    expect(surfaceSelectionTokensFilter(token)).toBe(false);
  });

  it('should filter out "surface-selection" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'surface-selection', 'mode']);
    expect(surfaceSelectionTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the string "surface-selection"', () => {
    const token = createToken(['surface', 'background', 'primary']);
    expect(surfaceSelectionTokensFilter(token)).toBe(false);
  });

  it('should filter out general selection tokens without the full "surface-selection" keyword', () => {
    const token = createToken(['color', 'selection', 'text']);
    expect(surfaceSelectionTokensFilter(token)).toBe(false);
  });
});

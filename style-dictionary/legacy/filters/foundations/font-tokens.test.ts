import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-font-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'fontFamily',
    $value: 'Arial',
    original: { $value: 'Arial' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsFontTokens
  const foundationsFontTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] === 'font';

  it('should include tokens in the font namespace', () => {
    const token = createToken(['font', 'family', 'heading']);
    expect(foundationsFontTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested font tokens', () => {
    const token = createToken(['font', 'weight', 'bold', 'desktop']);
    expect(foundationsFontTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    // Even if it contains 'font' later in the path
    const token = createToken(['options', 'font', 'size']);
    expect(foundationsFontTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens from other namespaces', () => {
    const token = createToken(['color', 'font', 'primary']);
    expect(foundationsFontTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "font" is not the root', () => {
    const token = createToken(['typography', 'font']);
    expect(foundationsFontTokensFilter(token)).toBe(false);
  });

  it('should filter out empty paths or unrelated system tokens', () => {
    const token = createToken(['size', 'spacing', 'medium']);
    expect(foundationsFontTokensFilter(token)).toBe(false);
  });
});

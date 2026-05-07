import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-weight-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'fontWeight',
    $value: 400,
    original: { $value: 400 },
    filePath: 'test.json',
    isSource: true,
  });

  const foundationsTextWeightTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0].includes('text') && token.path.includes('weight');

  it('should include tokens where path[0] includes "text" and path contains "weight"', () => {
    const token = createToken(['text', 'weight', 'bold']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(true);
  });

  it('should include tokens with partial matches on the root segment (e.g., text-styles)', () => {
    const token = createToken(['text-styles', 'weight', 'normal']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested weight tokens', () => {
    const token = createToken(['text', 'body', 'emphasis', 'weight']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace', () => {
    const token = createToken(['options', 'text', 'weight']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens if the root segment does not include "text"', () => {
    const token = createToken(['typography', 'weight']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain "weight" anywhere in the path', () => {
    const token = createToken(['text', 'family', 'sans']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(false);
  });

  it('should handle short paths correctly', () => {
    const token = createToken(['text', 'weight']);
    expect(foundationsTextWeightTokensFilter(token)).toBe(true);
  });
});

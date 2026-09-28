import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-text-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'typography',
    $value: '16px',
    original: { $value: '16px' },
    filePath: 'test.json',
    isSource: true,
  });

  // Matches the exact logic in your Definition File
  const foundationsTextTokensFilter = (token: Token): boolean =>
    (token.path[0] !== 'options' && token.path[0].includes('text-default')) ||
    token.path[0].includes('text-eyebrow') ||
    token.path[0].includes('text-heading') ||
    token.path[0].includes('text-body') ||
    token.path[0].includes('text-subheading') ||
    token.path[0].includes('text-utility');

  it('should include tokens where path[0] contains "text-default"', () => {
    const token = createToken(['text-default', 'size', 'medium']);
    expect(foundationsTextTokensFilter(token)).toBe(true);
  });

  it('should include tokens where path[0] contains "text-heading"', () => {
    const token = createToken(['text-heading', 'h1', 'bold']);
    expect(foundationsTextTokensFilter(token)).toBe(true);
  });

  it('should include tokens where path[0] contains "text-body" or "text-subheading"', () => {
    const bodyToken = createToken(['text-body', 'paragraph']);
    const subToken = createToken(['text-subheading', 'style']);
    expect(foundationsTextTokensFilter(bodyToken)).toBe(true);
    expect(foundationsTextTokensFilter(subToken)).toBe(true);
  });

  it('should include tokens where path[0] contains "text-eyebrow" or "text-utility"', () => {
    const eyebrowToken = createToken(['text-eyebrow', 'uppercase']);
    const utilityToken = createToken(['text-utility', 'caption']);
    expect(foundationsTextTokensFilter(eyebrowToken)).toBe(true);
    expect(foundationsTextTokensFilter(utilityToken)).toBe(true);
  });

  it('should filter out tokens where the keyword is nested deeper than path[0]', () => {
    // Because your logic specifically targets token.path[0]
    const token = createToken(['typography', 'text-heading', 'size']);
    expect(foundationsTextTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    // path[0] is 'options', so it won't include any of the 'text-*' strings
    const token = createToken(['options', 'text-heading', 'size']);
    expect(foundationsTextTokensFilter(token)).toBe(false);
  });

  it('should filter out unrelated typography tokens that do not match the exact strings', () => {
    // Contains "text", but not "text-body", "text-heading", etc.
    const token = createToken(['text-decoration', 'underline']);
    expect(foundationsTextTokensFilter(token)).toBe(false);
  });
});

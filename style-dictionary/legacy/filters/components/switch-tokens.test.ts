import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('switch-tokens filter', () => {
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
  const switchTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('switch');

  it('should include tokens where "switch" is the root namespace', () => {
    const token = createToken(['switch', 'background', 'checked']);
    expect(switchTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "switch" appears exactly elsewhere in the path', () => {
    const token = createToken(['component', 'form', 'switch', 'handle']);
    expect(switchTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens that only partially match "switch"', () => {
    // Array.includes('switch') will return false for 'switch-group'
    const token = createToken(['switch-group', 'margin', 'small']);
    expect(switchTokensFilter(token)).toBe(false);
  });

  it('should filter out "switch" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'switch', 'size']);
    expect(switchTokensFilter(token)).toBe(false);
  });

  it('should filter out "switch" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'switch', 'color-scheme']);
    expect(switchTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "switch" at all', () => {
    const token = createToken(['checkbox', 'background', 'checked']);
    expect(switchTokensFilter(token)).toBe(false);
  });

  it('should filter out general form tokens without the "switch" keyword', () => {
    const token = createToken(['form', 'element', 'spacing']);
    expect(switchTokensFilter(token)).toBe(false);
  });
});

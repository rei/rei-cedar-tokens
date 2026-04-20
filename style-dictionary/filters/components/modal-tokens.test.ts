import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('modal-tokens filter', () => {
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
  const modalTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('modal');

  it('should include tokens where "modal" is the root namespace', () => {
    const token = createToken(['modal', 'background', 'overlay']);
    expect(modalTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "modal" appears later in the path', () => {
    const token = createToken(['component', 'dialog', 'modal', 'border-radius']);
    expect(modalTokensFilter(token)).toBe(true);
  });

  it('should include specific modal sub-component tokens', () => {
    const token = createToken(['modal', 'header', 'padding']);
    expect(modalTokensFilter(token)).toBe(true);
  });

  it('should filter out "modal" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'modal', 'z-index']);
    expect(modalTokensFilter(token)).toBe(false);
  });

  it('should filter out "modal" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'modal', 'shadow']);
    expect(modalTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "modal"', () => {
    const token = createToken(['popover', 'background', 'color']);
    expect(modalTokensFilter(token)).toBe(false);
  });

  it('should filter out general overlay tokens without the "modal" keyword', () => {
    const token = createToken(['overlay', 'scrim', 'opacity']);
    expect(modalTokensFilter(token)).toBe(false);
  });
});

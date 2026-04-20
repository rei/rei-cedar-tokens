import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('accordion tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Updated to match your new Definition File logic
  const accordionTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('accordion');

  it('should include tokens where "accordion" is the root namespace', () => {
    const token = createToken(['accordion', 'background', 'primary']);
    expect(accordionTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "accordion" is nested elsewhere in the path', () => {
    const token = createToken(['component', 'accordion', 'item', 'header']);
    expect(accordionTokensFilter(token)).toBe(true);
  });

  it('should include "accordion" tokens inside the "color" namespace', () => {
    const token = createToken(['color', 'background', 'accordion', 'active']);
    expect(accordionTokensFilter(token)).toBe(true);
  });

  it('should filter out "accordion" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'accordion', 'padding']);
    expect(accordionTokensFilter(token)).toBe(false);
  });

  it('should filter out "accordion" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'accordion', 'color']);
    expect(accordionTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "accordion"', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(accordionTokensFilter(token)).toBe(false);
  });

  it('should filter out unrelated component tokens', () => {
    const token = createToken(['button', 'background', 'primary']);
    expect(accordionTokensFilter(token)).toBe(false);
  });
});

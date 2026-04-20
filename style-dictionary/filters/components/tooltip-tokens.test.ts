import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('tooltip tokens filter', () => {
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
  const tooltipTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('tooltip');

  it('should include tokens where "tooltip" is the root namespace', () => {
    const token = createToken(['tooltip', 'background', 'color']);
    expect(tooltipTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "tooltip" appears exactly elsewhere in the path', () => {
    const token = createToken(['component', 'overlay', 'tooltip', 'padding']);
    expect(tooltipTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens that only partially match "tooltip"', () => {
    // Array.includes('tooltip') is false for 'tooltips' or 'tooltip-container'
    const tooltipsToken = createToken(['tooltips', 'margin']);
    const tooltipContainerToken = createToken(['tooltip-container', 'background']);

    expect(tooltipTokensFilter(tooltipsToken)).toBe(false);
    expect(tooltipTokensFilter(tooltipContainerToken)).toBe(false);
  });

  it('should filter out "tooltip" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'tooltip', 'delay']);
    expect(tooltipTokensFilter(token)).toBe(false);
  });

  it('should filter out "tooltip" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'tooltip', 'border-radius']);
    expect(tooltipTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "tooltip" at all', () => {
    const token = createToken(['popover', 'background', 'color']);
    expect(tooltipTokensFilter(token)).toBe(false);
  });
});

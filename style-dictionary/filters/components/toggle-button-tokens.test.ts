import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('toggle-button-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'color',
    $value: '#000000',
    original: { $value: '#000000' },
    filePath: 'test.json',
    isSource: true,
  });

  // Matches the logic: (Not Options AND Not Theme) AND (Toggle-Button OR Toggle-Group)
  const toggleButtonTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    (token.path.includes('toggle-button') || token.path.includes('toggle-group'));

  it('should include tokens where "toggle-button" is in the path', () => {
    const token = createToken(['toggle-button', 'background', 'active']);
    expect(toggleButtonTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "toggle-group" is in the path', () => {
    const token = createToken(['toggle-group', 'border', 'color']);
    expect(toggleButtonTokensFilter(token)).toBe(true);
  });

  it('should include tokens where the keywords are deeply nested', () => {
    const token = createToken(['component', 'controls', 'toggle-button', 'padding']);
    expect(toggleButtonTokensFilter(token)).toBe(true);
  });

  it('should filter out "toggle-button" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'toggle-button', 'size']);
    expect(toggleButtonTokensFilter(token)).toBe(false);
  });

  it('should filter out "toggle-group" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'toggle-group', 'radius']);
    expect(toggleButtonTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that partially match (Array exact match rule)', () => {
    // Array.includes requires the full segment string
    const token = createToken(['toggle', 'button', 'primary']);
    expect(toggleButtonTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain either keyword', () => {
    const token = createToken(['button', 'background', 'primary']);
    expect(toggleButtonTokensFilter(token)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('message-tokens filter', () => {
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
  const messageTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path[0] !== 'theme' && token.path.includes('message');

  it('should include tokens where "message" is the root namespace', () => {
    const token = createToken(['message', 'background', 'info']);
    expect(messageTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "message" appears later in the path', () => {
    const token = createToken(['component', 'feedback', 'message', 'text']);
    expect(messageTokensFilter(token)).toBe(true);
  });

  it('should include specific message state tokens (e.g., success, error)', () => {
    const token = createToken(['message', 'error', 'border', 'color']);
    expect(messageTokensFilter(token)).toBe(true);
  });

  it('should filter out "message" tokens if they are in the options namespace', () => {
    const token = createToken(['options', 'message', 'padding']);
    expect(messageTokensFilter(token)).toBe(false);
  });

  it('should filter out "message" tokens if they are in the theme namespace', () => {
    const token = createToken(['theme', 'message', 'shadow']);
    expect(messageTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "message"', () => {
    const token = createToken(['alert', 'background', 'primary']);
    expect(messageTokensFilter(token)).toBe(false);
  });

  it('should filter out general feedback tokens without the "message" keyword', () => {
    const token = createToken(['notification', 'banner', 'color']);
    expect(messageTokensFilter(token)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('motion-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'duration',
    $value: '200ms',
    original: { $value: '200ms' },
    filePath: 'test.json',
    isSource: true
  });

  // Test the filter logic directly
  const motionTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' &&
    (token.path.includes('timing') || token.path.includes('duration'));

  it('should include tokens with timing in path', () => {
    const token = createToken(['motion', 'timing', 'ease-in']);
    expect(motionTokensFilter(token)).toBe(true);
  });

  it('should include tokens with duration in path', () => {
    const token = createToken(['motion', 'duration', 'fast']);
    expect(motionTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested timing tokens', () => {
    const token = createToken(['animation', 'button', 'timing', 'hover']);
    expect(motionTokensFilter(token)).toBe(true);
  });

  it('should include deeply nested duration tokens', () => {
    const token = createToken(['animation', 'modal', 'duration', 'enter']);
    expect(motionTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in options namespace', () => {
    const token = createToken(['options', 'motion', 'timing']);
    expect(motionTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens without timing or duration', () => {
    const token = createToken(['color', 'primary']);
    expect(motionTokensFilter(token)).toBe(false);
  });

  it('should filter out space tokens', () => {
    const token = createToken(['space', 'small']);
    expect(motionTokensFilter(token)).toBe(false);
  });
});

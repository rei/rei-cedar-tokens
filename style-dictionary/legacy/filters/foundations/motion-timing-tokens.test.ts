import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-motion-timing-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'duration',
    $value: '200ms',
    original: { $value: '200ms' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsMotionTimingTokens
  const foundationsMotionTimingTokensFilter = (token: Token): boolean =>
    token.path[0] !== 'options' && token.path.includes('timing');

  it('should include tokens that contain "timing" in the path', () => {
    const token = createToken(['motion', 'timing', 'standard']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "timing" is at the end of the path', () => {
    const token = createToken(['foundations', 'motion', 'timing']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "timing" is the root', () => {
    const token = createToken(['timing', 'fast']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens in the options namespace even if they include "timing"', () => {
    const token = createToken(['options', 'motion', 'timing']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not include "timing"', () => {
    const token = createToken(['motion', 'duration', 'fast']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens from other namespaces without "timing"', () => {
    const token = createToken(['color', 'base', 'red']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(false);
  });

  it('should be case sensitive (following standard JS includes)', () => {
    // This confirms that "Timing" with a capital T would fail based on the current logic
    const token = createToken(['motion', 'Timing']);
    expect(foundationsMotionTimingTokensFilter(token)).toBe(false);
  });
});

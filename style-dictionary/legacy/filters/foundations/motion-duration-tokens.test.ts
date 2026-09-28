import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('foundations-motion-duration-tokens filter', () => {
  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'duration',
    $value: '300ms',
    original: { $value: '300ms' },
    filePath: 'test.json',
    isSource: true,
  });

  // The logic extracted from foundationsMotionDurationTokens
  const foundationsMotionDurationTokensFilter = (token: Token): boolean => {
    return token.path[0] !== 'options' && token.path[0] === 'duration';
  };

  it('should include tokens where "duration" is the root (index 0)', () => {
    const token = createToken(['duration', 'moderate', 'default']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens where "duration" is not at the root', () => {
    // Even if it's motion-related, the logic specifically checks path[0]
    const token = createToken(['motion', 'duration', 'moderate']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in the options namespace', () => {
    // Technically redundant because of the path[0] === 'duration' check,
    // but tests the logic as written.
    const token = createToken(['options', 'duration', 'slow']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(false);
  });

  it('should filter out unrelated tokens', () => {
    const token = createToken(['color', 'background', 'primary']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "duration" appears later in the path', () => {
    const token = createToken(['animation', 'fast', 'duration']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(false);
  });

  it('should handle single-level paths correctly', () => {
    const token = createToken(['duration']);
    expect(foundationsMotionDurationTokensFilter(token)).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

const SPACE_SCALE_RANGE_NAME_MAP: Record<string, string> = {
  CdrSpaceScale01: 'CdrSpaceScaleRange0To1',
  CdrSpaceScale34: 'CdrSpaceScaleRange3To4',
  CdrSpaceScale35: 'CdrSpaceScaleRange3To5',
};

const filter = (token: Token): boolean => token.name in SPACE_SCALE_RANGE_NAME_MAP;

const transform = (token: Token): string => SPACE_SCALE_RANGE_NAME_MAP[token.name] || token.name;

const createToken = (name: string): Token => ({
  name,
  path: ['global', 'space', 'scale'],
  $type: 'dimension',
  $value: '1rem',
  original: { $value: '1rem' },
  filePath: 'test.json',
  isSource: true,
});

describe('name/pascal-space-scale-range transform', () => {
  it('renames 0-1 range token name to explicit Range*To* form', () => {
    const token = createToken('CdrSpaceScale01');
    expect(filter(token)).toBe(true);
    expect(transform(token)).toBe('CdrSpaceScaleRange0To1');
  });

  it('renames 3-4 range token name to explicit Range*To* form', () => {
    const token = createToken('CdrSpaceScale34');
    expect(filter(token)).toBe(true);
    expect(transform(token)).toBe('CdrSpaceScaleRange3To4');
  });

  it('renames 3-5 range token name to explicit Range*To* form', () => {
    const token = createToken('CdrSpaceScale35');
    expect(filter(token)).toBe(true);
    expect(transform(token)).toBe('CdrSpaceScaleRange3To5');
  });

  it('does not modify unrelated space-scale token names', () => {
    const token = createToken('CdrSpaceScale3');
    expect(filter(token)).toBe(false);
    expect(transform(token)).toBe('CdrSpaceScale3');
  });
});

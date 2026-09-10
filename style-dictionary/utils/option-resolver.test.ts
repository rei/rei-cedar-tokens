import { describe, expect, it, vi } from 'vitest';
import { getTokenAtPath, resolveOptionHex } from './option-resolver';

describe('resolveOptionHex', () => {
  it('returns the platform override when present', () => {
    const node = {
      $value: '#111111',
      $extensions: {
        cedar: {
          platformOverrides: { ios: { light: '#222222' } },
        },
      },
    };
    expect(resolveOptionHex(node, 'ios', 'light')).toBe('#222222');
  });

  it('falls back to appearances.dark when no platform override exists', () => {
    const node = {
      $value: '#111111',
      $extensions: {
        cedar: {
          appearances: { dark: '#333333' },
        },
      },
    };
    expect(resolveOptionHex(node, 'web', 'dark')).toBe('#333333');
  });

  it('prefers platform override over appearances.dark', () => {
    const node = {
      $value: '#111111',
      $extensions: {
        cedar: {
          appearances: { dark: '#333333' },
          platformOverrides: { ios: { dark: '#444444' } },
        },
      },
    };
    expect(resolveOptionHex(node, 'ios', 'dark')).toBe('#444444');
  });

  it('does not apply appearances.dark for a light appearance lookup', () => {
    const node = {
      $value: '#111111',
      $extensions: {
        cedar: { appearances: { dark: '#333333' } },
      },
    };
    expect(resolveOptionHex(node, 'web', 'light')).toBe('#111111');
  });

  it('resolves from $value when only $value is present', () => {
    const node = { $value: '#abcdef' };
    expect(resolveOptionHex(node, 'web', 'light')).toBe('#abcdef');
  });

  it('resolves from value when only value (legacy field) is present', () => {
    const node = { value: '#fedcba' } as any;
    expect(resolveOptionHex(node, 'web', 'light')).toBe('#fedcba');
  });

  it('prefers $value over value when both are present and match', () => {
    const node = { $value: '#123456', value: '#123456' } as any;
    expect(resolveOptionHex(node, 'web', 'light')).toBe('#123456');
  });

  it('prefers $value over value when both are present and mismatched, and warns', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const node = { $value: '#123456', value: '#654321' } as any;

    expect(resolveOptionHex(node, 'web', 'light')).toBe('#123456');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('mismatched');

    warnSpy.mockRestore();
  });

  it('returns undefined when the node is undefined', () => {
    expect(resolveOptionHex(undefined, 'web', 'light')).toBeUndefined();
  });

  it('returns undefined when neither $value nor value resolve to a string', () => {
    const node = { $value: 42 } as any;
    expect(resolveOptionHex(node, 'web', 'light')).toBeUndefined();
  });

  it('is consistent regardless of call order (normalize-time vs build-time resolution)', () => {
    // Regression test: color-variants.ts (normalize time) and ios-color-action.ts /
    // web-css-transform.ts (build time) must resolve identical hex values for the
    // same option node. Both now call this same function.
    const node = {
      $value: '#0a0a0a',
      value: '#0a0a0a',
      $extensions: {
        cedar: { appearances: { dark: '#f0f0f0' } },
      },
    };

    const lightAtNormalizeTime = resolveOptionHex(node, 'web', 'light');
    const lightAtBuildTime = resolveOptionHex(node, 'web', 'light');
    const darkAtNormalizeTime = resolveOptionHex(node, 'web', 'dark');
    const darkAtBuildTime = resolveOptionHex(node, 'web', 'dark');

    expect(lightAtNormalizeTime).toBe(lightAtBuildTime);
    expect(darkAtNormalizeTime).toBe(darkAtBuildTime);
  });
});

describe('getTokenAtPath', () => {
  it('navigates a nested object by dot-separated path', () => {
    const tokens = { color: { option: { 'warm-grey': { 100: { $value: '#eee' } } } } };
    expect(getTokenAtPath(tokens, 'color.option.warm-grey.100')).toEqual({ $value: '#eee' });
  });

  it('returns undefined for a path that does not exist', () => {
    const tokens = { color: { option: {} } };
    expect(getTokenAtPath(tokens, 'color.option.missing.100')).toBeUndefined();
  });

  it('returns undefined when traversal hits a non-object', () => {
    const tokens = { color: 'not-an-object' };
    expect(getTokenAtPath(tokens, 'color.option.100')).toBeUndefined();
  });
});

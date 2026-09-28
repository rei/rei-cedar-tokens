import { describe, expect, it } from 'vitest';
import { iosColorsetFormatter } from './ios-colorset.js';

describe('iosColorsetFormatter', () => {
  it('formats light and dark display-p3 values into an Xcode colorset', () => {
    const result = JSON.parse(
      iosColorsetFormatter({
        name: 'textLink',
        value: {
          light: {
            'color-space': 'display-p3',
            components: {
              red: '0.0000',
              green: '0.1000',
              blue: '0.2000',
              alpha: '1.000',
            },
          },
          dark: {
            'color-space': 'display-p3',
            components: {
              red: '1.0000',
              green: '0.9000',
              blue: '0.8000',
              alpha: '1.000',
            },
          },
        },
      }),
    ) as {
      colors: Array<{ appearances?: Array<{ appearance: string; value: string }>; color: unknown }>;
    };

    expect(result.colors).toHaveLength(2);
    expect(result.colors[0].appearances).toBeUndefined();
    expect(result.colors[1].appearances).toEqual([{ appearance: 'luminosity', value: 'dark' }]);
  });

  it('throws when either light or dark value is missing', () => {
    expect(() =>
      iosColorsetFormatter({
        name: 'textLink',
        value: {
          light: {
            'color-space': 'display-p3',
            components: {
              red: '0.0000',
              green: '0.1000',
              blue: '0.2000',
              alpha: '1.000',
            },
          },
        },
      }),
    ).toThrow('Token textLink is missing light/dark P3 values.');
  });
});

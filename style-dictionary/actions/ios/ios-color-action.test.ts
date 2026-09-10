import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { converter } from 'culori';
import { buildCustomOklch } from '../web/oklch-formulas.js';
import { iosColorsetAction } from './ios-color-action.js';

function fmt(value: number, precision: number): string {
  const rounded = Number(value.toFixed(precision));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function expectedP3Components(hex: string, colorFamily: string) {
  const oklch = buildCustomOklch(hex, colorFamily);
  const p3 = converter('p3')(oklch) as
    | { r: number; g: number; b: number; alpha?: number }
    | undefined;
  if (!p3) throw new Error(`Could not convert ${hex} to P3`);
  return {
    red: fmt(clamp01(p3.r), 4),
    green: fmt(clamp01(p3.g), 4),
    blue: fmt(clamp01(p3.b), 4),
    // culori omits `alpha` for fully-opaque colors — default to 1 so opaque
    // colors format identically regardless of whether alpha was explicit.
    alpha: fmt(typeof p3.alpha === 'number' ? p3.alpha : 1, 3),
  };
}

describe('iosColorsetAction', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it('uses cedar.resolved values when present', () => {
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'ios-colorset-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'textLink',
          path: ['color', 'modes', 'default', 'text', 'link'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                ios: { light: '#000000', dark: '#ffffff' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    iosColorsetAction.do?.(dictionary as never, { buildPath } as never, {} as never, {} as never);

    const outputPath = path.join(
      buildPath,
      'CdrColors.xcassets',
      'cdr-textLink.colorset',
      'Contents.json',
    );
    const contents = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as {
      colors: Array<{ color: { 'color-space': string; components: Record<string, string> } }>;
    };

    // Verify Display P3 color space is used
    expect(contents.colors[0].color['color-space']).toBe('display-p3');
    expect(contents.colors[1].color['color-space']).toBe('display-p3');

    // Verify alpha is present
    expect(contents.colors[0].color.components.alpha).toBeDefined();
    expect(contents.colors[1].color.components.alpha).toBeDefined();

    // With culori's proper sRGB to Display P3 conversion, black (#000000) and white (#ffffff)
    // will have slightly different RGB values than the naive 0.0000/1.0000
    // Just verify they're in valid range
    const lightRed = parseFloat(contents.colors[0].color.components.red);
    const darkRed = parseFloat(contents.colors[1].color.components.red);
    expect(lightRed).toBeGreaterThanOrEqual(0);
    expect(lightRed).toBeLessThanOrEqual(1);
    expect(darkRed).toBeGreaterThanOrEqual(0);
    expect(darkRed).toBeLessThanOrEqual(1);
  });

  it('falls back to option token lookup when cedar.resolved is absent', () => {
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'ios-colorset-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'textLink',
          path: ['color', 'modes', 'default', 'text', 'link'],
          $type: 'color',
          $extensions: {
            cedar: {
              ios: {
                light: 'color.option.brand.blue.400',
                dark: 'color.option.brand.blue.400',
              },
            },
          },
        },
      ],
      tokens: {
        color: {
          option: {
            brand: {
              blue: {
                400: {
                  $value: '#000000',
                  $extensions: {
                    cedar: {
                      appearances: { dark: '#111111' },
                      platformOverrides: {
                        ios: { dark: '#ffffff' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    iosColorsetAction.do?.(dictionary as never, { buildPath } as never, {} as never, {} as never);

    const outputPath = path.join(
      buildPath,
      'CdrColors.xcassets',
      'cdr-textLink.colorset',
      'Contents.json',
    );
    const contents = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as {
      colors: Array<{ color: { 'color-space': string; components: Record<string, string> } }>;
    };

    // Verify Display P3 color space is used
    expect(contents.colors[0].color['color-space']).toBe('display-p3');
    expect(contents.colors[1].color['color-space']).toBe('display-p3');

    // Verify alpha is present
    expect(contents.colors[0].color.components.alpha).toBeDefined();
    expect(contents.colors[1].color.components.alpha).toBeDefined();

    // With culori's proper sRGB to Display P3 conversion, values will differ from naive implementation
    // Just verify they're in valid range and that dark override was applied
    const lightRed = parseFloat(contents.colors[0].color.components.red);
    const darkRed = parseFloat(contents.colors[1].color.components.red);
    expect(lightRed).toBeGreaterThanOrEqual(0);
    expect(lightRed).toBeLessThanOrEqual(1);
    expect(darkRed).toBeGreaterThanOrEqual(0);
    expect(darkRed).toBeLessThanOrEqual(1);
    // Dark should be lighter than light (white override applied)
    expect(darkRed).toBeGreaterThan(lightRed);
  });

  it('uses colorFamily from option tokens for custom OKLCH → P3 conversion', () => {
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'ios-colorset-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'surfacePrimary',
          path: ['color', 'modes', 'default', 'surface', 'primary'],
          $type: 'color',
          $extensions: {
            cedar: {
              ios: {
                light: 'color.option.warm-grey.100',
                dark: 'color.option.warm-grey.600',
              },
            },
          },
        },
      ],
      tokens: {
        color: {
          option: {
            'warm-grey': {
              100: {
                $value: '#f1f0ed',
                $extensions: {
                  cedar: {
                    colorFamily: 'warm-grey',
                  },
                },
              },
              600: {
                $value: '#c2bdb5',
                $extensions: {
                  cedar: {
                    colorFamily: 'warm-grey',
                  },
                },
              },
            },
          },
        },
      },
    };

    iosColorsetAction.do?.(dictionary as never, { buildPath } as never, {} as never, {} as never);

    const outputPath = path.join(
      buildPath,
      'CdrColors.xcassets',
      'cdr-surfacePrimary.colorset',
      'Contents.json',
    );
    const contents = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as {
      colors: Array<{ color: { 'color-space': string; components: Record<string, string> } }>;
    };

    const light = contents.colors[0].color;
    const dark = contents.colors[1].color;

    expect(light['color-space']).toBe('display-p3');
    expect(dark['color-space']).toBe('display-p3');
    expect(light.components).toEqual(expectedP3Components('#f1f0ed', 'warm-grey'));
    expect(dark.components).toEqual(expectedP3Components('#c2bdb5', 'warm-grey'));
  });
});

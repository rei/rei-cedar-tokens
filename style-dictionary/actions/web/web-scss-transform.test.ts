import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toScssValue, toScssVar, webScssAction } from './web-scss-transform.js';

describe('webScssAction', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    for (const dir of tempDirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it('warns when a semantic color category is unknown', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'accentBase',
          path: ['color', 'modes', 'default', 'accent', 'base'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                web: { light: '#111111', dark: '#222222' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('unknown semantic color category'),
    );
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('accent'));
  });

  it('writes SCSS variables to the foundations directory', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'actionPrimary',
          path: ['color', 'modes', 'default', 'action', 'primary'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                web: { light: '#406eb5', dark: '#0b2d60' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const textScss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-action.scss'),
      'utf8',
    );

    const hexDeclaration = '$cdr-action-primary: #406eb5;';
    const oklchDeclaration = '$cdr-action-primary: oklch(';

    expect(textScss).toContain(hexDeclaration);
    expect(textScss).toContain(oklchDeclaration);
    expect(textScss.indexOf(hexDeclaration)).toBeLessThan(textScss.indexOf(oklchDeclaration));
    expect(textScss).not.toContain(':root');
    expect(textScss).not.toContain('--cdr-');
  });

  it('preserves alpha from 8-digit hex in oklch declarations', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'graphicScrim',
          path: ['color', 'modes', 'default', 'graphic', 'scrim'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                web: { light: '#ffffffd9', dark: '#000000bf' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const surfaceScss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-graphik.scss'),
      'utf8',
    );

    expect(surfaceScss).toContain('$cdr-graphic-scrim: #ffffffd9;');
    expect(surfaceScss).toContain('$cdr-graphic-scrim: oklch(100% 0 0 / 0.851);');
  });

  it('throws when web option refs are missing', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'textBase',
          path: ['color', 'modes', 'default', 'text', 'base'],
          $type: 'color',
          $extensions: { cedar: {} },
        },
      ],
      tokens: {},
    };

    expect(() =>
      webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never),
    ).toThrow('missing $extensions.cedar.web.light');
  });

  it('throws when web option refs are not strings', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'textBase',
          path: ['color', 'modes', 'default', 'text', 'base'],
          $type: 'color',
          $extensions: {
            cedar: {
              web: {
                light: { bad: true },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    expect(() =>
      webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never),
    ).toThrow('missing $extensions.cedar.web.light');
  });

  it('resolves web option refs and writes hex declarations', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'actionPrimary',
          path: ['color', 'modes', 'default', 'action', 'primary'],
          $type: 'color',
          $extensions: {
            cedar: {
              web: {
                light: 'color.option.brand.blue.400',
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
                  $value: '#123456',
                },
              },
            },
          },
        },
      },
    };

    webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const textScss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-action.scss'),
      'utf8',
    );
    expect(textScss).toContain('$cdr-action-primary: #123456;');
  });

  it('removes generated color files on undo', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-scss-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'actionPrimary',
          path: ['color', 'modes', 'default', 'action', 'primary'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                web: { light: '#406eb5' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webScssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);
    expect(fs.existsSync(path.join(buildPath, 'foundations', 'cdr-color-action.scss'))).toBe(true);

    webScssAction.undo?.(dictionary as any, { buildPath } as any, {} as never, {} as never);
    expect(fs.existsSync(path.join(buildPath, 'foundations', 'cdr-color-action.scss'))).toBe(false);
  });

  describe('toScssValue', () => {
    it('rewrites token aliases to SCSS variable references', () => {
      expect(toScssValue('{text.size.fluid.400}')).toBe('$cdr-text-size-fluid-400');
    });

    it('rounds numbers to three decimals', () => {
      expect(toScssValue(-0.25600001215934753)).toBe('-0.256');
    });
  });

  describe('toScssVar', () => {
    it('strips the color modes default prefix', () => {
      expect(toScssVar(['color', 'modes', 'default', 'text', 'link'])).toBe('$cdr-text-link');
    });

    it('strips the top-level color segment', () => {
      expect(toScssVar(['color', 'text', 'link'])).toBe('$cdr-text-link');
    });

    it('strips the text/semantic segment', () => {
      expect(toScssVar(['text', 'semantic', 'size', '400'])).toBe('$cdr-text-size-400');
    });

    it('kebab-cases sub-properties', () => {
      expect(toScssVar(['color', 'text', 'link'], 'hoverColor')).toBe('$cdr-text-link-hover-color');
    });
  });
});

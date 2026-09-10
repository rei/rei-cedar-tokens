import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { webCssAction } from './web-css-transform.js';

describe('webCssAction', () => {
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
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
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

    webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('unknown semantic color category'),
    );
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('accent'));
  });

  it('writes color CSS files to the foundations directory', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'surfaceBase',
          path: ['color', 'modes', 'default', 'surface', 'base'],
          $type: 'color',
          $extensions: {
            cedar: {
              resolved: {
                web: { light: '#ffffff' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const surfaceCss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-surface.css'),
      'utf8',
    );
    expect(surfaceCss).toContain('--cdr-surface-base: #ffffff;');
    expect(surfaceCss).toContain('--cdr-surface-base: oklch(');
    expect(surfaceCss).toContain(':root {');
  });

  it('writes hex fallback before oklch color declarations', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
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
                web: { light: '#406eb5', dark: '#0b2d60' },
              },
            },
          },
        },
      ],
      tokens: {},
    };

    webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const lightTextCss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-text.css'),
      'utf8',
    );
    const hexDeclaration = '--cdr-text-link: #406eb5;';
    const oklchDeclaration = '--cdr-text-link: oklch(';

    expect(lightTextCss).toContain(hexDeclaration);
    expect(lightTextCss).toContain(oklchDeclaration);
    expect(lightTextCss.indexOf(hexDeclaration)).toBeLessThan(
      lightTextCss.indexOf(oklchDeclaration),
    );
  });

  it('preserves alpha from 8-digit hex in oklch declarations', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'surfaceScrim',
          path: ['color', 'modes', 'default', 'surface', 'scrim'],
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

    webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const lightSurfaceCss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-surface.css'),
      'utf8',
    );

    expect(lightSurfaceCss).toContain('--cdr-surface-scrim: #ffffffd9;');
    expect(lightSurfaceCss).toContain('--cdr-surface-scrim: oklch(100% 0 0 / 0.851);');
  });

  it('throws when web option refs are missing', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
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
      webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never),
    ).toThrow('missing $extensions.cedar.web.light');
  });

  it('throws when web option refs are not strings', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
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
                dark: 'color.option.brand.blue.600',
              },
            },
          },
        },
      ],
      tokens: {},
    };

    expect(() =>
      webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never),
    ).toThrow('missing $extensions.cedar.web.light');
  });

  it('resolves web option refs and writes hex declarations', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const buildPath = fs.mkdtempSync(path.join(os.tmpdir(), 'web-css-action-'));
    tempDirs.push(buildPath);

    const dictionary = {
      allTokens: [
        {
          name: 'textLink',
          path: ['color', 'modes', 'default', 'text', 'link'],
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

    webCssAction.do?.(dictionary as any, { buildPath } as any, {} as never, {} as never);

    const textCss = fs.readFileSync(
      path.join(buildPath, 'foundations', 'cdr-color-text.css'),
      'utf8',
    );
    expect(textCss).toContain('--cdr-text-link: #123456;');
  });
});

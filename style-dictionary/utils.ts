import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { Token } from 'style-dictionary';
import type { Theme, TokenTypes } from './constants';

export const getDirname = (filename: string | URL) => dirname(fileURLToPath(filename));

export const BASE_FONT_SIZE = 10;

/**
 * Converts pixel values to rem units based on a base font size.
 *
 * This utility function handles space-separated values (like CSS shorthand properties)
 * and converts each pixel value to rem. Zero values are returned as '0' without units.
 * Values already in rem are preserved.
 *
 * @param value - The value to convert (can be a single value or space-separated values)
 * @param baseFontSize - The base font size to use for conversion (default: BASE_FONT_SIZE)
 * @returns The converted value(s) in rem units
 *
 * @example
 * ```typescript
 * pxToRem('16px', 10) // Returns '1.6rem'
 * pxToRem('16px 32px', 10) // Returns '1.6rem 3.2rem'
 * pxToRem('0', 10) // Returns '0'
 * ```
 */
export const pxToRem = (value: string | number, baseFontSize: number = BASE_FONT_SIZE): string => {
  if (typeof value !== 'string') return String(value);

  const tokens = value.split(' ');
  const result = tokens.map((token) => {
    const parsedValue = parseFloat(token);

    if (parsedValue === 0 || !token) {
      return '0';
    }

    if (!token.includes('rem')) {
      const num = parseFloat(token) / baseFontSize;
      const unit = num !== 0 ? 'rem' : '';

      return `${num}${unit}`;
    }

    return token;
  });

  return result.join(' ');
};

export const commonConfig = (theme: Theme, platform: string) => ({
  prefix: 'cdr',
  buildPath: `dist/${theme}/${platform}/`,
  options: {
    showFileHeader: false
  }
});

export const filterSourceTokensAndType = (token: Token, type: TokenTypes | TokenTypes[]) => {
  const types = Array.isArray(type) ? type : [type];

  return (
    token.path[0] !== 'options' &&
    token.path[0] !== 'theme' &&
    token.$type !== undefined &&
    types.includes(token.$type)
  );
};

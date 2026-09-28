import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a transform for font family values in CSS/SCSS output.
 *
 * SD v4 output font family values with double-quoted names wrapped in single quotes:
 *   Graphik, '"Graphik fallback"', '"Helvetica Neue"', sans-serif
 * SD v5 outputs them with bare double quotes:
 *   Graphik, "Graphik fallback", "Helvetica Neue", sans-serif
 *
 * This transform restores the SD v4 behavior by wrapping double-quoted font names
 * in single quotes. Only applies to fontFamily tokens that contain double quotes.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const fontFamilyQuotes = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'fontFamily/css-quotes',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => {
      if (token.$type !== 'fontFamily') return false;
      return typeof token.$value === 'string' && token.$value.includes('"');
    },
    transform: (token: Token): string => {
      const val = token.$value;
      if (typeof val !== 'string') return val;
      // Wrap double-quoted font names in single quotes
      // e.g., "Graphik fallback" -> '"Graphik fallback"'
      return val.replace(/"([^"]+)"/g, '\'"$1"\'');
    },
  });
};

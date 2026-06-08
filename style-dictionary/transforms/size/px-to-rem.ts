import type StyleDictionary from 'style-dictionary';
import type { Token, Config } from 'style-dictionary';
import { BASE_FONT_SIZE, pxToRem } from '../../utils';

/**
 * Registers a transitive transform for converting px values to rem.
 *
 * This transform converts dimension and fontSize tokens from pixels to rem units,
 * enabling scalable, accessible typography and spacing. The transform:
 * - Excludes text-size-root and breakpoint tokens from conversion
 * - Handles dimension, fontSize, and expanded typography tokens with 'px' values
 * - Uses a configurable base font size (defaults to BASE_FONT_SIZE)
 * - Applies transitively through token references
 *
 * Configuration option:
 * - basePxFontSize: Override the default base font size for rem calculation
 *
 * @param sd - The Style Dictionary instance to register the transform with
 *
 * @example
 * // Input token:
 * // { $type: 'dimension', $value: '16px' }
 * // Output with BASE_FONT_SIZE=10: '1.6rem'
 */
export const pxToRemTransitive = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/px-to-rem-transitive',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => {
      // Exclude text-size-root and breakpoint tokens
      const tokenName = token.path.join('-');
      if (tokenName.includes('text-size-root') || tokenName.includes('breakpoint')) {
        return false;
      }

      // Include dimension, fontSize, and check if value contains 'px' for expanded typography tokens
      return (
        token.$type === 'dimension' ||
        token.$type === 'fontSize' ||
        (typeof token.$value === 'string' && token.$value.includes('px'))
      );
    },
    transform: (token: Token, config: Config): string => {
      const REM = config.basePxFontSize || BASE_FONT_SIZE;
      return pxToRem(token.$value, REM);
    },
  });
};

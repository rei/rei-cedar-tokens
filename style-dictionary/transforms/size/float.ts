import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a transform for converting dimension and font size tokens to float values.
 *
 * This transform converts numeric dimension and fontSize values to floating-point
 * format with the 'f' suffix, commonly used in iOS and other native platforms.
 * Values are rounded to one decimal place for precision.
 *
 * Applies to tokens with $type of 'dimension' or 'fontSize'.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 *
 * @example
 * // Input token:
 * // { $type: 'dimension', $value: '16' }
 * // Output: '16.0f'
 *
 * @example
 * // Input token:
 * // { $type: 'fontSize', $value: '14.5' }
 * // Output: '14.5f'
 */
export const float = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/float',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => token.$type === 'dimension' || token.$type === 'fontSize',
    transform: (token: Token): string => {
      const num = parseFloat(token.$value).toFixed(1);
      const unit = 'f';
      return `${num}${unit}`;
    }
  });
};

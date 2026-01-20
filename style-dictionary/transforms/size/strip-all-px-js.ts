import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a transform that strips 'px' units from token values for JavaScript output.
 *
 * This transform removes the 'px' suffix from token values, returning unitless numbers
 * suitable for JavaScript/TypeScript consumption. Tokens with 'Prominence' in their
 * name are excluded from this transformation.
 *
 * Useful for frameworks that accept numeric values and apply units internally,
 * or for calculations in JavaScript/TypeScript code.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const stripAllPxJs = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/strip-all-px-js',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => !token.name?.match('Prominence'),
    transform: (token: Token): string => {
      let cleanVal = token.$value;
      if (typeof token.$value === 'string' && token.$value.endsWith('px')) {
        cleanVal = token.$value.slice(0, -2);
      }
      return cleanVal;
    }
  });
};

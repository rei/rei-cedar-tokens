import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a transform that strips 'px' units from all token values.
 *
 * This transform removes the 'px' suffix from all token values without any filtering,
 * returning unitless numbers. Unlike strip-all-px-js, this applies to all tokens
 * regardless of their name or type.
 *
 * Useful for platforms or frameworks that require numeric values without units,
 * or when the unit context is implied by the platform.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const stripAllPx = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/strip-all-px',
    type: 'value',
    transitive: true,
    transform: (token: Token): string => {
      let cleanVal = token.$value;
      if (typeof token.$value === 'string' && token.$value.endsWith('px')) {
        cleanVal = token.$value.slice(0, -2);
      }
      return cleanVal;
    }
  });
};

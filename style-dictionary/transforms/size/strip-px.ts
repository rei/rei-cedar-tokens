import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a selective transform that strips 'px' units based on token type.
 *
 * This transform removes the 'px' suffix from token values, but excludes certain
 * token types that should retain their pixel units:
 * - breakpoint tokens: Preserved for media query values
 * - letterSpacing tokens: Preserved for precise typography control
 *
 * All other token types will have 'px' units removed if present.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const stripPx = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/strip-px',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => {
      let shouldStrip: boolean;
      switch (token.$type) {
        case 'breakpoint':
          shouldStrip = false;
          break;
        case 'letterSpacing':
          shouldStrip = false;
          break;
        default:
          shouldStrip = true;
          break;
      }
      return shouldStrip;
    },
    transform: (token: Token): string => {
      let cleanVal = token.$value;
      if (typeof token.$value === 'string' && token.$value.endsWith('px')) {
        cleanVal = token.$value.slice(0, -2);
      }
      return cleanVal;
    }
  });
};

import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a CSS clamp() value transform for responsive design tokens.
 *
 * This transform converts clamp-type tokens into CSS clamp() function strings,
 * which enable fluid, responsive values that scale between minimum and maximum
 * values based on an ideal viewport-relative size.
 *
 * The transform expects tokens with $type 'clamp' and a $value object containing:
 * - min: Minimum value (used at smallest viewport)
 * - ideal: Preferred value (typically viewport-relative)
 * - max: Maximum value (used at largest viewport)
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const cssClamp = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'value/clamp',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => token.$type === 'clamp',
    transform: (token: Token): string => {
      const v = token.$value ?? token.value;

      if (typeof v === 'string') return v;

      const { min, ideal, max } = v || {};
      if (!min || !ideal || !max) {
        throw new Error(`Clamp token ${token.name} must have min, ideal, and max values.`);
      }

      return `clamp(${min}, ${ideal}, ${max})`;
    },
  });
};

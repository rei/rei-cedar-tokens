import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Extended Token interface that includes spacingModifier for space calculations.
 */
interface SpaceToken extends Token {
  spacingModifier?: number;
}

/**
 * Registers a transform for spacing tokens with modifiers for CSS/style output.
 *
 * This transform applies a spacing modifier to dimension tokens, outputting the
 * result as a floating-point number with one decimal place. The modifier is
 * multiplied by the base value to calculate the final spacing value.
 *
 * Only applies to dimension tokens that have a spacingModifier attribute.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const space = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/space',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean =>
      token.$type === 'dimension' && !!(token as SpaceToken).spacingModifier,
    transform: (token: Token): string => {
      const { $value, spacingModifier } = token as SpaceToken;
      const num = (parseFloat($value) * (spacingModifier || 1)).toFixed(1);
      return num;
    },
  });
};

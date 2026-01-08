import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only radius tokens.
 *
 * This filter includes tokens that are in the 'radius' namespace while
 * excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const radiusTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'radius-tokens',
    filter: (token: Token) => token.path[0] !== 'options' && token.path[0] === 'radius'
  });
};

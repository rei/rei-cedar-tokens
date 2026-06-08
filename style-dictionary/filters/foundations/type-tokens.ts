import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that match only type tokens.
 *
 * This filter includes tokens that match 'type' in their path,
 * while excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsTypeTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-type-tokens',
    filter: (token: Token) => token.path[0] !== 'options' && token.path[0] === 'type',
  });
};

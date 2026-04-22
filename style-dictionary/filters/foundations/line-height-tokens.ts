import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only Line height tokens.
 *
 * This filter includes tokens that match 'line-height' in their path,
 * while excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsLineHeightTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-line-height-tokens',
    filter: (token: Token) => token.path[0] !== 'options' && token.path[0] === 'line-height',
  });
};

import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that removes source tokens from the output.
 *
 * This filter excludes tokens that are part of the 'options' or 'theme' namespaces,
 * which are typically used internally for configuration and theming but should not
 * be included in the final token output.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const removeSourceTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'remove-source-tokens',
    filter: (token: Token) => token.path[0] !== 'options' && token.path[0] !== 'theme',
  });
};

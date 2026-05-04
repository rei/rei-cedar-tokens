import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only icon size tokens.
 *
 * This filter includes tokens that are in the 'icon' namespace while
 * excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsSpaceIconTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-space-icon-tokens',
    filter: (token: Token) => token.path[0] !== 'options' && token.path[0] === 'icon',
  });
};

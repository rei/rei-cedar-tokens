import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only membership subtle tokens.
 *
 * This filter includes tokens that are in the 'membership.subtle' namespace,
 * which contains subtle-styled membership-related design tokens.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const membershipSubtleTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'membership-subtle-tokens',
    filter: (token: Token) => token.path[0] === 'membership' && token.path[1] === 'subtle'
  });
};

import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only font size tokens.
 *
 * This filter includes tokens that are in the 'text' namespace with "font-size" related paths,
 * as well as the top-level 'text-size-root' token. Tokens in the 'options' namespace are excluded.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsTextSizeTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-text-size-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      (token.path[0] === 'text-size-root' ||
        (token.path[0].includes('text') && token.path.includes('size'))),
  });
};

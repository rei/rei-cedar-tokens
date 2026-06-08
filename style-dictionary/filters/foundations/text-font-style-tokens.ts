import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only text style tokens.
 *
 * This filter includes tokens in the 'text' namespace where the path contains 'style',
 * 'variation' (e.g. font-variation-settings for italic), or 'textTransform' (e.g. text-transform
 * for eyebrow). Tokens in the 'options' namespace are excluded.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsTextStyleTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-text-style-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      token.path[0].includes('text') &&
      (token.path.includes('style') ||
        token.path.includes('variation') ||
        token.path.includes('transform')),
  });
};

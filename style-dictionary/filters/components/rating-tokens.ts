import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only Rating tokens.
 *
 * This filter includes tokens in the rating or rating-star namespace
 * excluding tokens from the 'options' and 'theme' namespaces, which are typically
 * used internally for configuration and theming.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const componentRatingTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'component-rating-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      (token.path.includes('rating') || token.path.includes('rating-star')),
  });
};

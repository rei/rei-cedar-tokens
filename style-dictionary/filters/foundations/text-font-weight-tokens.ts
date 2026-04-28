import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only font weight tokens.
 *
 * This filter includes tokens that are in the 'text' namespace including only "font-weight" related, while
 * excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsTextFontWeightTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-text-font-weight-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      token.path[0].includes('text') &&
      token.path.includes('fontWeight'),
  });
};

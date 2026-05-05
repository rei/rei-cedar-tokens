import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only text tokens.
 *
 * This filter includes tokens that are in the 'text' namespace while
 * excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsTextTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-text-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      (token.path[0].includes('text-default') ||
        token.path[0].includes('text-eyebrow') ||
        token.path[0].includes('text-heading') ||
        token.path[0].includes('text-body') ||
        token.path[0].includes('text-subheading') ||
        token.path[0].includes('text-utility')) &&
      !token.path.includes('fontSize') &&
      !token.path.includes('fontFamily') &&
      !token.path.includes('lineHeight') &&
      !token.path.includes('fontStyle') &&
      !token.path.includes('letterSpacing') &&
      !token.path.includes('fontWeight') &&
      !token.path.includes('family') &&
      !token.path.includes('size') &&
      !token.path.includes('style') &&
      !token.path.includes('weight'),
  });
};

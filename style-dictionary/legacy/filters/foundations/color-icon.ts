import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only color icon tokens.
 *
 * This filter includes legacy icon tokens and the universal semantic icon tokens
 * while excluding tokens from the 'options' and 'theme' namespaces, which are
 * typically used internally for configuration and theming.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsColorIconsTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-color-icon-tokens',
    filter: (token: Token) => {
      const iconTokens = [
        // Legacy foundations
        'default',
        'emphasis',
        'link',
        'disabled',
        // Universal semantic foundations
        'accent',
        'brand',
        'membership',
        'natural',
        'sale',
      ];

      return (
        token.path[0] !== 'options' &&
        token.path[0] !== 'theme' &&
        token.path[0] === 'color' &&
        token.path[1] === 'icon' &&
        iconTokens.includes(token.path[2])
      );
    },
  });
};

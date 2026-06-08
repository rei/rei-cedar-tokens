import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that removes specific token categories.
 *
 * This filter excludes:
 * - Color tokens with subcategories: background, radius, icon, text, border
 * - Top-level categories: space, radius, icon, text, text-size-root, border, prominence, duration, timing, form
 * - Tokens in the 'options' and 'theme' namespaces
 *
 * Use this filter to generate a token output that excludes commonly separated
 * token categories that are typically exported as individual files.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const removeCategoriesTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'remove-categories-tokens',
    filter: (token: Token) => {
      const colorSubcategoriesToFilter = ['background', 'radius', 'icon', 'text', 'border'];
      const categoriesToFilter = [
        'space',
        'radius',
        'icon',
        'text',
        'text-size-root',
        'border',
        'prominence',
        'duration',
        'timing',
        'form',
      ];

      if (
        (token.path[0] === 'color' && colorSubcategoriesToFilter.includes(token.path[1])) ||
        categoriesToFilter.includes(token.path[0])
      ) {
        return false;
      }

      return token.path[0] !== 'options' && token.path[0] !== 'theme';
    },
  });
};

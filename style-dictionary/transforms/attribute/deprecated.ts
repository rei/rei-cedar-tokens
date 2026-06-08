import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom attribute transform for handling deprecated tokens.
 *
 * This transform processes tokens with a 'deprecated-YYYY-RX' prefix in their path:
 * - Extracts the deprecation year and release information from the token path
 * - Removes the deprecation prefix from the token path
 * - Adds metadata attributes for deprecated status, year, and release
 *
 * Token naming convention: `deprecated-YYYY-RX.rest.of.token.path`
 * - YYYY: Four-digit deprecation year (e.g., 2024)
 * - RX: Release identifier (e.g., R1, R2)
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const deprecated = (sd: typeof StyleDictionary) => {
  sd.registerTransform({
    name: 'attribute/deprecated',
    type: 'attribute',
    transform: (token: Token): Record<string, unknown> => {
      if (token.path[0].includes('deprecated')) {
        const [, year, release] = token.path[0].split('-');
        // Intentionally replaces token.path so the name transform
        // generates clean variable names without the deprecated prefix.
        // This must run before any name transforms (see build.ts ordering comment).
        token.path = token.path.slice(1);

        return {
          deprecated: true,
          'deprecated-year': year,
          'deprecated-release': release,
        };
      }

      return { deprecated: false };
    },
  });
};

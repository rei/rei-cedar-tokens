import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only color surface tokens.
 *
 * This filter includes the surface-specific tokens found in `surface.json`:
 * - `color.background.surface.*` — surface background colors
 * - `color.border.surface.*` — surface border colors
 *
 * Tokens from the 'options' and 'theme' namespaces are excluded.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsColorSurfaceTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'foundations-color-surface-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      token.path[0] !== 'theme' &&
      token.path[0] === 'color' &&
      token.path[2] === 'surface' &&
      (token.filePath as string).endsWith('surface.json'),
  });
};

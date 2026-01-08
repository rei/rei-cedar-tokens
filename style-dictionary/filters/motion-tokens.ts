import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a custom Style Dictionary filter that includes only motion tokens.
 *
 * This filter includes tokens that contain 'timing' or 'duration' in their path,
 * while excluding tokens from the 'options' namespace, which is typically
 * used internally for configuration.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const motionTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: 'motion-tokens',
    filter: (token: Token) =>
      token.path[0] !== 'options' &&
      (token.path.includes('timing') || token.path.includes('duration'))
  });
};

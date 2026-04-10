import type StyleDictionary from "style-dictionary";
import type { Token } from "style-dictionary";

/**
 * Registers a custom Style Dictionary filter that includes only membership vibrant tokens.
 *
 * This filter includes tokens that are in the 'membership.vibrant' namespace,
 * which contains vibrant-styled membership-related design tokens.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const membershipVibrantTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: "membership-vibrant-tokens",
    filter: (token: Token) =>
      token.path[0] === "membership" && token.path[1] === "vibrant",
  });
};

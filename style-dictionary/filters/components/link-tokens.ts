import type StyleDictionary from "style-dictionary";
import type { Token } from "style-dictionary";

/**
 * Registers a custom Style Dictionary filter that includes only Accordion tokens.
 *
 * This filter includes tokens that are that include link namespace while
 * excluding tokens from the 'options' and 'theme' namespaces, which are typically
 * used internally for configuration and theming.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const componentLinkTokens = (sd: typeof StyleDictionary): void => {
  sd.registerFilter({
    name: "component-link-tokens",
    filter: (token: Token) =>
      token.path[0] !== "options" &&
      token.path[0] !== "theme" &&
      token.path.includes("link"),
  });
};

import type StyleDictionary from "style-dictionary";
import type { Token } from "style-dictionary";

/**
 * Registers a custom Style Dictionary filter that includes only color border tokens.
 *
 * This filter includes tokens that are in the 'color.border' namespace while
 * excluding tokens from the 'options' and 'theme' namespaces, which are typically
 * used internally for configuration and theming.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsColorBorderTokens = (
  sd: typeof StyleDictionary,
): void => {
  sd.registerFilter({
    name: "foundations-color-border-tokens",
    filter: (token: Token) => {
      const borderTokens = [
        "transparent",
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
      ];

      return (
        token.path[0] !== "options" &&
        token.path[0] !== "theme" &&
        token.path[0] === "color" &&
        token.path[1] === "border" &&
        borderTokens.includes(token.path[2])
      );
    },
  });
};

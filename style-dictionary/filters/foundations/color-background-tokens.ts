import type StyleDictionary from "style-dictionary";
import type { Token } from "style-dictionary";

/**
 * Registers a custom Style Dictionary filter that includes only color background tokens.
 *
 * This filter includes tokens that are in the 'color.background' namespace while
 * excluding tokens from the 'options' and 'theme' namespaces, which are typically
 * used internally for configuration and theming.
 *
 * @param sd - The Style Dictionary instance to register the filter with
 */
export const foundationsColorBackgroundTokens = (
  sd: typeof StyleDictionary,
): void => {
  sd.registerFilter({
    name: "foundations-color-background-tokens",
    filter: (token: Token) => {
      const colorTokens = [
        "transparent",
        "primary",
        "secondary",
        "sale",
        "brand-spruce",
        "success",
        "info",
        "warning",
        "error",
      ];

      return (
        token.path[0] !== "options" &&
        token.path[0] !== "theme" &&
        token.path[0] === "color" &&
        token.path[1] === "background" &&
        colorTokens.includes(token.path[2])
      );
    },
  });
};

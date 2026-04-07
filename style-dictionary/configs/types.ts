import type { PlatformConfig } from "style-dictionary/types";
import type { Theme } from "../constants";
import { getTokenModules } from "../token-modules";
import { commonConfig } from "../utils";

export const types = (theme: Theme): PlatformConfig => ({
  types: {
    ...commonConfig(theme, "types"),
    transforms: [
      "attribute/deprecated",
      "name/pascal",
      "size/strip-all-px-js",
      "size/space-js",
      "value/clamp",
    ],
    files: getTokenModules(theme, "types").flatMap((tokenModule) => [
      {
        destination: `${tokenModule.responsibility}/${tokenModule.name}.mjs`,
        format: "typescript/module-values",
        filter: tokenModule.filter,
      },
      {
        destination: `${tokenModule.responsibility}/${tokenModule.name}.d.ts`,
        format: "typescript/module-interface",
        filter: tokenModule.filter,
      },
      {
        destination: `${tokenModule.responsibility}/${tokenModule.name}.names.d.ts`,
        format: "typescript/token-name-union",
        filter: tokenModule.filter,
      },
    ]),
  },
});

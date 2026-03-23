import type StyleDictionary from "style-dictionary";
import type { FormatFnArguments } from "style-dictionary/types";
import { getModuleTypeName, getValueName } from "./typescript-module-utils";

export const typescriptModuleDeclarations = (
  sd: typeof StyleDictionary,
): void => {
  sd.registerFormat({
    name: "typescript/module-interface",
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const moduleInterfaceName = getModuleTypeName(file?.destination);
      const valueName = getValueName(file?.destination);
      const tokenNames = dictionary.allTokens
        .map((token) => token.name)
        .sort((left, right) => left.localeCompare(right));

      return [
        `export interface ${moduleInterfaceName} {`,
        ...tokenNames.map((tokenName) => `  readonly ${tokenName}: string;`),
        "}",
        "",
        `export declare const ${valueName}: ${moduleInterfaceName};`,
        "",
        `export default ${valueName};`,
      ].join("\n");
    },
  });
};

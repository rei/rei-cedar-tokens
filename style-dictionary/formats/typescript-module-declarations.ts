import type StyleDictionary from "style-dictionary";
import type {
  FormatFnArguments,
  TransformedToken,
} from "style-dictionary/types";
import { getModuleTypeName, getValueName } from "./typescript-module-utils";

type TokenDescription = string | Record<string, string | string[]>;

const formatJSDoc = (description?: TokenDescription): string => {
  if (!description) return "";

  let lines: string[] = [];

  if (typeof description === "string") {
    lines.push(`   * ${description}`);
  } else if (typeof description === "object" && description !== null) {
    const keyMap: Record<string, string> = {
      what: "usage",
      when: "design",
    };

    lines = Object.entries(description).map(([key, val]) => {
      const mappedKey = keyMap[key] || key;
      const formattedValue = Array.isArray(val) ? val.join(", ") : val;
      return `   * @${mappedKey} ${formattedValue}`;
    });
  }

  return ["  /**", ...lines, "   */"].join("\n");
};

export const typescriptModuleDeclarations = (
  sd: typeof StyleDictionary,
): void => {
  sd.registerFormat({
    name: "typescript/module-interface",
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const moduleInterfaceName = getModuleTypeName(file?.destination);
      const valueName = getValueName(file?.destination);

      const sortedTokens = [...dictionary.allTokens].sort((left, right) =>
        left.name.localeCompare(right.name),
      );

      const interfaceMembers = sortedTokens.map((token: TransformedToken) => {
        const description =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (token as any).original?.docs?.description ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (token as any).docs?.description;

        const jsDoc = formatJSDoc(description);
        const declaration = `  readonly ${token.name}: string;`;

        return jsDoc ? `${jsDoc}\n${declaration}` : declaration;
      });

      return [
        `export interface ${moduleInterfaceName} {`,
        ...interfaceMembers,
        "}",
        "",
        `export declare const ${valueName}: ${moduleInterfaceName};`,
        "",
        `export default ${valueName};`,
      ].join("\n");
    },
  });
};

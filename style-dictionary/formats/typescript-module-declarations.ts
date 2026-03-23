import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments } from 'style-dictionary/types';
import { getModuleTypeName, getValueName } from './typescript-module-utils';

export const typescriptModuleDeclarations = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'typescript/cdr-module-declarations',
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const moduleTypeName = getModuleTypeName(file?.destination);
      const valueName = getValueName(file?.destination);

      return [
        `export declare const ${valueName}: {`,
        ...dictionary.allTokens
          .map((token) => token.name)
          .sort((left, right) => left.localeCompare(right))
          .map((tokenName) => `  readonly ${tokenName}: string;`),
        '};',
        '',
        `export type ${moduleTypeName} = typeof ${valueName};`,
        '',
        `export default ${valueName};`
      ].join('\n');
    }
  });
};

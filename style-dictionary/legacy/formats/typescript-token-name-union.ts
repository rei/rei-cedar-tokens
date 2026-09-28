import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments } from 'style-dictionary/types';
import { getModuleTokenNameTypeName } from './typescript-module-utils';

export const typescriptTokenNameUnion = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'typescript/token-name-union',
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const unionName = getModuleTokenNameTypeName(file?.destination);
      const tokenNames = dictionary.allTokens
        .map((token) => token.name)
        .sort((left, right) => left.localeCompare(right));

      return [
        `export type ${unionName} =`,
        ...tokenNames.map((tokenName, index) => {
          const suffix = index === tokenNames.length - 1 ? ';' : '';
          return `  | ${JSON.stringify(tokenName)}${suffix}`;
        }),
        '',
      ].join('\n');
    },
  });
};

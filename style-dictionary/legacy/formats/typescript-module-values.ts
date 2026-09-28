import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments } from 'style-dictionary/types';
import { getValueName } from './typescript-module-utils';

export const typescriptModuleValues = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'typescript/module-values',
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const valueName = getValueName(file?.destination).split('.');
      const tokenEntries = dictionary.allTokens
        .map((token) => [token.name, token.$value] as const)
        .sort(([left], [right]) => left.localeCompare(right));

      const lines = [`export const ${valueName[0]} = {`];

      for (const [tokenName, tokenValue] of tokenEntries) {
        lines.push(`  ${tokenName}: ${JSON.stringify(tokenValue)},`);
      }

      lines.push('};', '', `export default ${valueName[0]};`);

      return lines.join('\n');
    },
  });
};

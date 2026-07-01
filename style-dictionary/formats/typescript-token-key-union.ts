import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments } from 'style-dictionary/types';
import { getModuleBaseName, toPascalCase } from './typescript-module-utils';

/**
 * Derives the module prefix to strip from each token name.
 *
 * For a file destination of `foundations/cdr-space-scale.keys.d.ts`,
 * the base name is `cdr-space-scale`, so the PascalCase prefix to strip
 * is `CdrSpaceScale`.
 */
function getModulePrefix(destination?: string): string {
  // getModuleBaseName strips .names.d.ts → keep parity for .keys.d.ts
  const base = getModuleBaseName(destination);
  return toPascalCase(base);
}

/**
 * Converts a PascalCase token name to a kebab-case semantic key by stripping
 * the module prefix.
 *
 * Examples:
 *   CdrBreakpointLg  (prefix: CdrBreakpoint) → "lg"
 *   CdrSpaceOneX     (prefix: CdrSpace)       → "one-x"
 *   CdrRadiusSoft    (prefix: CdrRadius)       → "soft"
 *   CdrSpaceScale0   (prefix: CdrSpaceScale)   → "0"
 */
function toSemanticKey(tokenName: string, prefix: string): string {
  const withoutPrefix = tokenName.startsWith(prefix) ? tokenName.slice(prefix.length) : tokenName;
  // Convert PascalCase remainder to kebab-case
  return withoutPrefix
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // handle consecutive caps: "TwoX" → "Two-X"
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // standard boundary: "OneX" → "One-X"
    .toLowerCase();
}

/**
 * Registers a TypeScript token semantic key union format for Style Dictionary.
 *
 * Emits a `.keys.d.ts` file per module with a kebab-case key union.
 * These keys are stripped of the module prefix and represent the semantic
 * identifier for the token within its module.
 *
 * Example output (cdr-breakpoint.keys.d.ts):
 *   export type CdrBreakpointKey = "lg" | "md" | "sm" | "xs";
 *
 * Consumers use these unions to:
 *   - drive responsive class generation without hardcoding key lists
 *   - validate token key strings at compile time
 *   - map from semantic attribute values to token lookups
 */
export const typescriptTokenKeyUnion = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'typescript/token-key-union',
    format: ({ dictionary, file }: FormatFnArguments): string => {
      const prefix = getModulePrefix(file?.destination);
      const moduleName = prefix; // e.g. "CdrBreakpoint"
      const unionTypeName = `${moduleName}Key`;
      const arrayName = `${moduleName}Keys`;

      const keys = dictionary.allTokens
        .map((token) => toSemanticKey(token.name, prefix))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      const uniqueKeys = [...new Set(keys)];

      if (file?.destination?.endsWith('.mjs')) {
        return [
          `export const ${arrayName} = [`,
          ...uniqueKeys.map((key) => `  ${JSON.stringify(key)},`),
          `];`,
          '',
        ].join('\n');
      }

      return [
        `export declare const ${arrayName}: readonly [`,
        ...uniqueKeys.map((key, index) => {
          const suffix = index === uniqueKeys.length - 1 ? '' : ',';
          return `  ${JSON.stringify(key)}${suffix}`;
        }),
        `];`,
        `export type ${unionTypeName} =`,
        ...uniqueKeys.map((key, index) => {
          const suffix = index === uniqueKeys.length - 1 ? ';' : '';
          return `  | ${JSON.stringify(key)}${suffix}`;
        }),
        '',
      ].join('\n');
    },
  });
};

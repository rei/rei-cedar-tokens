import type StyleDictionary from 'style-dictionary';
import type {
  FormatFnArguments,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary/types';
import _ from 'lodash';
import { registerDeepMixin } from './utils';

// Register the custom lodash mixin
registerDeepMixin();

/**
 * Recursively removes specified keys from an object.
 * Replaces @divriots/style-dictionary-to-figma cleanMeta (abandoned package).
 */
function cleanMeta(
  obj: Record<string, unknown>,
  opts?: { cleanMeta?: string[] | boolean },
): Record<string, unknown> {
  const cleanMetaOpts = opts?.cleanMeta;
  if (!cleanMetaOpts) return obj;

  const keys: string[] = Array.isArray(cleanMetaOpts)
    ? cleanMetaOpts
    : ['filePath', 'isSource', 'original', 'attributes', 'path'];

  if (typeof obj !== 'object' || obj === null) return obj;

  return Object.keys(obj)
    .filter((k) => !keys.includes(k))
    .reduce(
      (acc, x) =>
        Object.assign(acc, {
          [x]: cleanMeta(obj[x] as Record<string, unknown>, { cleanMeta: keys }),
        }),
      {} as Record<string, unknown>,
    );
}

/**
 * Checks if a token path indicates it's inside options.font or options.space.
 * These tokens were plain values (not DTCG) in SD v4, so the old figma format
 * output them as flat strings/numbers rather than objects with $value/$type.
 */
function isFlatToken(token: TransformedToken): boolean {
  const path = token.path || [];
  return path[0] === 'options' && (path[1] === 'font' || path[1] === 'space');
}

/**
 * Registers a custom Figma format for Style Dictionary.
 *
 * This format outputs tokens in a Figma-compatible JSON structure while:
 * - Preserving original token reference values
 * - Removing 'options.' prefix from references
 * - Cleaning unnecessary metadata properties
 * - Including descriptions and file paths when available
 *
 * @param sd - The Style Dictionary instance to register the format with
 */
export const figma = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'figma',
    format: ({ dictionary }: FormatFnArguments): string => {
      const propsToRemove = [
        'isSource',
        'attributes',
        'path',
        'docs',
        'newToken',
        'name',
        'docCategory',
        'docExample',
      ];

      /**
       * Recursively processes tokens for the figma output.
       * - For tokens inside options.font/options.space: output flat resolved values
       * - For all other tokens: output objects with $value (resolved), $type, filePath
       */
      const preserveReferences = (tokens: TransformedTokens): Record<string, unknown> => {
        return _.deep(tokens, (obj) => {
          return _.mapValues(obj, (value: TransformedToken | TransformedTokens) => {
            // Check if this is a TransformedToken (has 'original' property)
            if (
              typeof value === 'object' &&
              value !== null &&
              'original' in value &&
              value.original?.$value !== undefined
            ) {
              const token = value as TransformedToken;

              // Tokens inside options.font or options.space were plain values in SD v4.
              // Output them as flat values to match the old figma format.
              // For tokens with references: use resolved $value
              // For simple tokens: use original $value (avoids px→rem transform)
              if (isFlatToken(token)) {
                const origVal = token.original?.$value;
                if (typeof origVal === 'string' && origVal.includes('{')) {
                  return token.$value;
                }
                return origVal ?? token.$value;
              }

              // All other tokens: output as objects with unresolved reference from original.$value.
              // This preserves the reference syntax (e.g., "{color.warm-grey-010}") matching old behavior.
              // Use original.$value with 'options.' prefix removed.
              // For composite values (multiple references), add '.$value' to each reference
              // to match the old SD v4 source format.
              let origVal = token.original?.$value;
              if (typeof origVal === 'string') {
                origVal = origVal.replace('options.', '');
                // Add .$value to references in composite values (multiple refs separated by spaces)
                if (origVal.includes('} {')) {
                  origVal = origVal.replace(/\{([^}]+)\}/g, (match, ref) => {
                    return ref.includes('.$value') ? match : `{$ref.$value}`.replace('$ref', ref);
                  });
                }
              }
              // Clean original for clamp tokens: remove 'key' that SD v5 adds
              let cleanOriginal: Record<string, unknown> | undefined;
              if (token.$type === 'clamp' && token.original) {
                const { key: _origKey, ...rest } = token.original as Record<string, unknown>;
                void _origKey;
                cleanOriginal = rest;
              }

              return {
                $value: origVal,
                $type: token.$type,
                // Preserve filePath before original (matches old figma output order)
                ...(token.filePath && { filePath: token.filePath }),
                // Preserve original for clamp tokens (matches old figma output)
                ...(token.$type === 'clamp' && cleanOriginal && { original: cleanOriginal }),
                ...(token.original?.$description && {
                  $description: token.original.$description,
                }),
              };
            }
            return value;
          });
        });
      };

      // First preserve references, then clean metadata
      const transformedTokens = cleanMeta(preserveReferences(dictionary.tokens), {
        cleanMeta: propsToRemove,
      });

      return JSON.stringify(transformedTokens, null, 2);
    },
  });
};

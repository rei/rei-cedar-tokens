import type StyleDictionary from 'style-dictionary';
import type {
  FormatFnArguments,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary/types';
import _ from 'lodash';
import { cleanMeta } from '@divriots/style-dictionary-to-figma';
import { registerDeepMixin } from './utils';

// Register the custom lodash mixin
registerDeepMixin();

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
       * Recursively preserves original token references in the token structure.
       * Transforms tokens to maintain reference values instead of resolved values.
       *
       * @param tokens - The token dictionary to transform
       * @returns Transformed tokens with preserved references
       */
      const preserveReferences = (tokens: TransformedTokens): Record<string, unknown> => {
        return _.deep(tokens, (obj) => {
          return _.mapValues(obj, (value: TransformedToken | TransformedTokens) => {
            // Check if this is a TransformedToken (has 'original' property)
            if (
              typeof value === 'object' &&
              value !== null &&
              'original' in value &&
              value.original?.$value &&
              typeof value.original.$value === 'string'
            ) {
              // Preserve the original reference value and remove the 'options.' prefix
              return {
                $value: value.original.$value.replace('options.', ''),
                $type: value.$type,
                ...(value.original.$description && {
                  $description: value.original.$description,
                }),
                ...(value.filePath && { filePath: value.filePath }),
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

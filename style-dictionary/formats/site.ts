import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments, TransformedToken } from 'style-dictionary/types';
import _ from 'lodash';

/**
 * Registers a site/documentation format for Style Dictionary.
 *
 * This format generates a JSON structure optimized for documentation sites.
 * Tokens are grouped by category, with path information removed and mixin names prefixed.
 *
 * @param sd - The Style Dictionary instance to register the format with
 */
export const site = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'site',
    format: ({ dictionary, platform }: FormatFnArguments): string => {
      const prefix = platform.prefix ? `${platform.prefix}-` : '';
      const toRet: Record<string, Partial<TransformedToken>[]> = {};
      const grouped = _.groupBy(dictionary.allTokens, 'docs.category');
      const keys = Object.keys(grouped);

      for (const key of keys) {
        const newKey = key === 'undefined' ? 'misc' : key;
        const catArr = grouped[key];
        toRet[newKey] = [];

        for (let i = 0, len = catArr.length; i < len; i++) {
          const { path: _removedPath, ...current } = catArr[i];
          // Intentionally removing 'path' property via destructuring
          void _removedPath;

          if (_.has(current, 'mixin')) {
            current.mixin = `${prefix}${current.mixin}`;
          }

          toRet[newKey].push(current);
        }
      }

      return JSON.stringify(toRet, null, 2);
    }
  });
};

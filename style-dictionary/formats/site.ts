import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments, TransformedToken } from 'style-dictionary/types';
import _ from 'lodash';

/**
 * Recursively removes the `key` property from all nested objects within a token.
 * SD v5 adds `key` to nested objects (original, docs, etc.) which was not present
 * in SD v4 output. This restores the v4 behavior by stripping it from nested objects.
 */
const removeKeyFromNested = (obj: Record<string, unknown>, depth = 0): void => {
  if (depth > 0 && 'key' in obj) {
    delete obj.key;
  }
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      removeKeyFromNested(val as Record<string, unknown>, depth + 1);
    }
  }
};

/**
 * Restores `.$value` suffix in composite references within original.$value.
 * SD v5 removes `.$value` from references, but SD v4 preserved it in the
 * original property for composite (multi-reference) values.
 * Example: "{a} {b}" -> "{a.$value} {b.$value}"
 */
const restoreDollarValueInOriginal = (current: Record<string, unknown>): void => {
  const original = current.original as Record<string, unknown> | undefined;
  if (original && typeof original.$value === 'string') {
    const val = original.$value;
    // Only add .$value to composite references (multiple refs separated by spaces)
    if (val.includes('} {')) {
      original.$value = val.replace(/\{([^}]+)\}/g, (match, ref) => {
        return ref.includes('.$value') ? match : `{${ref}.$value}`;
      });
    }
  }
};

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
          const token = catArr[i];
          const { path: _removedPath, key: tokenKey, ...current } = token;
          void _removedPath;

          if (_.has(current, 'mixin')) {
            current.mixin = `${prefix}${current.mixin}`;
          }

          const currentObj = current as unknown as Record<string, unknown>;

          // Remove `key` from nested objects (original, docs, etc.) added by SD v5
          removeKeyFromNested(currentObj);

          // Restore .$value in composite references in original.$value
          restoreDollarValueInOriginal(currentObj);

          // Re-add `key` at the end to match SD v4 output ordering
          if (tokenKey !== undefined) {
            currentObj.key = tokenKey;
          }

          toRet[newKey].push(currentObj as Partial<TransformedToken>);
        }
      }

      return JSON.stringify(toRet, null, 2);
    },
  });
};

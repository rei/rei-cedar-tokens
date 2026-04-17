import type StyleDictionary from 'style-dictionary';
import type { Token } from 'style-dictionary';

/**
 * Registers a transform for converting dimension tokens to Android density-independent pixels (dp).
 *
 * This transform converts dimension values to the Android dp unit format, which ensures
 * consistent sizing across different screen densities. The transform:
 * - Converts numeric values to a 2-decimal precision
 * - Appends the 'dp' unit suffix
 * - Applies transitively through token references
 *
 * Filters to include dimension tokens but excludes fontSize tokens.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const dpTransitive = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/dp-transitive',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => token.$type === 'dimension',
    transform: (token: Token): string => {
      const val = parseFloat(token.$value);
      return val.toFixed(2) + 'dp';
    },
  });
};

import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments, TransformedToken } from 'style-dictionary/types';
import _ from 'lodash';

type MapValueFormatter = (token: TransformedToken) => string;

function buildUtilityMapScss(
  dictionary: FormatFnArguments['dictionary'],
  formatValue: MapValueFormatter,
): string {
  let scss = '';
  const utilityTokens = _.filter(
    dictionary.allTokens,
    (token: TransformedToken) => token['utility-class'] === true,
  );
  const categories = _.groupBy(utilityTokens, 'docs.category');

  // Loop through categories
  const catKeys = Object.keys(categories);
  catKeys.forEach((cat) => {
    // Loop through types
    const types = _.groupBy(categories[cat], 'docs.type');
    const typeKeys = Object.keys(types);
    typeKeys.forEach((type) => {
      let formattedType = type === 'undefined' ? '' : `-${type}`;
      if (type === cat) {
        formattedType = '';
      }
      scss += `$${cat}${formattedType}: (\n  `;

      types[type].forEach((token: TransformedToken, i: number) => {
        if (i !== 0) {
          scss += ',\n  ';
        }
        scss += `${token.name}: ${formatValue(token)}`;
      });

      scss += '\n);\n';
    });
  });

  return scss;
}

/**
 * Registers a SCSS map format for Style Dictionary.
 *
 * This format generates SCSS maps from utility tokens (tokens with `utility-class: true`).
 * Tokens are grouped by category and type, and output as SCSS map variables.
 *
 * @param sd - The Style Dictionary instance to register the format with
 */
export const scssMap = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'scss/map',
    format: ({ dictionary }: FormatFnArguments): string => {
      return buildUtilityMapScss(dictionary, (token) => {
        if (token.name.includes('-family')) {
          return `'${token.$value}'`;
        }

        return String(token.$value);
      });
    },
  });

  sd.registerFormat({
    name: 'scss/map-vars',
    format: ({ dictionary }: FormatFnArguments): string => {
      return buildUtilityMapScss(dictionary, (token) => {
        return `var(--${token.name})`;
      });
    },
  });

  sd.registerFormat({
    name: 'scss/map-legacy-forward',
    format: (): string => {
      return [
        '@warn "utility-map.scss is deprecated. Use map-resolved.scss or map-vars.scss instead.";',
        '@forward "map-resolved";',
      ].join('\n');
    },
  });
};

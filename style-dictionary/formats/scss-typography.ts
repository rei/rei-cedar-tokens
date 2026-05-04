import type StyleDictionary from 'style-dictionary';
import type { FormatFnArguments, TransformedToken } from 'style-dictionary/types';
import _ from 'lodash';
import { BASE_FONT_SIZE } from '../utils';

/**
 * Converts pixel values to rem units.
 *
 * @param value - The value to convert (can be a single value or space-separated values)
 * @param baseFontSize - The base font size in pixels (default: 10)
 * @returns The value converted to rem units
 */
export const pxToRem = (value: string | number, baseFontSize = BASE_FONT_SIZE): string => {
  if (typeof value !== 'string') return String(value);

  const tokens = value.split(' ');
  const result = tokens.map((token) => {
    const parsedValue = parseFloat(token);

    if (parsedValue === 0 || !token) {
      return '0';
    }

    if (!token.includes('rem')) {
      const num = parseFloat(token) / baseFontSize;
      const unit = num !== 0 ? 'rem' : '';

      return `${num}${unit}`;
    }

    return token;
  });

  return result.join(' ');
};

/**
 * Registers a SCSS typography format for Style Dictionary.
 *
 * This format generates SCSS mixins from DTCG composite typography tokens.
 * Typography tokens are expanded by tokens-studio and regrouped by this format
 * into cohesive mixins with all typography properties.
 *
 * Properties handled:
 * - fontFamily
 * - fontSize (converted to rem)
 * - fontWeight
 * - fontStyle
 * - lineHeight (converted to rem)
 * - letterSpacing
 * - textTransform
 * - textDecoration
 *
 * Deprecated mixins include a deprecation notice with year, release, and replacement info.
 *
 * @param sd - The Style Dictionary instance to register the format with
 */
export const scssTypography = (sd: typeof StyleDictionary): void => {
  sd.registerFormat({
    name: 'scss/typography',
    format: ({ dictionary, platform }: FormatFnArguments): string => {
      const prefix = platform.prefix ? `${platform.prefix}-` : '';
      const mixins: string[] = [];

      // Tokens-studio expands typography tokens into individual tokens
      // Group them by their parent path to recreate the mixin
      const allTokens = dictionary.allTokens;

      // Typography property names (short names after text-short-names transform)
      const typographyProps = [
        'family',
        'size',
        'weight',
        'style',
        'height',
        'spacing',
        'transform',
      ];

      // Maps short property names to CSS property names
      const cssPropertyMap: Record<string, string> = {
        family: 'font-family',
        size: 'font-size',
        weight: 'font-weight',
        style: 'font-style',
        height: 'line-height',
        spacing: 'letter-spacing',
        transform: 'text-transform',
      };

      // Group tokens by their parent typography token path
      interface TypographyGroup {
        path: string[];
        props: Record<string, string | number>;
        attributes?: Record<string, unknown>;
        newMixin?: string;
      }

      const typographyGroups: Record<string, TypographyGroup> = {};

      allTokens.forEach((token: TransformedToken) => {
        const lastPathPart = token.path[token.path.length - 1];
        if (typographyProps.includes(lastPathPart)) {
          const parentPath = token.path.slice(0, -1).join('.');
          if (!typographyGroups[parentPath]) {
            typographyGroups[parentPath] = {
              path: token.path.slice(0, -1),
              props: {},
              attributes: token.attributes,
              newMixin: token.newMixin,
            };
          }
          typographyGroups[parentPath].props[lastPathPart] = token.$value;
        }
      });

      Object.values(typographyGroups).forEach((group) => {
        const prefixedName = _.kebabCase([prefix, ...group.path].join('-'));
        const declarations: string[] = [];

        // Add declarations in a consistent order
        typographyProps.forEach((prop) => {
          if (group.props[prop] !== undefined) {
            let value = group.props[prop];
            if (prop === 'size' || prop === 'height') {
              value = pxToRem(String(value));
            }
            declarations.push(`${cssPropertyMap[prop] || _.kebabCase(prop)}: ${value};`);
          }
        });

        if (declarations.length === 0) return;

        let mixin = '';

        if (group.attributes?.deprecated === true) {
          // DEPRECATED
          const deprecateYear = group.attributes['deprecated-year'];
          const deprecateRelease = group.attributes['deprecated-release'];
          const prefixedNewName = group.newMixin
            ? `"${_.kebabCase([prefix, group.newMixin].join('-'))}"`
            : null;

          mixin = `// DEPRECATED
@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
  @include deprecate-mixin(${deprecateYear}, "${deprecateRelease}", "${prefixedName}", ${prefixedNewName});
}`;
        } else {
          // NOT DEPRECATED
          mixin = `@mixin ${prefixedName}() {
  ${declarations.join('\n  ')}
}

%${prefixedName} {
  ${declarations.join('\n  ')}
}`;
        }

        mixins.push(mixin);
      });

      return `${mixins.join('\n\n')}\n`;
    },
  });
};

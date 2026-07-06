import type StyleDictionary from 'style-dictionary';
import type { Token, Config } from 'style-dictionary';
import { BASE_FONT_SIZE, pxToRem } from '../../utils';

/**
 * Registers a custom size/rem transform that replaces SD v5's built-in size/rem.
 *
 * SD v5's built-in size/rem converts ALL px values to rem, but we need finer control.
 * This transform converts any string token value containing 'px' to rem,
 * used as a drop-in replacement for the built-in in our explicit transform lists.
 *
 * @param sd - The Style Dictionary instance to register the transform with
 */
export const sizeRemOverride = (sd: typeof StyleDictionary): void => {
  sd.registerTransform({
    name: 'size/rem-custom',
    type: 'value',
    transitive: true,
    filter: (token: Token): boolean => {
      if (typeof token.$value !== 'string' || !token.$value.includes('px')) {
        return false;
      }
      const tokenName = token.path.join('-');
      if (tokenName.includes('breakpoint') || tokenName.includes('text-size-root')) {
        return false;
      }
      return true;
    },
    transform: (token: Token, config: Config): string => {
      const REM = config.basePxFontSize || BASE_FONT_SIZE;
      return pxToRem(token.$value, REM);
    },
  });
};
